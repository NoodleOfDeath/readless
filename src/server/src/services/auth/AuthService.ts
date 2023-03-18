import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ms from 'ms';
import web3 from 'web3';

import { AuthError } from './AuthError';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  GenerateOTPRequest,
  GenerateOTPResponse,
  Jwt,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
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

export class AuthService extends BaseService {

  public async login(req: Partial<LoginRequest>): Promise<LoginResponse> {
    const { payload, user } = await User.from(req, { failIfNotResolved: true });
    if (payload.type === 'eth2Address') {
      // auth by eth2Address
      console.log(web3);
    } else if (payload.type === 'thirdParty') {
      // auth by thirdParty
    } else {
      // auth by password
      const credential = await user.findCredential('password');
      if (!credential) {
        throw new AuthError('MISSING_PASSWORD');
      }
      if (!bcrypt.compareSync(req.password, credential.value)) {
        throw new AuthError('INVALID_PASSWORD');
      }
    }
    // user is authenticated, generate JWT
    const token = Jwt.Default(user.id);
    const signedToken = jwt.sign(token, process.env.JWT_SECRET, { expiresIn: token.expiresIn });
    return {
      jwt: signedToken,
      userId: user.id,
    };
  }

  public async register(req: Partial<RegistrationRequest>): Promise<RegistrationResponse> {
    const { payload, user } = await User.from(req, { failIfNotResolved: false });
    let newAliasType: AliasType;
    let newAliasValue: string;
    let thirdPartyId: string;
    let verificationCode: string;
    let verified = false;
    if (user) {
      throw new AuthError('DUPLICATE_USER');
    }
    if (typeof payload.value !== 'string') {
      if (payload.value.name === 'google') {
        const google = new GoogleService();
        const ticket = await google.verify(payload.value.credential);
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
    } else {
      newAliasType = payload.type;
      newAliasValue = payload.value;
    }
    const newUser = new User();
    await newUser.save();
    if (!verified) {
      verificationCode = await generateVerificationCode();
    }
    if (thirdPartyId && typeof payload.value !== 'string') {
      // bind third-party alias
      await Alias.create({
        type: `thirdParty/${payload.value.name}`,
        userId: newUser.id,
        value: thirdPartyId,
        verifiedAt: new Date(),
      });
    }
    await Alias.create({
      type: newAliasType,
      userId: newUser.id,
      value: newAliasValue,
      verificationCode,
      verificationExpiresAt: verified ? undefined : new Date(Date.now() + ms('20m')),
      verifiedAt: verified ? new Date() : undefined,
    });
    if (req.password) {
      const newCredential = new Credential({
        type: 'password',
        userId: newUser.id,
        value: bcrypt.hashSync(req.password, 10),
      });
      await newCredential.save();
    }
    if(verified) {
      return await this.login(req);
    } else {
      const mailer = new MailService();
      mailer.sendMail({ to: newAliasValue }, 'verify', {
        email: newAliasValue,
        verificationCode,
      });
      return { userId: newUser.id };
    }
  }

  public async logout({ userId }: Partial<LogoutRequest>): Promise<LogoutResponse> {
    await Credential.destroy({ where: { userId } });
    return { success: true };
  }

  public async authenticate(req: Partial<AuthenticationRequest>): Promise<AuthenticationResponse> {
    const payload = jwt.verify(req.jwt, process.env.JWT_SECRET) as Jwt;
    if (!payload || !payload.userId || payload.userId !== req.userId) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    return { userId: payload.userId };
  }
  
  public async requestOTP(req: Partial<GenerateOTPRequest>): Promise<GenerateOTPResponse> {
    const { payload, user } = await User.from(req, { failIfNotResolved: true });
    console.log(payload, user);
    console.log(await user.email);
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

  public async verifyOTP(req: Partial<VerifyOTPRequest>): Promise<VerifyOTPResponse> {
    const { user } = await User.from(req, { failIfNotResolved: true });
    const otp = await user.findCredential('otp');
    if (!otp) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    if (otp.expiresAt < new Date()) {
      await otp.destroy();
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    await otp.destroy();
    const token = new Jwt({ userId: user.id });
    const signedToken = jwt.sign(token, process.env.JWT_SECRET, { expiresIn: token.expiresIn });
    return { jwt: signedToken, userId: user.id };
  }
  
}
