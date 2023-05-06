import { DatedAttributes } from '../../types';

export type SentimentTokenAttributes = DatedAttributes & {
  parentId: number;
  text: string;
};

export type SentimentTokenCreationAttributes = {
  parentId: number;
  text: string;
};