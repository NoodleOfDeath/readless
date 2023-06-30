import { DatedAttributes } from '../../types';

export type SubscriptionChannel = 'email' | 'sms' | 'push';

export type SubscriptionAttributes = DatedAttributes & {
  channel: SubscriptionChannel;
  uuid: string;
  event: string;
  locale?: string;
  verifyToken?: string;
  verifiedAt?: Date;
};

export type SubscriptionCreationAttributes = Partial<DatedAttributes> & {
  channel: SubscriptionChannel;
  uuid: string;
  event: string;
  locale?: string;
  verifyToken?: string;
  verifiedAt?: Date;
};

export type PublicSubscriptionAttributes = Omit<SubscriptionAttributes, 'verifyToken'>;