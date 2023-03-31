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
    type: DataType.DATE,
  })
  declare expiresAt: Date;

}