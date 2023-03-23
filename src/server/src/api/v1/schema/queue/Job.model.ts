import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import { JobAttributes, JobCreationAttributes } from './Job.types';
import { Serializable } from '../../../../types';
import { BaseModel } from '../base';

@Table({
  modelName: 'job',
  paranoid: true,
  timestamps: true,
})
export class Job<DataType extends Serializable, ReturnType extends Serializable, QueueName extends string = string, A extends JobAttributes<DataType, ReturnType, QueueName> = JobAttributes<DataType, ReturnType, QueueName>, B extends JobCreationAttributes<DataType, ReturnType, QueueName> = JobCreationAttributes<DataType, ReturnType, QueueName>>
  extends BaseModel<A, B>
  implements JobAttributes<DataType, ReturnType, QueueName> {
    
  @Index({
    name: 'jobs_queue_name_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    queue: QueueName;
  
  @Index({
    name: 'jobs_queue_name_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;
  
  @Column({
    allowNull: false,
    type: DataType.JSON,
  })
    data: DataType;
  
  @Column({ type: DataType.JSON })
    resp?: ReturnType;
  
  @Column({ type: DataType.JSON })
    startedAt?: Date;
  
  @Column({ type: DataType.JSON })
    completedAt?: Date;
  
  @Column({ type: DataType.JSON })
    failedAt?: Date;

  @Column({ type: DataType.JSON })
    delayedUntil?: Date;

}

