import { Column, DataType, ForeignKey, Index, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { Newsletter } from './newsletter.model';

export type SubscriptionAttributes = DatedAttributes & {
  aliasType: string;
  alias: string;
  newsletterId: number;
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
  
  @ForeignKey(() => Newsletter)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    newsletterId: number;

}
