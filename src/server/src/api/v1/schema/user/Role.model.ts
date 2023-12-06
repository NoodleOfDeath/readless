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
      priority: 200,
      refreshable: false,
      requiresElevation: true,
      scope: ['account:read', 'account:write'],
    },
    god: {
      lifetime: '2m',
      name: 'god',
      priority: 9000,
      refreshable: true,
      requiresElevation: true,
      scope: ['*'],
    },
    standard: {
      lifetime: '30d',
      name: 'standard',
      priority: 0,
      refreshable: true,
      scope: ['standard:read', 'standard:write'],
    },
    verified: {
      extends: 'standard',
      lifetime: '30d',
      name: 'verified',
      priority: 20,
      refreshable: true,
      scope: ['standard:read', 'standard:write', 'verified:read', 'verified:write'],
    },
  };
  
  static async prepare() {
    for (const role of Object.values(this.ROLES)) {
      await this.upsert(role);
    }
  }
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;

  @Column({
    allowNull: false,
    defaultValue: 0,
    type: DataType.INTEGER,
  })
  declare priority: number;

  @Column({
    allowNull: false,
    defaultValue: '30d',
    type: DataType.STRING,
  })
  declare lifetime: string;
    
  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare refreshable: boolean;
  
  @Column({
    allowNull: false,
    defaultValue: [],
    type: DataType.ARRAY(DataType.STRING),
  })
  declare scope: string[];

  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN,
  })
  declare requiresElevation: boolean;

  @Column({
    allowNull: false,
    defaultValue: 'standard',
    type: DataType.STRING,
  })
  declare defaultsTo: string;

  @Column({ type: DataType.STRING })
  declare extends?: string;

}
