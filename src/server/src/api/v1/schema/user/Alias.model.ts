import appleSignin from 'apple-signin-auth';
import { Op } from 'sequelize';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import { JWT } from './../../controllers/account/jwt';
import {
  AliasAttributes,
  AliasCreationAttributes,
  AliasPayload,
  AliasType,
  FindAliasOptions,
} from './Alias.types';
import { Credential } from './Credential.model';
import { GoogleService } from '../../../../services';
import { AuthError } from '../../middleware';
import { BaseModel } from '../base';

@Table({
  modelName: 'alias',
  paranoid: true,
  timestamps: true,
})
export class Alias<
    A extends AliasAttributes = AliasAttributes,
    B extends AliasCreationAttributes = AliasCreationAttributes,
  >
  extends BaseModel<A, B>
  implements AliasAttributes {

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  declare userId: number;
  
  @Index({
    name: 'aliases_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
  declare type: AliasType;
  
  @Index({
    name: 'aliases_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
  declare value: string;
  
  @Column({
    defaultValue: 0, 
    type: DataType.INTEGER,
  })
  declare priority: number;

  @Index({
    name: 'aliases_verificationCode_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({ type: DataType.STRING })
  declare verificationCode: string;
    
  @Column({ type: DataType.DATE })
  declare verificationExpiresAt: Date;

  @Column({ type: DataType.DATE })
  declare verifiedAt: Date;
    
  public static async from(payload: AliasPayload, opts?: FindAliasOptions): Promise<Alias> {

    // Resolve from JWT
    if (payload.jwt) {
      const jwt = new JWT(payload.jwt);
      const { userId } = jwt;
      const alias = await Alias.findOne({ where: { userId } });
      return alias;
    }

    // Resolve from a third-party token
    if (payload.thirdParty) {      
      if (payload.thirdParty.name === 'apple') {
        const claims = await appleSignin.verifyIdToken(payload.thirdParty.credential);
        const { email, email_verified: emailVerified } = claims;
        let alias: Alias;
        if (email && emailVerified) {
          alias = await Alias.findOne({ where: { type: 'email', value: email } });
        } if (!alias) {
          alias = await Alias.findOne({ where: { type: 'thirdParty/google', value: claims.sub } });
        } 
        return alias;
      } else
      if (payload.thirdParty.name === 'google') {
        const ticket = await GoogleService.verify(payload.thirdParty.credential);
        const {
          email, email_verified: emailVerified, sub: thirdPartyId, 
        } = ticket.getPayload();
        let alias: Alias;
        if (email && emailVerified) {
          alias = await Alias.findOne({ where: { type: 'email', value: email } });
        } if (!alias) {
          alias = await Alias.findOne({ where: { type: 'thirdParty/google', value: thirdPartyId } });
        } 
        return alias;
      } else {
        throw new AuthError('BAD_REQUEST');
      }
    }

    // Resolve from OTP
    if (payload.otp) {
      const otp = await Credential.findOne({
        where: {
          type: opts?.deleteAccount ? 'deleteToken' : 'otp',
          value: payload.otp,
        },
      });
      if (!otp) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      const alias = await Alias.findOne({ where: { userId: otp.userId } });
      if (!alias && !opts?.ignoreIfNotResolved) {
        throw new AuthError('UNKNOWN_ALIAS', { alias: 'otp' });
      }
      return alias;
    } 
    
    // Resolve from email, phone, or username
    if (payload.email || payload.phone || payload.username) {
      const type = payload.email ? 'email' : payload.phone ? 'phone' : 'username';
      let alias: Alias;
      if (opts?.skipVerification) {
        alias = await Alias.findOne({
          where: {
            type,
            value: payload[type],
          },
        });
      } else {
        alias = await Alias.findOne({ 
          where: {
            type,
            value: payload[type],
            verifiedAt: { [Op.ne]: null },
          },
        });
      }
      if (!alias && !opts?.ignoreIfNotResolved) {
        throw new AuthError('UNKNOWN_ALIAS', { alias: type });
      }
      return alias;
    }

    if (!opts?.ignoreIfNotResolved) {
      throw new AuthError('UNKNOWN_ALIAS');
    }
    
    return undefined;
  }

}

