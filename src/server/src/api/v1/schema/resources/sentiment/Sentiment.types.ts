import { DatedAttributes } from '../../types';

export type SentimentAttributes = DatedAttributes & {
  parentId: number;
  method: string;
  score: number;
};

export type SentimentCreationAttributes = {
  parentId: number;
  method: string;
  score: number;
};

export type SentimentMap<T extends SentimentAttributes> = { [key: string]: T };