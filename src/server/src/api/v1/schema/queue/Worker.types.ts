
import { Job } from './Job.model';
import { Queue } from './Queue.model';
import { QueueSpecifier } from './Queue.types';
import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

export type WorkerState = 'idle' | 'processing' | 'stopped' | 'retired';

export type WorkerOptions = {
  autostart?: boolean;
  fifo?: boolean;
  fetchIntervalMs?: number;
  retryFailedJobs?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type WorkerAttributes<DataType extends Serializable, ReturnType, QueueName extends string = string> = DatedAttributes & {
  queue: QueueName;
  host?: string;
  options: WorkerOptions;
  state: WorkerState;
  lastUpdateAt: Date;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type WorkerCreationAttributes<DataType extends Serializable, ReturnType, QueueName extends string = string> = {
  queue: QueueName;
  host?: string;
  options?: WorkerOptions;
  state?: WorkerState;
  lastUpdateAt?: Date;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type WorkerInitProps<DataType extends Serializable, ReturnType, QueueName extends string = string> = {
  queue: Queue<DataType, ReturnType, QueueName>;
  queueProps: QueueSpecifier<DataType, ReturnType, QueueName>;
  handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>;
  options: WorkerOptions;
};