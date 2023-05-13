import { SentimentTokenAttributes, SentimentTokenCreationAttributes } from './SentimentToken.types';
import { DatedAttributes } from '../../types';

export type SentimentAttributes<T extends SentimentTokenAttributes> = DatedAttributes & {
  parentId: number;
  method: string;
  score: number;
  tokens: T[];
};

export type SentimentCreationAttributes<T extends SentimentTokenCreationAttributes> = {
  parentId: number;
  method: string;
  score: number;
  tokens?: T[];
};

export type Sentimental = {
  sentiment: number;
};

export const PUBLIC_SENTIMENT_ATTRIBUTES = ['id', 'method', 'score'];

export type PublicSentimentAttributes = {
  method: string;
  score: number;
};