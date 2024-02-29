import { Column, DataType } from 'sequelize-typescript';

import {
  GroupMembershipAttributes,
  GroupMembershipCreationAttributes,
} from './GroupMembership.types';
import { BaseModel } from '../../base';

export abstract class GroupMembership<
  A extends GroupMembershipAttributes, 
  B extends GroupMembershipCreationAttributes
> 
  extends BaseModel<A, B> implements GroupMembershipAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare groupId: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare childId: number;

}