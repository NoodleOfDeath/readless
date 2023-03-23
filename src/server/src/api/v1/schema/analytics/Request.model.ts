import {
  Column,
  DataType,
  Table,
} from 'sequelize-typescript';

import { RequestAttributes, RequestCreationAttributes } from './Request.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'request',
  paranoid: true,
  timestamps: true,
})
export class Request<A extends RequestAttributes = RequestAttributes, B extends RequestCreationAttributes = RequestCreationAttributes> extends BaseModel<A, B> implements RequestAttributes {

  @Column({ type: DataType.STRING(2083) })
    remoteAddr: string;

  @Column({ type: DataType.STRING(2083) })
    referrer?: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    path: string;

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

}