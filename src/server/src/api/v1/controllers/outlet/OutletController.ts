import {
  Get,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
  
import { AuthError, InternalError } from '../../middleware';
import {
  BulkResponse,
  FindAndCountOptions,
  Outlet,
  OutletAttributes,
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
  ): Promise<BulkResponse<OutletAttributes>> {
    const options: FindAndCountOptions<Outlet> = { order: [['name', 'ASC']] };
    const outlets = await Outlet.findAndCountAll(options);
    return outlets;
  }
  
}