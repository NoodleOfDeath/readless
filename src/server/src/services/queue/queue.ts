import { BaseJobOptions, Job, Queue, QueueOptions, Worker as BullMQWorker, WorkerOptions } from 'bullmq';
import IORedis from 'ioredis';
import { BaseService } from '../base';

/** Dummy class to make TS happy */
export class QueueProps<DataType = {}, ReturnType = {}, NameType extends string = string> {
  name: NameType;
  data?: DataType;
  resp?: ReturnType;
  constructor(name: NameType) {
    this.name = name;
  }
}

export type SiteMapJobData = { id: number; name: string; url: string };

export const QUEUES = {
  siteMaps: new QueueProps<SiteMapJobData>('siteMaps'),
} as const;

export type QueueServiceOptions = QueueOptions & {
  redisClient: IORedis;
};

export class QueueService extends BaseService {
  defaultJobOptions: BaseJobOptions;
  redisClient: IORedis;
  queues: { [key: string]: Queue } = {};

  constructor({
    defaultJobOptions,
    redisClient = new IORedis(process.env.REDIS_CONNECTION_STRING),
  }: Partial<QueueServiceOptions> = {}) {
    super();
    this.defaultJobOptions = defaultJobOptions;
    this.redisClient = redisClient;
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
        connection: this.redisClient,
      });
    await queue.add(jobName, payload, options);
    this.queues[jobQueue.name] = queue;
  }

  getQueue<DataType, ReturnType, NameType extends string = string>(
    jobQueue: QueueProps<DataType, ReturnType, NameType>,
  ): Queue<DataType> {
    return (
      (this.queues[jobQueue.name] as Queue<DataType>) ??
      new Queue<DataType>(jobQueue.name, { defaultJobOptions: this.defaultJobOptions, connection: this.redisClient })
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
      connection: new IORedis(process.env.REDIS_CONNECTION_STRING),
    });
  }

  constructor(
    queueProps: QueueProps<DataType, ReturnType, NameType>,
    handler: (job: Job<DataType, ReturnType, NameType>) => Promise<ReturnType>,
    options?: WorkerOptions,
  ) {
    super(queueProps.name, handler, { ...options, connection: new IORedis(process.env.REDIS_CONNECTION_STRING) });
    this.queueProps = queueProps;
  }
}
