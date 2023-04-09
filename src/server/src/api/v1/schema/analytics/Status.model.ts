
import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { StatusAttributes } from './Status.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'status',
  paranoid: true,
  timestamps: true,
})
export class Status extends BaseModel<StatusAttributes, StatusAttributes> implements StatusAttributes {

  @Column({
    allowNull: false,
    type: DataType.STRING,
    unique: true,
  })
  declare name: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare description: string;
    
  @Column({ type: DataType.JSON })
  declare data?: Record<string, unknown>;

}
