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
export class Queue<DataType extends Serializable = Serializable, ReturnType = Serializable, QueueName extends string = string, A extends QueueAttributes<DataType, ReturnType, QueueName> = QueueAttributes<DataType, ReturnType, QueueName>, B extends QueueCreationAttributes<DataType, ReturnType, QueueName> = QueueCreationAttributes<DataType, ReturnType, QueueName>>
  extends BaseModel<A, B>
  implements QueueAttributes<DataType, ReturnType, QueueName> {
    
  public static QUEUES = {
    caches: new QueueSpecifier<CacheJobData, any>('caches'),
    crawler: new QueueSpecifier<CrawlJobData, any>('crawler'),
    recaps: new QueueSpecifier<RecapPayload, Recap>('recaps'),
    siteMaps: new QueueSpecifier<SiteMapJobData, Summary>('siteMaps'),
    topics: new QueueSpecifier<TopicResolutionJobData, any>('topics'),
  };
  
  static async initQueues() {
    for (const queue of Object.values(this.QUEUES)) {
      await this.upsert(queue);
    }
  }
  
  static async from<DataType extends Serializable = Serializable, ReturnType = Serializable, QueueName extends string = string>(queueProps: QueueSpecifier<DataType, ReturnType, QueueName>) {
    return await Queue.findOne({ where: { name: queueProps.name } });
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: QueueName;
    
  @Column({
    defaultValue: 'active',
    type: DataType.STRING,
  })
  declare state: QueueState;

  declare data?: DataType;
  declare resp?: ReturnType;
  
  generateJobName(options?: JobNameOptions) {
    return Job.generateJobName({
      prefix: this.toJSON().name,
      ...options,
    });
  }

  async add(jobName: string, payload: DataType, group?: string, schedule?: Date) {
    const existingJob = await Job.findOne({
      where: { 
        name: jobName,
        startedAt: { [Op.ne]: null },
      }, 
    });
    if (existingJob) {
      return existingJob;
    }
    const [job] = await Job.upsert({
      data: payload,
      group,
      name: jobName,
      queue: this.toJSON().name,
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