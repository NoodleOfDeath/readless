import { Attributes, FindAndCountOptions as SequelizeFindAndCountOptions } from 'sequelize';
import { Hooks } from 'sequelize/types/hooks';
import { Model } from 'sequelize-typescript';

export type DatedAttributes = {
  id: number;
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

export type DestroyResponse = {
  success: boolean;
};

// Model Types

export * from './analytics/Metric.types';
export * from './analytics/RateLimit.types';

export * from './user/Alias.types';
export * from './user/User.types';
export * from './user/UserMetadata.types';

export * from './auth/Credential.types';
export * from './auth/Role.types';

export * from './newsletter/Newsletter.types';
export * from './newsletter/Subscription.types';

export * from './interaction/Interaction.types';

export * from './resources/types';
export * from './resources/Media.types';
export * from './resources/Post.types';
export * from './resources/outlet/Outlet.types';
export * from './resources/summary/Summary.types';
export * from './resources/topic/Topic.types';
export * from './resources/article/Article.types';

export * from './queue/Queue.types';
export * from './queue/Job.types';
export * from './queue/Worker.types';