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
    queue: QueueName;
    
  @Column({ type: DataType.JSON })
    options: WorkerOptions;
    
  @Column({
    allowNull: false,
    defaultValue: 'idle',
    type: DataType.STRING,
  })
    state: WorkerState = 'idle';
    
  @Column({
    allowNull: false,
    defaultValue: new Date(),
    type: DataType.DATE,
  })
    lastUpdateAt: Date;
    
  activeQueue: Queue<DataType, ReturnType, QueueName>;
  queueProps: QueueSpecifier<DataType, ReturnType, QueueName>;
  
  handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>;
  
  get failureExprs() {
    return (this.toJSON().options.retryFailedJobs ?? []).map((e) => ({ [Op.iRegexp]: e }));
  }
  
  static async from<DataType extends Serializable, ReturnType, QueueName extends string = string>(
    queueProps: QueueSpecifier<DataType, ReturnType, QueueName>,
    handler: (job: Job<DataType, ReturnType, QueueName>, next: (() => void)) => Promise<ReturnType>,
    { 
      autostart = true,
      fetchIntervalMs = ms('5s'),
    }: WorkerOptions = {}
  ) {
    const queue = await Queue.from(queueProps);
    if (!queue) {
      throw new Error(`missing queue?! ${queueProps.name}`);
    }
    const worker = await Worker.create({
      options: { autostart, fetchIntervalMs },
      queue: queueProps.name,
    });
    if (!worker) {
      throw new Error(`creating worker failed 🥺?! ${queueProps.name}`);
    }
    worker.activeQueue = queue;
    worker.queueProps = queueProps;
    worker.handler = handler;
    if (worker.toJSON().options.autostart) {
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

  async fetchJob() {
    const job = await Job.findOne({
      // lifo
      order: [['createdAt', 'DESC']],
      where: {
        completedAt: null,
        delayedUntil: { [Op.or]: [null, { [Op.lt]: new Date() }] },
        queue: this.queueProps.name,
        [Op.or]: [{ failedAt: null }, { failureReason: { [Op.or]: [...this.failureExprs] } },
        ],
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
      await this.ping();
      await this.handler(job, () => this.process());
      await this.ping();
      console.log(`Finished processing job ${job.id} for queue "${this.queueProps.name}"`);
    } else {
      await this.setState('idle');
      setTimeout(() => this.process(), this.toJSON().options.fetchIntervalMs);
    }
  }

}
