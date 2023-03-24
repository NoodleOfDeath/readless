import { DatedAttributes } from '../types';

export type DocumentAttributes = DatedAttributes & {
  name: string;
  content: string;
};

export type DocumentCreationAttributes = {
  name: string;
  content: string;
};