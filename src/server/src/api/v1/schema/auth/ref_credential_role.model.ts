import {
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

import { DatedAttributes } from '../dated';

export type RefCredentialRoleAttributes = DatedAttributes & {
  credentialId: number;
  roleId: number;
};

export type RefCredentialRoleCreationAttributes = DatedAttributes & {
  credentialId: number;
  roleId: number;
};

@Table({
  modelName: '_ref_credential_role',
  paranoid: true,
  timestamps: true,
})
export class RefCredentialRole<A extends RefCredentialRoleAttributes = RefCredentialRoleAttributes, B extends RefCredentialRoleCreationAttributes = RefCredentialRoleCreationAttributes> extends Model<A, B> implements RefCredentialRoleAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefCredentialRole>): Partial<RefCredentialRole> {
    return defaults ?? {};
  }
    
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    credentialId: number;
  
  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
    roleId: number;

}