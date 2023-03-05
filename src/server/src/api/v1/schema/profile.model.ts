import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { User } from './user.model';

export type ProfileAttributes = DatedAttributes & {
  userId: number;
  
};

export type ProfileCreationAttributes = DatedAttributes & {
  userId: number;
  
};

@Table({
  modelName: 'subscription',
  timestamps: true,
  paranoid: true,
})
export class Profile<A extends ProfileAttributes = ProfileAttributes, B extends ProfileCreationAttributes = ProfileCreationAttributes>
  extends Model<A, B>
  implements ProfileAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Profile>): Partial<Profile> {
    return defaults ?? {};
  }
  
  @Column({
    type: DataType.NUMBER,
    allowNull: false,
  })
    userId: number;
  
  @BelongsTo(() => User, 'userId')
    user: User;

}
