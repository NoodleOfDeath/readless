import { networkInterfaces } from 'os';

import ms from 'ms';
import { Op } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { Job } from './Job.model';
import { Queue } from './Queue.model';
import { QueueSpecifier } from './Queue.types';
import { 
  WorkerAttributes, 
  WorkerCreationAttributes, 
  WorkerOptions, 
  WorkerState,
} from './Worker.types';
import { Serializable } from '../../../../types';
import { BaseModel } from '../base';
import { RateLimit } from '../system/RateLimit.model';

function getHost() {
  const nets = networkInterfaces();
  const results: Record<string, string[]> = {};
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
      if (net.family === familyV4Value && !net.internal) {
        const addresses = results[name] ?? [];
        addresses.push(net.address);
        results[name] = addresses;
      }
    }
  }
  return results;
}

const HOST = JSON.stringify(getHost());

const WORKER_RETRY_EXPRS = (process.env.WORKER_RETRY_EXPRS || 'took long,bad response,unexpected error').split(',');

@Table({
  modelName: 'worker',
  paranoid: true,
  timestamps: true,
})
export class Worker<DataType extends Serializable, ReturnType, QueueName extends string = string, A extends WorkerAttributes<DataType, ReturnType, QueueName> = WorkerAttributes<DataType, ReturnType, QueueName>, B extends WorkerCreationAttributes<DataType, ReturnType, QueueName> = WorkerCreationAttributes<DataType, ReturnType, QueueName>> extends BaseModel<A, B> implements WorkerAttributes<DataType, ReturnType, QueueName> {

  get pid() {
    return this.id; 
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare queue: QueueName;
  
  @Column({ type: DataType.STRING })
  declare host?: string;
    
  @Column({ type: DataType.JSON })
  declare options: WorkerOptions;
    
  @Column({
    allowNull: false,
    defaultValue: 'idle',
    type: DataType.STRING,
  })
  declare state: WorkerState;
    
  @Column({
    allowNull: false,
    defaultValue: new Date(),
    type: DataType.DATE,
  })
  declare lastUpdateAt: Date;
    
  activeQueue: Queue<DataType, ReturnType, QueueName>;
  queueProps: QueueSpecifier<DataType, ReturnType, QueueName>;
  
  handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>;

  static async from<DataType extends Serializable, ReturnType, QueueName extends string = string>(
    queueProps: QueueSpecifier<DataType, ReturnType, QueueName>,
    handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>,
    { 
      autostart = true,
      fetchIntervalMs = ms('5s'),
      fifo,
    }: WorkerOptions = {}
  ) {
    const queue = await Queue.from(queueProps);
    if (!queue) {
      throw new Error(`missing queue?! ${queueProps.name}`);
    }
    const worker = await Worker.create({
      host: HOST,
      options: {
        autostart, fetchIntervalMs, fifo, 
      },
      queue: queueProps.name,
    });
    if (!worker) {
      throw new Error(`creating worker failed 🥺?! ${queueProps.name}`);
    }
    worker.activeQueue = queue;
    worker.queueProps = queueProps;
    worker.handler = handler;
    if (worker.options.autostart) {
      await worker.start();
    }
    return worker;
  }
  
  async ping() {
    this.set('lastUpdateAt', new Date());
    await this.save();
  }
  
  async setState(state: WorkerState) {
    this.set('state', state);
    await this.save();
    await this.ping();
  }

  async start() {
    console.log(`Starting worker (pid ${this.pid}) for queue "${this.queueProps.name}"`);
    await this.setState('processing');
    this.process();
  }

  async stop() {
    console.log(`Stopping worker (pid ${this.pid}) for queue "${this.queueProps.name}"`);
    await this.setState('stopped');
    await this.save();
  }
  
  async getRateLimit(key: string) {
    return await RateLimit.findOne({ where: { key } });
  }

  async fetchJob() {
    const otherJobs = await Job.findAll({
      where: {
        lockedBy: { [Op.ne]: this.id },
        startedAt: { [Op.ne]: null },
      },
    });
    const job = await Job.findOne({
      order: [
        ['priority', 'DESC'],
        ['createdAt', this.options.fifo ? 'ASC' : 'DESC'],
      ],
      where: {
        completedAt: null,
        delayedUntil: { [Op.or]: [null, { [Op.lt]: new Date() }] },
        group: { [Op.notIn]: otherJobs.map((j) => j.group) },
        lockedBy: null,
        queue: this.queueProps.name,
        startedAt: null,
        [Op.or]: [{ failedAt: null }, { failureReason: { [Op.or]: [...(this.options.retryFailedJobs ?? WORKER_RETRY_EXPRS).map((e) => ({ [Op.iRegexp]: e }))] } }],
      },
    });
    return job as Job<DataType, ReturnType, QueueName>;
  }
  
  async process() {
    if (this.state === 'stopped') {
      return;
    }
    await this.ping();
    const job = await this.fetchJob();
    if (job) {
      console.log(`Processing job ${job.id} for queue "${this.queueProps.name}"`);
      await this.ping();
      await job.begin(this.id);
      await this.handler(job, () => this.process());
      await this.ping();
      console.log(`Finished processing job ${job.id} for queue "${this.queueProps.name}"`);
    } else {
      await this.setState('idle');
      setTimeout(() => this.process(), this.options.fetchIntervalMs);
    }
  }

}
