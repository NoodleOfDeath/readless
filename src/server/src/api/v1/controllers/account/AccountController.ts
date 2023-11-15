import appleSignin from 'apple-signin-auth';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { Request as ExpressRequest } from 'express';
import ms from 'ms';
import {
  Body,
  Get,
  Patch,
  Post,
  Put,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import {
  JWT,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  ProfileResponse,
  RegistrationRequest,
  RegistrationResponse,
  RequestOtpRequest,
  RequestOtpResponse,
  UpdateCredentialRequest,
  UpdateCredentialResponse,
  UpdateMetadataRequest,
  UpdateMetadataResponse,
  VerifyAliasRequest,
  VerifyAliasResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from './types';
import {
  GoogleService,
  MailService,
  OpenAIService,
} from '../../../../services';
import {
  randomString,
  validateEmail,
  validatePassword,
} from '../../../../utils';
import { AuthError, InternalError } from '../../middleware';
import {
  Alias,
  AliasType,
  Credential,
  User,
} from '../../schema';

const VERIFICATION_CODE_LENGTH = process.env.VERIFICATION_CODE_LENGTH ? parseInt(process.env.VERIFICATION_CODE_LENGTH) : 16;

const OTP_LENGTH = process.env.OTP_LENGTH ? parseInt(process.env.OTP_LENGTH) : 10;

async function generateVerificationCode(): Promise<string> {
  const verificationCode = randomString(VERIFICATION_CODE_LENGTH);
  if ((await Alias.findOne({ where: { verificationCode } })) !== null) {
    return generateVerificationCode();
  }
  return verificationCode;
}

async function generateOtp(): Promise<string> {
  const value = randomString(OTP_LENGTH);
  if (
    (await Credential.findOne({
      where: {
        type: 'otp',
        value,
      },
    })) !== null
  ) {
    return generateOtp();
  }
  return value;
}

@Route('/v1/account')
@Tags('Account')
@Security('jwt')
@SuccessResponse('200', 'OK')
@SuccessResponse('201', 'Created')
@SuccessResponse('204', 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Server Error')
export class AccountController {

  @Post('/register')
  public static async register(
    @Request() req: ExpressRequest,
    @Body() body: RegistrationRequest
  ): Promise<RegistrationResponse> {
    let user: User | null = null;
    let newUser: User | null = null;
    let newAliasType: AliasType;
    let newAliasValue: string;
    let thirdPartyId: string;
    let verificationCode: string;
    let verified = false;
    let createAlias = true;
    if (body.jwt || body.userId) {
      throw new AuthError('ALREADY_LOGGED_IN');
    }
    if (body.anonymous) {
      console.log('anonymous registration');
      try {
        const bytes = CryptoJS.AES.decrypt(body.anonymous, process.env.REGISTRATION_PRIVATE_KEY);
        bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) {
        throw new AuthError('BAD_REQUEST');
      }
    } else {
      if (!body.thirdParty) {
        if (!validateEmail(body.email)) {
          throw new InternalError('Email has invalid format');
        }
        if (!validatePassword(body.password)) {
          throw new InternalError('Password does not meet requirements');
        }
      }
      const result = await User.from(body, { ignoreIfNotResolved: true });
      const { payload } = result;
      user = result.user;
      if (user) {
        throw new AuthError('DUPLICATE_USER');
      }
      if (body.thirdParty) {
        if (body.thirdParty.name === 'apple') {
          const claims = await appleSignin.verifyIdToken(body.thirdParty.credential);
          const { email, email_verified: emailVerified } = claims;
          thirdPartyId = claims.sub;
          if (email && emailVerified) {
            const user = (await User.from({ email }, { ignoreIfNotResolved: true }))?.user;
            if (user) {
              newUser = user;
            }
            createAlias = !newUser;
            // auto-create new alias by email, as well
            newAliasType = 'email';
            newAliasValue = email;
            verified = true;
          } else {
            newUser = (await User.from({ 'thirdParty/apple': thirdPartyId }))?.user;
          }
        } else
        if (body.thirdParty.name === 'google') {
          const ticket = await GoogleService.verify(body.thirdParty.credential);
          const { email, email_verified: emailVerified } = ticket.getPayload();
          thirdPartyId = ticket.getPayload().sub;
          if (!email) {
            throw new AuthError('NO_THIRD_PARTY_ALIAS');
          }
          if (!emailVerified) {
            throw new AuthError('THIRD_PARTY_ALIAS_NOT_VERIFIED');
          }
          const user = (await User.from({ email }, { ignoreIfNotResolved: true }))?.user;
          if (user) {
            newUser = user;
          }
          createAlias = !newUser;
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
    }
    if (!newUser) {
      newUser = new User();
      await newUser.save();
    }
    await newUser.grantRole('standard');
    await newUser.grantRole('account');
    if (!verified) {
      verificationCode = await generateVerificationCode();
    }
    if (thirdPartyId && body.thirdParty) {
      // bind third-party alias
      await newUser.createAlias(
        `thirdParty/${body.thirdParty.name}`,
        thirdPartyId,
        { verifiedAt: new Date() }
      );
    } else
    if (body.anonymous) {
      let validUsername = false;
      let alias: Alias | null = null;
      let reply: string;
      while (!validUsername) {
        const chatService = new OpenAIService();
        reply = await chatService.send('Create a very very unique username between 8 and 16 characters long that contains only letters and numbers. And would never be guessed by anyone else.');
        alias = await Alias.findOne({ where: { value: reply } });
        validUsername = alias == null && reply.length > 8 && reply.length < 16 && Boolean(reply.match(/^[a-zA-Z0-9]+$/));
      }
      newAliasType = 'username';
      newAliasValue = reply;
      verified = true;
    }
    if (createAlias) {
      try {
        console.log('creating alias', newAliasType, newAliasValue);
        await newUser.createAlias(newAliasType, newAliasValue, {
          verificationCode: verified ? undefined : verificationCode,
          verificationExpiresAt: verified
            ? undefined
            : new Date(Date.now() + ms('20m')),
          verifiedAt: verified ? new Date() : undefined,
        });
      } catch (e) {
        console.log(e);
      }
    }
    if (body.password) {
      if (!validatePassword(body.password)) {
        throw new InternalError('Password does not meet requirements');
      }
      await newUser.createCredential('password', body.password);
    }
    if (body.anonymous) {
      const credential = await JWT.as('standard', newUser.id);
      await newUser.createCredential('jwt', credential);
      await newUser.grantRole('verified');
      return {
        token: credential.wrapped,
        userId: newUser.id,
      };
    }
    if (verified) {
      await newUser.grantRole('verified');
      if (newAliasType === 'email') {
        await new MailService().sendMailFromTemplate({ to: newAliasValue }, 'welcome', { email: newAliasValue });
      }
      return await this.login(req, body);
    } else {
      if (newAliasType === 'email') {
        await new MailService().sendMailFromTemplate({ to: newAliasValue }, 'verifyEmail', {
          email: newAliasValue,
          verificationCode,
        });
      }
      return { userId: newUser.id };
    }
  }

  @Post('/login')
  public static async login(
    @Request() req: ExpressRequest,
    @Body() body: LoginRequest
  ): Promise<LoginResponse> {
    console.log('trying login');
    if (req.body.token) {
      const token = new JWT(req.body.token);
      const credential = await Credential.findOne({
        where: {
          type: 'jwt',
          userId: token.userId,
          value: req.body.token,
        },
      });
      if (!credential) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      if (token.expired) {
        throw new AuthError('EXPIRED_CREDENTIALS');
      }
      console.log(token);
      const user = await User.findOne({ where: { id: token.userId } });
      return {
        profile: user?.toJSON().profile ?? {},
        token: token.wrapped,
        userId: token.userId,
      };
    }
    const ticket = await User.from(body, { ignoreIfNotResolved: Boolean(body.anonymous || body.createIfNotExists) });
    const { payload } = ticket;
    let { alias, user } = ticket;
    if (!alias && !user) {
      const { token, userId } = await this.register(req, body);
      user = await User.findOne({ where: { id: userId } });
      await user.sync();
      if (!user) {
        throw new AuthError('UNKNOWN_ALIAS');
      }
      if (token) {
        return {
          profile: user.toJSON().profile ?? {}, 
          token, 
          unlinked: true, 
          userId,
        };
      }
      alias = await user.findAlias(payload.type);
    }
    if (!alias?.verifiedAt) {
      throw new AuthError('ALIAS_UNVERIFIED');
    }
    if (payload.type === 'eth2Address') {
      // auth by eth2Address
      console.log('web3');
    } else if (payload.type.startsWith('thirdParty/')) {
      if (body.thirdParty?.name === 'apple') {
        const claims = await appleSignin.verifyIdToken(body.thirdParty?.credential);
        const alias = await Alias.findOne({ where: { type: payload.type, value: claims.sub } });
        if (!alias) {
          throw new AuthError('UNKNOWN_ALIAS');
        }
      } else 
      if (body.thirdParty?.name === 'google') {
        const ticket = await GoogleService.verify(body.thirdParty?.credential);
        if ((ticket.getPayload().exp * 1000) < Date.now()) {
          throw new AuthError('EXPIRED_CREDENTIALS');
        }
        const alias = await Alias.findOne({ where: { type: payload.type, value: ticket.getPayload().sub } });
        if (!alias) {
          throw new AuthError('UNKNOWN_ALIAS');
        }
      }
    } else {
      // auth by password
      const credential = await user.findCredential('password');
      if (!credential) {
        throw new AuthError('INVALID_PASSWORD');
      }
      if (!bcrypt.compareSync(body.password, credential.value)) {
        throw new AuthError('INVALID_PASSWORD');
      }
    }
    // user is authenticated, generate JWT
    await user.sync();
    const userData = user.toJSON();
    const token = await JWT.as(body.requestedRole ?? 'standard', userData.id);
    await user.createCredential('jwt', token);
    return {
      profile: userData.profile,
      token: token.wrapped,
      userId: userData.id,
    };
  }

  @Get('/profile')
  @Security('jwt', ['standard:read'])
  public static async getProfile(
    @Request() req: ExpressRequest
  ): Promise<ProfileResponse> {
    const { user } = await User.from({ jwt: req.body.token });
    await user.sync();
    const userData = user.toJSON();
    return { profile: userData.profile };
  }

  @Post('/logout')
  public static async logout(
    @Request() req: ExpressRequest,
    @Body() body: LogoutRequest
  ): Promise<LogoutResponse> {
    let count = 0;
    if (body.jwt) {
      const token = new JWT(body.jwt);
      count += await Credential.destroy({
        where: {
          type: 'jwt',
          userId: token.userId,
          value: body.jwt,
        },
      });
      if (body.force) {
        count += await Credential.destroy({ where: { userId: token.userId } });
      }
    }
    return { count, success: true };
  }
  
  @Post('/otp')
  public static async requestOtp(
    @Request() req: ExpressRequest,
    @Body() body: RequestOtpRequest
  ): Promise<RequestOtpResponse> {
    const { user } = await User.from(body, { ignoreIfNotResolved: true });
    if (!user) {
      return { success: false };
    }
    const email = await user.findAlias('email');
    if (!email) {
      return { success: false };
    }
    await user.revokeCredential('otp');
    const otp = await generateOtp();
    await user.createCredential('otp', otp);
    const emailData = email;
    const mailer = new MailService();
    await mailer.sendMailFromTemplate({ to: emailData.value }, 'resetPassword', {
      email: emailData.value,
      otp,
    });
    return { success: true };
  }
  
  @Post('/verify/alias')
  public static async verifyAlias(
    @Request() req: ExpressRequest,
    @Body() body: VerifyAliasRequest
  ): Promise<VerifyAliasResponse> {
    const alias = await Alias.findOne({ where: { verificationCode: body.verificationCode } });
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
  
  @Post('/verify/otp')
  public static async verifyOtp(
    @Request() req: ExpressRequest,
    @Body() body: VerifyOTPRequest
  ): Promise<VerifyOTPResponse> {
    const { user } = await User.from(body);
    const otp = await user.findCredential('otp', body.otp);
    await otp.destroy();
    if (!otp) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    if (otp.expiresAt.valueOf() < Date.now()) {
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    const userData = user;
    const token = await JWT.as('account', userData.id);
    await user.createCredential('jwt', token);
    return {
      token: token.wrapped,
      userId: userData.id,
    };
  }

  @Patch('/update/metadata')
  @Security('jwt', ['standard:write'])
  public static async updateMetadata(
    @Request() req: ExpressRequest,
    @Body() body: UpdateMetadataRequest
  ): Promise<UpdateMetadataResponse> {
    const { user } = await User.from({ jwt: req.body.token });
    await user.setMetadata(body.key, body.value);
    return { success: true };
  }
  
  @Put('/update/credential')
  @Security('jwt', ['account:write'])
  public static async updateCredential(
    @Request() req: ExpressRequest,
    @Body() body: UpdateCredentialRequest
  ): Promise<UpdateCredentialResponse> {
    const { user } = await User.from(body);
    if (typeof body.password === 'string') {
      if (!validatePassword(body.password)) {
        throw new InternalError('Password does not meet requirements');
      }
      const password = await user.findCredential('password');
      if (password) {
        await password.destroy();
      }
      await user.createCredential('password', body.password);
      return { success: true };
    }
    return { success: false };
  }

}
