import { HasMany, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { UserAlias } from './alias.model';

// eslint-disable-next-line @typescript-eslint/ban-types
export type UserAttributes = DatedAttributes & {};

// eslint-disable-next-line @typescript-eslint/ban-types
export type UserCreationAttributes = DatedAttributes & {};

@Table({
  modelName: 'user',
  timestamps: true,
  paranoid: true,
})
export class User<A extends UserAttributes = UserAttributes, B extends UserCreationAttributes = UserCreationAttributes>
  extends Model<A, B>
  implements UserAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<User>): Partial<User> {
    return defaults ?? {};
  }

  @HasMany(() => UserAlias, 'userId')
    aliases: UserAlias[];
}
