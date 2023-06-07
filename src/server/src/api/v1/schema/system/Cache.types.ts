import { DatedAttributes } from '../types';

export type CacheAttributes = DatedAttributes & {
  key: string;
  halflife: string; // ms style
  value: string;
};

export type CacheCreationAttributes = Partial<DatedAttributes> & { 
  key: string;
  halflife: string;
  value: string;
};