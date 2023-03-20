
import { DatedAttributes } from '../types';

export type NewsletterAttributes = DatedAttributes & {
  name: string;
  description: string;
};

export type NewsletterCreationAttributes = {
  name: string;
  description: string;
};