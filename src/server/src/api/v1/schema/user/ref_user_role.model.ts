import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type RefUserRoleAttributes = DatedAttributes & {
  userId: number;
  roleId: number;
};

export type RefUserRoleCreationAttributes = DatedAttributes & {
  userId: number;
  roleId: number;
};

@Table({
  modelName: '_ref_user_role',
  paranoid: true,
  timestamps: true,
})
export class RefUserRole<A extends RefUserRoleAttributes = RefUserRoleAttributes, B extends RefUserRoleCreationAttributes = RefUserRoleCreationAttributes> extends Model<A, B> implements RefUserRoleAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefUserRole>): Partial<RefUserRole> {
    return defaults ?? {};
  }
    
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