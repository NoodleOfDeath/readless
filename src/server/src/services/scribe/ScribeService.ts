import { ReadAndSummarizePayload } from './types';
import {
  ChatGPTService,
  Prompt,
  SpiderService,
} from '../';
import { Category, Summary } from '../../api/v1/schema/models';
import { BaseService } from '../base';

const MAX_OPENAI_TOKEN_COUNT = 4096 as const;
const BAD_RESPONSE_EXPR = /^["']?[\s\n]*(?:Understood,|Alright,|okay, i|Okay. How|I am an AI|I'm sorry|stay (?:informed|updated)|keep yourself updated|CNBC: stay|CNBC is offering|sign\s?up|HuffPost|got it. |how can i|hello!|okay, i'm|sure,)/i;

export class ScribeService extends BaseService {
  
  static categories: string[] = [];
  
  public static async init() {
    await Category.initCategories();
    const categories = await Category.findAll();
    this.categories = categories.map((c) => c.displayName);
  }
  
  public static async readAndSummarize(
    {
      url, content, dateSelector, dateAttribute, outletId, force, 
    }: ReadAndSummarizePayload
  ): Promise<Summary> {
    if (this.categories.length === 0) {
      await this.init();
    }
    if (!outletId) {
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
    const spider = new SpiderService();
    const loot = await spider.loot(url, content, dateSelector, dateAttribute);
    // create the prompt onReply map to be sent to chatgpt
    if (loot.filteredText.split(' ').length > MAX_OPENAI_TOKEN_COUNT) {
      throw new Error('Article too long for OpenAI');
    }
    const newSummary = Summary.json<Summary>({
      filteredText: loot.filteredText,
      originalDate: loot.timestamp && new Date(loot.timestamp),
      originalTitle: loot.title,
      outletId,
      rawText: loot.text,
      url,
    });
    const prompts: Prompt[] = [
      {
        handleReply: (reply) => { 
          if (/no/i.test(reply.text)) {
            throw new Error(['Not an actual article'].join('\n'));
          }
          newSummary.title = reply.text;
        },
        text: [
          'Does the following appear to be an actual news article? Please respond with just "yes" or "no"\n\n', 
          newSummary.filteredText,
        ].join(''),
      },
      {
        handleReply: (reply) => { 
          if (reply.text.length > 200) {
            throw new Error(['Title too long'].join('\n'));
          }
          newSummary.title = reply.text;
        },
        text: [
          'Please summarize the general take away message of the article I just gave you in a single sentence using no more than 150 character', 
        ].join(''),
      },
      {
        handleReply: (reply) => {
          newSummary.bullets = reply.text
            .replace(/^bullets:\s*/i, '')
            .replace(/\.$/, '')
            .split(/[,;\n]/)
            .map((bullet) => bullet.trim());
        },
        text: 'Please provide 5 concise bullet point sentences no longer than 10 words each that summarize this article using • as the bullet symbol',
      },
      {
        handleReply: (reply) => { 
          newSummary.shortSummary = reply.text;
        },
        text: 'Please provide a two sentence summary using no more than 300 characters',
      },
      {
        handleReply: (reply) => { 
          newSummary.summary = reply.text;
        },
        text: 'Please provide a 100 to 200 word summary',
      },
      {
        handleReply: (reply) => { 
          newSummary.longSummary = reply.text;
        },
        text: 'Please provide a 200 to 300 word summary',
      },
      {
        handleReply: (reply) => { 
          newSummary.text = reply.text;
        },
        text: 'Please provide a 300 to 400 word summary',
      },
      {
        handleReply: (reply) => {
          newSummary.tags = reply.text
            .replace(/^tags:\s*/i, '')
            .replace(/\.$/, '')
            .split(/[,;\n]/)
            .map((tag) => tag.trim());
        },
        text: 'Please provide a list of at least 10 tags most relevant to this article separated by commas like: tag 1,tag 2,tag 3,tag 4,tag 5,tag 6,tag 7,tag 8,tag 9,tag 10',
      },
      {
        handleReply: (reply) => { 
          newSummary.category = reply.text
            .replace(/^category:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please select a best category for this article from the following choices: ${this.categories.join(' ')}`,
      },
      {
        handleReply: (reply) => { 
          newSummary.subcategory = reply.text
            .replace(/^subcategory:\s*/i, '')
            .replace(/\.$/, '').trim();
        },
        text: `Please provide a one word subcategory for this article under the category '${newSummary.category}'`,
      },
      {
        handleReply: (reply) => {
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
      prompt.handleReply(reply);
    }
    const category = await Category.findOne({ where: { displayName: newSummary.category } });
    newSummary.category = category.name;
    console.log('Created new summary from', url, newSummary.title);
    const summary = await Summary.create(newSummary);
    return summary;
  }
  
}