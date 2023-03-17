import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

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
  implements RoleAttributes {

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
  
}
