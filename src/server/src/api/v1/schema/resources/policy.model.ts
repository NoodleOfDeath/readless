import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { PolicyAttributes, PolicyCreationAttributes } from './policy.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'policy',
  paranoid: true,
  timestamps: true,
})
export class Policy<
    A extends PolicyAttributes = PolicyAttributes,
    B extends PolicyCreationAttributes = PolicyCreationAttributes,
  >
  extends BaseModel<A, B>
  implements PolicyAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    content: string;

}
