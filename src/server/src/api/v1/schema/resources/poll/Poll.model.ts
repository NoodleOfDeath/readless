import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { PollAttributes, PollCreationAttributes } from './Poll.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'poll',
  paranoid: true,
  timestamps: true,
})
export class Poll<
    A extends PollAttributes = PollAttributes,
    B extends PollCreationAttributes = PollCreationAttributes,
  > extends BaseModel<A, B> implements PollAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare title: string;
  
}