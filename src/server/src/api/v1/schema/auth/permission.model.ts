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
  timestamps: true,
  paranoid: true,
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
    type: DataType.STRING,
    allowNull: false,
  })
    resourceType: ResourceType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    resourceId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    access: AccessLevel;

}

