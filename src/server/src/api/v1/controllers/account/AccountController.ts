import {
  Body,
  Post,
  Put,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { AccountService, AuthError } from '../../../../services';
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

@Route('/v1/account')
@Tags('Account')
@Response<AuthError>(401, 'Unauthorized')
@Response<AuthError>(500, 'Internal Server Error')
export class AccountController {

  @Post('/register')
  @Security('jwt')
  @SuccessResponse('201', 'Created')
  public async register(@Body() body: Partial<RegistrationRequest>): Promise<RegistrationResponse> {
    return await AccountService.register(body);
  }

  @Post('/login')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async login(@Body() body: Partial<LoginRequest>): Promise<LoginResponse> {
    return await AccountService.login(body);
  }

  @Post('/logout')
  @Security('jwt')
  @SuccessResponse('204', 'No Content')
  public async logout(@Body() body: Partial<LogoutRequest>): Promise<LogoutResponse> {
    return await AccountService.logout(body);
  }
  
  @Post('/otp')
  @Security('jwt')
  @SuccessResponse('201', 'OK')
  public async generateOTP(@Body() body: Partial<GenerateOTPRequest>): Promise<GenerateOTPResponse> {
    return await AccountService.generateOtp(body);
  }
  
  @Post('/verify/alias')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async verifyAlias(@Body() body: Partial<VerifyAliasRequest>): Promise<VerifyAliasResponse> {
    return await AccountService.verifyAlias(body);
  }
  
  @Post('/verify/otp')
  @Security('jwt')
  @SuccessResponse('200', 'OK')
  public async verifyOTP(@Body() body: Partial<VerifyOTPRequest>): Promise<VerifyOTPResponse> {
    return await AccountService.verifyOtp(body);
  }
  
  @Put('/update/credential')
  @Security('jwt', ['account:write'])
  @SuccessResponse(200, 'OK')
  public async updateCredential(@Body() body: Partial<UpdateCredentialRequest>): Promise<UpdateCredentialResponse> {
    return await AccountService.updateCredential(body);
  }

}
