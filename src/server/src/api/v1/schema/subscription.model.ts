import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';

export type SubscriptionAttributes = DatedAttributes & {
  aliasType: string;
  alias: string;
  feedType: string;
  feedId: number;
};

export type SubscriptionCreationAttributes = SubscriptionAttributes;

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
  
  @Index({
    name: 'subscriptions_aliasType_alias_key',
    unique: true
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    aliasType: string;
  
  @Index({
    name: 'subscriptions_aliasType_alias_key',
    unique: true,
  })
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
