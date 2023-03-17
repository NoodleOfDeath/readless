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
  timestamps: true,
  paranoid: true,
})
export class RefCredentialRole<A extends RefCredentialRoleAttributes = RefCredentialRoleAttributes, B extends RefCredentialRoleCreationAttributes = RefCredentialRoleCreationAttributes> extends Model<A, B> implements RefCredentialRoleAttributes {

  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<RefCredentialRole>): Partial<RefCredentialRole> {
    return defaults ?? {};
  }
    
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    credentialId: number;
  
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    roleId: number;

}