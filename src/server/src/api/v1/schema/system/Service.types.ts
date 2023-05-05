import { DatedAttributes } from '../types';

export type ServiceAttributes = DatedAttributes & {
  name: string;
  description?: string;
};

export type ServiceCreationAttributes = { 
  name: string;
  description?: string;
};