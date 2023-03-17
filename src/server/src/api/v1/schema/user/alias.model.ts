import {
  Column,
  DataType,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type AliasAttributes = DatedAttributes & {
  userId: number;
  type: string;
  value: string;
  verificationCode?: string;
  verificationExpiresAt?: Date;
  verifiedAt?: Date;
};

export type AliasCreationAttributes = AliasAttributes;

@Table({
  modelName: 'alias',
  paranoid: true,
  timestamps: true,
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
    allowNull: false,
    type: DataType.INTEGER,
  })
    userId: number;
  
  @Index({
    name: 'aliases_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: string;
  
  @Index({
    name: 'aliases_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    value: string;

  @Index({
    name: 'aliases_verificationCode_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({ type: DataType.STRING })
    verificationCode: string;
    
  @Column({ type: DataType.DATE })
    verificationExpiresAt: Date;

  @Column({ type: DataType.DATE })
    verifiedAt: Date;

}