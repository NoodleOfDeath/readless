import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import {
  Column,
  DataType,
  Index,
  Table,
} from 'sequelize-typescript';

import {
  ALIAS_TYPES,
  AliasAttributes,
  AliasCreationAttributes,
  AliasPayload,
  AliasType,
  FindAliasOptions,
  ThirdPartyAuth,
} from './alias.types';
import { AuthError, GoogleService } from '../../../../services';
import { Jwt } from '../../../../services/types';
import { Credential } from '../auth/credential.model';
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
    userId: number;
  
  @Index({
    name: 'aliases_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING,
  })
    type: AliasType;
  
  @Index({
    name: 'aliases_type_value_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({
    allowNull: false,
    type: DataType.STRING(2083),
  })
    value: string;

  @Index({
    name: 'aliases_verificationCode_unique_key',
    unique: true,
    where: { deletedAt: null },
  })
  @Column({ type: DataType.STRING })
    verificationCode: string;
    
  @Column({ type: DataType.DATE })
    verificationExpiresAt: Date;

  @Column({ type: DataType.DATE })
    verifiedAt: Date;
    
  public static parsePayload(payload: Partial<AliasPayload>): AliasPayload {
    let type: AliasType = payload.type;
    let value: string | ThirdPartyAuth = payload.value;
    Object.values(ALIAS_TYPES).forEach((aliasType) => {
      if (payload[aliasType]) {
        type = aliasType;
        value = payload[aliasType];
      }
    });
    return {
      type,
      value,
    };
  }
    
  public static async from(req: Partial<AliasPayload>, opts?: FindAliasOptions): Promise<{alias: Alias, payload: AliasPayload, jwt?: Jwt, otp?: Credential}> {
    const payload = Alias.parsePayload(req);
    if (payload.type === 'thirdParty' && typeof payload.value !== 'string') {
      if (payload.value.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(payload.value.credential);
        const {
          email, email_verified: emailVerified, sub: thirdPartyId, 
        } = ticket.getPayload();
        if (!email) {
          throw new AuthError('NO_THIRD_PARTY_ALIAS');
        }
        if (!emailVerified) {
          throw new AuthError('THIRD_PARTY_ALIAS_NOT_VERIFIED');
        }
        return await this.from({
          type: `thirdParty/${payload.value.name}`,
          value: thirdPartyId,
        }, opts);
      }
    } else if (payload.type === 'jwt' && typeof payload.value === 'string') {
      const token = jwt.verify(payload.value, process.env.JWT_SECRET) as Jwt;
      if (typeof token !== 'object') {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      const alias = await Alias.findOne({ where: { userId: token.userId } });
      if (!alias && !opts?.ignoreIfNotResolved) {
        throw new AuthError('UNKNOWN_ALIAS', { alias: payload.type });
      }
      return {
        alias, jwt: token, payload, 
      };
    } else if (payload.type === 'otp' && typeof payload.value === 'string') {
      const otp = await Credential.findOne({
        where: {
          type: 'otp',
          value: payload.value,
        },
      });
      if (!otp) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      const alias = await Alias.findOne({ where: { userId: otp.toJSON().userId } });
      if (!alias && !opts?.ignoreIfNotResolved) {
        throw new AuthError('UNKNOWN_ALIAS', { alias: payload.type });
      }
      return {
        alias, otp, payload, 
      };
    } else {
      const alias = await Alias.findOne({ 
        where: {
          type: payload.type,
          value: payload.value,
          verifiedAt: opts?.skipVerification ? undefined : { [Op.ne]: null },
        },
      });
      if (!alias && !opts?.ignoreIfNotResolved) {
        throw new AuthError('UNKNOWN_ALIAS', { alias: payload.type });
      }
      return { alias, payload };
    }
  }

}