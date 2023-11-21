import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { PollOptionAttributes, PollOptionCreationAttributes } from './PollOption.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'poll_option',
  paranoid: true,
  timestamps: true,
})
export class PollOption<
    A extends PollOptionAttributes = PollOptionAttributes,
    B extends PollOptionCreationAttributes = PollOptionCreationAttributes,
  > extends BaseModel<A, B> implements PollOptionAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare pollId: number;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare value: string;

  @Column({ type: DataType.STRING })
  declare displayName?: string;
  
  declare options?: PollOptionAttributes[];
  
}