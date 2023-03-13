import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Role } from './role.model';
import { Permission } from './permission.model';

export type RolePermissionAttributes = DatedAttributes & {
  roleId: number;
  permissionId: number;
};

export type RolePermissionCreationAttributes = DatedAttributes & {
  roleId: number;
  permissionId: number;
};

@Table({
  modelName: 'role_permission',
  timestamps: true,
  paranoid: true,
})
export class RolePermission<A extends RolePermissionAttributes = RolePermissionAttributes, B extends RolePermissionCreationAttributes = RolePermissionCreationAttributes> extends Model<A, B> implements RolePermissionAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RolePermission>): Partial<RolePermission> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    roleId: number;
  
  @ForeignKey(() => Permission)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    permissionId: number;
  
  async role() {
    return await Role.findByPk(this.roleId);
  }
    
  async permission() { 
    return await Permission.findByPk(this.permissionId);
  }

}