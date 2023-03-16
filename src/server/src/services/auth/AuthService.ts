import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import web3 from 'web3';

import { AliasType } from '../../api/v1/schema/types';
import { AuthError } from './AuthError';
import { BaseService } from '../base';
import { GoogleService } from '../google';
import {
  Alias, Credential,  User, 
} from '../../api/v1/schema/models';
import {
  AliasOptions, AliasTicket, AuthenticationOptions, AuthenticationResponse, LoginOptions, LoginResponse, LogoutOptions, LogoutResponse, RegistrationOptions, RegistrationResponse,
} from './types';

const JWT_TOKEN_LIFETIME = '1d';

export class AuthService extends BaseService {

  public parseAlias({
    email,
    eth2Address,
    username,
    thirdParty,
  }: Partial<AliasOptions>) {
    const type = email
      ? 'email': username
        ? 'username'
        : eth2Address
          ? 'eth2Address'
          : 'thirdParty';
    const payload = email || username || eth2Address || thirdParty;
    return new AliasTicket({
      type,
      payload,
    });
  }

  public async resolveAlias<T extends AliasType>(
    alias: AliasTicket<T>, 
  ): Promise<Alias> {
    if (typeof alias.payload !== 'string') {
      if (alias.payload.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(alias.payload.credential);
        const { email, email_verified: emailVerified } = ticket.getPayload();
        if (!email) {
          throw new AuthError('NO_THIRD_PARTY_ALIAS');
        }
        if (!emailVerified) {
          throw new AuthError('THIRD_PARTY_ALIAS_NOT_VERIFIED');
        }
        return await this.resolveAlias({
          type: 'email',
          payload: email,
        });
      }
    } else {
      return await Alias.findOne({
        where: {
          type: alias.type,
          value: alias.payload,
        },
      });
    }
  }

  public async resolveUserByAlias<T extends AliasType>(
    alias: AliasTicket<T> | Alias,
    throwIfNotFound = true,
  ) {
    const userAlias =
      alias instanceof AliasTicket
        ? (await this.resolveAlias(alias))?.toJSON()
        : alias;
    if (userAlias) {
      return await User.findOne({ where: { id: userAlias.userId } });
    }
    if (throwIfNotFound) {
      throw new AuthError('UNKNOWN_ALIAS');
    }
  }

  public async resolveUser(opts: Partial<AliasOptions>, throwIfNotFound = true) {
    const alias = this.parseAlias(opts);
    const user = await this.resolveUserByAlias(alias, throwIfNotFound);
    return {
      alias,
      user,
    };
  }

  public async resolveUserAsJson(opts: Partial<AliasOptions>, throwIfNotFound = true) {
    const { alias, user } = await this.resolveUser(opts, throwIfNotFound);
    return {
      alias,
      user: user?.toJSON(),
    };
  }

  public async login(opts: Partial<LoginOptions>): Promise<LoginResponse> {
    const { alias, user } = (await this.resolveUserAsJson(opts));
    if (alias.type === 'eth2Address') {
      // auth by eth2Address
      console.log(web3);
    } else if (alias.type === 'thirdParty') {
      // auth by thirdParty
      await Credential.upsert(
        {
          userId: user.id,
          type: [alias.type, opts.thirdParty?.name].join('/'),
          value: opts.thirdParty?.credential,
        },
      );
    } else {
      // auth by password
      const credential = (
        await Credential.findOne({
          where: {
            userId: user.id,
            type: 'password',
          },
        })
      )?.toJSON();
      if (!credential) {
        throw new AuthError('MISSING_PASSWORD');
      }
      if (!bcrypt.compareSync(opts.password, credential.value)) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
    }
    // user is authenticated, generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_TOKEN_LIFETIME });
    const newToken = new Credential({
      userId: user.id,
      type: 'jwt',
      value: token,
      expiresOn: new Date(Date.now() + ms(JWT_TOKEN_LIFETIME)),
    });
    await newToken.save();
    return {
      userId: user.id,
      jwt: token,
    };
  }

  public async register(opts: Partial<RegistrationOptions>): Promise<RegistrationResponse> {
    const { alias, user } = (await this.resolveUserAsJson(opts, false));
    if (user) {
      throw new AuthError('DUPLICATE_USER');
    }
    let newAliasType: AliasType;
    let newAliasValue: string;
    let verified = false;
    if (typeof alias.payload !== 'string') {
      if (alias.payload.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(alias.payload.credential);
        const { email, email_verified: emailVerified } = ticket.getPayload();
        if (!email) {
          throw new AuthError('NO_THIRD_PARTY_ALIAS');
        }
        if (!emailVerified) {
          throw new AuthError('THIRD_PARTY_ALIAS_NOT_VERIFIED');
        }
        newAliasType = 'email';
        newAliasValue = email;
        verified = true;
      }
    } else {
      newAliasType = alias.type;
      newAliasValue = alias.payload;
    }
    const newUser = new User();
    await newUser.save();
    const newAlias = new Alias({
      userId: newUser.id,
      type: newAliasType,
      value: newAliasValue,
      verifiedOn: verified ? new Date() : undefined,
    });
    await newAlias.save();
    if (opts.password) {
      const newCredential = new Credential({
        userId: newUser.id,
        type: 'password',
        value: bcrypt.hashSync(opts.password, 10),
      });
      await newCredential.save();
    }
    if(verified) {
      return await this.login(opts);
    };
    return { userId: newUser.id };
  }

  public async logout({ userId }: Partial<LogoutOptions>): Promise<LogoutResponse> {
    await Credential.destroy({ where: { userId } });
    return { success: true };
  }

  public async authenticate(opts: Partial<AuthenticationOptions>): Promise<AuthenticationResponse> {
    const credential = (
      await Credential.findOne({
        where: {
          type: 'jwt',
          value: opts.jwt,
        },
      })
    )?.toJSON();
    if (!credential) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    if (new Date() > new Date(credential.expiresOn)) {
      await Credential.destroy({ where: { id: credential.id } });
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    return { userId: credential.userId };
  }

}
