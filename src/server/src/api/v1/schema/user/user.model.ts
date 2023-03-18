import {  Table } from 'sequelize-typescript';

import { Alias } from './alias.model';
import { AliasPayload, FindAliasOptions } from './alias.types';
import { UserAttributes, UserCreationAttributes } from './user.types';
import { Credential } from '../auth/credential.model';
import { CredentialType } from '../auth/credential.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'user',
  paranoid: true,
  timestamps: true,
})
export class User<A extends UserAttributes = UserAttributes, B extends UserCreationAttributes = UserCreationAttributes>
  extends BaseModel<A, B>
  implements UserAttributes {

  /** Resolves a use from an alias request payload */
  public static async from(req: Partial<AliasPayload>, opts?: Partial<FindAliasOptions>) {
    const { alias, payload } = await Alias.from(req, opts);
    return {
      alias, 
      payload, 
      user: await User.findOne({ where: { id: alias.userId } }),
    };
  }
  
  public get aliases() {
    return Alias.findAll({ where: { userId: this.id } });
  }
  
  public get email() {
    return Alias.findOne({ 
      where: {
        type: 'email',
        userId: this.id,
      },
    });
  }

  public get credentials() {
    return Credential.findAll({ where: { userId: this.id } });
  }

  public async findCredential(type: CredentialType) {
    return Credential.findOne({
      where: {
        type, 
        userId: this.id, 
      }, 
    });
  }

}
