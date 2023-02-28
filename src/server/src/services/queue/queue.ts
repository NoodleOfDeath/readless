import { BaseJobOptions, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { BaseService } from '../base';

export const QUEUES = {
  siteMaps: 'siteMaps',
} as const;

export type QueueServiceOptions = {
  redisClient: IORedis;
};

export class QueueService extends BaseService {
  redisClient: IORedis;
  queues: { [key: string]: Queue } = {};

  constructor({ redisClient = new IORedis(process.env.REDIS_CONNECTION_STRING) }: Partial<QueueServiceOptions> = {}) {
    super();
    this.redisClient = redisClient;
  }

  dispatch<T>(queueName: string, jobName: string, payload: T, options?: BaseJobOptions) {
    const queue =
      (this.queues[queueName] as Queue<T>) ??
      new Queue<T>(queueName, {
        connection: this.redisClient,
      });
    queue.add(jobName, payload, options);
    this.queues[queueName] = queue;
  }
}
