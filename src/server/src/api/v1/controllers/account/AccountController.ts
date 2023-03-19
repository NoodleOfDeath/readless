import {
  Body,
  Put,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { AccountService, AuthError } from '../../../../services';
import { MutateAccountRequest, MutateAccountResponse } from '../../../../services/types';

@Route('/v1/account')
@Tags('Account')
@Response<AuthError>(401, 'Unauthorized')
@Response<AuthError>(500, 'Internal Server Error')
export class AccountController {

  @Put('/update')
  @SuccessResponse(200, 'OK')
  public async updateAccount(@Body() body: Partial<MutateAccountRequest>): Promise<MutateAccountResponse> {
    return await new AccountService().mutateAccount(body);
  }
  
}