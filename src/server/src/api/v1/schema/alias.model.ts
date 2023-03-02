import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';
import { DatedAttributes } from './dated';
import { User } from './user.model';

export type UserAliasAttributes = DatedAttributes & {
  userId: number;
  type: string;
  value: string;
};

export type UserAliasCreationAttributes = DatedAttributes & {
  userId: number;
  type: string;
  value: string;
};

@Table({
  modelName: 'alias',
  timestamps: true,
  paranoid: true,
})
export class UserAlias<
    A extends UserAliasAttributes = UserAliasAttributes,
    B extends UserAliasCreationAttributes = UserAliasCreationAttributes,
  >
  extends Model<A, B>
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

  @BelongsTo(() => User, 'userId')
  user: User;
}
