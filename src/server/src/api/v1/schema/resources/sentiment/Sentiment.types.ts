import { SentimentTokenAttributes, SentimentTokenCreationAttributes } from './SentimentToken.types';
import { DatedAttributes, SentimentMethodName } from '../../types';

export type SentimentAttributes<T extends SentimentTokenAttributes> = DatedAttributes & {
  parentId: number;
  method: SentimentMethodName;
  score: number;
  tokens: T[];
};

export type SentimentCreationAttributes<T extends SentimentTokenCreationAttributes> = {
  parentId: number;
  method: SentimentMethodName;
  score: number;
  tokens?: T[];
};

export type Sentimental = {
  sentiment: number;
};

export const PUBLIC_SENTIMENT_ATTRIBUTES = ['id', 'method', 'score'];

export type PublicSentimentAttributes<T extends SentimentTokenCreationAttributes> = {
  method: string;
  score: number;
  description: string;
  tokens: T[];
};