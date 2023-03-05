import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { User } from './user.model';

export type NotificationAttributes = DatedAttributes & {
  userId: number;
  type: 'email' | 'push' | 'text' | 'toast';
};

export type NotificationCreationAttributes = DatedAttributes & {
  userId: number;
  
};

@Table({
  modelName: 'subscription',
  timestamps: true,
  paranoid: true,
})
export class Notification<A extends NotificationAttributes = NotificationAttributes, B extends NotificationCreationAttributes = NotificationCreationAttributes>
  extends Model<A, B>
  implements NotificationAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Notification>): Partial<Notification> {
    return defaults ?? {};
  }
  
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
    userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type: 'email' | 'push' | 'text' | 'toast';
  
  @BelongsTo(() => User, 'userId')
    user: User;

}
