import { Attributes, FindAndCountOptions as SequelizeFindAndCountOptions } from 'sequelize';
import { Hooks } from 'sequelize/types/hooks';
import { Model } from 'sequelize-typescript';

export type DatedAttributes = {
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FindAndCountOptions<T extends Model<any, any> | Hooks<Model<any, any>, any, any>> = Omit<
  SequelizeFindAndCountOptions<Attributes<T>>,
  'groups'
>;

export type BulkResponse<T> = {
  count: number;
  rows: T[];
};

// Model Types

export * from './analytics/metric.types';
export * from './resources/policy.types';

export * from './user/alias.types';
export * from './user/user.types';
export * from './user/user_metadata.types';

export * from './auth/credential.types';

export * from './newsletter/newsletter.types';
export * from './newsletter/subscription.types';

export * from './resources/interaction/interaction.types';
export * from './resources/interaction/referral.types';

export * from './resources/media/media.types';

export * from './resources/types';
export * from './resources/post.types';
export * from './resources/outlet/outlet.types';
export * from './resources/source/source.types';
export * from './resources/topic/topic.types';
export * from './resources/article/article.types';

