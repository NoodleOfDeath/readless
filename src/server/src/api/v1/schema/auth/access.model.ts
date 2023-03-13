import { Column, DataType, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type AccessAttributes = DatedAttributes & {
  resourceId: number;
  scope: string;
};

export type AccessCreationAttributes = DatedAttributes & {
  resourceId: number;
  scope: string;
};

@Table({
  modelName: 'access',
  timestamps: true,
  paranoid: true,
})
export class Access<
    A extends AccessAttributes = AccessAttributes,
    B extends AccessCreationAttributes = AccessCreationAttributes,
  >
  extends Model<A, B>
  implements AccessAttributes
{
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Access>): Partial<Access> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    resourceId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    scope: string;
}
