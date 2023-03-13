import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from './dated';

export type RequestAttributes = DatedAttributes & {
  remoteAddr: string;
  referrer: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, unknown>;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
}

export type RequestCreationAttributes = RequestAttributes;

@Table({
  modelName: 'request',
  timestamps: true,
  paranoid: true,
})
export class Request<A extends RequestAttributes = RequestAttributes, B extends RequestCreationAttributes = RequestCreationAttributes> extends Model<A, B> implements RequestAttributes {
  remoteAddress: string;

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Request>): Partial<Request> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING(2083),
  })
    remoteAddr: string;

  @Column({
    type: DataType.STRING(2083),
  })
    referrer: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    path: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

  @Column({
    type: DataType.JSON,
  })
    params?: Record<string, unknown>;

  @Column({
    type: DataType.JSON,
  })
    query?: Record<string, unknown>;

  @Column({
    type: DataType.JSON,
  })
    body?: Record<string, unknown>;

}