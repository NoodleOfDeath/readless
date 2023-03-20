import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RefUserRoleAttributes, RefUserRoleCreationAttributes } from './RefUserRole.types';
import { BaseModel } from '../base';

@Table({
  modelName: '_ref_user_role',
  paranoid: true,
  timestamps: true,
})
export class RefUserRole<A extends RefUserRoleAttributes = RefUserRoleAttributes, B extends RefUserRoleCreationAttributes = RefUserRoleCreationAttributes> extends BaseModel<A, B> implements RefUserRoleAttributes {
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    userId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    roleId: number;

}