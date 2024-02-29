
import { Job } from './Job.model';
import { Queue } from './Queue.model';
import { QueueSpecifier } from './Queue.types';
import { Serializable } from '../../../../types';
import { DatedAttributes } from '../types';

export type WorkerState = 'idle' | 'processing' | 'retired' | 'stopped';

export type WorkerOptions = {
  autostart?: boolean;
  fifo?: boolean;
  clockOffset?: number;
  fetchIntervalMs?: number;
  retryFailedJobs?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type WorkerAttributes<D extends Serializable, R, Q extends string = string> = DatedAttributes & {
  queue: Q;
  host?: string;
  options: WorkerOptions;
  state: WorkerState;
  lastUpdateAt: Date;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type WorkerCreationAttributes<D extends Serializable, R, Q extends string = string> = {
  queue: Q;
  host?: string;
  options?: WorkerOptions;
  state?: WorkerState;
  lastUpdateAt?: Date;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type WorkerInitProps<D extends Serializable, R, Q extends string = string> = {
  queue: Queue<D, R, Q>;
  queueProps: QueueSpecifier<D, R, Q>;
  handler: (job: Job<D, R, Q>, next: (() => void)) => Promise<R>;
  options: WorkerOptions;
};