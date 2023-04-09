import {
  Get,
  Path,
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
  Status,
  StatusAttributes,
} from '../../schema';

@Route('/v1/status')
@Tags('Status')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class StatusController {
  
  @Get('/')
  public static async getStatuses(
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<BulkResponse<StatusAttributes>> {
    const options: FindAndCountOptions<Status> = { order: [['name', 'ASC']] };
    const statuses = await Status.findAndCountAll(options);
    return statuses;
  }
  
  @Get('/:name')
  public static async getStatus(
    @Path() name: string,
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<StatusAttributes> {
    const status = await Status.findOne({ where: { name } });
    return status;
  }
  
}