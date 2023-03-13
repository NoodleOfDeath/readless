import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Role } from '../auth/role.model';
import { User } from './user.model';

export type UserRoleAttributes = DatedAttributes & {
  userId: number;
  roleId: number;
};

export type UserRoleCreationAttributes = DatedAttributes & {
  userId: number;
  roleId: number;
};

@Table({
  modelName: 'user_role',
  timestamps: true,
  paranoid: true,
})
export class UserRole<A extends UserRoleAttributes = UserRoleAttributes, B extends UserRoleCreationAttributes = UserRoleCreationAttributes> extends Model<A, B> implements UserRoleAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<UserRole>): Partial<UserRole> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    userId: number;
  
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    roleId: number;
  
  get user() {
    return User.findByPk(this.userId);
  }
    
  get role() { 
    return Role.findByPk(this.roleId);
  }

}