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
} from './credential.types';
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

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    userId: number;
  
  @Index({
    name: 'credentials_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: CredentialType;

  @Index({
    name: 'credentials_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.TEXT,
  })
    value: string;

  @Column({ type: DataType.DATE })
    expiresAt: Date;

}
