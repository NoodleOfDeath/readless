import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

export type JobAttributes<DataType extends Serializable, ReturnType extends Serializable, QueueName extends string = string> = DatedAttributes & {
  queue: QueueName;
  name: string;
  data: DataType;
  resp?: ReturnType;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  delayedUntil?: Date;
};

export type JobCreationAttributes<DataType extends Serializable, ReturnType extends Serializable, QueueName extends string = string> = {
  queue: QueueName;
  name: string;
  data?: DataType;
  resp?: ReturnType;
};

export type SiteMapJobData = {
  url: string; 
  force?: boolean;
};
