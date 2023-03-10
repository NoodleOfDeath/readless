import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { User } from './user.model';

export type HeadlessAliasAttributes = DatedAttributes & {
  type: string;
  value: string;
};

export type HeadlessAliasCreationAttributes = HeadlessAliasAttributes;

@Table({
  modelName: 'headless_alias',
  timestamps: true,
  paranoid: true,
})
export class HeadlessUserAlias<
    A extends HeadlessUserAliasAttributes = HeadlessUserAliasAttributes,
    B extends HeadlessUserAliasCreationAttributes = HeadlessUserAliasCreationAttributes,
  >
  extends Model<A, B>
  implements HeadlessUserAliasAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<HeadlessUserAlias>): Partial<HeadlessUserAlias> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    value: string;
}

export type UserAliasAttributes = HeadlessAliasCreationAttributes & {
  userId: number;
};

export type UserAliasCreationAttributes = UserAliasAttributes;

@Table({
  modelName: 'alias',
  timestamps: true,
  paranoid: true,
})
export class UserAlias<
    A extends UserAliasAttributes = UserAliasAttributes,
    B extends UserAliasCreationAttributes = UserAliasCreationAttributes,
  >
  extends HeadlessUserAlias<A, B>
  implements UserAliasAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<UserAlias>): Partial<UserAlias> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    userId: number;

  @BelongsTo(() => User, 'userId')
    user: User;
}
