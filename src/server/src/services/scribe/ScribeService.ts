import { ReadAndSummarizeOptions, ReadAndSummarizePayload } from './types';
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
    this.categories = categories.map((category) => category.name);
  }
  
  public static async readAndSummarize(
    { url }: ReadAndSummarizePayload,
    {
      onProgress, force, outletId, 
    }: ReadAndSummarizeOptions = {}
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
    const loot = await spider.loot(url);
    // create the prompt handleReply map to be sent to chatgpt
    if (loot.filteredText.split(' ').length > MAX_OPENAI_TOKEN_COUNT) {
      throw new Error('Article too long for OpenAI');
    }
    const newSummary = Summary.json<Summary>({
      filteredText: loot.filteredText,
      originalTitle: loot.title,
      outletId,
      rawText: loot.text,
      url,
    });
    const prompts: Prompt[] = [
      {
        handleReply: (reply) => { 
          if (reply.text.length > 200) {
            throw new Error('Title too long');
          }
          newSummary.title = reply.text;
        },
        text: `Please summarize the general take away message of the following article in a single sentence using no more than 150 characters:\n\n${newSummary.filteredText}`,
      },
      {
        handleReply: (reply) => {
          newSummary.bullets = reply.text
            .replace(/^bullets:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
            .map((bullet) => bullet.trim());
        },
        text: 'Please provide 5 concise bullet point sentences no longer than 10 words each that summarize this article using • as the bullet symbol',
      },
      {
        handleReply: (reply) => { 
          newSummary.shortSummary = reply.text;
        },
        text: [
          'Please summarize the same article in two sentences and no more than 300 characters',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        handleReply: (reply) => { 
          newSummary.summary = reply.text;
        },
        text: [
          'Please summarize the same article using between 100 and 200 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        handleReply: (reply) => { 
          newSummary.longSummary = reply.text;
        },
        text: [
          'Please summarize the same article using between 300 and 600 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        handleReply: (reply) => { 
          newSummary.text = reply.text;
        },
        text: [
          'Please summarize the same article using between 600 and 1000 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        handleReply: (reply) => {
          newSummary.tags = reply.text
            .replace(/^tags:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
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
    for (let n = 0; n < prompts.length; n++) {
      const prompt = prompts[n];
      const reply = await chatgpt.send(prompt.text);
      if (BAD_RESPONSE_EXPR.test(reply.text)) {
        throw new Error('Bad response from chatgpt');
      }
      console.log(reply);
      prompt.handleReply(reply);
      if (onProgress) {
        onProgress((n + 1) / prompts.length);
      }
    }
    const category = await Category.findOne({ where: { displayName: newSummary.category } });
    newSummary.category = category.name;
    console.log('Created new summary from', url, newSummary.title);
    const summary = await Summary.create(newSummary);
    return summary;
  }
  
}