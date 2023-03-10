import { BelongsTo, Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';
import { User } from './user.model';

export type MembershipAttributes = DatedAttributes & {
  userId: number;
  renewsOn: Date;
  tier: number;
  platform: string;
  platformUUID: string;
};

export type MembershipCreationAttributes = DatedAttributes & {
  userId: number;
  renewsOn: Date;
  tier: number;
  platform: string;
  platformUUID: string;
};p

@Table({
  modelName: 'membership',
  timestamps: true,
  paranoid: true,
})
export class Membership<A extends MembershipAttributes = MembershipAttributes, B extends MembershipCreationAttributes = MembershipCreationAttributes>
  extends Model<A, B>
  implements MembershipAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Membership>): Partial<Membership> {
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
    type: DataType.NUMBER,
    allowNull: false,
  })
  tier: number;
  
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
