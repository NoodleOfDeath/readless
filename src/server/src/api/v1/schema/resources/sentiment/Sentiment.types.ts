import {  } from './SentimentToken.model';
import { SentimentTokenAttributes } from './SentimentToken.types';
import { DatedAttributes } from '../../types';

export type SentimentAttributes = DatedAttributes & {
  parentId: number;
  method: string;
  score: number;
  tokens?: SentimentTokenAttributes[];
};

export type SentimentCreationAttributes = {
  parentId: number;
  method: string;
  score: number;
};