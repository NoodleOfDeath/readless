import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { MetricAttributes } from './Metric.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'metric',
  paranoid: true,
  timestamps: true,
})
export class Metric extends BaseModel<MetricAttributes, MetricAttributes> implements MetricAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: 'click' | 'nav';
    
  @Column({
    allowNull: false,
    type: DataType.JSON,
  })
  declare data: Record<string, unknown>;
    
  @Column({ type: DataType.ARRAY(DataType.STRING) })
  declare referrer?: string[];

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare userAgent: string;

}
