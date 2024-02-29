import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RateLimitAttributes, RateLimitCreationAttributes } from './RateLimit.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'rate_limit',
  paranoid: true,
  timestamps: true,
})
export class RateLimit<A extends RateLimitAttributes = RateLimitAttributes, B extends RateLimitCreationAttributes = RateLimitCreationAttributes> extends BaseModel<A, B> implements RateLimitAttributes {

  @Column({
    allowNull: false, 
    type: DataType.STRING(2083), 
    unique: true, 
  })
  declare key: string;

  @Column({ 
    defaultValue: 0, 
    type: DataType.INTEGER, 
  })
  declare points: number;

  @Column({ 
    allowNull: false, 
    type: DataType.INTEGER,
  })
  declare limit: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare window: number;

  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare expiresAt: Date;
  
  async isSaturated() {
    await this.flush();
    return this.points >= this.limit;
  }
  
  async flush() {
    if (this.expiresAt < new Date()) {
      this.set('points', 0);
      this.set('expiresAt', new Date(Date.now() + this.window));
    }
    return await this.save();
  }
  
  async advance(offset = 1) {
    this.set('points', this.points + offset);
    return await this.save();
  }

}