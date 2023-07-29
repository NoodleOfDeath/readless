import { Request as ExpressRequest } from 'express';
import {
  Body,
  Post,
  Put,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { AccountService } from '../../../../services';
import {
  GenerateOTPRequest,
  GenerateOTPResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegistrationRequest,
  RegistrationResponse,
  UpdateCredentialRequest,
  UpdateCredentialResponse,
  VerifyAliasRequest,
  VerifyAliasResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../../../../services/types';
import { AuthError, InternalError } from '../../middleware';

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
    @Body() body: Partial<RegistrationRequest>
  ): Promise<RegistrationResponse> {
    return await AccountService.register(body);
  }

  @Post('/login')
  public static async login(
    @Request() req: ExpressRequest,
    @Body() body: Partial<LoginRequest>
  ): Promise<LoginResponse> {
    return await AccountService.login(body);
  }

  @Post('/logout')
  public static async logout(
    @Request() req: ExpressRequest,
    @Body() body: Partial<LogoutRequest>
  ): Promise<LogoutResponse> {
    return await AccountService.logout(body);
  }
  
  @Post('/otp')
  public static async generateOTP(
    @Request() req: ExpressRequest,
    @Body() body: Partial<GenerateOTPRequest>
  ): Promise<GenerateOTPResponse> {
    return await AccountService.generateOtp(body);
  }
  
  @Post('/verify/alias')
  public static async verifyAlias(
    @Request() req: ExpressRequest,
    @Body() body: Partial<VerifyAliasRequest>
  ): Promise<VerifyAliasResponse> {
    return await AccountService.verifyAlias(body);
  }
  
  @Post('/verify/otp')
  public static async verifyOTP(
    @Request() req: ExpressRequest,
    @Body() body: Partial<VerifyOTPRequest>
  ): Promise<VerifyOTPResponse> {
    return await AccountService.verifyOtp(body);
  }
  
  @Put('/update/credential')
  @Security('jwt', ['account:write'])
  public static async updateCredential(
    @Request() req: ExpressRequest,
    @Body() body: Partial<UpdateCredentialRequest>
  ): Promise<UpdateCredentialResponse> {
    return await AccountService.updateCredential(body);
  }

}
