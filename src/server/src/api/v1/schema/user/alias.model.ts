import {
  Column, DataType, Model, Table, 
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type AliasAttributes = DatedAttributes & {
  userId: number;
  type: string;
  value: string;
  verifiedOn?: Date;
};

export type AliasCreationAttributes = AliasAttributes;

@Table({
  modelName: 'alias',
  timestamps: true,
  paranoid: true,
})
export class Alias<
    A extends AliasAttributes = AliasAttributes,
    B extends AliasCreationAttributes = AliasCreationAttributes,
  >
  extends Model<A, B>
  implements AliasAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Alias>): Partial<Alias> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    userId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type: string;

  @Column({
    type: DataType.STRING(2083),
    allowNull: false,
  })
    value: string;

  @Column({ type: DataType.DATE })
    verifiedOn: Date;

}