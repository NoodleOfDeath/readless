import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

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
};

@Table({
  modelName: 'membership',
  paranoid: true,
  timestamps: true,
})
export class Membership<A extends MembershipAttributes = MembershipAttributes, B extends MembershipCreationAttributes = MembershipCreationAttributes>
  extends Model<A, B>
  implements MembershipAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Membership>): Partial<Membership> {
    return defaults ?? {};
  }
  
  @Column({
    allowNull: false,
    type: DataType.NUMBER,
  })
    userId: number;
  
  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
    renewsOn: Date;
  
  @Column({
    allowNull: false,
    type: DataType.NUMBER,
  })
    tier: number;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    platform: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    platformUUID: string;
  
}
