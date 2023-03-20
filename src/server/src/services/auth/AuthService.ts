import bcrypt from 'bcryptjs';
import ms from 'ms';
import web3 from 'web3';

import { AuthError } from './AuthError';
import {
  GenerateOTPRequest,
  GenerateOTPResponse,
  Jwt,
  JwtBearing,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  OTP_LENGTH,
  RegistrationRequest,
  RegistrationResponse,
  VERIFICATION_CODE_LENGTH,
  VerifyAliasRequest,
  VerifyAliasResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './types';
import {
  Alias,
  AliasType,
  Credential,
  User,
} from '../../api/v1/schema/';
import { BaseService } from '../base';
import { GoogleService } from '../google';
import { MailService } from '../mail';

async function generateVerificationCode(): Promise<string> {
  const verificationCode = Math.random().toString(36).substring(2, 2 + VERIFICATION_CODE_LENGTH);
  if (await Alias.findOne({ where: { verificationCode } }) !== null) {
    return generateVerificationCode();
  }
  return verificationCode;
}

async function generateOtp(): Promise<string> {
  const value = Math.random().toString(36).substring(2, 2 + OTP_LENGTH);
  if (await Credential.findOne({
    where: {
      type: 'otp',
      value,
    },
  }) !== null) {
    return generateOtp();
  }
  return value;
}

export class AuthService extends BaseService {

  public async register(req: Partial<JwtBearing<RegistrationRequest>>): Promise<RegistrationResponse> {
    const { payload, user } = await User.from(req, { ignoreIfNotResolved: true });
    if (req.jwt) {
      throw new AuthError('ALREADY_LOGGED_IN');
    }
    let newAliasType: AliasType;
    let newAliasValue: string;
    let thirdPartyId: string;
    let verificationCode: string;
    let verified = false;
    if (user) {
      throw new AuthError('DUPLICATE_USER');
    }
    if (req.thirdParty) {
      if (req.thirdParty.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(req.thirdParty.credential);
        const { email, email_verified: emailVerified } = ticket.getPayload();
        thirdPartyId = ticket.getPayload().sub;
        if (!email) {
          throw new AuthError('NO_THIRD_PARTY_ALIAS');
        }
        if (!emailVerified) {
          throw new AuthError('THIRD_PARTY_ALIAS_NOT_VERIFIED');
        }
        // auto-create new alias by email, as well
        newAliasType = 'email';
        newAliasValue = email;
        verified = true;
      }
    } else if (typeof payload.value === 'string') {
      newAliasType = payload.type;
      newAliasValue = payload.value;
    } else {
      throw new AuthError('BAD_REQUEST');
    }
    const newUser = new User();
    await newUser.save();
    if (!verified) {
      verificationCode = await generateVerificationCode();
    }
    if (thirdPartyId && req.thirdParty) {
      // bind third-party alias
      await newUser.createAlias(
        `thirdParty/${req.thirdParty.name}`, 
        thirdPartyId,
        { verifiedAt: new Date() }
      );
    }
    await newUser.createAlias(newAliasType, newAliasValue, {
      verificationCode,
      verificationExpiresAt: verified ? undefined : new Date(Date.now() + ms('20m')),
      verifiedAt: verified ? new Date() : undefined,
    });
    if (req.password) {
      await newUser.createCredential('password', req.password);
    }
    if (verified) {
      return await this.login(req);
    } else {
      const mailer = new MailService();
      mailer.sendMail({ to: newAliasValue }, 'verifyEmail', {
        email: newAliasValue,
        verificationCode,
      });
      return { userId: newUser.toJSON().id };
    }
  }

  public async login(req: Partial<JwtBearing<LoginRequest>>): Promise<LoginResponse> {
    const { payload, user } = await User.from(req);
    if (req.jwt) {
      throw new AuthError('ALREADY_LOGGED_IN');
    }
    if (payload.type === 'eth2Address') {
      // auth by eth2Address
      console.log(web3);
    } else if (payload.type.startsWith('thirdParty/')) {
      // auth by thirdParty
    } else {
      // auth by password
      const credential = await user.findCredential('password');
      if (!credential) {
        throw new AuthError('MISSING_PASSWORD');
      }
      if (!bcrypt.compareSync(req.password, credential.toJSON().value)) {
        throw new AuthError('INVALID_PASSWORD');
      }
    }
    // user is authenticated, generate JWT
    const userData = user.toJSON();
    const token = Jwt.Default(userData.id);
    await user.createCredential('jwt', token);
    return {
      jwt: token.signed,
      userId: userData.id,
    };
  }

  public async logout({ jwt, userId }: Partial<JwtBearing<LogoutRequest>>): Promise<LogoutResponse> {
    let count = 0;
    if (jwt) {
      count += await Credential.destroy({ 
        where: {
          type: 'jwt',
          value: jwt.signed,
        },
      });
    }
    if (userId) {
      count += await Credential.destroy({ where: { userId } });
    }
    return { count, success: true };
  }
  
  public async generateOtp(req: Partial<GenerateOTPRequest>): Promise<GenerateOTPResponse> {
    const { user } = await User.from(req);
    const email = await user.findAlias('email');
    if (!email) {
      throw new AuthError('UNKNOWN_ALIAS', { alias: 'email' });
    }
    const otp = await generateOtp();
    await user.createCredential('otp', otp);
    const emailData = email.toJSON();
    const mailer = new MailService();
    mailer.sendMail({ to: emailData.value }, 'resetPassword', {
      email: emailData.value,
      otp,
    });
    return { success: true };
  }

  public async verifyAlias(req: Partial<VerifyAliasRequest>): Promise<VerifyAliasResponse> {
    const alias = await Alias.findOne({ where: { verificationCode: req.verificationCode } });
    if (!alias) {
      throw new AuthError('UNKNOWN_ALIAS', { alias: 'user identifier' });
    } else if (alias.verificationExpiresAt < new Date()) {
      await alias.destroy();
      throw new AuthError('EXPIRED_VERIFICATION_CODE');
    } else if (alias.verifiedAt) {
      throw new AuthError('STALE_VERIFICATION_CODE');
    }
    await alias.update({ 
      verificationCode: null,
      verificationExpiresAt: null,
      verifiedAt: new Date(),
    });
    return { success: true };
  }

  public async verifyOtp(req: Partial<VerifyOTPRequest>): Promise<VerifyOTPResponse> {
    const { user } = await User.from(req);
    const otp = await user.findCredential('otp');
    if (!otp) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    await otp.destroy();
    if (otp.expiresAt < new Date()) {
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    const userData = user.toJSON();
    const token = Jwt.Account(userData.id);
    await user.createCredential('jwt', token);
    return { jwt: token.signed, userId: userData.id };
  }
  
}
