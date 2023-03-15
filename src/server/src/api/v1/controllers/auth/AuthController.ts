import {
  Body, Post, Route, Tags, 
} from 'tsoa';

import { AuthService } from '../../../../services';
import {
  LoginOptions, LoginResponse, RegistrationOptions, RegistrationResponse,
} from '../../../../services/types';

@Route('/v1/auth')
@Tags('Auth')
export class AuthController {

  @Post('/login')
  public async login(@Body() body: Partial<LoginOptions>): Promise<LoginResponse> {
    const response = await new AuthService().login(body);
    return response;
  }

  @Post('/register')
  public async register(
    @Body() body: Partial<RegistrationOptions>,
  ): Promise<RegistrationResponse> {
    const response = await new AuthService().register(body);
    return response;
  }

}
