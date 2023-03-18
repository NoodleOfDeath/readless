
import { DatedAttributes } from '../types';

export type NewsletterAttributes = DatedAttributes & {
  name: string;
  description: string;
};

export type NewsletterCreationAttributes = DatedAttributes & {
  name: string;
  description: string;
};