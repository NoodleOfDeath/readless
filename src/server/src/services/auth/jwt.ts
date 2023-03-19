import jwt from 'jsonwebtoken';
import ms from 'ms';

import { ResourceType } from './../../api/v1/schema/types';
import { AuthError } from './AuthError';
import { User } from '../../api/v1/schema';

export type JwtScope = 'god' | 'default' | 'account' | `${ResourceType}.${number}`;
export type JwtBaseAccess = 'read' | 'write' | 'delete';
export type JwtAccess = JwtBaseAccess | `deny.${JwtBaseAccess}`;

export const JWT_LIFETIMES = {
  account: '15m',
  default: '1d',
} as const;

export const JWT_SCOPES = {
  account: ['account'] as JwtScope[],
  default: ['default'] as JwtScope[],
} as const;

export const JWT_REFERSH_AGE = ms('1d');

export type JwtOptions = {
  userId: number;
  scope?: JwtScope[];
  access?: JwtAccess[];
  expiresIn?: string;
  refreshable?: boolean;
  autoSign?: boolean;
}

export class Jwt {

  userId: number;
  scope: JwtScope[];
  access: JwtAccess[];
  expiresIn: string;
  refreshable?: boolean;
  signed: string;

  expired() {
    const { exp } = jwt.decode(this.signed) as { exp: number };
    return exp < Date.now() / 1000;
  }

  expiresSoon() {
    const { exp } = jwt.decode(this.signed) as { exp: number };
    return exp < Date.now() / 1000 + 60 * 60 * 24;
  }

  static Default(userId: number) {
    return new Jwt({
      access: ['read', 'write'],
      expiresIn: JWT_LIFETIMES.default,
      refreshable: true,
      scope: JWT_SCOPES.default,
      userId,
    });
  }

  static Account(userId: number) {
    return new Jwt({
      access: ['read', 'write'],
      expiresIn: JWT_LIFETIMES.account,
      scope: JWT_SCOPES.account,
      userId,
    });
  }

  constructor({
    userId,
    scope: scopes = [],
    access = [],
    expiresIn = JWT_LIFETIMES.default,
    refreshable,
    autoSign = true,
  }: JwtOptions) {
    this.userId = userId;
    this.scope = scopes;
    this.access = access;
    this.expiresIn = expiresIn;
    this.refreshable = refreshable;
    if (autoSign) {
      this.signed = jwt.sign({
        access,
        expiresIn,
        refreshable,
        scopes,
        userId,
      }, process.env.JWT_SECRET, { expiresIn: this.expiresIn });
    }
  }

  public can(access: JwtBaseAccess, scope: JwtScope) {
    if (scope.includes('god')) {
      return true;
    }
    if (this.access.includes(`deny.${access}`)) {
      return false;
    }
    return this.access.includes(access) && this.scope.includes(scope);
  }

  public async refresh() {
    if (!this.refreshable) {
      throw new AuthError('UNREFRESHABLE_JWT');
    }
    const user = await User.findByPk(this.userId);
    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    const credential = await user.findCredential('jwt');
    if (!credential) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    await credential.destroy();
    const token = Jwt.Default(this.userId);
    await user.createCredential('jwt', token);
    return token;
  }

}