import Sentiment from 'sentiment';

import { SentimentIntensityAnalyzer } from './vader';
import { SentimentMethodName, SystemLog } from '../../api/v1/schema';
import { AnthropicService } from '../anthropic';
import { BaseService } from '../base';
import { OpenAIService } from '../openai';

export class SentimentService extends BaseService {

  public static async sentiment<
    Method extends SentimentMethodName,
    R extends (Method extends 'afinn' ? Sentiment.AnalysisResult :
    Method extends 'claude-2.1' | 'gpt-3.5' ? number :
    Method extends 'vader' ?
    ReturnType<typeof SentimentIntensityAnalyzer.polarityScores> : undefined) | undefined,
  >(method: Method, text: string): Promise<R> {
    switch (method) {
    case 'afinn':
      return new Sentiment().analyze(text) as R;
    case 'claude-2.1':
      return await this.claude21Sentiment(text) as R;
    case 'gpt-3.5':
      return await this.gpt35Sentiment(text) as R;
    case 'vader':
      return SentimentIntensityAnalyzer.polarityScores(text) as R;
    default:
      return undefined as R;
    }
  }
  
  public static async claude21Sentiment(text: string, retries = 1) {
    try {
      const chatService = new AnthropicService();
      const reply = await chatService.send(['For the following text, please provide a floating point sentiment score between -1 and 1. Please respond with the score only:', text].join('\n\n'));
      const score = Number.parseFloat(reply.trim());
      if (Number.isNaN(score)) {
        await SystemLog.create({
          level: 'error',
          message: `Invalid sentiment score response: ${text} => ${reply}`,
        });
        if (retries > 0) {
          return await this.claude21Sentiment(text, retries - 1);
        }
      }
      return score;
    } catch (e) {
      console.error(e);
      await SystemLog.create({
        level: 'error',
        message: `${e}: ${text}`,
      });
      if (retries > 0) {
        return await this.claude21Sentiment(text, retries - 1);
      }
    }
  }
  
  public static async gpt35Sentiment(text: string, retries = 2) {
    try {
      const chatService = new OpenAIService();
      const reply = await chatService.send(['For the following text, please provide a floating point sentiment score between -1 and 1. Please respond with the score only:', text].join('\n\n'));
      const score = Number.parseFloat(reply.trim());
      if (Number.isNaN(score)) {
        await SystemLog.create({
          level: 'error',
          message: `Invalid sentiment score response: ${text} => ${reply}`,
        });
        if (retries > 0) {
          return await this.gpt35Sentiment(text, retries - 1);
        }
      }
      return score;
    } catch (e) {
      console.error(e);
      await SystemLog.create({
        level: 'error',
        message: `${e}: ${text}`,
      });
      if (retries > 0) {
        return await this.gpt35Sentiment(text, retries - 1);
      }
    }
  }

}