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
} from './Queue.types';
import { Serializable } from '../../../../types';
import { BaseModel } from '../base';

@Table({
  modelName: 'queue',
  paranoid: true,
  timestamps: true,
})
export class Queue<DataType extends Serializable = Serializable, ReturnType extends Serializable = Serializable, QueueName extends string = string, A extends QueueAttributes<DataType, ReturnType, QueueName> = QueueAttributes<DataType, ReturnType, QueueName>, B extends QueueCreationAttributes<DataType, ReturnType, QueueName> = QueueCreationAttributes<DataType, ReturnType, QueueName>>
  extends BaseModel<A, B>
  implements QueueAttributes<DataType, ReturnType, QueueName> {
    
  public static QUEUES = { siteMaps: new QueueSpecifier<SiteMapJobData>('siteMaps') };
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
    name: QueueName;

  data?: DataType;
  resp?: ReturnType;

  async add(jobName: string, payload: DataType) {
    return await Job.create({
      data: payload,
      name: jobName,
      queue: this.name,
    });
  }

}