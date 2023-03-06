import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';

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
  timestamps: true,
  paranoid: true,
})
export class Metric extends Model<MetricAttributes, MetricAttributes> implements MetricAttributes {

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type: 'click' | 'nav';
    
  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
    data: Record<string, unknown>;
    
  @Column({
    type: DataType.ARRAY(DataType.STRING),
  })
    referrer?: string[];

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    userAgent: string;

}
