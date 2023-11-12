import jwt from 'jsonwebtoken';
import ms from 'ms';

import { AuthError } from '../../middleware';
import { Credential, User } from '../../schema';

export type JwtBaseAccessOperation = '*' | 'has' | 'read' | 'write' | 'delete';
export type JwtAccessOperation = JwtBaseAccessOperation | `deny.${JwtBaseAccessOperation}`;

export const JWT_REFERSH_THRESHOLD_MS = ms(process.env.JWT_REFERSH_THRESHOLD || '100y');

export type JsonWebToken = {
  userId: number;
  scope: string[];
  priority: number;
  createdAt: Date;
  expiresIn: string;
  refreshable: boolean;
  defaultsTo: string;
  signed: string;
};

export type WrappedJwt = {
  userId: number;
  priority: number;
  createdAt: number;
  expiresAt: number;
  signed: string;
};

export type JwtRequest = {
  jwt?: string;
};

export type JwtResponse = {
  userId: number;
  token?: WrappedJwt;
};

export class JWT implements JsonWebToken {

  userId: number; 
  scope: string[];
  priority: number;
  createdAt: Date;
  expiresIn: string;
  refreshable = false;
  defaultsTo = 'standard';
  signed: string;

  get wrapped(): WrappedJwt {
    return {
      createdAt: this.createdAt.valueOf(),
      expiresAt: new Date(this.createdAt.valueOf() + ms(this.expiresIn)).valueOf(),
      priority: this.priority,
      signed: this.signed,
      userId: this.userId,
    };
  }

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
  
  static from(token: string | Partial<JsonWebToken>) {
    return new JWT(token);
  }

  static async as(role: string, userId: number) {
    const user = await User.findOne({ where: { id: userId } });
    const roles = await user.getRoles();
    const rbac = roles[role];
    if (!rbac) {
      throw new AuthError('INSUFFICIENT_PERMISSIONS');
    }
    return new JWT({
      defaultsTo: rbac.defaultsTo,
      expiresIn: rbac.lifetime,
      priority: rbac.priority,
      refreshable: rbac.refreshable,
      scope: rbac.scope,
      userId,
    });
  }

  constructor(opts: string | Partial<JsonWebToken>) {
    try {
      if (typeof opts === 'string') {
        const { 
          userId,
          scope, 
          priority,
          createdAt,
          expiresIn,
          refreshable,
          defaultsTo,
        } = jwt.verify(opts, process.env.JWT_SECRET) as JWT;
        if (!userId || !scope) {
          throw new AuthError('INVALID_CREDENTIALS');
        }
        this.userId = userId;
        this.scope = scope;
        this.priority = priority;
        this.createdAt = createdAt;
        this.expiresIn = expiresIn;
        this.refreshable = refreshable;
        this.defaultsTo = defaultsTo;
        this.signed = opts;
      } else {
        const {
          userId,
          scope = [],
          priority = 0,
          expiresIn = '1d',
          refreshable,
          defaultsTo = 'standard',
        } = opts;
        const createdAt = new Date();
        this.userId = userId;
        this.scope = scope;
        this.priority = priority;
        this.createdAt = createdAt;
        this.expiresIn = expiresIn;
        this.refreshable = refreshable;
        this.defaultsTo = defaultsTo;
        this.signed = jwt.sign({
          createdAt,
          defaultsTo,
          expiresIn,
          priority,
          refreshable,
          scope,
          userId,
        }, process.env.JWT_SECRET, { expiresIn: this.expiresIn });
      } 
    } catch (e) {
      console.log(e);
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
  
  public async validate(refresh?: boolean) {
    let expired = false;
    let refreshed: JWT;
    if (this.expired) {
      expired = true;
      await Credential.destroy({
        where: {
          type: 'jwt',
          userId: this.userId,
          value: this.signed,
        },
      });
    } 
    const credential = await Credential.findOne({
      where: {
        type: 'jwt',
        userId: this.userId,
        value: this.signed,
      },
    });
    if (!credential || credential.toJSON().expiresAt < new Date()) {
      expired = true;
      await credential?.destroy();
    }
    if (refresh && !expired && this.refreshable && this.expiresSoon) {
      refreshed = await this.refresh();
    }
    return {
      expired,
      refreshed,
    };
  }

  public async refresh() {
    const user = await User.findOne({ where: { id: this.userId } });
    if (!user) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    const credential = await user.findCredential('jwt', this.signed);
    if (!credential) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    if (credential.toJSON().expiresAt < new Date()) {
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    await credential.destroy();
    let token: JWT;
    if (!this.refreshable) {
      token = await JWT.as(this.defaultsTo, this.userId);
    } else {
      token = new JWT({
        expiresIn: this.expiresIn,
        priority: this.priority,
        refreshable: true,
        scope: this.scope,
        userId: this.userId,
      });
    }
    await user.createCredential('jwt', token);
    return token;
  }

}

