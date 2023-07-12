import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

export type RetryPolicy = 
 | 'aggressive'
 | 'backoff'
 | `${number}`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JobAttributes<DataType extends Serializable, ReturnType, QueueName extends string = string> = DatedAttributes & {
  queue: QueueName;
  name: string;
  data: DataType;
  group: string;
  retryPolicy: RetryPolicy;
  attempts: number;
  lockedBy?: number;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
  delayedUntil?: Date;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JobCreationAttributes<DataType extends Serializable, ReturnType, QueueName extends string = string> = {
  queue: QueueName;
  name: string;
  data?: DataType;
  group?: string;
  retryPolicy?: RetryPolicy;
};

export type JobNameOptions = {
  delimiter?: string;
  prefix?: string;
  timeBased?: boolean;
  timeOffset?: string;
  timeInterval?: string;
};

export type CacheJobData = {
  endpoint: string;
  locale?: string;
  interval?: string;
  page?: number;
  depth?: number;
};

export type CrawlJobData = {
  publisher: number;
};

export type SiteMapJobData = {
  outlet: string;
  publisher?: string;
  url: string; 
  content?: string;
  force?: boolean;
};

export type TopicResolutionJobData = {
  summary: number;
  lookback?: string;
};
