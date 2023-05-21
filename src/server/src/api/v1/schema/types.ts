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
export * from './system/Query.types';
export * from './system/RateLimit.types';
export * from './system/service/Service.types';
export * from './system/service/ServiceStatus.types';
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

export * from './resources/nlp/Token.types';
export * from './resources/nlp/TokenType.types';
export * from './resources/sentiment/SentimentMethod.types';
export * from './resources/localization/Translation.types';

export * from './resources/interaction/Interaction.types';
export * from './resources/sentiment/Sentiment.types';
export * from './resources/sentiment/SentimentToken.types';

export * from './resources/channel/Outlet.types';
export * from './resources/channel/Category.types';

export * from './resources/summary/Summary.types';
export * from './resources/summary/SummaryToken.types';
export * from './resources/summary/SummarySentiment.types';
export * from './resources/summary/SummarySentimentToken.types';
export * from './resources/summary/SummaryInteraction.types';
export * from './resources/summary/SummaryTranslation.types';
