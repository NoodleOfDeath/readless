import ms from 'ms';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import {
  JobAttributes,
  JobCreationAttributes,
  RetryPolicy,
} from './Job.types';
import { Serializable } from '../../../../types';
import { BaseModel } from '../base';

@Table({
  modelName: 'job',
  paranoid: true,
  timestamps: true,
})
export class Job<DataType extends Serializable, ReturnType, QueueName extends string = string, A extends JobAttributes<DataType, ReturnType, QueueName> = JobAttributes<DataType, ReturnType, QueueName>, B extends JobCreationAttributes<DataType, ReturnType, QueueName> = JobCreationAttributes<DataType, ReturnType, QueueName>>
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
  
  @Column({
    defaultValue: 0,
    type: DataType.INTEGER,
  })
    attempts: number;
    
  @Column({
    defaultValue: 'backoff',
    type: DataType.STRING,
  })
    retryPolicy: RetryPolicy;
    
  @Column({ type: DataType.DATE })
    startedAt?: Date;
  
  @Column({ type: DataType.DATE })
    completedAt?: Date;
  
  @Column({ type: DataType.DATE })
    failedAt?: Date;
  
  @Column({ type: DataType.TEXT })
    failureReason?: string;

  @Column({ type: DataType.DATE })
    delayedUntil?: Date;

  async delay(byMs: number | string) {
    const offset = typeof byMs === 'string' ? ms(byMs) : byMs;
    this.set('delayedUntil', new Date(Date.now() + offset));
    await this.save();
  }

  async moveToCompleted() {
    this.set('attempts', this.toJSON().attempts + 1);
    this.set('completedAt', new Date());
    await this.save();
  }
    
  async moveToFailed(reason?: string | Error) {
    this.set('attempts', this.toJSON().attempts + 1);
    this.set('failedAt', new Date());
    this.set('failureReason', reason instanceof Error ? reason.message : reason);
    await this.save();
  }

}

