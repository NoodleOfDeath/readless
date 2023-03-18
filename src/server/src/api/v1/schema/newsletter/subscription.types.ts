
import { DatedAttributes } from '../types';

export type SubscriptionAttributes = DatedAttributes & {
  aliasType: string;
  alias: string;
  newsletterId: number;
};

export type SubscriptionCreationAttributes = DatedAttributes & {
  aliasType: string;
  alias: string;
  newsletterId?: number;
  newsletterName?: string;
};