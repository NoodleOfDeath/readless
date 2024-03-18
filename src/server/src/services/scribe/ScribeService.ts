import ms from 'ms';

import { ReadAndSummarizePayload, RecapPayload } from './types';
import {
  Loot,
  OpenAIService,
  PuppeteerError,
  PuppeteerService,
  S3Service,
  TtsService,
} from '../';
import {
  Category,
  Recap,
  RecapCreationAttributes,
  RecapSummary,
  SentimentMethod,
  Subscription,
  Summary,
  SummaryCreationAttributes,
  SummaryMedia,
} from '../../api/v1/schema';
import { BaseService } from '../base';

const MIN_TOKEN_COUNT = 55;
const MAX_OPENAI_TOKEN_COUNT = Number(process.env.MAX_OPENAI_TOKEN_COUNT || 1500);

const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

export function abbreviate(str: string, len: number) {
  //
  return str.split(' ').slice(0, len).join(' ');
}

export class ScribeService extends BaseService {
  
  static categories: string[] = [];
  
  public static async prepare() {
    await Category.prepare();
    const categories = await Category.findAll();
    this.categories = categories.map((c) => c.displayName);
    await SentimentMethod.prepare();
  }
  
  public static async readAndSummarize(
    {
      url, imageUrls = [], content, publisher, force, priority,
    }: ReadAndSummarizePayload
  ): Promise<Summary> {

    if (this.categories.length === 0) {
      await this.prepare();
    }

    if (!publisher) {
      throw new Error('no publisher id specified');
    }

    if (!force) {
      const existingSummary = await Summary.findOne({ where: { url } });
      if (existingSummary) {
        await this.log(`Summary already exists for ${url}`);
        return existingSummary;
      }
    } else {
      await this.log(`Forcing summary rewrite for ${url}`);
    }

    if (!PuppeteerService.EXCLUDE_EXPRS.depth1.every((e) => !new RegExp(e, 'i').test(url.replace(/^https?:\/\/.*?(?=\/)/, '')))) {
      throw new Error('Probably not a news article');
    }

    // fetch web content with the spider
    let loot: Loot; 
    try {
      loot = await PuppeteerService.loot(url, publisher, { content });
    } catch (e) {
      if (e instanceof PuppeteerError) {
        if (e.status === 403) {
          await this.error(['Bad response', url, e.message].join('\n\n'), false);
        } else
        if (e.status === 404) {
          await this.error(['Page not found', url, e.message].join('\n\n'), false);
        }
      }
      throw e;
    }
    
    if (priority > 0) {
      const parsedDate = new Date(parseInt(`${priority}`));
      if (!Number.isNaN(parsedDate.valueOf())) {
        loot.date = parsedDate;
      }
    }
    loot.imageUrls = Array.from(new Set([...loot.imageUrls, ...imageUrls]));

    if (!force) {
      const existingMedia = await SummaryMedia.findOne({ where: { originalUrl: loot.imageUrls } });
      if (existingMedia) {
        await this.log(`Media already exists for ${url}`);
        return await Summary.findOne({ where: { id: existingMedia.parentId } });
      }
    }
    if (loot.content.split(' ').length > MAX_OPENAI_TOKEN_COUNT) {
      loot.content = abbreviate(loot.content, MAX_OPENAI_TOKEN_COUNT);
    }
    if (loot.content.split(' ').length < MIN_TOKEN_COUNT) {
      await this.error(['Article too short', url, loot.content].join('\n\n'));
    }
    if (!loot.date || Number.isNaN(loot.date.valueOf())) {
      await this.error(['Invalid date found', url, JSON.stringify(publisher.selectors.date), loot.dateMatches.join('\n-----\n'), loot.content].join('\n\n'));
    }
    if (Date.now() - loot.date.valueOf() > ms(OLD_NEWS_THRESHOLD)) {
      throw new Error(`${loot.date} -- News is older than ${OLD_NEWS_THRESHOLD}`);
    }
    if (loot.date > new Date(Date.now() + ms('3h'))) {
      await this.error(['News is from the future', url, loot.date.toISOString()].join('\n\n'));
    }

    while (loot.date > new Date()) {
      loot.date = new Date(loot.date.valueOf() - ms('1h'));
    }

    let newSummary = Summary.json<Summary>({
      filteredText: loot.content,
      imageUrl: loot.imageUrls?.[0],
      originalDate: loot.date,
      originalTitle: loot.title,
      publisherId: publisher.id,
      rawText: loot.rawText,
      summary: 'This reading format will be removed in the next update! After all, it\'s called Read Less!',
      url,
    });

    // initialize chatService service and send the prompt
    const openai = new OpenAIService();

    try {

      const { filteredText } = await openai.send<{ filteredText: string }>([
        'Call filterText to filter all text from the following that does not appear to be news related. If most of the text is not news related, please respond with "NOT NEWS".\n\n',
        newSummary.filteredText,
      ].join('\n\n'), {
        function_call: { name: 'filterText' },
        functions: [
          {
            name: 'filterText',
            parameters: {
              properties: { filteredText: { maxLength: 4096, type: 'string' } },
              required: ['filteredText'],
              type: 'object',
            },
          },
        ],
      });
      if (/not news/i.test(filteredText)) {
        await this.error(['Not news', url, filteredText].join('\n\n'));
        return;
      }
      if (filteredText.length < MIN_TOKEN_COUNT) {
        await this.error(['Article too short', url, filteredText].join('\n\n'));
        return;
      }
      newSummary.filteredText = filteredText;

      const reply = await openai.send<SummaryCreationAttributes>(`Call createSummary and return a new summary for the following article. Generate 5 bullets 20 words each. The title 20 words. Short summary 3 sentences:\n\n${newSummary.filteredText}`, {
        function_call: { name: 'createSummary' },
        functions: [
          {
            name: 'createSummary',
            parameters: {
              properties: {
                bullets: {
                  items: {
                    maxLength: 50, 
                    type: 'string', 
                  }, 
                  maxLength: 5,
                  minLength: 5,
                  type: 'array', 
                },
                category: {
                  enum: this.categories,
                  type: 'string',
                },
                shortSummary: { 
                  maxLength: 150, 
                  type: 'string',
                },
                title: { 
                  maxLength: 100,
                  type: 'string',
                },
              },
              required: ['title', 'shortSummary', 'bullets', 'category'],
              type: 'object',
            },
          },
        ],
      });
      if (!reply) {
        await this.error('createSummary returned null');
      }
      newSummary = {
        ...newSummary,
        ...reply,
      };

    } catch (e) {
      await this.error(['There was an issue generating the summary on openai', e].join('\n\n'));
      return;
    }

    try {
    
      const category = await Category.findOne({ where: { displayName: newSummary.category } });
      newSummary.categoryId = category.id;
      
      if (await Summary.findOne({ where: { url } })) {
        await this.error('job already completed by another worker');
        return;
      }
    
      // Save summary to database
      const summary = await Summary.create(newSummary);

      // Save article media
      if (loot.imageUrls && loot.imageUrls.length > 0) {
        // download looted images
        let imageCount = 0;
        for (const imageUrl of loot.imageUrls) {
          try {
            const obj = await S3Service.mirror(imageUrl, {
              ACL: 'public-read',
              Accept: 'image',
              Folder: 'img/s',
            });
            if (!obj) {
              continue;
            }
            await SummaryMedia.create({
              key: `imageArticle${imageCount === 0 ? '' : imageCount + 1}`,
              originalUrl: imageUrl,
              parentId: summary.id,
              path: obj.key,
              type: 'image',
              url: obj.url,
            });
            if (imageCount === 0) {
              summary.set('imageUrl', obj.url);
              await summary.save();
            }
            imageCount++;
          } catch (e) {
            await this.error(['Failed to download image', loot.imageUrls, JSON.stringify(e)].join('\n\n'), false);
          }
        }
      } else {
        this.log('Generating image with deepai as fallback');
        const obj = await summary.generateImageWithDeepAi();
        if (obj) {
          await SummaryMedia.create({
            key: 'imageAi1',
            parentId: summary.id,
            path: obj.key,
            type: 'image',
            url: obj.url,
          });
          summary.set('imageUrl', obj.url);
          await summary.save();
        }
      }
      
      try {
        await summary.generateThumbnails();
        await summary.generateSentiments();
      } catch (e) {
        console.error(e);
      }

      if (this.features.tts) {
      
        this.log('Generating tts');
        // generate media
        const result = await TtsService.generate({ text: `From ${publisher.displayName}: ${summary.title}` });
        const obj = await TtsService.mirror(result.url, {
          ACL: 'public-read',
          Folder: 'audio/s',
        });
        if (obj) {
          await SummaryMedia.create({
            key: 'tts',
            parentId: summary.id,
            path: obj.key,
            type: 'audio',
            url: obj.url,
          });
        }
        
      }

      try {
        await Summary.refreshViews(['refresh_summary_media_view', 'refresh_summary_sentiment_view']);
      } catch (e) {
        console.error(e);
      }

      this.log('🥳 Created new summary from', url, newSummary.title);
      
      return summary;
      
    } catch (e) {
      await this.error(['😤 Unexpected Error Encountered', url, e, JSON.stringify(newSummary, null, 2)].join('\n\n'));
      return;
    }
    
  }
  
