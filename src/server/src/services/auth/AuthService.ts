import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import web3 from 'web3';

import { AliasType } from '../../api/v1/schema/types';
import { BaseService } from '../base';
import { GoogleService } from '../google';
import {
  AliasOptions, AliasTicket, AuthError, AuthenticationOptions, AuthenticationResponse, LoginOptions, LoginResponse, RegistrationOptions 
} from './types';
import {
  Credential, User, UserAlias 
} from '../../api/v1/schema/models';

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
  ): Promise<UserAlias> {
    if (typeof alias.payload !== 'string') {
      if (alias.payload.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(alias.payload.credential);
        const email = (
          await google.getProfile(ticket, { access_token: alias.payload.credential, })
        ).emailAddress;
        if (!email) {
          throw new AuthError('Google account does not have an email address');
        }
        return await this.resolveAlias({
          type: 'email',
          payload: email,
        });
      }
    } else {
      return await UserAlias.findOne({
        where: {
          type: alias.type,
          value: alias.payload,
        },
      });
    }
  }

  public async resolveUserByAlias<T extends AliasType>(
    alias: AliasTicket<T> | UserAlias,
  ) {
    const userAlias =
      alias instanceof AliasTicket
        ? (await this.resolveAlias(alias))?.toJSON()
        : alias;
    if (userAlias) {
      return await User.findOne({ where: { id: userAlias.userId, }, });
    }
    throw new AuthError('Unable to find a user with the specified payload');
  }

  public async resolveUser(opts: Partial<AliasOptions>) {
    const alias = this.parseAlias(opts);
    const user = await this.resolveUserByAlias(alias);
    return {
      alias,
      user,
    };
  }

  public async resolveUserAsJson(opts: Partial<AliasOptions>) {
    const { alias, user } = await this.resolveUser(opts);
    return {
      alias,
      user: user?.toJSON(),
    };
  }

  public async login({
    email,
    eth2Address,
    username,
    thirdParty,
    password,
  }: Partial<LoginOptions>): Promise<LoginResponse> {
    const aliases = {
      email,
      eth2Address,
      username,
      thirdParty,
    };
    const { alias, user } = (await this.resolveUserAsJson(aliases));
    if (alias.type === 'eth2Address') {
      // auth by eth2Address
      console.log(web3);
    } else if (alias.type === 'thirdParty') {
      // auth by thirdParty
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
        throw new AuthError(
          'User does not have a password set. Please use a third party login method or request OTP.',
        );
      }
      if (!bcrypt.compareSync(password, credential.value)) {
        throw new AuthError('Password is incorrect');
      }
    }
    // user is authenticated, generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: JWT_TOKEN_LIFETIME, });
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

  public async register({
    email,
    eth2Address,
    username,
    thirdParty,
    password,
  }: Partial<RegistrationOptions>) {
    const alias = this.parseAlias({
      email,
      eth2Address,
      username,
      thirdParty,
    });
    const user = (await this.resolveUserByAlias(alias))?.toJSON();
    if (user) {
      throw new AuthError('User already exists');
    }
    let newAliasValue: string;
    if (typeof alias.payload !== 'string') {
      if (alias.payload.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(alias.payload.credential);
        const email = (
          await google.getProfile(ticket, { access_token: alias.payload.credential, })
        ).emailAddress;
        if (!email) {
          throw new AuthError('Google account does not have an email address');
        }
        const user = (
          await this.resolveUserByAlias({
            type: 'email',
            payload: email,
          })
        )?.toJSON();
        if (user) {
          throw new AuthError('User already exists');
        }
        newAliasValue = email;
      }
    } else {
      newAliasValue = alias.payload;
    }
    const newUser = new User();
    await newUser.save();
    const newAlias = new UserAlias({
      userId: newUser.id,
      type: alias.type,
      value: newAliasValue,
    });
    await newAlias.save();
    if (password) {
      const newCredential = new Credential({
        userId: newUser.id,
        type: 'password',
        value: bcrypt.hashSync(password, 10),
      });
      await newCredential.save();
    }
    return { userId: newUser.id, };
  }

  public async authenticate({
    email,
    eth2Address,
    username,
    password,
    thirdParty,
    jwt,
  }: Partial<AuthenticationOptions>): Promise<AuthenticationResponse> {
    const credential = (
      await Credential.findOne({
        where: {
          type: 'jwt',
          value: jwt,
        },
      })
    )?.toJSON();
    if (!credential) {
      throw new AuthError('JWT is invalid');
    }
    if (new Date() > new Date(credential.expiresOn)) {
      await Credential.destroy({ where: { id: credential.id } });
      throw new AuthError('JWT has expired');
    }
    return { userId: credential.userId, };
  }
}
