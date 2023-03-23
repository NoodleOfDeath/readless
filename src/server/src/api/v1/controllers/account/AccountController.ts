import {
  Body,
  Header,
  Post,
  Put,
  Response,
  Route,
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
  @SuccessResponse('201', 'Created')
  public async register(@Body() body: Partial<RegistrationRequest>): Promise<RegistrationResponse> {
    return await new AccountService().register(body);
  }

  @Post('/login')
  @SuccessResponse('200', 'OK')
  public async login(@Body() body: Partial<LoginRequest>): Promise<LoginResponse> {
    return await new AccountService().login(body);
  }

  @Post('/logout')
  @SuccessResponse('204', 'No Content')
  public async logout(@Body() body: Partial<LogoutRequest>): Promise<LogoutResponse> {
    return await new AccountService().logout(body);
  }
  
  @Post('/otp')
  @SuccessResponse('201', 'OK')
  public async generateOTP(@Body() body: Partial<GenerateOTPRequest>): Promise<GenerateOTPResponse> {
    return await new AccountService().generateOtp(body);
  }
  
  @Post('/verify/alias')
  @SuccessResponse('200', 'OK')
  public async verifyAlias(@Body() body: Partial<VerifyAliasRequest>): Promise<VerifyAliasResponse> {
    return await new AccountService().verifyAlias(body);
  }
  
  @Post('/verify/otp')
  @SuccessResponse('200', 'OK')
  public async verifyOTP(@Body() body: Partial<VerifyOTPRequest>): Promise<VerifyOTPResponse> {
    return await new AccountService().verifyOtp(body);
  }
  
  @Put('/update/credential')
  @Header('Authorization')
  @SuccessResponse(200, 'OK')
  public async updateCredential(@Body() body: Partial<UpdateCredentialRequest>): Promise<UpdateCredentialResponse> {
    return await new AccountService().updateCredential(body as Partial<UpdateCredentialRequest>);
  }

}
