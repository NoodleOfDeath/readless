import ms from 'ms';
import { Op } from 'sequelize';

import { QueueService } from './QueueService';
import {
  Job,
  Queue,
  QueueSpecifier,
} from '../../api/v1/schema';
import { Serializable } from '../../types';

export type WorkerOptions = {
  autostart?: boolean;
  fetchIntervalMs?: number;
};

export type WorkerState = 'idle' | 'processing' | 'stopped';

export type WorkerInitProps<DataType extends Serializable, ReturnType, QueueName extends string = string> = {
  queue: Queue<DataType, ReturnType, QueueName>;
  queueProps: QueueSpecifier<DataType, ReturnType, QueueName>;
  handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>;
  options: WorkerOptions;
};

export class Worker<DataType extends Serializable, ReturnType, QueueName extends string = string> {

  static topPid = 0;

  pid: number;
  queue: Queue<DataType, ReturnType, QueueName>;
  queueProps: QueueSpecifier<DataType, ReturnType, QueueName>;
  handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>;
  options: WorkerOptions;

  state: WorkerState = 'idle';
  
  static async from<DataType extends Serializable, ReturnType, QueueName extends string = string>(
    queueProps: QueueSpecifier<DataType, ReturnType, QueueName>,
    handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>,
    { 
      autostart = true,
      fetchIntervalMs = ms('5s'),
    }: WorkerOptions = {}
  ) {
    const queue = await QueueService.getQueue(queueProps);
    return new Worker({
      handler,
      options: { autostart, fetchIntervalMs },
      queue,
      queueProps,
    });
  }

  private constructor({
    queue,
    queueProps,
    handler,
    options,
  }: WorkerInitProps<DataType, ReturnType, QueueName>) {
    this.pid = ++Worker.topPid;
    this.queue = queue;
    this.queueProps = queueProps;
    this.handler = handler;
    this.options = options;
    if (options.autostart) {
      this.start();
    }
  }

  start() {
    console.log(`Starting worker (pid ${this.pid}) for queue "${this.queueProps.name}"`);
    this.state = 'processing';
    this.process();
  }

  stop() {
    console.log(`Stopping worker (pid ${this.pid}) for queue "${this.queueProps.name}"`);
    this.state = 'stopped';
  }

  async fetchJob() {
    const job = await Job.findOne({
      order: [['createdAt', 'ASC']],
      where: {
        completedAt: null,
        delayedUntil: { [Op.or]: [{ [Op.lt]: new Date() }, null] },
        failedAt: null,
        queue: this.queueProps.name,
      },
    });
    return job as Job<DataType, ReturnType, QueueName>;
  }
  
  async process() {
    if (this.state === 'stopped') {
      return;
    }
    const job = await this.fetchJob();
    if (job) {
      console.log(`Processing job ${job.id} for queue "${this.queueProps.name}"`);
      await this.handler(job, () => this.process());
      console.log(`Finished processing job ${job.id} for queue "${this.queueProps.name}"`);
    } else {
      this.state = 'idle';
      setTimeout(() => this.process(), this.options.fetchIntervalMs);
    }
  }

}
