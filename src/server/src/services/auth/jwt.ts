import jwt from 'jsonwebtoken';
import ms from 'ms';

import { AuthError } from './AuthError';
import { User } from '../../api/v1/schema';

export type JwtBaseAccessOperation = '*' | 'read' | 'write' | 'delete';
export type JwtAccessOperation = JwtBaseAccessOperation | `deny.${JwtBaseAccessOperation}`;

export const JWT_REFERSH_THRESHOLD_MS = ms(process.env.JWT_REFERSH_THRESHOLD || '6h');

export type JsonWebToken = {
  userId: number;
  scope: string[];
  priority: number;
  createdAt: Date;
  expiresIn: string;
  refreshable: boolean;
  signed: string;
}

export type JwtOptions = {
  userId: number;
  scope?: string[];
  priority?: number;
  expiresIn?: string;
  refreshable?: boolean;
};

export class Jwt implements JsonWebToken {

  userId: number;
  scope: string[];
  priority: number;
  createdAt: Date;
  expiresIn: string;
  refreshable = false;
  signed: string;

  get expired() {
    const { exp } = jwt.decode(this.signed) as { exp: number };
    return exp < Date.now() / 1_000;
  }

  get expiresSoon() {
    const { exp } = jwt.decode(this.signed) as { exp: number };
    return exp < (Date.now() + JWT_REFERSH_THRESHOLD_MS) / 1_000;
  }

  get scopedAccess() {
    return this.scope.map((scope) => {
      const [role, operation] = scope.split(':') as [string, JwtAccessOperation];
      return {
        operation,
        role,
      };
    });
  }
  
  static from(token: string | JwtOptions) {
    return new Jwt(token);
  }

  static async as(role: string, userId: number) {
    const user = await User.findOne({ where: { id: userId } });
    const roles = await user.getRoles();
    const defaults = roles[role];
    if (!defaults) {
      throw new AuthError('INSUFFICIENT_PERMISSIONS');
    }
    return new Jwt({
      expiresIn: defaults.lifetime,
      priority: defaults.priority,
      refreshable: defaults.refreshable,
      scope: defaults.scope,
      userId,
    });
  }

  constructor(opts: string | JwtOptions) {
    try {
      if (typeof opts === 'string') {
        const { 
          userId, 
          scope, 
          priority,
          createdAt,
          expiresIn,
          refreshable,
        } = jwt.verify(opts, process.env.JWT_SECRET) as Jwt;
        if (!userId || !scope) {
          throw new AuthError('INVALID_CREDENTIALS');
        }
        this.userId = userId;
        this.scope = scope;
        this.priority = priority;
        this.createdAt = createdAt;
        this.expiresIn = expiresIn;
        this.refreshable = refreshable;
        this.signed = opts;
      } else {
        const {
          userId,
          scope = [],
          priority = 0,
          expiresIn = '1d',
          refreshable,
        } = opts;
        const createdAt = new Date();
        this.userId = userId;
        this.scope = scope;
        this.priority = priority;
        this.createdAt = createdAt;
        this.expiresIn = expiresIn;
        this.refreshable = refreshable;
        this.signed = jwt.sign({
          createdAt,
          expiresIn,
          priority,
          refreshable,
          scope,
          userId,
        }, process.env.JWT_SECRET, { expiresIn: this.expiresIn });
      } 
    } catch (e) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
  }

  public canAccess(requestedScope: string | string[]) {
    if (typeof requestedScope === 'string') {
      const [requesetedRole, requestedOperation] = requestedScope.split(':') as [string, JwtBaseAccessOperation];
      for (const { operation, role } of this.scopedAccess) {
        if (operation === `deny.${requestedOperation}`) {
          return false;
        }
        if ((role === requesetedRole || role === 'god') && (operation === requestedOperation || operation === '*')) {
          return true;
        }
      }
      return false;
    } else {
      return requestedScope.every((scope) => this.canAccess(scope));
    }
  }

  public async refresh() {
    if (!this.refreshable) {
      throw new AuthError('UNREFRESHABLE_JWT');
    }
    const user = await User.findByPk(this.userId);
    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    const credential = await user.findCredential('jwt', this.signed);
    if (!credential) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    if (credential.toJSON().expiresAt?.valueOf() < Date.now()) {
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    await credential.destroy();
    const token = new Jwt({
      expiresIn: this.expiresIn,
      priority: this.priority,
      refreshable: true,
      scope: this.scope,
      userId: this.userId,
    });
    await user.createCredential('jwt', token);
    return token;
  }

}

