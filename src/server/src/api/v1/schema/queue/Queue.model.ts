import { Op } from 'sequelize';
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { Job } from './Job.model';
import {
  CacheJobData,
  CrawlJobData,
  JobNameOptions,
  SiteMapJobData,
  TopicResolutionJobData,
} from './Job.types';
import {
  AddJobOptions,
  QueueAttributes,
  QueueCreationAttributes,
  QueueSpecifier,
  QueueState,
} from './Queue.types';
import { RecapPayload } from '../../../../services/types';
import { Serializable } from '../../../../types';
import { BaseModel } from '../base';
import { Recap, Summary } from '../models';

@Table({
  modelName: 'queue',
  paranoid: true,
  timestamps: true,
})
export class Queue<D extends Serializable = Serializable, R = Serializable, Q extends string = string, A extends QueueAttributes<D, R, Q> = QueueAttributes<D, R, Q>, B extends QueueCreationAttributes<D, R, Q> = QueueCreationAttributes<D, R, Q>>
  extends BaseModel<A, B>
  implements QueueAttributes<D, R, Q> {
    
  public static QUEUES = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    caches: new QueueSpecifier<CacheJobData, any>('caches'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    crawler: new QueueSpecifier<CrawlJobData, any>('crawler'),
    recaps: new QueueSpecifier<RecapPayload, Recap>('recaps'),
    sitemaps: new QueueSpecifier<SiteMapJobData, Summary>('sitemaps'),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    topics: new QueueSpecifier<TopicResolutionJobData, any>('topics'),
  };
  
  static async prepare() {
    for (const queue of Object.values(this.QUEUES)) {
      await this.upsert(queue);
    }
  }
  
  static async from<D extends Serializable = Serializable, R = Serializable, Q extends string = string>(queueProps: QueueSpecifier<D, R, Q>) {
    return await Queue.findOne({ where: { name: queueProps.name } });
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: Q;
    
  @Column({
    defaultValue: 'active',
    type: DataType.STRING,
  })
  declare state: QueueState;

  declare data?: D;
  declare resp?: R;
  
  generateJobName(options?: JobNameOptions) {
    return Job.generateJobName({
      prefix: this.name,
      ...options,
    });
  }

  async add(jobName: string, payload: D, {
    schedule,
    ...options
  }: AddJobOptions<D, R, Q> = {}) {
    const existingJob = await Job.findOne({
      where: { 
        name: jobName,
        queue: this.name,
      }, 
    });
    if (existingJob) {
      return existingJob;
    }
    if (existingJob) {
      await existingJob.destroy();
    }
    const job = await Job.create({
      data: payload,
      name: jobName,
      queue: this.name,
      ...options,
    });
    if (schedule) {
      await job.schedule(schedule);
    }
    return job;
  }
  
  async clear() {
    await Job.destroy({
      where: {
        completedAt: { [Op.ne]: null },
        queue: this.toJSON().name,
      }, 
    });
  }

}