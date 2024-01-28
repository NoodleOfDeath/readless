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
  
import { BaseController, BulkResponse } from '../';
import { SupportedLocale } from '../../../../core/locales';
import {
  AuthError,
  Request as ExpressRequest,
  InternalError,
} from '../../middleware';
import {
  Category,
  CategoryInteraction,
  InteractionCreationAttributes,
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
  
  @Post('/interact/:target/:type')
  public static async interactWithCategory(
    @Request() req: ExpressRequest,
    @Path() target: string,
    @Path() type: InteractionType,
    @Body() body: Partial<InteractionCreationAttributes>
  ): Promise<PublicCategoryAttributes> {
    const user = req.jwt?.user;
    const category = await Category.findOne({ where: { name: target } });
    const interaction = await CategoryInteraction.create({
      ...body, 
      remoteAddr: req.ip,
      targetId: category?.id,
      type,
      userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Category.scope('public').findByPk(category?.id);
    return resource;
  }
  
}