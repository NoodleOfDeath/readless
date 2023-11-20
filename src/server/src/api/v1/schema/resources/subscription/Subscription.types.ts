import { DatedAttributes } from '../../types';

export type SubscriptionChannel = 'email' | 'sms' | 'fcm' | 'apns' | 'push';
export type SubscriptionEvent = 'default' | 'daily-recap' | 'daily-reminder';

export type SubscriptionAttributes = DatedAttributes & {
  channel: SubscriptionChannel;
  uuid: string;
  event: SubscriptionEvent;
  repeats?: string;
  title?: string;
  body?: string;
  fireTime?: Date;
  locale?: string;
  verificationCode?: string;
  unsubscribeToken?: string;
  verifiedAt?: Date;
  expiresAt?: Date;
  userId?: number;
};

export type SubscriptionCreationAttributes = Partial<DatedAttributes> & {
  channel: SubscriptionChannel;
  uuid: string;
  event: SubscriptionEvent;
  repeats?: string;
  title?: string;
  body?: string;
  fireTime?: Date;
  locale?: string;
  verificationCode?: string;
  unsubscribeToken?: string;
  verifiedAt?: Date;
  expiresAt?: Date;
  userId?: number;
};

export const PUBLIC_SUBSCRIPTION_ATTRIBUTES = [
  'id',
  'channel',
  'event',
  'repeats',
  'fireTime',
  'verifiedAt',
  'expiresAt',
] as const;

export type PublicSubscriptionAttributes = Pick<
  SubscriptionAttributes,
  typeof PUBLIC_SUBSCRIPTION_ATTRIBUTES[number]>;