import bcrypt from 'bcryptjs';
import ms from 'ms';
import { Op } from 'sequelize';
import { Table } from 'sequelize-typescript';

import { Alias } from './alias.model';
import {
  AliasCreationAttributes,
  AliasPayload,
  AliasType,
  FindAliasOptions,
} from './alias.types';
import { UserAttributes, UserCreationAttributes } from './user.types';
import { AuthError } from '../../../../services';
import { Jwt, JwtBearing } from '../../../../services/types';
import { Credential } from '../auth/credential.model';
import { CredentialCreationAttributes, CredentialType } from '../auth/credential.types';
import { BaseModel } from '../base';

@Table({
  modelName: 'user',
  paranoid: true,
  timestamps: true,
})
export class User<A extends UserAttributes = UserAttributes, B extends UserCreationAttributes = UserCreationAttributes>
  extends BaseModel<A, B>
  implements UserAttributes {

  /** Resolves a user from an alias request/payload */
  public static async from(req: Partial<JwtBearing<AliasPayload>>, opts?: Partial<FindAliasOptions>) {
    if (req.jwt instanceof Jwt) {
      const user = await User.findOne({ where: { id: req.jwt.userId } });
      if (!user && !opts?.ignoreIfNotResolved) {
        if (!opts?.ignoreIfNotResolved) {
          throw new AuthError('INVALID_CREDENTIALS');
        }
      }
      return { user };
    } else {
      const {
        alias, otp, payload, 
      } = await Alias.from(req, opts);
      if (!alias) {
        if (!opts?.ignoreIfNotResolved) {
          throw new AuthError('UNKNOWN_ALIAS', { alias: 'email' });
        }
        return { alias, payload };
      }
      return {
        alias,
        otp,
        payload, 
        user: await User.findOne({ where: { id: alias.toJSON().userId } }),
      };
    }
  }
  
  public async findAlias(type: AliasType) {
    return await Alias.findOne({ 
      where: {
        type,
        userId: this.id,
      },
    });
  }
  
  public async findAliases(type: AliasType, ...other: AliasType[]) {
    return await Alias.findAll({ 
      where: {
        type: { [Op.in]: [type, ...other] },
        userId: this.id,
      },
    });
  }

  public async createAlias(type: AliasType, value: string, attr: Omit<AliasCreationAttributes, 'type' | 'userId' | 'value'>) {
    return await Alias.create({
      type,
      userId: this.id,
      value,
      ...attr,
    });
  }

  public async findCredential(type: CredentialType) {
    return await Credential.findOne({
      where: {
        type,
        userId: this.id,
      }, 
    });
  }
  
  public async findCredentials(type: CredentialType, ...other: CredentialType[]) {
    return await Credential.findAll({
      where: {
        type: { [Op.in]: [type, ...other] },
        userId: this.id,
      }, 
    });
  }

  public async createCredential<C extends CredentialType, V extends C extends 'jwt' ? Jwt : string>(type: C, rawValue: V, attr: Omit<CredentialCreationAttributes, 'type' | 'userId' | 'value'> = {}) {
    let value: string;
    let expiresAt: Date;
    if (typeof rawValue === 'string') {
      value = rawValue;
    } else {
      value = rawValue.signed;
      expiresAt = new Date(Date.now() + ms(rawValue.expiresIn));
    }
    if (type === 'password') {
      value = bcrypt.hashSync(value, process.env.PASSWORD_HASH_ROUNDS || 10);
    }
    return await Credential.create({ 
      expiresAt,
      type,
      userId: this.id,
      value,
      ...attr,
    });
  }

}
