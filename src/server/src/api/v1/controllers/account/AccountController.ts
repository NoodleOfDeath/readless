import appleSignin from 'apple-signin-auth';
import bcrypt from 'bcryptjs';
import CryptoJS from 'crypto-js';
import { Request as ExpressRequest } from 'express';
import ms from 'ms';
import {
  Body,
  Delete,
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
  DeleteUserRequest,
  DeleteUserResponse,
  JWT,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegisterAliasRequest,
  RegistrationRequest,
  RegistrationResponse,
  RequestOtpRequest,
  RequestOtpResponse,
  UnregisterAliasRequest,
  UpdateCredentialRequest,
  UpdateCredentialResponse,
  UpdateMetadataRequest,
  UpdateMetadataResponse,
  VerifyAliasRequest,
  VerifyAliasResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from './types';
import { GoogleService, MailService } from '../../../../services';
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
import { BaseControllerWithPersistentStorageAccess } from '../Controller';

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
export class AccountController extends BaseControllerWithPersistentStorageAccess {

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

    if (req.body.jwt || body.userId) {
      throw new AuthError('ALREADY_LOGGED_IN');
    }
    if (body.email && !validateEmail(body.email)) {
      throw new InternalError('Email has invalid format');
    }
    if (body.password && !validatePassword(body.password)) {
      throw new InternalError('Password does not meet requirements');
    }

    if (body.anonymous) {
      // Anonymous registration
      try {
        const bytes = CryptoJS.AES.decrypt(body.anonymous, process.env.REGISTRATION_PRIVATE_KEY);
        bytes.toString(CryptoJS.enc.Utf8);
      } catch (e) {
        throw new AuthError('BAD_REQUEST');
      }
    } else {
      // Don't register if user already exists
      user = await User.from(body, { ignoreIfNotResolved: true, ...req.body });
      if (user) {
        throw new AuthError('DUPLICATE_USER');
      }
      if (body.thirdParty) {
        // third-party registration
        if (body.thirdParty.name === 'apple') {
          // verify apple sign-in
          const claims = await appleSignin.verifyIdToken(body.thirdParty.credential);
          const { email, email_verified: emailVerified } = claims;
          thirdPartyId = claims.sub;
          if (email && emailVerified) {
            const user = (await User.from({ email }, { ignoreIfNotResolved: true, ...req.body }));
            if (user) {
              newUser = user;
            }
            createAlias = !newUser;
            // auto-create new alias by email, as well
            newAliasType = 'email';
            newAliasValue = email;
            verified = true;
          } else {
            newUser = (await User.from({ 'thirdParty/apple': thirdPartyId }));
          }
        } else
        if (body.thirdParty.name === 'google') {
          // verify google sign-in
          const ticket = await GoogleService.verify(body.thirdParty.credential);
          const { email, email_verified: emailVerified } = ticket.getPayload();
          thirdPartyId = ticket.getPayload().sub;
          if (email) {
            const user = (await User.from({ email }, { ignoreIfNotResolved: true }));
            if (user) {
              newUser = user;
            }
            createAlias = !newUser;
            // auto-create new alias by email, as well
            newAliasType = 'email';
            newAliasValue = email;
            verified = emailVerified;  
          } else {
            newUser = (await User.from({ 'thirdParty/google': thirdPartyId }));
          }
        } else {
          throw new AuthError('BAD_REQUEST');
        }
      } else 
      if (body.email) {
        // Standard registration
        newAliasType = 'email';
        newAliasValue = body.email;
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
      createAlias = false;
    }

    await newUser.generateUsername();
    
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

    if (body.email && body.password) {
      if (!validatePassword(body.password)) {
        throw new InternalError('Password does not meet requirements');
      }
      await newUser.createCredential('password', body.password);
    }

    if (body.anonymous) {
      const credential = await JWT.as('standard', newUser.id);
      await newUser.createCredential('jwt', credential);
      return {
        token: credential.wrapped,
        userId: newUser.id,
      };
    }

    if (verified) {
      await newUser.grantRole('verified');
      if (newAliasType === 'email') {
        await new MailService().sendMailFromTemplate('welcome', { to: newAliasValue }, { email: newAliasValue });
      }
      return await this.login(req, body);
    } else {
      if (newAliasType === 'email') {
        await new MailService().sendMailFromTemplate(
          'verifyEmail', 
          { to: newAliasValue },
          {
            email: newAliasValue,
            verificationCode,
          }
        );
      }
      if (thirdPartyId) {
        return await this.login(req, body);
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

    if (req.body.jwt) {
      // User is already logged in. Send back updated profile.
      const token = new JWT(req.body.jwt);
      if (token.expired) {
        throw new AuthError('EXPIRED_CREDENTIALS');
      }
      const credential = await Credential.findOne({
        where: {
          type: 'jwt',
          userId: token.userId,
          value: req.body.jwt,
        },
      });
      if (!credential) {
        throw new AuthError('INVALID_CREDENTIALS');
      }
      const user = await User.findOne({ where: { id: token.userId } });
      if (!user) {
        throw new AuthError('UNKNOWN_ALIAS');
      }
      await user.syncProfile(); // get profile
      return {
        profile: user?.toJSON().profile ?? {},
        token: token.wrapped,
        userId: token.userId,
      };
    }

    // Try to find user, if not found, register but only for anonymous and third-party
    let user = await User.from(
      body, 
      { ignoreIfNotResolved: Boolean(body.anonymous || body.createIfNotExists), ...req.body }
    );
    
    if (!user) {
      const { token, userId } = await this.register(req, body);
      user = await User.findOne({ where: { id: userId } });
      if (!user) {
        throw new AuthError('UNKNOWN_ALIAS');
      }
      await user.syncProfile(); // get profile
      if (token) {
        // account is anonymous, return JWT
        return {
          profile: user.toJSON().profile ?? {}, 
          token, 
          unlinked: user.toJSON().profile?.linkedThirdPartyAccounts?.length === 0, 
          userId,
        };
      }
    }

    if (body.eth2Address) {
      // auth by eth2Address
      console.log('web3');
    } else
    if (body.thirdParty) {
      // third-party login
      if (body.thirdParty.name === 'apple') {
        const claims = await appleSignin.verifyIdToken(body.thirdParty?.credential);
        const { email, email_verified: emailVerified } = claims;
        let alias: Alias;
        if (email && emailVerified) {
          alias = await Alias.findOne({ where: { type: 'email', value: email } });
        } if (!alias) {
          alias = await Alias.findOne({ where: { type: 'thirdParty/apple', value: claims.sub } });
        }
        if (!alias) {
          throw new AuthError('UNKNOWN_ALIAS');
        }
      } else 
      if (body.thirdParty.name === 'google') {
        const ticket = await GoogleService.verify(body.thirdParty?.credential);
        if ((ticket.getPayload().exp * 1000) < Date.now()) {
          throw new AuthError('EXPIRED_CREDENTIALS');
        }
        const { email, email_verified: emailVerified } = ticket.getPayload();
        let alias: Alias;
        if (email && emailVerified) {
          alias = await Alias.findOne({ where: { type: 'email', value: email } });
        } if (!alias) {
          alias = await Alias.findOne({ where: { type: 'thirdParty/google', value: ticket.getPayload().sub } });
        } 
        if (!alias) {
          throw new AuthError('UNKNOWN_ALIAS');
        }
      }
    } else {
      const type = body.email ? 'email' : body.phone ? 'phone' : 'username';
      if (!(await user.findAlias(type))?.verifiedAt) {
        throw new AuthError('ALIAS_UNVERIFIED');
      }
      // auth by password
      const credential = await user.findCredential('password');
      if (!credential) {
        throw new AuthError('INVALID_PASSWORD');
      }
      if (!bcrypt.compareSync(body.password, credential.value)) {
        throw new AuthError('INVALID_PASSWORD');
      }
    }
    // user is authenticated, generate JWT else {
    await user.syncProfile(); // get profile
    const userData = user.toJSON();
    const token = await JWT.as(body.requestedRole ?? 'standard', userData.id);
    await user.createCredential('jwt', token);
    return {
      profile: userData.profile,
      token: token.wrapped,
      userId: userData.id,
    };
  }

  @Post('/logout')
  public static async logout(
    @Request() req: ExpressRequest,
    @Body() body: LogoutRequest
  ): Promise<LogoutResponse> {
    let count = 0;
    if (req.body.jwt) {
      const token = new JWT(req.body.jwt);
      count += await Credential.destroy({
        where: {
          type: 'jwt',
          userId: token.userId,
          value: req.body.jwt,
        },
      });
      if (body.force) {
        count += await Credential.destroy({ where: { userId: token.userId } });
      }
    }
    return { count, success: true };
  }

  @Post('/alias/register')
  public static async registerAlias(
    @Request() req: ExpressRequest,
    @Body() body: RegisterAliasRequest
  ): Promise<RegistrationResponse> {
    const user = await User.from(body, req.body);
    await user.syncProfile();
    if (user.toJSON().profile?.linkedThirdPartyAccounts?.includes(body.otherAlias.thirdParty.name)) {
      throw new AuthError('DUPLICATE_USER');
    }
    const alias = await Alias.from(body.otherAlias);
    if (alias) {
      throw new AuthError('DUPLICATE_USER');
    }
    let thirdPartyId: string;
    if (body.otherAlias.thirdParty) {
      if (body.otherAlias.thirdParty.name === 'apple') {
        const claims = await appleSignin.verifyIdToken(body.otherAlias.thirdParty.credential);
        const alias = await Alias.findOne({ where: { type: 'thirdParty/apple', value: claims.sub } });
        thirdPartyId = claims.sub;
        if (alias) {
          throw new AuthError('DUPLICATE_USER');
        }
      } else
      if (body.otherAlias.thirdParty.name === 'google') {
        const ticket = await GoogleService.verify(body.otherAlias.thirdParty.credential);
        const alias = await Alias.findOne({ where: { type: 'thirdParty/google', value: ticket.getPayload().sub } });
        thirdPartyId = ticket.getPayload().sub;
        if (alias) {
          throw new AuthError('DUPLICATE_USER');
        }
      }
    }
    const verificationCode = await generateVerificationCode();
    const options: Partial<Alias> = body.otherAlias.thirdParty ? 
      { verifiedAt: new Date() } : {
        verificationCode,
        verificationExpiresAt: new Date(Date.now() + ms('20m')),
      };
    const type = body.otherAlias.thirdParty ? `thirdParty/${body.otherAlias.thirdParty.name}` : body.otherAlias.email ? 'email' : body.otherAlias.phone ? 'phone' : 'username';
    const value = body.otherAlias.thirdParty ? thirdPartyId : body.otherAlias[type];
    await user.createAlias(type as AliasType, value, options);
    if (body.otherAlias.email) {
      await new MailService().sendMailFromTemplate(
        'verifyEmail',
        { to: body.otherAlias.email },
        {
          email: body.otherAlias.email, 
          verificationCode, 
        }
      );
    }
    return { userId: user.id };
  }

  @Post('/alias/unregister')
  public static async unregisterAlias(
    @Request() req: ExpressRequest,
    @Body() body: RegisterAliasRequest | UnregisterAliasRequest
  ): Promise<RegistrationResponse> {
    const user = await User.from(body, req.body);
    if (body.otherAlias.thirdParty) {
      const alias = await user.findAlias(`thirdParty/${(body as UnregisterAliasRequest).otherAlias.thirdParty}`);
      await alias.destroy();
    } else {
      const alias = await Alias.from((body as RegisterAliasRequest).otherAlias);
      if (!alias) {
        throw new AuthError('UNKNOWN_ALIAS');
      }
      await alias.destroy();
    }
    return { userId: user.id };
  }
  
  @Post('/alias/verify')
  public static async verifyAlias(
    @Request() req: ExpressRequest,
    @Body() body: VerifyAliasRequest
  ): Promise<VerifyAliasResponse> {
    const alias = await Alias.findOne({ where: { verificationCode: body.verificationCode } });
    if (!alias) {
      throw new AuthError('INVALID_CREDENTIALS');
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
  
  @Post('/otp')
  public static async requestOtp(
    @Request() req: ExpressRequest,
    @Body() body: RequestOtpRequest
  ): Promise<RequestOtpResponse> {
    const user = await User.from(body);
    const email = await user.findAlias('email');
    if (!email) {
      return { success: false };
    }
    await user.revokeCredential(body.deleteAccount ? 'deleteToken' : 'otp');
    const otp = await generateOtp();
    await user.createCredential(body.deleteAccount ? 'deleteToken' : 'otp', otp);
    const emailData = email;
    const mailer = new MailService();
    await mailer.sendMailFromTemplate(
      body.deleteAccount ? 'deleteAccount' : 'resetPassword',
      { to: emailData.value }, 
      {
        email: emailData.value,
        otp,
      }
    );
    return { success: true };
  }
  
  @Post('/otp/verify')
  public static async verifyOtp(
    @Request() req: ExpressRequest,
    @Body() body: VerifyOtpRequest
  ): Promise<VerifyOtpResponse> {
    const user = await User.from(body, req.body);
    const otp = await user.findCredential(body.deleteAccount ? 'deleteToken' : 'otp', body.otp);
    await otp.destroy();
    if (!otp) {
      throw new AuthError('INVALID_CREDENTIALS');
    }
    if (otp.expiresAt && (otp.expiresAt.valueOf() < Date.now())) {
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    const token = await JWT.as('account', user.id);
    await user.createCredential('jwt', token);
    return {
      token: token.wrapped,
      userId: user.id,
    };
  }

  @Patch('/metadata')
  @Security('jwt', ['standard:write'])
  public static async updateMetadata(
    @Request() req: ExpressRequest,
    @Body() body: UpdateMetadataRequest
  ): Promise<UpdateMetadataResponse> {
    const user = await User.from(body, req.body);
    await user?.setMetadata(body.key, body.value, body.type);
    return { success: true };
  }
  
  @Put('/credential')
  @Security('jwt', ['account:write'])
  public static async updateCredential(
    @Request() req: ExpressRequest,
    @Body() body: UpdateCredentialRequest
  ): Promise<UpdateCredentialResponse> {
    const user = await User.from(body, req.body);
    await user.authenticate(req.body);
    if (body.newPassword) {
      if (!validatePassword(body.newPassword)) {
        throw new InternalError('Password does not meet requirements');
      }
      await Credential.destroy({
        where: { 
          type: 'password', 
          userId: user.id, 
        },
      });
      await user.createCredential('password', body.newPassword);
      return { success: true };
    }
    return { success: false };
  }
  
  @Delete('/')
  @Security('jwt', ['account:write'])
  public static async deleteAccount(
    @Request() req: ExpressRequest,
    @Body() body: DeleteUserRequest
  ): Promise<DeleteUserResponse> {
    const user = await User.from(body, req.body);
    await user.authenticate(req.body);
    await user.destroy({ force: true });
    return { success: true };
  }

}
