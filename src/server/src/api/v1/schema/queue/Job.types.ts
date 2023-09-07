import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

export type RetryPolicy = 
 | 'aggressive'
 | 'backoff'
 | `${number}`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JobAttributes<D extends Serializable, R, Q extends string = string> = DatedAttributes & {
  queue: Q;
  name: string;
  data: D;
  priority: bigint;
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
export type JobCreationAttributes<D extends Serializable, R, Q extends string = string> = {
  queue: Q;
  name: string;
  data?: D;
  priority?: bigint;
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
  imageUrls?: string;
  content?: string;
  force?: boolean;
};

export type TopicResolutionJobData = {
  summary: number;
  lookback?: string;
};
