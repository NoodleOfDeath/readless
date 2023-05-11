import ms from 'ms';

import { ReadAndSummarizePayload } from './types';
import {
  ChatGPTService,
  DeepAiService,
  MailService,
  Prompt,
  PuppeteerService,
  S3Service,
} from '../';
import {
  Category,
  Summary,
  SummarySentiment,
  SummarySentimentToken,
} from '../../api/v1/schema/models';
import { BaseService } from '../base';

const MIN_TOKEN_COUNT = 50 as const;
const MAX_OPENAI_TOKEN_COUNT = 4000 as const;
const BAD_RESPONSE_EXPR = /^["']?[\s\n]*(?:Understood,|Alright,|okay, i|Okay. How|I am an AI|I'm sorry|stay (?:informed|updated)|got it|keep yourself updated|CNBC: stay|CNBC is offering|sign\s?up|HuffPost|got it. |how can i|hello!|okay, i'm|sure,)/i;

const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

export function abbreviate(str: string, len: number) {
  //
  return str.substring(0, len);
}

export class ScribeService extends BaseService {
  
  static categories: string[] = [];
  
  public static async init() {
    await Category.initCategories();
    const categories = await Category.findAll();
    this.categories = categories.map((c) => c.displayName);
  }

  public static async error(subject: string, text: string, throws = true): Promise<void> {
    await new MailService().sendMail({
      from: 'debug@readless.ai',
      subject,
      text,
      to: 'debug@readless.ai',
    });
    if (throws) {
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
    // create the prompt onReply map to be sent to chatgpt
    if (loot.content.split(' ').length > MAX_OPENAI_TOKEN_COUNT) {
      loot.content = abbreviate(loot.content, MAX_OPENAI_TOKEN_COUNT);
      await this.error('Long article found', `Long article found for ${url}\n\n${loot.content}`, false);
    }
    if (loot.content.split(' ').length < MIN_TOKEN_COUNT) {
      throw new Error('Article too short');
    }
    if (Number.isNaN(loot.date.valueOf())) {
      await this.error('Invalid date found', `Invalid date found for ${url}\n\n${loot.dateMatches.join('\n')}`);
    }
    if (Date.now() - loot.date.valueOf() > ms(OLD_NEWS_THRESHOLD)) {
      throw new Error(`News is older than ${OLD_NEWS_THRESHOLD}`);
    }
    if (loot.date > new Date(Date.now() + ms('3h'))) {
      await this.error('News is from the future', `News is from the future for ${url}\n\n${loot.date.toISOString()}`);
    }
    // daylight savings most likely
    if (loot.date > new Date() && loot.date < new Date(Date.now() + ms('1h'))) {
      loot.date = new Date(Date.now() - ms('1h') + ms(`${loot.date.getMinutes()}m`));
    }
    const newSummary = Summary.json<Summary>({
      filteredText: loot.content,
      imageUrl: loot.imageUrl,
      originalDate: loot.date,
      originalTitle: loot.title,
      outletId: outlet.id,
      rawText: loot.rawText,
      url,
    });
    let categoryDisplayName: string;
    const sentiment = SummarySentiment.json<SummarySentiment>({ method: 'openai' });
    const sentimentTokens: string[] = [];
    const prompts: Prompt[] = [
      {
        handleReply: async (reply) => { 
          if (/no/i.test(reply.text)) {
            throw new Error('Not an actual article');
          }
          newSummary.title = reply.text;
        },
        text: [
          'Does the following appear to be a news article or story? A collection of article headlines, advertisements, description of a news website, or subscription program should not be considered a news article/story. Please respond with just "yes" or "no"\n\n', 
          newSummary.filteredText,
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          const { score, tokens } = JSON.parse(reply.text);
          if (Number.isNaN(score)) {
            await this.error('Not a valid sentiment score', reply.text);
          }
          sentiment.score = score;
          if (!Array.isArray(tokens) || !tokens.every((t) => typeof t === 'string')) {
            await this.error('tokens are in the wrong format', reply.text);
          }
          sentimentTokens.push(...tokens);
        },
        text: 'For the article/story I just gave you, please provide a floating point sentiment score between -1 and 1 as well as the 10 most notable adjective tokens from the text. Please respond with JSON only using the format: { score: number, tokens: string[] }',
      },
      {
        handleReply: async (reply) => { 
          if (reply.text.split(' ').length > 15) {
            await this.error('Title too long', `Title too long for ${url}\n\n${reply.text}`);
          }
          newSummary.title = reply.text;
        },
        text: [
          'Please summarize the same article/story using no more than 10 words. Prioritize any important numeric/date values and try to make the summary as unbiased as possible.',
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          if (reply.text.split(' ').length > 40) {
            await this.error('Short summary too long', `Short summary too long for ${url}\n\n${reply.text}`);
          }
          newSummary.shortSummary = reply.text;
        },
        text: [
          'Please provide another unbiased summary using no more than 30 words. Make note of any biases within the article. Do not start with "The article/story" or "This article/story".', 
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          if (reply.text.split(' ').length > 120) {
            await this.error('Summary too long', `Summary too long for ${url}\n\n${reply.text}`);
          }
          newSummary.summary = reply.text;
        },
        text: [
          'Please provide another longer two paragraph unbiased summary using no more than 80 words. Make note of any biases within the article. Do not start with "The article/story" or "This article/story".', 
        ].join(''),
      },
      {
        handleReply: async (reply) => {
          newSummary.bullets = reply.text
            .replace(/^bullets:\s*/i, '')
            .replace(/\.$/, '')
            .split(/\n/)
            .map((bullet) => bullet.trim());
        },
        text: 'Please provide 5 concise unbiased bullet point sentences no longer than 10 words each that summarize this article/story using • as the bullet symbol',
      },
      {
        handleReply: async (reply) => { 
          categoryDisplayName = reply.text
            .replace(/^category:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please select a best category for this article/story from the following choices: ${this.categories.join(' ')}`,
      },
    ];
    
    try {
      
      // initialize chatgpt service and send the prompt
      const chatgpt = new ChatGPTService();
      // iterate through each summary prompt and send them to chatgpt
      for (const prompt of prompts) {
        const reply = await chatgpt.send(prompt.text);
        if (BAD_RESPONSE_EXPR.test(reply.text)) {
          throw new Error(['Bad response from chatgpt', '--prompt--', prompt.text, '--repl--', reply.text].join('\n'));
        }
        this.log(reply);
        await prompt.handleReply(reply);
      }
    
      const category = await Category.findOne({ where: { displayName: categoryDisplayName } });
      newSummary.categoryId = category.id;

      if (this.features.image_generation) {
      
        // Generate image from the title
        const image = await DeepAiService.textToImage(newSummary.title);
        if (!image) {
          throw new Error('Image generation failed');
        }
        
        // Save image to S3 CDN
        const file = await S3Service.download(image.output_url);
        const obj = await S3Service.uploadObject({
          ACL: 'public-read',
          ContentType: 'image/jpeg',
          File: file,
          Folder: 'img/s',
        });
        newSummary.imageUrl = obj.url;
  
      }
    
      // Save summary to database
      const summary = await Summary.create(newSummary);
      
      // Create sentiment
      sentiment.parentId = summary.id;
      const newSentiment = await SummarySentiment.create(sentiment);

      // Create summary sentiment tokens
      for (const token of sentimentTokens) {
        await SummarySentimentToken.create({
          parentId: newSentiment.id,
          text: token,
        });
      }
      
      this.log('Created new summary from', url, newSummary.title);
      return summary;
      
    } catch (e) {
      await this.error('Unexpected Error Encountered', `${e}\n\n${JSON.stringify(newSummary, null, 2)}`);
    }
    
  }
  
}