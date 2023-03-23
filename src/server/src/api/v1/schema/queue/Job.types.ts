import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type JobAttributes<DataType extends Serializable, ReturnType, QueueName extends string = string> = DatedAttributes & {
  queue: QueueName;
  name: string;
  data: DataType;
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
  failureReason?: string;
};

export type SiteMapJobData = {
  outlet: string;
  url: string; 
  force?: boolean;
};
