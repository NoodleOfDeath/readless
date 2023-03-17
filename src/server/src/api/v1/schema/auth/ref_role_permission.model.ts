import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type RefRolePermissionAttributes = DatedAttributes & {
  roleId: number;
  permissionId: number;
};

export type RefRolePermissionCreationAttributes = DatedAttributes & {
  roleId: number;
  permissionId: number;
};

@Table({
  modelName: '_ref_role_permission',
  paranoid: true,
  timestamps: true,
})
export class RefRolePermission<A extends RefRolePermissionAttributes = RefRolePermissionAttributes, B extends RefRolePermissionCreationAttributes = RefRolePermissionCreationAttributes> extends Model<A, B> implements RefRolePermissionAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefRolePermission>): Partial<RefRolePermission> {
    return defaults ?? {};
  }
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    roleId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    permissionId: number;

}