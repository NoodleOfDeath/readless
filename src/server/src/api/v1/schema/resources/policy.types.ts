import { DatedAttributes } from '../types';

export type PolicyAttributes = DatedAttributes & {
  name: string;
  content: string;
};

export type PolicyCreationAttributes = DatedAttributes & {
  name: string;
  content: string;
};