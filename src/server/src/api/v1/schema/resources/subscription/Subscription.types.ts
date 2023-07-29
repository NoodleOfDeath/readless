import { DatedAttributes } from '../../types';

export type SubscriptionChannel = 'email' | 'sms' | 'push';

export type SubscriptionAttributes = DatedAttributes & {
  channel: SubscriptionChannel;
  uuid: string;
  event: string;
  locale?: string;
  verifiedToken?: string;
  unsubscribeToken?: string;
  verifiedAt?: Date;
  expiresAt?: Date;
};

export type SubscriptionCreationAttributes = Partial<DatedAttributes> & {
  channel: SubscriptionChannel;
  uuid: string;
  event: string;
  locale?: string;
  verifiedToken?: string;
  unsubscribeToken?: string;
  verifiedAt?: Date;
  expiresAt?: Date;
};

export const PUBLIC_SUBSCRIPTION_ATTRIBUTES = [
  'id',
  'verifiedAt',
  'expiresAt',
] as const;

export type PublicSubscriptionAttributes = Pick<
  SubscriptionAttributes,
  typeof PUBLIC_SUBSCRIPTION_ATTRIBUTES[number]>;