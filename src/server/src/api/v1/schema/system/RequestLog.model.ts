import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RequestLogAttributes, RequestLogCreationAttributes } from './RequestLog.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'request',
  paranoid: true,
  timestamps: true,
})
export class RequestLog<A extends RequestLogAttributes = RequestLogAttributes, B extends RequestLogCreationAttributes = RequestLogCreationAttributes> extends BaseModel<A, B> implements RequestLogAttributes {

  @Column({
    allowNull: false, 
    type: DataType.STRING(2083), 
  })
  declare remoteAddr: string;

  @Column({ 
    allowNull: false, 
    type: DataType.STRING(2083), 
  })
  declare path: string;

  @Column({ type: DataType.TEXT })
  declare userAgent?: string;
  
  @Column({ type: DataType.STRING })
  declare appVersion?: string;
  
  @Column({ type: DataType.STRING })
  declare locale?: string;
  
  @Column({ type: DataType.STRING })
  declare platform?: string;
  
  @Column({ type: DataType.INTEGER })
  declare userId?: number;

}