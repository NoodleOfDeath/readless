import { HasMany, Model, Table } from 'sequelize-typescript';
import { DatedAttributes } from './dated';
import { UserAlias } from './alias.model';

export type UserAttributes = DatedAttributes & {};

export type UserCreationAttributes = DatedAttributes & {};

@Table({
  modelName: 'user',
  timestamps: true,
  paranoid: true,
})
export class User<
    A extends UserAttributes = UserAttributes,
    B extends UserCreationAttributes = UserCreationAttributes,
  >
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