import {
  Attributes,
  OrderItem,
  FindAndCountOptions as SequelizeFindAndCountOptions,
} from 'sequelize';
import { Hooks } from 'sequelize/types/hooks';
import { Model } from 'sequelize-typescript';

export type DatedAttributes = {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type FindAndCountOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Model<any, any> | Hooks<Model<any, any>, any, any>,
> = Omit<SequelizeFindAndCountOptions<Attributes<T>>, 'groups'>;

export type PrepareOptions = {
  translate?: boolean;
};

export function orderByToItem(orderBy: string): OrderItem {
  return orderBy.split(':') as OrderItem;
}

export function orderByToItems(orderBy: string | string[]): OrderItem[] {
  if (typeof orderBy === 'string') {
    return [orderByToItem(orderBy)];
  }
  return orderBy.map(orderByToItem);
}

// Model Types

// System
export * from './system/RequestLog.types';
export * from './system/RateLimit.types';
export * from './system/Cache.types';
export * from './system/log/SystemLog.types';
export * from './system/message/Message.types';

// Queues
export * from './queue/Queue.types';
export * from './queue/Job.types';
export * from './queue/Worker.types';

// User
export * from './user/Alias.types';
export * from './user/User.types';
export * from './user/UserMetadata.types';
export * from './user/Credential.types';
export * from './user/Role.types';

// Posts
export * from './resources/Post.types';

// Localization
export * from './resources/localization/Locale.types';
export * from './resources/localization/Translation.types';

// Media
export * from './resources/media/Media.types';

// Interaction
export * from './resources/interaction/Interaction.types';

// Sentiment
export * from './resources/sentiment/SentimentMethod.types';
export * from './resources/sentiment/Sentiment.types';

// Channel
export * from './resources/channel/Publisher.types';
export * from './resources/channel/PublisherInteraction.types';
export * from './resources/channel/PublisherTranslation.types';
export * from './resources/channel/Category.types';
export * from './resources/channel/CategoryInteraction.types';
export * from './resources/channel/CategoryTranslation.types';

// Summary
export * from './resources/summary/Summary.types';
export * from './resources/summary/SummaryCategory.types';
export * from './resources/summary/SummarySentiment.types';
export * from './resources/summary/SummaryInteraction.types';
export * from './resources/summary/SummaryTranslation.types';
export * from './resources/summary/SummaryMedia.types';
export * from './resources/summary/SummaryRelation.types';

// Recap
export * from './resources/recap/Recap.types';
export * from './resources/recap/RecapInteraction.types';
export * from './resources/recap/RecapTranslation.types';
export * from './resources/recap/RecapMedia.types';
export * from './resources/recap/RecapSummary.types';

// Subscription
export * from './resources/subscription/Subscription.types';

// Polls
export * from './resources/poll/Poll.types';
export * from './resources/poll/PollInteraction.types';
export * from './resources/poll/PollOption.types';

// IAP
export * from './resources/iap/Voucher.types';
export * from './resources/iap/IapVoucher.types';