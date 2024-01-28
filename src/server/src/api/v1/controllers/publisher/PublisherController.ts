import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';
 
import { BaseController, BulkResponse } from '..';
import { SupportedLocale } from '../../../../core/locales';
import {
  AuthError,
  Request as ExpressRequest,
  InternalError,
} from '../../middleware';
import { 
  InteractionCreationAttributes,
  InteractionType,
  PublicPublisherAttributes, 
  Publisher,
  PublisherInteraction,
} from '../../schema';

@Route('/v1/publisher')
@Tags('Publishers')
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
    const publishers = await Publisher.getPublishers(locale ?? params.locale);
    return publishers;
  }
  
  @Post('/interact/:targetId/:type')
  public static async interactWithPublisher(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionCreationAttributes,
  ): Promise<PublicPublisherAttributes> {
    const user = req.jwt?.user;
    const interaction = await PublisherInteraction.create({
      ...body,
      remoteAddr: req.ip,
      targetId,
      type, 
      userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Publisher.scope('public').findByPk(targetId);
    return resource;
  }

}