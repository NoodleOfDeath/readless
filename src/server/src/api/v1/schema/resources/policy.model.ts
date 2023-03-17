import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type PolicyAttributes = DatedAttributes & {
  name: string;
  content: string;
};

export type PolicyCreationAttributes = DatedAttributes & {
  name: string;
  content: string;
};

@Table({
  modelName: 'policy',
  paranoid: true,
  timestamps: true,
})
export class Policy<
    A extends PolicyAttributes = PolicyAttributes,
    B extends PolicyCreationAttributes = PolicyCreationAttributes,
  >
  extends Model<A, B>
  implements PolicyAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Policy>): Partial<Policy> {
    return defaults ?? {};
  }

  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    name: string;

  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    content: string;

}
