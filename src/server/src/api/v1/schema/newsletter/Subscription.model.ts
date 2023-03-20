import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { SubscriptionAttributes, SubscriptionCreationAttributes } from './Subscription.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'subscription',
  paranoid: true,
  timestamps: true,
})
export class Subscription<A extends SubscriptionAttributes = SubscriptionAttributes, B extends SubscriptionCreationAttributes = SubscriptionCreationAttributes>
  extends BaseModel<A, B>
  implements SubscriptionAttributes {

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
