import { SentimentTokenAttributes, SentimentTokenCreationAttributes } from './SentimentToken.types';
import { DatedAttributes } from '../../types';

export type SentimentAttributes<T extends SentimentTokenAttributes> = DatedAttributes & {
  parentId: number;
  method: string;
  score: number;
  // @Deprecated
  summary_sentiment_tokens?: SentimentTokenAttributes[];
  tokens: T[];
};

export type SentimentCreationAttributes<T extends SentimentTokenCreationAttributes> = {
  parentId: number;
  method: string;
  score: number;
  // @Deprecated
  summary_sentiment_tokens?: SentimentTokenAttributes[];
  tokens?: T[];
};

export type Sentimental = {
  sentiment: number;
  // @Deprecated
  averageSentiment?: number;
};