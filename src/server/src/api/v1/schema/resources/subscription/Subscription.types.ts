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
};

export const PUBLIC_SUBSCRIPTION_ATTRIBUTES = [
  'id',
  'verifiedAt',
  'expiresAt',
] as const;

export type PublicSubscriptionAttributes = Pick<
  SubscriptionAttributes,
  typeof PUBLIC_SUBSCRIPTION_ATTRIBUTES[number]>;