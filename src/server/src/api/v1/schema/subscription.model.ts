import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { User } from './user.model';

export type SubscriptionAttributes = DatedAttributes & {
  userId: number;
  renewsOn: Date;
  platform: string;
  platformUUID: string;
};

export type SubscriptionCreationAttributes = DatedAttributes & {
  userId: number;
  renewsOn: Date;
  platform: string;
  platformUUID: string;
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
    type: DataType.NUMBER,
    allowNull: false,
  })
    userId: number;
  
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
    renewsOn: Date;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    platform: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    platformUUID: string;
  
  @BelongsTo(() => User, 'userId')
    user: User;

}
