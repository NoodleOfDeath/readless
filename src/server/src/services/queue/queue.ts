import { BaseJobOptions, Queue } from 'bullmq';
import IORedis from 'ioredis';
import { BaseService } from '../base';

export type QueueServiceOptions = {
  redisClient: IORedis;
};

export const QUEUES = {
  siteMaps: 'siteMaps',
};

export class QueueService extends BaseService {
  redisClient: IORedis;
  queues: { [key: string]: Queue } = {};

  constructor({ redisClient = new IORedis(process.env.REDIS_CONNECTION_STRING) }: Partial<QueueServiceOptions> = {}) {
    super();
    this.redisClient = redisClient;
  }

  async dispatch<T>(queueName: string, jobName: string, payload: T, options?: BaseJobOptions) {
    const queue =
      (this.queues[queueName] as Queue<T>) ??
      new Queue<T>(queueName, {
        connection: this.redisClient,
      });
    await queue.add(jobName, payload, options);
    this.queues[queueName] = queue;
  }
}
