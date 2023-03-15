import {
  Column, DataType, Model, Table, 
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type HeadlessAliasAttributes = DatedAttributes & {
  type: string;
  value: string;
  claimedOn?: Date;
};

export type HeadlessAliasCreationAttributes = HeadlessAliasAttributes;

@Table({
  modelName: 'headless_alias',
  timestamps: true,
  paranoid: true,
})
export class HeadlessAlias<
    A extends HeadlessAliasAttributes = HeadlessAliasAttributes,
    B extends HeadlessAliasCreationAttributes = HeadlessAliasCreationAttributes,
  >
  extends Model<A, B>
  implements HeadlessAliasAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<HeadlessAlias>): Partial<HeadlessAlias> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type: string;

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
    value: string;

  @Column({ type: DataType.DATE })
    claimedOn: Date;

}

export type UserAliasAttributes = HeadlessAliasCreationAttributes & {
  userId: number;
};

export type UserAliasCreationAttributes = UserAliasAttributes;

@Table({
  modelName: 'user_alias',
  timestamps: true,
  paranoid: true,
})
export class UserAlias<
    A extends UserAliasAttributes = UserAliasAttributes,
    B extends UserAliasCreationAttributes = UserAliasCreationAttributes,
  >
  extends HeadlessAlias<A, B>
  implements UserAliasAttributes {

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

}
