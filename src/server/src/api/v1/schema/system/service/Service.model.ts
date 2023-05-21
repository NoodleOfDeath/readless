import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { ServiceAttributes, ServiceCreationAttributes } from './Service.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'service',
  paranoid: true,
  timestamps: true,
})
export class Service<A extends ServiceAttributes = ServiceAttributes, B extends ServiceCreationAttributes = ServiceCreationAttributes> extends BaseModel<A, B> implements ServiceAttributes {

  @Column({
    allowNull: false, 
    type: DataType.STRING, 
    unique: true, 
  })
  declare name: string;
  
  @Column({ type: DataType.TEXT })
  declare description?: string;

}