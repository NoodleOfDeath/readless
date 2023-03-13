import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { BaseService } from '../base';
import { Credential, User, UserAlias } from '../../api/v1/schema';

export type ResolveUserOptions = {
  aliasType: string;
  alias: string;
};

export type LoginOptions = {
  email: string;
  eth2address: string;
  username: string;
  thirdParty: string;
  thirdPartyToken: string;
  password: string;
};

export type RegistrationOptions = {
  email: string;
  eth2address: string;
  username: string;
  thirdParty: string;
  thirdPartyToken: string;
  password: string;
};

export type LoginResponse = {
  id: number;
  jwt: string;
};

export type RegistrationResponse = number;

export class AuthService extends BaseService {
  constructor() {
    super();
  }

  public parseAlias({
    email,
    eth2address,
    username,
    thirdParty,
    thirdPartyToken,
  }: Partial<LoginOptions> & Partial<RegistrationOptions>): {
    aliasType: string;
    alias: string;
  } {
    const aliasType = email ? 'email' : username ? 'username' : 'eth2address';
    const alias = email || username || eth2address;
    return {
      aliasType,
      alias,
    };
  }

  public async resolveAlias({
    aliasType,
    alias,
  }: Partial<ResolveUserOptions>): Promise<UserAlias> {
    return UserAlias.findOne({
      where: {
        type: aliasType,
        value: alias,
      },
    });
  }

  public async resolveUser({
    aliasType,
    alias,
  }: Partial<ResolveUserOptions>): Promise<User> {
    const userAlias = (await this.resolveAlias({ aliasType, alias }))?.toJSON();
    if (userAlias) {
      return await User.findOne({
        where: {
          id: userAlias.userId,
        },
      });
    }
  }

  public async login({
    email,
    eth2address,
    username,
    thirdParty,
    thirdPartyToken,
    password,
  }: Partial<LoginOptions>): Promise<LoginResponse> {
    const { aliasType, alias } = this.parseAlias({
      email,
      eth2address,
      username,
      thirdParty,
      thirdPartyToken,
    });
    const user = (await this.resolveUser({ aliasType, alias }))?.toJSON();
    if (aliasType === 'eth2address') {
      // auth by eth2address
    } else if (thirdParty && thirdPartyToken) {
      // auth by third party
    } else {
      // auth by password
      const credential = (await Credential.findOne({
        where: {
          userId: user.id,
          type: 'password',
        },
      }))?.toJSON();
      if (!credential) {
        throw new Error(
          'User dont have no not password does not exist for user account',
        );
      }
      if (!bcrypt.compareSync(password, credential.value)) {
        throw new Error('Password is incorrect');
      }
    }
    // user is authenticated, generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    const newToken = new Credential({
      userId: user.id,
      type: 'jwt',
      value: token,
      expiresOn: new Date(Date.now() + 1_000 * 60 * 60 * 24),
    });
    await newToken.save();
    return {
      id: user.id,
      jwt: token,
    };
  }

  public async register({
    email,
    eth2address,
    username,
    password,
  }: Partial<RegistrationOptions>): Promise<RegistrationResponse> {
    const { aliasType, alias } = this.parseAlias({
      email,
      eth2address,
      username,
    });
    const user = (await this.resolveUser({ aliasType, alias }))?.toJSON();
    if (user) {
      throw new Error('User already exists');
    }
    const newUser = new User();
    await newUser.save();
    const newAlias = new UserAlias({
      userId: newUser.id,
      type: aliasType,
      value: alias,
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
    return newUser.id;
  }

  public async validateJsonWebToken({
    jwt
  }: {jwt: string}) {
    const credential = (await Credential.findOne({
      where: {
        type: 'jwt',
        value: jwt,
      },
    }))?.toJSON();
    if (!credential) {
      throw new Error('JWT is invalid');
    }
    if (new Date() > new Date(credential.expiresOn)) {
      await Credential.destroy({ where: { id: credential.id } });
      throw new Error('JWT has expired');
    }
    return credential.userId;
  }
  
}
