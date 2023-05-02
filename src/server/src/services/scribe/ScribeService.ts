import ms from 'ms';

import { ReadAndSummarizePayload } from './types';
import {
  ChatGPTService,
  MailService,
  Prompt,
  PuppeteerService,
} from '../';
import { Category, Summary } from '../../api/v1/schema/models';
import { Sentiment } from '../../api/v1/schema/types';
import { BaseService } from '../base';

const MIN_TOKEN_COUNT = 70 as const;
const MAX_OPENAI_TOKEN_COUNT = 4000 as const;
const BAD_RESPONSE_EXPR = /^["']?[\s\n]*(?:Understood,|Alright,|okay, i|Okay. How|I am an AI|I'm sorry|stay (?:informed|updated)|keep yourself updated|CNBC: stay|CNBC is offering|sign\s?up|HuffPost|got it. |how can i|hello!|okay, i'm|sure,)/i;

const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

export function abbreviate(str: string, len: number) {
  // const sentences = str.split(/\.|\?|!/);
  //console.log(parts);
  return str.substring(0, len);
}

export class ScribeService extends BaseService {
  
  static categories: string[] = [];
  
  public static async init() {
    await Category.initCategories();
    const categories = await Category.findAll();
    this.categories = categories.map((c) => c.displayName);
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
      await new MailService().sendMail({
        from: 'debug@readless.ai',
        subject: 'Long article found',
        text: `Long article found ${url}\n\n${loot.content}`,
        to: 'debug@readless.ai',
      });
    }
    if (loot.content.split(' ').length < MIN_TOKEN_COUNT) {
      throw new Error('Article too short');
    }
    if (Number.isNaN(loot.date.valueOf())) {
      await new MailService().sendMail({
        from: 'debug@readless.ai',
        subject: 'Invalid date found',
        text: `Invalid date found for ${url}\n\n${loot.dateMatches.join('\n')}`,
        to: 'debug@readless.ai',
      });
      throw new Error('Published date found is invalid');
    }
    if (Date.now() - loot.date.valueOf() > ms(OLD_NEWS_THRESHOLD)) {
      throw new Error(`News is older than ${OLD_NEWS_THRESHOLD}`);
    }
    if (loot.date > new Date(Date.now() + ms('4h'))) {
      await new MailService().sendMail({
        from: 'debug@readless.ai',
        subject: 'News is from the future',
        text: `News is from the future for ${url}\n\n${loot.date.toISOString()}`,
        to: 'debug@readless.ai',
      });
      throw new Error('News is from the future');
    }
    const newSummary = Summary.json<Summary>({
      filteredText: loot.content,
      imageUrl: loot.imageUrl,
      originalDate: loot.date,
      originalTitle: loot.title,
      outletId: outlet.id,
      rawText: loot.rawText,
      sentiments: {},
      url,
    });
    const prompts: Prompt[] = [
      {
        handleReply: async (reply) => { 
          if (/no/i.test(reply.text)) {
            throw new Error('Not an actual article');
          }
          newSummary.title = reply.text;
        },
        text: [
          'Does the following appear to be a news article? A collection of articles, advertisements, or description of a news website should not be considered a news article. Please respond with just "yes" or "no"\n\n', 
          newSummary.filteredText,
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          const sentiment = Sentiment.from(reply.text);
          if (Number.isNaN(sentiment.score)) {
            throw new Error(`Not a valid sentiment score: ${reply.text}`);
          }
          newSummary.sentiments.chatgpt = sentiment;
        },
        text: 'For the article I just gave you, please provide a floating point sentiment score between -1 and 1 as well as at least 10 adjective token counts. Please respond with JSON only using the format: { score: number, tokens: Record<string, number> }',
      },
      {
        handleReply: async (reply) => { 
          if (reply.text.split(' ').length > 20) {
            await new MailService().sendMail({
              from: 'debug@readless.ai',
              subject: 'Title too long',
              text: `Title too long for ${url}\n\n${reply.text}`,
              to: 'debug@readless.ai',
            });
            throw new Error('Title too long');
          }
          newSummary.title = reply.text;
        },
        text: [
          'Please summarize the same article using no more than 15 words. Do not start with "The article" or "This article".', 
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          if (reply.text.split(' ').length > 100) {
            await new MailService().sendMail({
              from: 'debug@readless.ai',
              subject: 'Summary too long',
              text: `Summary too long for ${url}\n\n${reply.text}`,
              to: 'debug@readless.ai',
            });
            throw new Error('Title too long');
          }
          newSummary.summary = reply.text;
          newSummary.shortSummary = reply.text;
        },
        text: [
          'Please provide a three to four sentence summary using no more than 100 words. Do not start with "The article" or "This article".', 
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
        text: 'Please provide 5 concise bullet point sentences no longer than 10 words each that summarize this article using • as the bullet symbol',
      },
      {
        handleReply: async (reply) => { 
          newSummary.category = reply.text
            .replace(/^category:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please select a best category for this article from the following choices: ${this.categories.join(' ')}`,
      },
    ];
    // initialize chatgpt service and send the prompt
    const chatgpt = new ChatGPTService();
    // iterate through each summary prompt and send them to chatgpt
    for (const prompt of prompts) {
      const reply = await chatgpt.send(prompt.text);
      if (BAD_RESPONSE_EXPR.test(reply.text)) {
        throw new Error(['Bad response from chatgpt', '--prompt--', prompt.text, '--repl--', reply.text].join('\n'));
      }
      console.log(reply);
      await prompt.handleReply(reply);
    }
    const category = await Category.findOne({ where: { displayName: newSummary.category } });
    newSummary.category = category.name;
    console.log('Created new summary from', url, newSummary.title);
    const summary = await Summary.create(newSummary);
    return summary;
  }
  
}