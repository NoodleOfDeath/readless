import ms from 'ms';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import { JobLimitAttributes, JobLimitCreationAttributes } from './JobLimit.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'job_limit',
  paranoid: true,
  timestamps: true,
})
export class JobLimit<A extends JobLimitAttributes, B extends JobLimitCreationAttributes>
  extends BaseModel<A, B>
  implements JobLimitAttributes<DataType, ReturnType, QueueName> {
    
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
    key: string;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    limit: number;
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    duration: number;
    
  @Column({
    defaultValue: 0,
    type: DataType.INTEGER,
  })
    count: number;
    
  @Column({ 
    allowNull: false, 
    type: DataType.DATE,
  })
    expiresAt: Date;

  async increment() {
    const {
      count, duration, limit, expiresAt, 
    } = this.toJSON();
    if (expiresAt.valueOf() < Date.now()) {
      this.set('count', 0);
      this.set('expiresAt', Date.now() + duration);
    }
    if (count > limit) {
      throw new Error('limit reached');
    }
    this.set('count', count + 1);
    this.set('failureReason', reason instanceof Error ? reason.message : reason);
    await this.save();
  }

}

