
import { DatedAttributes } from '../types';

export type StatusAttributes = DatedAttributes & {
  name: string;
  description: string;
  data?: Record<string, unknown>;
};

export type StatusCreationAttributes = {
  name: string;
  description: string;
  data?: Record<string, unknown>;
};