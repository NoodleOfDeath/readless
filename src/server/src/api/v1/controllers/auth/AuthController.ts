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
} from '../../../../services/types';

@Route('/v1/auth')
@Tags('Auth')
@Response<AuthError>(401, 'Unauthorized')
@Response<AuthError>(500, 'Internal Server Error')
export class AuthController {

  @Post('/login')
  @SuccessResponse('200', 'OK')
  public async login(@Body() body: Partial<LoginOptions>): Promise<LoginResponse> {
    return await new AuthService().login(body);
  }

  @Post('/register')
  @SuccessResponse('201', 'Created')
  public async register(
    @Body() body: Partial<RegistrationOptions>,
  ): Promise<RegistrationResponse> {
    return await new AuthService().register(body);
  }

  @Post('/logout')
  @SuccessResponse('204', 'No Content')
  public async logout(
    @Body() body: Partial<LogoutOptions>,
  ): Promise<LogoutResponse> {
    return await new AuthService().logout(body);
  }

  @Post('/authenticate')
  @SuccessResponse('200', 'OK')
  public async authenticate(
    @Body() body: Partial<AuthenticationOptions>,
  ): Promise<AuthenticationResponse> {
    return await new AuthService().authenticate(body);
  }
  
  @Post('/verify/alias')
  @SuccessResponse('200', 'OK')
  public async verifyAlias(
    @Body() body: Partial<VerifyAliasOptions>,
  ): Promise<VerifyAliasResponse> {
    return await new AuthService().verifyAlias(body);
  }

}
