import {
  Get,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
 
import { BulkResponse } from '../';
import { AuthError, InternalError } from '../../middleware';
import {
  FindAndCountOptions,
  Outlet,
  PublicOutletAttributes,
} from '../../schema';

@Route('/v1/outlet')
@Tags('Outlet')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class OutletController {
  
  @Get('/')
  public static async getOutlets(
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<BulkResponse<PublicOutletAttributes>> {
    const options: FindAndCountOptions<Outlet> = { order: [['displayName', 'ASC']] };
    const outlets = await Outlet.scope('public').findAndCountAll(options);
    return outlets;
  }
  
}