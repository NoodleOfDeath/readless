import { Request as ExpressRequest } from 'express';
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
 
import {
  BaseController,
  BulkResponse,
  InteractionRequest,
} from '..';
import { SupportedLocale } from '../../../../core/locales';
import { AuthError, InternalError } from '../../middleware';
import { 
  InteractionType,
  PublicPublisherAttributes, 
  Publisher,
  PublisherInteraction,
  User,
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
    @Body() body: InteractionRequest
  ): Promise<PublicPublisherAttributes> {
    const user = await User.fromJwt(req.body, { ignoreIfNotResolved: true, ...req.body });
    const {
      content, metadata, remoteAddr, 
    } = body;
    const interaction = await PublisherInteraction.create({
      content, metadata, remoteAddr, targetId, type, userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Publisher.scope('public').findByPk(targetId);
    return resource;
  }

}