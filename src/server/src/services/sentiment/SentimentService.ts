import Sentiment from 'sentiment';

import { SentimentIntensityAnalyzer } from './vader';
import { SentimentMethodName } from '../../api/v1/schema';
import { BaseService } from '../base';
import { MailService } from '../mail';
import { OpenAIService } from '../openai';

export class SentimentService extends BaseService {

  public static async sentiment<
    Method extends SentimentMethodName,
    R extends (Method extends 'afinn' ? Sentiment.AnalysisResult :
    Method extends 'openai' ? number :
    ReturnType<typeof SentimentIntensityAnalyzer.polarityScores>) | undefined,
  >(method: Method, text: string): Promise<R> {
    switch (method) {
    case 'afinn':
      return new Sentiment().analyze(text) as R;
    case 'openai':
      return await this.openAiSentiment(text) as R;
    case 'vader':
      return SentimentIntensityAnalyzer.polarityScores(text) as R;
    default:
      return undefined as R;
    }
  }
  
  public static async openAiSentiment(text: string) {
    try {
      const chatService = new OpenAIService();
      const reply = await chatService.send(['For the following text, please provide a floating point sentiment score between -1 and 1. Please respond with the score only:', text].join('\n\n'));
      const score = Number.parseFloat(reply);
      if (Number.isNaN(score)) {
        await new MailService().sendMail({
          from: 'debug@readless.ai',
          subject: 'Not a valid sentiment score', 
          text: [reply, text].join('\n\n'),
          to: 'debug@readless.ai',
        });
        throw new Error('invalid sentiment');
      }
      return score;
    } catch (e) {
      console.error(e);
    }
  }

}