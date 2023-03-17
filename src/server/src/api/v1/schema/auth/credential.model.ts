import {
  Column,
  DataType,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type CredentialAttributes = DatedAttributes & {
  userId: number; 
  type: string;
  value: string;
  expiresAt: Date;
};

export type CredentialCreationAttributes = DatedAttributes & {
  userId: number;
  type: string;
  value: string;
  expiresAt: Date;
};

@Table({
  modelName: 'credential',
  timestamps: true,
  paranoid: true,
})
export class Credential<
    A extends CredentialAttributes = CredentialAttributes,
    B extends CredentialCreationAttributes = CredentialCreationAttributes,
  >
  extends Model<A, B>
  implements CredentialAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<Credential>): Partial<Credential> {
    return defaults ?? {};
  }

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    userId: number;
  
  @Index({
    name: 'credentials_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
    type: string;

  @Index({
    name: 'credentials_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
    value: string;

  @Column({ type: DataType.DATE })
    expiresAt: Date;

}
