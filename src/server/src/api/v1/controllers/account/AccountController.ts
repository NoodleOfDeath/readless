import {
  Body,
  Header,
  Put,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';

import {
  UpdateCredentialRequest,
  UpdateCredentialResponse,
} from './../../../../services/account/types';
import { AccountService, AuthError } from '../../../../services';

@Route('/v1/account')
@Tags('Account')
@Response<AuthError>(401, 'Unauthorized')
@Response<AuthError>(500, 'Internal Server Error')
export class AccountController {

  @Put('/update/credential')
  @Header('Authorization')
  @SuccessResponse(200, 'OK')
  public async updateCredential(@Body() body: Partial<UpdateCredentialRequest>): Promise<UpdateCredentialResponse> {
    return await new AccountService().updateCredential(body as Partial<UpdateCredentialRequest>);
  }
  
}