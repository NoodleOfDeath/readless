import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { Credential } from './credential.model';
import { Role } from './role.model';

export type CredentialRoleAttributes = DatedAttributes & {
  credentialId: number;
  roleId: number;
};

export type CredentialRoleCreationAttributes = DatedAttributes & {
  credentialId: number;
  roleId: number;
};

@Table({
  modelName: 'credential_role',
  timestamps: true,
  paranoid: true,
})
export class CredentialRole<A extends CredentialRoleAttributes = CredentialRoleAttributes, B extends CredentialRoleCreationAttributes = CredentialRoleCreationAttributes> extends Model<A, B> implements CredentialRoleAttributes {
  static get empty() {
    return this.json();
  }

  static json(defaults?: Partial<CredentialRole>): Partial<CredentialRole> {
    return defaults ?? {};
  }
    
  @ForeignKey(() => Credential)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    credentialId: number;
  
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
    roleId: number;
  
  async credential() {
    return await Credential.findByPk(this.credentialId);
  }
    
  async role() { 
    return await Role.findByPk(this.roleId);
  }

}