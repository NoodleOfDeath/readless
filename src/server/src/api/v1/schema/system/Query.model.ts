import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { QueryAttributes, QueryCreationAttributes } from './Query.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'query',
  paranoid: true,
  timestamps: true,
})
export class Query<A extends QueryAttributes = QueryAttributes, B extends QueryCreationAttributes = QueryCreationAttributes> extends BaseModel<A, B> implements QueryAttributes {

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

  @Column({ 
    allowNull: false, 
    type: DataType.TEXT,
  })
  declare userAgent: string;
  
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare appVersion: string;

}