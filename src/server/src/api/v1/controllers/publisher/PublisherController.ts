import { Request as ExpressRequest } from 'express';
import {
  Get,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
 
import { BaseController, BulkResponse } from '..';
import { ClientSupportedLocale as SupportedLocale } from '../../../../core/locales';
import { AuthError, InternalError } from '../../middleware';
import { PublicPublisherAttributes, Publisher } from '../../schema';

@Route('/v1/publisher')
@Tags('Publisher')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class PublisherController extends BaseController {
  
  @Get('/')
  public static async getPublishers(
    @Request() req: ExpressRequest,
    @Query() locale?: SupportedLocale,
    @Query() _userId?: number,
    @Query() _filter?: string
  ): Promise<BulkResponse<PublicPublisherAttributes>> {
    const params = this.serializeParams(req);
    console.log('fuck', params);
    const publishers = await Publisher.getPublishers(locale ?? params.locale);
    return publishers;
  }
  
}