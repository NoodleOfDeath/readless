/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from '../';
import { SupportedLocale } from '../../../../core/locales';
import {
  AuthError,
  Request as ExpressRequest,
  InternalError,
} from '../../middleware';
import {
  Category,
  CategoryInteraction,
  InteractionType,
  PublicCategoryAttributes,
} from '../../schema';

@Route('/v1/category')
@Tags('Categories')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class CategoryController extends BaseController {
  
  @Get('/')
  public static async getCategories(
    @Request() req: ExpressRequest,
    @Query() locale?: SupportedLocale,
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<BulkResponse<PublicCategoryAttributes>> {
    const params = this.serializeParams(req);
    const categories = await Category.getCategories(locale ?? params.locale);
    return categories;
  }
  
  @Post('/interact/:targetId/:type')
  public static async interactWithCategory(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<PublicCategoryAttributes> {
    const user = req.jwt?.user;
    const {
      content, metadata, remoteAddr, 
    } = body;
    const interaction = await CategoryInteraction.create({
      content, metadata, remoteAddr, targetId, type, userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Category.scope('public').findByPk(targetId);
    return resource;
  }
  
}