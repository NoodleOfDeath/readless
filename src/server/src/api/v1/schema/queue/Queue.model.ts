import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { Job } from './Job.model';
import { SiteMapJobData } from './Job.types';
import {
  QueueAttributes,
  QueueCreationAttributes,
  QueueSpecifier,
  QueueState,
} from './Queue.types';
import { Serializable } from '../../../../types';
import { BaseModel } from '../base';
import { Summary } from '../resources/summary/Summary.model';

@Table({
  modelName: 'queue',
  paranoid: true,
  timestamps: true,
})
export class Queue<DataType extends Serializable = Serializable, ReturnType = Serializable, QueueName extends string = string, A extends QueueAttributes<DataType, ReturnType, QueueName> = QueueAttributes<DataType, ReturnType, QueueName>, B extends QueueCreationAttributes<DataType, ReturnType, QueueName> = QueueCreationAttributes<DataType, ReturnType, QueueName>>
  extends BaseModel<A, B>
  implements QueueAttributes<DataType, ReturnType, QueueName> {
    
  public static QUEUES = { siteMaps: new QueueSpecifier<SiteMapJobData, Summary>('siteMaps') };
  
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

  data?: DataType;
  resp?: ReturnType;

  async add(jobName: string, payload: DataType) {
    const job = await Job.findOne({ where: { name: jobName } });
    if (job) {
      return job;
    }
    return await Job.create({
      data: payload,
      name: jobName,
      queue: this.toJSON().name,
    });
  }

}