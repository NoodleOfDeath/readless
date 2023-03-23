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
import { Source } from '../resources/source/Source.model';

@Table({
  modelName: 'queue',
  paranoid: true,
  timestamps: true,
})
export class Queue<DataType extends Serializable = Serializable, ReturnType = Serializable, QueueName extends string = string, A extends QueueAttributes<DataType, ReturnType, QueueName> = QueueAttributes<DataType, ReturnType, QueueName>, B extends QueueCreationAttributes<DataType, ReturnType, QueueName> = QueueCreationAttributes<DataType, ReturnType, QueueName>>
  extends BaseModel<A, B>
  implements QueueAttributes<DataType, ReturnType, QueueName> {
    
  public static QUEUES = { siteMaps: new QueueSpecifier<SiteMapJobData, Source>('siteMaps') };
  
  static async initQueues() {
    for (const queue of Object.values(this.QUEUES)) {
      await this.upsert(queue);
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
    name: QueueName;
    
  @Column({
    defaultValue: 'active',
    type: DataType.STRING,
  })
    state: QueueState;

  data?: DataType;
  resp?: ReturnType;

  async add(jobName: string, payload: DataType) {
    return await Job.findOrCreate({
      defaults: {
        data: payload,
        name: jobName,
        queue: this.toJSON().name,
      },
      where: {
        completedAt: null,
        name: jobName,
        queue: this.toJSON().name,
        startedAt: null,
      },
    });
  }

}