import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type MetricAttributes = DatedAttributes & {
  type: 'click' | 'nav';
  data: Record<string, unknown>;
  /** ip address(es) of actor */
  referrer?: string[];
  /** the user agent info of the consumer of this referral */
  userAgent: string;
};

export type MetricCreationAttributes = MetricAttributes;

@Table({
  modelName: 'metric',
  paranoid: true,
  timestamps: true,
})
export class Metric extends Model<MetricAttributes, MetricAttributes> implements MetricAttributes {

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
