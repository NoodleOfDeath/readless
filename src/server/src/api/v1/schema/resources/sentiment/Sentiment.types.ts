import { DatedAttributes } from '../../types';

export type Token = { text: string };

export type SentimentAttributes = DatedAttributes & {
  parentId: number;
  method: string;
  score: number;
  tokens?: Token[];
};

export type SentimentCreationAttributes = {
  parentId: number;
  method: string;
  score: number;
  tokens?: Token[];
};