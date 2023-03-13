import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { DatedAttributes } from '../dated';
import { User } from '../user/user.model';

export type CredentialAttributes = DatedAttributes & {
  userId: number;
  type: string;
  value: string;
  expiresOn: Date;
};

export type CredentialCreationAttributes = DatedAttributes & {
  userId: number;
  type: string;
  value: string;
  expiresOn: Date;
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

  @ForeignKey(() => User)
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
    type: DataType.TEXT,
    allowNull: false,
  })
    value: string;

  @Column({
    type: DataType.DATE,
  })
    expiresOn: Date;
    
  get user() {
    return User.findByPk(this.userId);
  }
}
