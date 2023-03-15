import {
  Column, DataType, Model, Table 
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
  timestamps: true,
  paranoid: true,
})
export class Policy<
    A extends PolicyAttributes = PolicyAttributes,
    B extends PolicyCreationAttributes = PolicyCreationAttributes,
  >
  extends Model<A, B>
  implements PolicyAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Policy>): Partial<Policy> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    content: string;
}
