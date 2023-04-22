import ms from 'ms';

import { ReadAndSummarizePayload } from './types';
import {
  ChatGPTService,
  MailService,
  Prompt,
  PuppeteerService,
} from '../';
import { Category, Summary } from '../../api/v1/schema/models';
import { BaseService } from '../base';

const MIN_TOKEN_COUNT = 200 as const;
const MAX_OPENAI_TOKEN_COUNT = 4096 as const;
const BAD_RESPONSE_EXPR = /^["']?[\s\n]*(?:Understood,|Alright,|okay, i|Okay. How|I am an AI|I'm sorry|stay (?:informed|updated)|keep yourself updated|CNBC: stay|CNBC is offering|sign\s?up|HuffPost|got it. |how can i|hello!|okay, i'm|sure,)/i;

const NOTICE_MESSAGE = 'This reading format will be going away in the next major update, which will include more useful analysis metrics that are short and easier to read! Stay tuned!';

const OLD_NEWS_THRESHOLD = process.env.OLD_NEWS_THRESHOLD || '1d';

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
    // fetch web content with the spider
    const loot = await PuppeteerService.loot(url, outlet, content);
    // create the prompt onReply map to be sent to chatgpt
    if (loot.content.split(' ').length > MAX_OPENAI_TOKEN_COUNT) {
      await new MailService().sendMail({
        from: 'debug@readless.ai',
        subject: 'Article too long',
        text: `Article too long for ${url}\n\n${loot.content}`,
        to: 'debug@readless.ai',
      });
      throw new Error('Article too long for OpenAI');
    }
    if (loot.content.split(' ').length < MIN_TOKEN_COUNT) {
      await new MailService().sendMail({
        from: 'debug@readless.ai',
        subject: 'Article too short',
        text: `Article too short for ${url}\n\n${loot.content}`,
        to: 'debug@readless.ai',
      });
      throw new Error('Article too short');
    }
    if (Number.isNaN(loot.date.valueOf())) {
      await new MailService().sendMail({
        from: 'debug@readless.ai',
        subject: 'Invalid date found',
        text: `Invalid date found for ${url}`,
        to: 'debug@readless.ai',
      });
      throw new Error('Published date found is invalid');
    }
    if (Date.now() - loot.date.valueOf() > ms(OLD_NEWS_THRESHOLD)) {
      throw new Error(`News is invalid or older than ${OLD_NEWS_THRESHOLD}`);
    }
    if (loot.date > new Date()) {
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
      longSummary: NOTICE_MESSAGE,
      originalDate: loot.date,
      originalTitle: loot.title,
      outletId: outlet.id,
      rawText: loot.rawText,
      summary: NOTICE_MESSAGE,
      text: NOTICE_MESSAGE,
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
          'Does the following appear to be a news article? A collection of article headlines, advertisement, or description of a news website should not be considered a news article. Please respond with just "yes" or "no"\n\n', 
          newSummary.filteredText,
        ].join(''),
      },
      {
        handleReply: async (reply) => { 
          if (reply.text.length > 200) {
            await new MailService().sendMail({
              from: 'debug@readless.ai',
              subject: 'Title too long',
              text: `Title too long for ${url}\n\n${loot.title}\n\n${loot.content}`,
              to: 'debug@readless.ai',
            });
            throw new Error('Title too long');
          }
          newSummary.title = reply.text;
        },
        text: [
          'Please summarize the general take away message of the article I just gave you in a single sentence using no more than 150 characters. Do not start with "The article" or "This article".', 
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
          newSummary.shortSummary = reply.text;
        },
        text: 'Please provide a two to three sentence summary using no more than 150 words. Do not start with "The article" or "This article".',
      },
      {
        handleReply: async (reply) => {
          newSummary.tags = reply.text
            .replace(/^tags:\s*/i, '')
            .replace(/\.$/, '')
            .split(/[,;\n]/)
            .map((tag) => tag.trim());
        },
        text: 'Please provide a list of at least 10 tags most relevant to this article separated by commas like: tag 1,tag 2,tag 3,tag 4,tag 5,tag 6,tag 7,tag 8,tag 9,tag 10',
      },
      {
        handleReply: async (reply) => { 
          newSummary.category = reply.text
            .replace(/^category:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please select a best category for this article from the following choices: ${this.categories.join(' ')}`,
      },
      {
        handleReply: async (reply) => { 
          newSummary.subcategory = reply.text
            .replace(/^subcategory:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please provide a one word subcategory for this article under the category '${newSummary.category}'`,
      },
      {
        handleReply: async (reply) => {
          newSummary.imagePrompt = reply.text;
        },
        text: 'Please provide a short image prompt for an ai image generator to make an image for this article',
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