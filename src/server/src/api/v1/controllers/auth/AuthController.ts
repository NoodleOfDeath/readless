import {
  Body,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { AuthError, AuthService } from '../../../../services';
import {
  AuthenticationRequest,
  AuthenticationResponse,
  GenerateOTPRequest,
  GenerateOTPResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  RegistrationRequest,
  RegistrationResponse,
  VerifyAliasRequest,
  VerifyAliasResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from '../../../../services/types';

@Route('/v1/auth')
@Tags('Auth')
@Response<AuthError>(401, 'Unauthorized')
@Response<AuthError>(500, 'Internal Server Error')
export class AuthController {

  @Post('/login')
  @SuccessResponse('200', 'OK')
  public async login(@Body() body: Partial<LoginRequest>): Promise<LoginResponse> {
    return await new AuthService().login(body);
  }

  @Post('/register')
  @SuccessResponse('201', 'Created')
  public async register(@Body() body: Partial<RegistrationRequest>): Promise<RegistrationResponse> {
    return await new AuthService().register(body);
  }

  @Post('/logout')
  @SuccessResponse('204', 'No Content')
  public async logout(@Body() body: Partial<LogoutRequest>): Promise<LogoutResponse> {
    return await new AuthService().logout(body);
  }

  @Post('/authenticate')
  @SuccessResponse('200', 'OK')
  public async authenticate(@Body() body: Partial<AuthenticationRequest>): Promise<AuthenticationResponse> {
    return await new AuthService().authenticate(body);
  }
  
  @Post('/verify/alias')
  @SuccessResponse('200', 'OK')
  public async verifyAlias(@Body() body: Partial<VerifyAliasRequest>): Promise<VerifyAliasResponse> {
    return await new AuthService().verifyAlias(body);
  }
  
  @Post('/verify/otp')
  @SuccessResponse('200', 'OK')
  public async verifyOTP(@Body() body: Partial<VerifyOTPRequest>): Promise<VerifyOTPResponse> {
    return await new AuthService().verifyOTP(body);
  }
  
  @Post('/otp')
  @SuccessResponse('201', 'OK')
  public async requestOTP(@Body() body: Partial<GenerateOTPRequest>): Promise<GenerateOTPResponse> {
    return await new AuthService().requestOTP(body);
  }

}
