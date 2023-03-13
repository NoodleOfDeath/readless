import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { RolePermission } from './role_permission.model';

export type RoleAttributes = DatedAttributes & {
  name: string;
};

export type RoleCreationAttributes = DatedAttributes & {
  name: string;
};

@Table({
  modelName: 'role',
  timestamps: true,
  paranoid: true,
})
export class Role<A extends RoleAttributes = RoleAttributes, B extends RoleCreationAttributes = RoleCreationAttributes>
  extends Model<A, B>
  implements RoleAttributes
{
  static get empty() { 
    return this.json();
  }

  static json(defaults?: Partial<Role>): Partial<Role> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name: string;
    
  @HasMany(() => RolePermission, 'roleId')
    _permissions: RolePermission[];
    
  async permissions() {
    return await this._permissions.map((p) => p.permission);
  }
  
}