  public static async writeRecap(payload: RecapPayload = {}) {
    try {
      
      const {
        key, start, end, duration,
      } = Recap.objectKey(payload);
      
      const exists = await Recap.exists(key);
      if (exists && !payload.force) {
        await this.error('Recap already exists');
      }
      
      console.log(start, end);

      const summaries = (await Summary.getTopStories({ interval: duration })).rows;
      
      if (summaries.length === 0) {
        await this.error('no summaries to recap');
      }

      const sourceSummaries = summaries.map((summary) => 
        `[${summary.id}] (${summary.siblings.length} articles) ${summary.publisher.displayName}: ${summary.title} - ${summary.shortSummary}`);

      const mainPrompt = 
        `I will provide you with a list of news events that occurred on ${start.toLocaleString()}. Please summarize the highlights in three to five paragraphs, blog form, making sure to prioritize topics that seem like breaking news and/or have a greater number of related articles written about them indicated in parentheses.

        Try to make the summary concise, engaging, and entertaining to read. Do not make up facts and do not respons with a list of bullet points. Just cover what seems most important. Do NOT add a references section at the end.

        Please also site from the list of events using the number of each headline as its reference code. For example, if the list of events were:
        [88] (14 articles) CNN: Trump impeached - Trump was impeached by the House of Representatives. The Senate will now hold a trial to determine whether or not he will be removed from office.
        [2793] (14 articles) Fox News: Trump impeached - Former President Donald Trump has been impeached by the House of Representatives for the second time in his presidency.
        [12476] (20 articles) MSNBC: Wildfires in California - Wildfires are raging in California, destroying thousands of homes and forcing hundreds of thousands of people to evacuate.

        Then you would write:

        In today's news, Trump was impeached [88, 2793] and wildfires are raging in California [12476].

        Here is the list of events:
        ${sourceSummaries.join('\n')}`;

      const newRecap = Recap.json<Recap>({ 
        key,
        length: duration,
      });
      
      // initialize chat service
      const openai = new OpenAIService();

      // iterate through each summary prompt and send them to ChatGPT
      
      const data = await openai.send<RecapCreationAttributes>(mainPrompt, {
        function_call: { name: 'createRecap' },
        functions: [
          {
            name: 'createRecap',
            parameters: {
              properties: {
                text: {
                  maxLength: 750,
                  minLength: 250,
                  type: 'string', 
                },
                title: { maxLength: 100, type: 'string' },
              },
              required: ['title', 'text'],
              type: 'object',
            },
          },
        ],
      });
      newRecap.title = data.title;
      newRecap.text = data.text;
      
      const recap = await Recap.create(newRecap);
      
      for (const summary of summaries) {
        await RecapSummary.create({
          parentId: recap.id,
          summaryId: summary.id,
        });
      }

      await Subscription.notify('daily-recap', 'email', {
        html: await recap.formatAsHTML(summaries),
        subject: `Daily Highlights: ${recap.title}`,
      });
      
      await Subscription.notify('daily-recap', 'push', {
        body: recap.title,
        title: 'Daily Highlights',
      });

      return recap;
      
    } catch (e) {
      console.log(e);
      await this.error('Unexpected error writing recap');
    }
  }
  
}