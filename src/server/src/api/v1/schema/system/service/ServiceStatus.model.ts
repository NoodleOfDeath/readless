import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { ServiceStatusAttributes, ServiceStatusCreationAttributes } from './ServiceStatus.types';
import { BaseModel } from '../../base';

@Table({
  modelName: 'service_status',
  paranoid: true,
  timestamps: true,
})
export class ServiceStatus<A extends ServiceStatusAttributes = ServiceStatusAttributes, B extends ServiceStatusCreationAttributes = ServiceStatusCreationAttributes> extends BaseModel<A, B> implements ServiceStatusAttributes {
  
  @Column({
    allowNull: false, 
    type: DataType.INTEGER,
    unique: true,
  })
  declare serviceId: number;

  @Column({
    allowNull: false, 
    type: DataType.STRING, 
  })
  declare state: string;
  
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare description: string;

}