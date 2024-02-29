import { Column, DataType } from 'sequelize-typescript';

import {
  GroupAttributes,
  GroupCreationAttributes,
  GroupType,
} from './Group.types';
import { BaseModel } from '../../base';

export abstract class Group<
    A extends GroupAttributes = GroupAttributes,
    B extends GroupCreationAttributes = GroupCreationAttributes,
  >
  extends BaseModel<A, B>
  implements GroupAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare type: GroupType;

}
