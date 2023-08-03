import { Request as ExpressRequest } from 'express';
import {
  Get,
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
import { AuthError, InternalError } from '../../middleware';
import { Category, PublicCategoryAttributes } from '../../schema';

@Route('/v1/category')
@Tags('Category')
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
    @Query() _userId?: number,
    @Query() _filter?: string
  ): Promise<BulkResponse<PublicCategoryAttributes>> {
    const params = this.serializeParams(req);
    const categories = await Category.getCategories(locale ?? params.locale);
    return categories;
  }
  
}