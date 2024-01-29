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
  
  @Post('/interact/:target/:type')
  public static async interactWithPublisher(
    @Request() req: ExpressRequest,
    @Path() target: string,
    @Path() type: InteractionType,
    @Body() body: Partial<InteractionCreationAttributes>
  ): Promise<PublicPublisherAttributes> {
    const user = req.jwt?.user;
    const publisher = await Publisher.findOne({ where: { name: target } });
    if (!user || !publisher) {
      return undefined;
    }
    if (body.revert) {
      await PublisherInteraction.destroy({
        where: {
          targetId: publisher.id,
          type, 
          userId: user.id,
        },
      });
    }
    const interaction = await PublisherInteraction.create({
      ...body,
      remoteAddr: req.ip,
      targetId: publisher.id,
      type, 
      userId: user.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Publisher.scope('public').findByPk(publisher?.id);
    return resource;
  }

}