import sql from 'sequelize';
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
  BulkMetadataResponse,
  FindAndCountOptions,
  Outlet,
  PublicOutletAttributes,
  Summary,
} from '../../schema';
import { Sentiment } from '../../schema/types';

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
  ): Promise<BulkMetadataResponse<PublicOutletAttributes>> {
    const options: FindAndCountOptions<Outlet> = {
      attributes: [sql.fn('avg', 'summaries.sentiment -> \'chatgpt\' -> \'score\''), 'average_sentiment']
      include: [
        Summary.scope('public_raw'),
      ],
      order: [['displayName', 'ASC']],
      raw: true,
    };
    const outlets = await Outlet.scope('public').findAndCountAll(options);
    return outlets;
  }
  
}