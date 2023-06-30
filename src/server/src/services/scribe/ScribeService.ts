import ms from 'ms';
import { Op } from 'sequelize';

import { ReadAndSummarizePayload, RecapPayload } from './types';
import {
  DeepAiService,
  MailService,
  OpenAIService,
  Prompt,
  PuppeteerService,
  TtsService,
} from '../';
import {
  Category,
  Recap,
  RecapSentiment,
  RecapSummary,
  SentimentMethod,
  SentimentMethodName,
  Subscription,
  Summary,
  SummaryMedia,
  SummarySentiment,
} from '../../api/v1/schema';
import { BaseService } from '../base';
import { SentimentService } from '../sentiment';

const MIN_TOKEN_COUNT = 50;
const MAX_OPENAI_TOKEN_COUNT = Number(process.env.MAX_OPENAI_TOKEN_COUNT || 1500);
const BAD_RESPONSE_EXPR = /^["']?[\s\n]*(?:Understood,|Alright,|okay, i|Okay. How|I am an AI|I'm sorry|stay (?:informed|updated)|got it|keep yourself updated|CNBC: stay|CNBC is offering|sign\s?up|HuffPost|got it. |how can i|hello!|okay, i'm|sure,)/i;

const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

export function abbreviate(str: string, len: number) {
  //
  return str.split(' ').slice(0, len).join(' ');
}

export class ScribeService extends BaseService {
  
  static categories: string[] = [];
  
  public static async init() {
    await Category.initCategories();
    const categories = await Category.findAll();
    this.categories = categories.map((c) => c.displayName);
    await SentimentMethod.initSentimentMethods();
  }

  public static async error(subject: string, text = subject, throws = true): Promise<void> {
    await new MailService().sendMail({
      from: 'debug@readless.ai',
      subject,
      text,
      to: 'debug@readless.ai',
    });
    if (throws === true) {
      throw new Error(subject);
    }
  }
  
  public static async readAndSummarize(
    {
      url, content, outlet, force, 
    }: ReadAndSummarizePayload
  ): Promise<Summary> {
    if (this.categories.length === 0) {
      await this.init();
    }
    if (!outlet) {
      throw new Error('no outlet id specified');
    }
    if (!force) {
      const existingSummary = await Summary.findOne({ where: { url } });
      if (existingSummary) {
        console.log(`Summary already exists for ${url}`);
        return existingSummary;
      }
    } else {
      console.log(`Forcing summary rewrite for ${url}`);
    }
    if (!PuppeteerService.EXCLUDE_EXPRS.depth1.every((e) => !new RegExp(e, 'i').test(url.replace(/^https?:\/\/.*?(?=\/)/, '')))) {
      throw new Error('Probably not a news article');
    }
    // fetch web content with the spider
    const loot = await PuppeteerService.loot(url, outlet, { content });
    // create the prompt onReply map to be sentto ChatGPT
    if (loot.content.split(' ').length > MAX_OPENAI_TOKEN_COUNT) {
      loot.content = abbreviate(loot.content, MAX_OPENAI_TOKEN_COUNT);
    }
    if (loot.content.split(' ').length < MIN_TOKEN_COUNT) {
      await this.error('Article too short', [url, loot.content].join('\n\n'));
    }
    if (!loot.date || Number.isNaN(loot.date.valueOf())) {
      await this.error('Invalid date found', [url, JSON.stringify(outlet.selectors.date), loot.dateMatches.join('\n-----\n')].join('\n\n'));
    }
    if (Date.now() - loot.date.valueOf() > ms(OLD_NEWS_THRESHOLD)) {
      throw new Error(`News is older than ${OLD_NEWS_THRESHOLD}`);
    }
    if (loot.date > new Date(Date.now() + ms('3h'))) {
      await this.error('News is from the future', [url, loot.date.toISOString()].join('\n\n'));
    }
    // daylight savings most likely
    if (loot.date > new Date() && loot.date < new Date(Date.now() + ms('1h'))) {
      loot.date = new Date(Date.now() - ms('1h') + ms(`${loot.date.getMinutes()}m`));
    }
    const newSummary = Summary.json<Summary>({
      filteredText: loot.content,
      imageUrl: '',
      originalDate: loot.date,
      originalTitle: loot.title,
      outletId: outlet.id,
      rawText: loot.rawText,
      url,
    });
    let categoryDisplayName: string;
    const sentiment = SummarySentiment.json<SummarySentiment>({ method: 'openai' });
    const prompts: Prompt[] = [
      {
        handleReply: async (reply) => { 
          if (/no/i.test(reply)) {
            throw new Error('Not an actual article');
          }
          newSummary.title = reply;
        },
        text: [
          'Does the following appear to be a news article or story? A collection of article headlines, pictures, videos, advertisements, description of a news website, or subscription program should not be considered a news article/story. Please respond with just "yes" or "no"\n\n', 
          newSummary.filteredText,
        ].join(''),
      },
      {
        handleReply: async (reply) => {
          const score = Number.parseFloat(reply);
          if (Number.isNaN(score)) {
            await this.error('Not a valid sentiment score', [url, reply, newSummary.filteredText].join('\n\n'));
          }
          sentiment.score = score;
        },
        text: 'For the article I just gave you, please provide a floating point sentiment score between -1 and 1. Please respond with the score only.',
      },
      {
        handleReply: async (reply) => { 
          categoryDisplayName = reply
            .replace(/^.*?:\s*/, '')
            .replace(/\.$/, '')
            .trim();
          if (!this.categories.some((c) => new RegExp(`^${c}$`, 'i').test(categoryDisplayName))) {
            await this.error('Bad category', [url, categoryDisplayName, reply].join('\n\n'));
          }
        },
        text: `Please select a best category for this article from the following choices: ${this.categories.join(',')}. Respond with only the category name`,
      },
      {
        handleReply: async (reply) => { 
          if (reply.split(' ').length > 15) {
            await this.error('Title too long', `Title too long for ${url}\n\n${reply}`);
          }
          newSummary.title = reply;
        },
        text: [
          'Please summarize the same article using no more than 10 words to be used as a title. Prioritize any important names, places, events, date, or numeric values and try to make the title as unbiased and mot clickbaity as possible. Respond with just the title.',
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          if (reply.split(' ').length > 40) {
            await this.error('Short summary too long', `Short summary too long for ${url}\n\n${reply}`);
          }
          newSummary.shortSummary = reply;
        },
        text: [
          'Please provide another unbiased summary using no more than 30 words. Do not use phrases like "The article" or "This article".', 
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          if (reply.split(' ').length > 120) {
            await this.error('Summary too long', `Summary too long for ${url}\n\n${reply}`);
          }
          newSummary.summary = reply;
        },
        text: [
          'Please provide another longer unbiased summary using no more than 100 words. Do not use phrases like "The article" or "This article".', 
        ].join(''),
      },
      {
        handleReply: async (reply) => {
          newSummary.bullets = reply
            .replace(/•\s*/g, '')
            .replace(/^\.*?:\s*/, '')
            .replace(/<br\s*\/?>/g, '')
            .split(/\n/)
            .map((bullet) => bullet.trim()
              .replace(/\n*/g, '')
              .replace(/[\\.]*$/, ''))
            .filter(Boolean);
        },
        text: 'Please provide 5 concise unbiased bullet point sentences no longer than 10 words each that summarize this article/story using • as the bullet symbol',
      },
    ];
      
    // initialize chatService service and send the prompt
    const chatService = new OpenAIService();
    // iterate through each summary prompt and send themto ChatGPT
    for (const prompt of prompts) {
      let reply = await chatService.send(prompt.text);
      if (BAD_RESPONSE_EXPR.test(reply)) {
        // attempt single retry
        reply = await chatService.send(prompt.text);
        if (BAD_RESPONSE_EXPR.test(reply)) {
          await this.error('Bad response from chatService', ['--repl--', reply, '--prompt--', prompt.text].join('\n'));
        }
      }
      try {
        await prompt.handleReply(reply);
      } catch (e) {
        if (/too long|sentiment|category/i.test(e.message)) {
          reply = await chatService.send(prompt.text);
          console.error(e);
          // attempt single retry
          await prompt.handleReply(reply);
        } else {
          throw e;
        }
      }
      this.log(reply);
    }
      
    try {
    
      const category = await Category.findOne({ where: { displayName: categoryDisplayName } });
      newSummary.categoryId = category.id;

      if (this.features.imageGen) {
        
        this.log('Generating image');
        const generateImage = async () => {
      
          // Generate image from the title
          const image = await DeepAiService.textToImage(newSummary.title);
          
          // Save image to S3 CDN
          const obj = await DeepAiService.mirror(image.output_url, {
            ACL: 'public-read',
            ContentType: 'image/jpeg',
            Folder: 'img/s',
          });
          newSummary.imageUrl = obj.url;
          
        };
        
        try {
          await generateImage();
        } catch (e) {
          await this.error('Image generation failed', [url, JSON.stringify(e)].join('\n\n'), false);
          try {
            // attempt single retry
            await generateImage();
          } catch (e) {
            await this.error('Image generation failed', [url, JSON.stringify(e)].join('\n\n'));
          }
        }
  
      }
    
      // Save summary to database
      const summary = await Summary.create(newSummary);
      
      // Create sentiment
      sentiment.parentId = summary.id;
      await SummarySentiment.create(sentiment);
      
      const afinnSentimentScores = SentimentService.sentiment('afinn', loot.content);
      await SummarySentiment.create({
        method: 'afinn',
        parentId: summary.id,
        score: afinnSentimentScores.comparative,
      });
      
      const vaderSentimentScores = SentimentService.sentiment('vader', loot.content);
      await SummarySentiment.create({
        method: 'vader',
        parentId: summary.id,
        score: vaderSentimentScores.compound,
      });
      
      if (this.features.tts) {
      
        this.log('Generating tts');
        // generate media
        const result = await TtsService.generate({ text: `From ${outlet.displayName}: ${summary.title}` });
        const obj = await TtsService.mirror(result.url, {
          ACL: 'public-read',
          Folder: 'audio/s',
        });
        await SummaryMedia.upsert({
          key: 'tts',
          parentId: summary.id,
          path: obj.key,
          type: 'audio',
          url: obj.url,
        });
        
      }
      
      this.log('🥳 Created new summary from', url, newSummary.title);
      return summary;
      
    } catch (e) {
      await this.error('😤 Unexpected Error Encountered', [url, JSON.stringify(e), JSON.stringify(newSummary, null, 2)].join('\n\n'));
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

      const summaries = await Summary.scope('public').findAll({ 
        where: { 
          [Op.and]: [
            { originalDate: { [Op.gte]: start } },
            { originalDate: { [Op.lte]: end } },
          ],
        },
      });
      
      if (summaries.length === 0) {
        await this.error('no summaries to recap');
      }

      const sources = await Promise.all(summaries.map(async (summary) => 
        `[${summary.id}] ${(await summary.getOutlet()).displayName}: ${summary.title} - ${summary.shortSummary}`));

      const mainPrompt = [
        `I will provide you with a list of news events that occurred on ${start.toLocaleString()}. Please summarize the highlights in two to three paragraphs, blog form, making sure to prioritize topics that seem like breaking news and/or were covered by multiple news sources. 

        Try to make the summary concise, engaging, and entertaining to read. Do not make up facts and do not respons with a list of bullet points. Just cover what seems most important.

        Please also site from the list of events using the number of each headline as its reference code. For example, if the list of events were:
        [88] CNN: Trump impeached - Trump was impeached by the House of Representatives. The Senate will now hold a trial to determine whether or not he will be removed from office.
        [2793] Fox News: Trump impeached - Former President Donald Trump has been impeached by the House of Representatives for the second time in his presidency.
        [12476] MSNBC: Wildfires in California - Wildfires are raging in California, destroying thousands of homes and forcing hundreds of thousands of people to evacuate.

        Then you would write:
        **${new Date().toLocaleDateString()}**

        In today's news, Trump was impeached [88,2793] and wildfires are raging in California [12476].

        Here is the list of events:
        `,
        ...sources,
      ].join('\n');

      const newRecap = Recap.json<Recap>({ 
        key,
        length: duration,
      });
      const prompts: Prompt[] = [
        {
          handleReply: async (reply) => {
            newRecap.text = reply;
          },
          text: mainPrompt,
        },
        {
          handleReply: async (reply) => {
            newRecap.title = reply;
          },
          text: 'Give this recap a 10-15 word title',
        },
      ];
      
      // initialize chat service
      const chatService = new OpenAIService();
      // iterate through each summary prompt and send themto ChatGPT
      for (const prompt of prompts) {
        let reply = await chatService.send(prompt.text);
        if (BAD_RESPONSE_EXPR.test(reply)) {
          // attempt single retry
          reply = await chatService.send(prompt.text);
          if (BAD_RESPONSE_EXPR.test(reply)) {
            await this.error('Bad response from chatService', ['--repl--', reply, '--prompt--', prompt.text].join('\n'));
          }
        }
        try {
          await prompt.handleReply(reply);
        } catch (e) {
          if (/too long|sentiment|category/i.test(e.message)) {
            reply = await chatService.send(prompt.text);
            console.error(e);
            // attempt single retry
            await prompt.handleReply(reply);
          } else {
            throw e;
          }
        }
        this.log(reply);
      }
      
      const recap = await Recap.create(newRecap);
      
      const sentiments: { [key in keyof SentimentMethodName]?: number[] } = {};
      for (const summary of summaries) {
        await RecapSummary.create({
          parentId: recap.id,
          summaryId: summary.id,
        });
        const summarySentiments = await summary.getSentiments();
        summarySentiments.forEach((sentiment) => {
          const scores = sentiments[sentiment.method] ?? [];
          scores.push(sentiment.score);
          sentiments[sentiment.method] = scores;
        });
      }
      
      for (const [method, scores] of Object.entries(sentiments)) {
        await RecapSentiment.create({
          method: method as SentimentMethodName,
          parentId: recap.id,
          score: scores.reduce((prev, curr) => prev + curr, 0) / scores.length,
        });
      }

      await Subscription.notify('daily-recap', 'email', {
        html: await recap.formatAsHTML(summaries),
        subject: recap.title,
      });

      return recap;
      
    } catch (e) {
      console.log(e);
      await this.error('Unexpected error writing recap');
    }
  }
  
}