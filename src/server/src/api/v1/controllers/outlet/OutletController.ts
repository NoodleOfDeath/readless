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
  BulkResponse,
  FindAndCountOptions,
  Outlet,
  PUBLIC_OUTLET_ATTRIBUTES,
  PUBLIC_SUMMARY_ATTRIBUTES,
  PublicOutletAttributes,
  Summary,
  SummarySentiment,
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
    const options: FindAndCountOptions<Outlet> = {
      attributes: [[sql.fn('avg', sql.col('sentiment.score')), 'average_sentiment']],
      group: [...PUBLIC_OUTLET_ATTRIBUTES, ...PUBLIC_SUMMARY_ATTRIBUTES],
      include: [
        Summary,
        SummarySentiment,
      ],
      order: [['displayName', 'ASC']],
      raw: true,
    };
    const outlets = await Outlet.scope('public').findAndCountAll(options);
    return outlets;
  }
  
}