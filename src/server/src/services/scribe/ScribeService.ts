import { ReadAndSummarizeExternalArticleOptions } from './types';
import {
  ChatGPTService,
  Prompt,
  SpiderService,
} from '../';
import { Summary } from '../../api/v1/schema/models';
import { ReadAndSummarizeExternalArticlePayload } from '../../api/v1/schema/types';
import { BaseService } from '../base';

const MAX_OPENAI_TOKEN_COUNT = 4096 as const;

export class ScribeService extends BaseService {
  
  public async readAndSummarizeExternalArticle(
    { url }: ReadAndSummarizeExternalArticlePayload,
    {
      onProgress, force, outletId, 
    }: ReadAndSummarizeExternalArticleOptions = {}
  ): Promise<Summary> {
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
      console.log(`Forcing source rewrite for ${url}`);
    }
    // fetch web content with the spider
    const spider = new SpiderService();
    const loot = await spider.loot(url);
    // create the prompt action map to be sent to chatgpt
    if (loot.filteredText.length > MAX_OPENAI_TOKEN_COUNT) {
      throw new Error('Article too long for OpenAI');
    }
    const sourceInfo = Summary.json<Summary>({
      filteredText: loot.filteredText,
      originalTitle: loot.title,
      outletId,
      rawText: loot.text,
      url,
    });
    const prompts: Prompt[] = [
      {
        action: (reply) => (sourceInfo.title = reply.text),
        catchFailure: (reply) => { 
          if (reply.text.length > 120) {
            return new Error('Title too long');
          }
        },
        text: `Please read the following article and provide a single sentence summary using no more than 120 characters:\n\n${sourceInfo.filteredText}`,
      },
      {
        action: (reply) => {
          sourceInfo.bullets = reply.text
            .replace(/^bullets:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
            .map((bullet) => bullet.trim());
        },
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: 'Please provide 5 concise bullet point sentences no longer than 10 words each for this article',
      },
      {
        action: (reply) => (sourceInfo.shortSummary = reply.text),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: [
          'Please summarize the same article in one sentence using no more than 255 characters.',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        action: (reply) => (sourceInfo.summary = reply.text),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: [
          'Please summarize the same article using between 100 and 200 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        action: (reply) => (sourceInfo.abridged = reply.text),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: [
          'Please summarize the same article using between 300 and 600 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        action: (reply) => (sourceInfo.text = reply.text),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: [
          'Please summarize the same article using between 600 and 1500 words.',
          'Please do not use phrases like "the article".',
        ].join(' '),
      },
      {
        action: (reply) => {
          sourceInfo.tags = reply.text
            .replace(/^tags:\s*/i, '')
            .replace(/\.$/, '')
            .split(',')
            .map((tag) => tag.trim());
        },
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: 'Please provide a list of at least 10 tags most relevant to this article separated by commas like: tag 1,tag 2,tag 3,tag 4,tag 5,tag 6,tag 7,tag 8,tag 9,tag 10',
      },
      {
        action: (reply) => (sourceInfo.category = reply.text.replace(/^category:\s*/i, '').replace(/\.$/, '')).trim(),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: 'Please provide a one word category for this article',
      },
      {
        action: (reply) =>
          (sourceInfo.subcategory = reply.text.replace(/^subcategory:\s*/i, '').replace(/\.$/, '')).trim(),
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: 'Please provide a one word subcategory for this article',
      },
      {
        action: (reply) => {
          sourceInfo.imagePrompt = reply.text;
        },
        catchFailure: (reply) => { 
          if (/^[\s\n]*(?:i'm sorry|sign\s?up)/i.test(reply.text)) {
            return new Error('Bad response from chatgpt');
          }
        },
        text: 'Please provide a short image prompt for an ai image generator to make an image for this article',
      },
    ];
    // initialize chatgpt service and send the prompt
    const chatgpt = new ChatGPTService();
    // iterate through each source prompt and send them to chatgpt
    for (let n = 0; n < prompts.length; n++) {
      const prompt = prompts[n];
      const reply = await chatgpt.send(prompt.text);
      console.log(reply);
      if (prompt.catchFailure) {
        const error = prompt.catchFailure(reply);
        if (error) { 
          throw error;
        }
      }
      prompt.action(reply);
      if (onProgress) {
        onProgress((n + 1) / prompts.length);
      }
    }
    console.log(sourceInfo);
    const source = new Summary(sourceInfo);
    await source.save();
    await source.reload();
    if (onProgress) {
      onProgress(1);
    }
    return source;
  }
  
}