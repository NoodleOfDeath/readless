import {
  Body, Post, Response, Route, Tags, 
} from 'tsoa';

import { AuthError, AuthService } from '../../../../services';
import {
  AuthenticationOptions, AuthenticationResponse, LogoutResponse, 
} from './../../../../services/auth/types';
import {
  LoginOptions, LoginResponse, RegistrationOptions, RegistrationResponse,
} from '../../../../services/types';

@Route('/v1/auth')
@Tags('Auth')
export class AuthController {

  @Post('/login')
  @Response<AuthError>(401, 'Unauthorized')
  public async login(@Body() body: Partial<LoginOptions>): Promise<LoginResponse> {
    return await new AuthService().login(body);
  }

  @Post('/register')
  @Response<AuthError>(401, 'Unauthorized')
  public async register(
    @Body() body: Partial<RegistrationOptions>,
  ): Promise<RegistrationResponse> {
    return await new AuthService().register(body);
  }

  @Post('/logout')
  @Response<AuthError>(401, 'Unauthorized')
  public async logout(
    @Body() body: Partial<LoginOptions>,
  ): Promise<LogoutResponse> {
    return await new AuthService().logout(body);
  }

  @Post('/authenticate')
  @Response<AuthError>(401, 'Unauthorized')
  public async authenticate(
    @Body() body: Partial<AuthenticationOptions>,
  ): Promise<AuthenticationResponse> {
    return await new AuthService().authenticate(body);
  }

}
