import { DatedAttributes } from '../types';

export type CacheAttributes = DatedAttributes & {
  key: string;
  lifespan: string; // ms style
  value: string;
};

export type CacheCreationAttributes = Partial<DatedAttributes> & { 
  key: string;
  lifespan: string;
  value: string;
};