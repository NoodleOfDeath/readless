import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type RequestAttributes = DatedAttributes & {
  remoteAddr: string;
  referrer?: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}

export type RequestCreationAttributes = RequestAttributes;

@Table({
  modelName: 'request',
  paranoid: true,
  timestamps: true,
})
export class Request<A extends RequestAttributes = RequestAttributes, B extends RequestCreationAttributes = RequestCreationAttributes> extends Model<A, B> implements RequestAttributes {

  remoteAddress: string;

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Request>): Partial<Request> {
    return defaults ?? {};
  }

  @Column({ type: DataType.STRING(2083) })
    remoteAddr: string;

  @Column({ type: DataType.STRING(2083) })
    referrer: string;

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