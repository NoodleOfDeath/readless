
import { DatedAttributes } from '../types';

export type SubscriptionAttributes = DatedAttributes & {
  aliasType: string;
  alias: string;
  newsletterId: number;
};

export type SubscriptionCreationAttributes = {
  aliasType: string;
  alias: string;
  newsletterId?: number;
  newsletterName?: string;
};