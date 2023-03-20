import {
  Column,
  DataType,
  Index,
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
  
  @Index({
    name: 'roles_name_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;

  @Column({
    allowNull: false,
    type: DataType.NUMBER,
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
