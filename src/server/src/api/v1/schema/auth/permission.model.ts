import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { AccessLevel, ResourceType } from '../types';

export type PermissionAttributes = DatedAttributes & {
  resourceType: ResourceType;
  resourceId: number;
  access: AccessLevel;
};

export type PermissionCreationAttributes = DatedAttributes & {
  resourceType: ResourceType;
  resourceId: number;
  access: AccessLevel;
};

@Table({
  modelName: 'permission',
  paranoid: true,
  timestamps: true,
})
export class Permission<
    A extends PermissionAttributes = PermissionAttributes,
    B extends PermissionCreationAttributes = PermissionCreationAttributes,
  >
  extends Model<A, B>
  implements PermissionAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Permission>): Partial<Permission> {
    return defaults ?? {};
  }

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    resourceType: ResourceType;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    resourceId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    access: AccessLevel;

}

