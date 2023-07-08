import {
  Get,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
 
import { BulkResponse } from '..';
import { AuthError, InternalError } from '../../middleware';
import {
  FindAndCountOptions,
  PublicPublisherAttributes,
  Publisher,
} from '../../schema';

@Route('/v1/publisher')
@Tags('Publisher')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class PublisherController {
  
  @Get('/')
  public static async getPublishers(
    @Query() _userId?: number,
    @Query() _filter?: string
  ): Promise<BulkResponse<PublicPublisherAttributes>> {
    const options: FindAndCountOptions<Publisher> = { order: [['displayName', 'ASC']] };
    const publishers = await Publisher.scope('public').findAndCountAll(options);
    return publishers;
  }
  
}