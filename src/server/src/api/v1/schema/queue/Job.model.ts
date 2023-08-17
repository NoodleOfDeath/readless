import ms from 'ms';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';
import { v1 } from 'uuid';

import {
  JobAttributes,
  JobCreationAttributes,
  JobNameOptions,
  RetryPolicy,
} from './Job.types';
import { Serializable } from '../../../../types';
import { BaseModel } from '../base';

@Table({
  modelName: 'job',
  paranoid: true,
  timestamps: true,
})
export class Job<D extends Serializable, R, Q extends string = string, A extends JobAttributes<D, R, Q> = JobAttributes<D, R, Q>, B extends JobCreationAttributes<D, R, Q> = JobCreationAttributes<D, R, Q>>
  extends BaseModel<A, B>
  implements JobAttributes<D, R, Q> {
    
  @Index({
    name: 'jobs_queue_name_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare queue: Q;
  
  @Index({
    name: 'jobs_queue_name_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;
  
  @Column({
    allowNull: false,
    type: DataType.JSON,
  })
  declare data: D;
  
  @Column({
    defaultValue: 0,
    type: DataType.BIGINT,
  })
  declare priority: bigint;
  
  @Column({
    defaultValue: 'default',
    type: DataType.STRING,
  })
  declare group: string;
    
  @Column({
    defaultValue: 'backoff',
    type: DataType.STRING,
  })
  declare retryPolicy: RetryPolicy;
  
  @Column({
    defaultValue: 0,
    type: DataType.INTEGER,
  })
  declare attempts: number;
  
  @Column({ type: DataType.INTEGER })
  declare lockedBy?: number;
    
  @Column({ type: DataType.DATE })
  declare startedAt?: Date;
  
  @Column({ type: DataType.DATE })
  declare completedAt?: Date;
  
  @Column({ type: DataType.DATE })
  declare failedAt?: Date;
  
  @Column({ type: DataType.TEXT })
  declare failureReason?: string;

  @Column({ type: DataType.DATE })
  declare delayedUntil?: Date;
  
  public static generateJobName({
    delimiter = '-',
    prefix = '',
    timeBased = true,
    timeInterval = '5m',
    timeOffset = '0m',
  }: JobNameOptions = {}) {
    if (timeBased) {
      const interval = ms(timeInterval);
      return [
        prefix,
        Math.floor((Date.now() + ms(timeOffset)) / interval) * interval,
      ].filter(Boolean).join(delimiter);
    }
    return v1();
  }

  async delay(byMs: number | string) {
    const offset = typeof byMs === 'string' ? ms(byMs) : byMs;
    this.set('lockedBy', null);
    this.set('startedAt', null);
    this.set('delayedUntil', new Date(Date.now() + offset));
    await this.save();
  }

  async schedule(at: Date) {
    this.set('lockedBy', null);
    this.set('startedAt', null);
    this.set('delayedUntil', at);
    await this.save();
  }
  
  async begin(pid: number) {
    this.set('lockedBy', pid);
    this.set('startedAt', new Date());
    this.set('attempts', this.toJSON().attempts + 1);
    this.set('failedAt', null);
    this.set('failureReason', null);
    this.save();
  }

  async moveToCompleted(destroy = false) {
    this.set('lockedBy', null);
    this.set('startedAt', null);
    this.set('completedAt', new Date());
    if (destroy) {
      await this.set('deletedAt', new Date());
    }
    await this.save();
  }
    
  async moveToFailed(reason?: string | Error) {
    this.set('lockedBy', null);
    this.set('startedAt', null);
    this.set('attempts', this.toJSON().attempts + 1);
    this.set('failedAt', new Date());
    this.set('failureReason', reason instanceof Error ? reason.message : reason);
    await this.save();
  }

}

