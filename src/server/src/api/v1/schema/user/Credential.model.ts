import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import {
  CredentialAttributes,
  CredentialCreationAttributes,
  CredentialType,
} from './Credential.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'credential',
  paranoid: true,
  timestamps: true,
})
export class Credential<
    A extends CredentialAttributes = CredentialAttributes,
    B extends CredentialCreationAttributes = CredentialCreationAttributes,
  >
  extends BaseModel<A, B>
  implements CredentialAttributes {

  @Index({
    name: 'credentials_userId_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare userId: number;

  @Index({
    name: 'credentials_userId_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare type: CredentialType;

  @Index({
    name: 'credentials_unique_value_key',
    unique: true,
    where: { deletedAt: null, type: ['otp', 'deleteToken', 'email', 'username', 'phone'] },
  })
  @Index({
    name: 'credentials_userId_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
  declare value: string;

  @Column({ type: DataType.DATE })
  declare expiresAt: Date;

}
