import Sentiment from 'sentiment';
import { SentimentMethodName } from 'src/api/v1/schema';

import { SentimentIntensityAnalyzer } from './vader';
import { BaseService } from '../base';

export class SentimentService extends BaseService {

  public static sentiment<
    Method extends SentimentMethodName,
    R extends Method extends 'afinn' ? Sentiment.AnalysisResult : ReturnType<typeof SentimentIntensityAnalyzer.polarityScores>,
  >(method: Method, text: string): R {
    switch (method) {
    case 'afinn':
      return new Sentiment().analyze(text) as R;
    case 'vader':
      return SentimentIntensityAnalyzer.polarityScores(text) as R;
    default:
      return undefined as R;
    }
  }

}