import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { MembershipAttributes, MembershipCreationAttributes } from './Membership.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'membership',
  paranoid: true,
  timestamps: true,
})
export class Membership<A extends MembershipAttributes = MembershipAttributes, B extends MembershipCreationAttributes = MembershipCreationAttributes>
  extends BaseModel<A, B>
  implements MembershipAttributes {
  
  @Column({
    allowNull: false,
    type: DataType.NUMBER,
  })
  declare userId: number;
  
  @Column({
    allowNull: false,
    type: DataType.DATE,
  })
  declare renewsOn: Date;
  
  @Column({
    allowNull: false,
    type: DataType.NUMBER,
  })
  declare tier: number;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare platform: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare platformUUID: string;
  
}
