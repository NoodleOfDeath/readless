import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import { Op } from 'sequelize';
import web3 from 'web3';

import { AuthError } from './AuthError';
import {
  AliasOptions,
  AliasProbe,
  AuthenticationOptions,
  AuthenticationResponse,
  LoginOptions,
  LoginResponse,
  LogoutOptions,
  LogoutResponse,
  RegistrationOptions,
  RegistrationResponse,
  VerifyAliasOptions,
  VerifyAliasResponse,
} from './types';
import {
  Alias,
  Credential,
  User,
} from '../../api/v1/schema/models';
import { AliasType } from '../../api/v1/schema/types';
import { BaseService } from '../base';
import { GoogleService } from '../google';
import { MailService } from '../mail';

const JWT_TOKEN_LIFETIME = '1d';
const VERIFICATION_CODE_LENGTH = 10;

type JwtPayloadOptions = {
  userId: number;
  scopes?: string[];
  permissions?: {
    resourceType: string;
    resourceId: number;
    access: string;
  }[];
}

class JwtPayload {

  userId: number;
  scopes?: string[];
  permissions?: {
    resourceType: string;
    resourceId: number;
    access: string;
  }[];
  constructor({
    userId,
    scopes,
    permissions,
  }: JwtPayloadOptions) {
    this.userId = userId;
    this.scopes = scopes;
    this.permissions = permissions;
  }

  toJSON() {
    return {
      userId: this.userId,
      scopes: this.scopes,
      permissions: this.permissions,
    };
  }

}

async function generateVerificationCode(): Promise<string> {
  const verificationCode = Math.random().toString(36).substring(2, 2 + VERIFICATION_CODE_LENGTH);
  if (await Alias.findOne({ where: { verificationCode } }) !== null) {
    return generateVerificationCode();
  }
  return verificationCode;
}

export class AuthService extends BaseService {

  public parseProbe({
    email,
    eth2Address,
    username,
    thirdParty,
  }: Partial<AliasOptions>, 
  other?: Partial<AliasProbe>,
  ): AliasProbe {
    const type = email
      ? 'email': username
        ? 'username'
        : eth2Address
          ? 'eth2Address'
          : 'thirdParty';
    const payload = email || username || eth2Address || thirdParty;
    return {
      type,
      payload,
      ...other,
    };
  }

  public async resolveAlias(probe: AliasProbe): Promise<Alias> {
    if (typeof probe.payload !== 'string') {
      if (probe.payload.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(probe.payload.credential);
        const { email, email_verified: emailVerified } = ticket.getPayload();
        if (!email) {
          throw new AuthError('NO_THIRD_PARTY_ALIAS');
        }
        if (!emailVerified) {
          throw new AuthError('THIRD_PARTY_ALIAS_NOT_VERIFIED');
        }
        return await this.resolveAlias({
          ...probe,
          type: 'email',
          payload: email,
        });
      }
    } else {
      return await Alias.findOne({ 
        where: {
          type: probe.type,
          value: probe.payload,
          verifiedAt: probe.skipVerification ? undefined : { [Op.ne]: null },
        },
      });
    }
  }

  public async resolveUserByAlias(probe: AliasProbe | Alias) {
    const alias =
      probe instanceof Alias
        ? probe
        : (await this.resolveAlias(probe))?.toJSON();
    if (alias) {
      return await User.findOne({ where: { id: alias.userId } });
    } else if (!(probe instanceof Alias) && probe.failIfNotResolved) {
      throw new AuthError('INVALID_PASSWORD');
    }
  }

  public async resolveUser(opts: Partial<AliasOptions>, other?: Partial<AliasProbe>) {
    const probe = this.parseProbe(opts, other);
    const user = await this.resolveUserByAlias(probe);
    return {
      probe,
      user,
    };
  }

  public async resolveUserAsJson(opts: Partial<AliasOptions>, other?: Partial<AliasProbe>) {
    const { probe, user } = await this.resolveUser(opts, other);
    return {
      probe,
      user: user?.toJSON(),
    };
  }

  public async login(opts: Partial<LoginOptions>): Promise<LoginResponse> {
    const { probe, user } = await this.resolveUserAsJson(opts, { failIfNotResolved: true });
    if (probe.type === 'eth2Address') {
      // auth by eth2Address
      console.log(web3);
    } else if (probe.type === 'thirdParty') {
      // auth by thirdParty
      await Credential.upsert(
        {
          userId: user.id,
          type: [probe.type, opts.thirdParty?.name].join('/'),
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
        throw new AuthError('INVALID_PASSWORD');
      }
    }
    // user is authenticated, generate JWT
    const token = jwt.sign(new JwtPayload({ userId: user.id }).toJSON(), process.env.JWT_SECRET, { expiresIn: JWT_TOKEN_LIFETIME });
    return {
      userId: user.id,
      jwt: token,
    };
  }

  public async register(opts: Partial<RegistrationOptions>): Promise<RegistrationResponse> {
    const { probe, user } = await this.resolveUserAsJson(opts, { failIfNotResolved: false });
    if (user) {
      throw new AuthError('DUPLICATE_USER');
    }
    let newAliasType: AliasType;
    let newAliasValue: string;
    let verificationCode: string;
    let verified = false;
    if (typeof probe.payload !== 'string') {
      if (probe.payload.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(probe.payload.credential);
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
      newAliasType = probe.type;
      newAliasValue = probe.payload;
    }
    const newUser = new User();
    await newUser.save();
    if (!verified) {
      verificationCode = await generateVerificationCode();
    }
    const newAlias = new Alias({
      userId: newUser.id,
      type: newAliasType,
      value: newAliasValue,
      verificationCode,
      verificationExpiresAt: verified ? undefined : new Date(Date.now() + ms('20m')),
      verifiedAt: verified ? new Date() : undefined,
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
    } else {
      const mailer = new MailService();
      mailer.sendMail({ to: newAliasValue }, 'verify', {
        email: newAliasValue,
        verificationCode,
      });
      return { userId: newUser.id };
    }
  }

  public async logout({ userId }: Partial<LogoutOptions>): Promise<LogoutResponse> {
    await Credential.destroy({ where: { userId } });
    return { success: true };
  }

  public async authenticate(opts: Partial<AuthenticationOptions>): Promise<AuthenticationResponse> {
    const payload = jwt.verify(opts.jwt, process.env.JWT_SECRET) as JwtPayload;
    if (!payload) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    return { userId: payload.userId };
  }

  public async verifyAlias(opts: Partial<VerifyAliasOptions>): Promise<VerifyAliasResponse> {
    const alias = await Alias.findOne({ where: { verificationCode: opts.verificationCode } });
    if (!alias) {
      throw new AuthError('UNKNOWN_ALIAS', { alias: 'user identifier' });
    } else if (alias.verificationExpiresAt < new Date()) {
      await alias.destroy();
      throw new AuthError('EXPIRED_VERIFICATION_CODE');
    } else if (alias.verifiedAt) {
      throw new AuthError('STALE_VERIFICATION_CODE');
    }
    await alias.update(
      { 
        verificationExpiresAt: null,
        verifiedAt: new Date(),
      },
    );
    return { success: true };
  }

}
