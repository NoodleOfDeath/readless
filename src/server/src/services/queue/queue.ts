import { BaseJobOptions, Worker as BullMQWorker, Job, Queue, QueueOptions, WorkerOptions } from 'bullmq';
import IORedis, { RedisOptions } from 'ioredis';

import { BaseService } from '../base';

/** Dummy class to make TS happy */
// eslint-disable-next-line @typescript-eslint/ban-types
export class QueueProps<DataType = {}, ReturnType = {}, NameType extends string = string> {
  name: NameType;
  data?: DataType;
  resp?: ReturnType;
  queueOptions?: QueueOptions;
  jobOptions?: BaseJobOptions;
  redisOptions?: RedisOptions;
  constructor(name: NameType) {
    this.name = name;
  }
}

export type SiteMapJobData = { id: number; name: string; url: string; force?: boolean };

export const QUEUES = {
  siteMaps: new QueueProps<SiteMapJobData>('siteMaps'),
} as const;

export type QueueServiceOptions = QueueOptions & {
  client: IORedis;
  redisOptions: RedisOptions;
};

export const redisClient = (
  connectionString = process.env.REDIS_CONNECTION_STRING,
  { maxRetriesPerRequest = null, ...opts }: RedisOptions = {},
) =>
  new IORedis(connectionString, {
    maxRetriesPerRequest,
    ...opts,
  });

export class QueueService extends BaseService {
  defaultJobOptions: BaseJobOptions;
  client: IORedis;
  queues: { [key: string]: Queue } = {};

  constructor({
    defaultJobOptions,
    redisOptions,
    client = redisClient(undefined, redisOptions),
  }: Partial<QueueServiceOptions> = {}) {
    super();
    this.defaultJobOptions = defaultJobOptions;
    this.client = client;
  }

  async dispatch<DataType, ReturnType, NameType extends string = string>(
    jobQueue: QueueProps<DataType, ReturnType, NameType>,
    jobName: string,
    payload: DataType,
    options?: BaseJobOptions,
  ) {
    const queue =
      (this.queues[jobQueue.name] as Queue<DataType>) ??
      new Queue<DataType, ReturnType, NameType>(jobQueue.name, {
        defaultJobOptions: this.defaultJobOptions,
        connection: this.client,
      });
    await queue.add(jobName, payload, options);
    this.queues[jobQueue.name] = queue;
  }

  getQueue<DataType, ReturnType, NameType extends string = string>(
    jobQueue: QueueProps<DataType, ReturnType, NameType>,
  ): Queue<DataType> {
    return (
      (this.queues[jobQueue.name] as Queue<DataType>) ??
      new Queue<DataType>(jobQueue.name, { defaultJobOptions: this.defaultJobOptions, connection: this.client })
    );
  }
}

export class Worker<DataType, ReturnType, NameType extends string = string> extends BullMQWorker<
  DataType,
  ReturnType,
  NameType
> {
  queueProps: QueueProps<DataType, ReturnType, NameType>;

  get queue() {
    return new Queue<DataType, ReturnType, NameType>(this.queueProps.name, {
      connection: redisClient(),
    });
  }

  constructor(
    queueProps: QueueProps<DataType, ReturnType, NameType>,
    handler: (job: Job<DataType, ReturnType, NameType>) => Promise<ReturnType>,
    options?: WorkerOptions,
  ) {
    super(queueProps.name, handler, { ...options, connection: redisClient() });
    this.queueProps = queueProps;
  }
}
