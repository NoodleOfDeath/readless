import { DatedAttributes, SentimentMethodName } from '../../types';

export type SentimentAttributes = DatedAttributes & {
  parentId: number;
  method: SentimentMethodName;
  score: number;
};

export type SentimentCreationAttributes = Partial<DatedAttributes> & {
  parentId: number;
  method: SentimentMethodName;
  score: number;
};

export type Sentimental = {
  sentiment?: number;
};

export const PUBLIC_SENTIMENT_ATTRIBUTES = ['id', 'method', 'score'];

export type PublicSentimentAttributes = {
  method: string;
  score: number;
};