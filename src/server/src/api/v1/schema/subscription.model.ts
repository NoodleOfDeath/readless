import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';

export type SubscriptionAttributes = DatedAttributes & {
  alias: string;
  feedType: string;
  feedId: number;
};

export type SubscriptionCreationAttributes = DatedAttributes & {
  alias: string;
  feedType: string;
  feedId: string;
};

@Table({
  modelName: 'subscription',
  timestamps: true,
  paranoid: true,
})
export class Subscription<A extends SubscriptionAttributes = SubscriptionAttributes, B extends SubscriptionCreationAttributes = SubscriptionCreationAttributes>
  extends Model<A, B>
  implements SubscriptionAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Subscription>): Partial<Subscription> {
    return defaults ?? {};
  }
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    alias: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    feedType: string;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    feedId: number;

}
