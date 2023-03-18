import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { MetricAttributes } from './metric.types';
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
    data: Record<string, unknown>;
    
  @Column({ type: DataType.ARRAY(DataType.STRING) })
    referrer?: string[];

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    userAgent: string;

}
