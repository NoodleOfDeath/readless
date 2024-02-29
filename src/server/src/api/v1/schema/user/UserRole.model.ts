import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { UserRoleAttributes, UserRoleCreationAttributes } from './UserRole.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'user_role',
  paranoid: true,
  timestamps: true,
})
export class UserRole<A extends UserRoleAttributes = UserRoleAttributes, B extends UserRoleCreationAttributes = UserRoleCreationAttributes> extends BaseModel<A, B> implements UserRoleAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare userId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare roleId: number;

}