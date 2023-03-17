import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type SubscriptionAttributes = DatedAttributes & {
  aliasType: string;
  alias: string;
  newsletterId: number;
};

export type SubscriptionCreationAttributes = DatedAttributes & {
  aliasType: string;
  alias: string;
  newsletterId?: number;
  newsletterName?: string;
};

@Table({
  modelName: 'subscription',
  paranoid: true,
  timestamps: true,
})
export class Subscription<A extends SubscriptionAttributes = SubscriptionAttributes, B extends SubscriptionCreationAttributes = SubscriptionCreationAttributes>
  extends Model<A, B>
  implements SubscriptionAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Subscription>): Partial<Subscription> {
    return defaults ?? {};
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    aliasType: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    alias: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    newsletterId: number;

}
