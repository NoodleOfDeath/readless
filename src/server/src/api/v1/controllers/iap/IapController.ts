import {
  Body,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { IapService, PurchaseRequest } from '../../../../services';
import { AuthError, InternalError } from '../../middleware';
import { PublicIapVoucherAttributes } from '../../schema';

@Route('/v1/iap')
@Tags('Iap')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class IapController {
  
  @Post('iap')
  public static async processPurchase(
    @Request() req,
    @Body() body: PurchaseRequest
  ): Promise<PublicIapVoucherAttributes> {
    return await IapService.processPurchase(body);
  }
  
}