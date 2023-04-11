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
  Release,
  ReleaseAttributes,
} from '../../schema';

@Route('/v1/release')
@Tags('Release')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class VersionController {
  
  @Get('/')
  public static async getReleases(
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<BulkResponse<ReleaseAttributes>> {
    const options: FindAndCountOptions<Release> = { order: [['createdAt', 'DESC']] };
    const releases = await Release.findAndCountAll(options);
    return releases;
  }
  
}