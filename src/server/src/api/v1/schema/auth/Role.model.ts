import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RoleAttributes, RoleCreationAttributes } from './Role.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'role',
  paranoid: true,
  timestamps: true,
})
export class Role<
    A extends RoleAttributes = RoleAttributes,
    B extends RoleCreationAttributes = RoleCreationAttributes,
  >
  extends BaseModel<A, B>
  implements RoleAttributes {

  static ROLES: Record<string, RoleCreationAttributes> = {
    account: {
      lifetime: '15m',
      name: 'account',
      priority: 100,
      refreshable: false,
      scope: ['account:read', 'account:write'],
    },
    god: {
      lifetime: '1d',
      name: 'god',
      priority: 9000,
      refreshable: true,
      scope: ['*'],
    },
    standard: {
      lifetime: '1d',
      name: 'standard',
      priority: 0,
      refreshable: true,
      scope: ['standard:read', 'standard:write'],
    },
  };
  
  static async initRoles() {
    for (const role of Object.values(this.ROLES)) {
      await this.upsert(role);
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
    name: string;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    priority: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    lifetime: string;
    
  @Column({
    allowNull: false,
    type: DataType.BOOLEAN,
  })
    refreshable: boolean;
  
  @Column({
    allowNull: false,
    type: DataType.ARRAY(DataType.STRING),
  })
    scope: string[];

}
