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
  
import { BulkResponse } from '../';
import { parseLocale } from '../../../../core/locales';
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
export class CategoryController {
  
  @Get('/')
  public static async getCategories(
    @Request() req: ExpressRequest,
    @Query() locale = parseLocale(req.query['locale']),
    @Query() _userId?: number,
    @Query() _filter?: string
  ): Promise<BulkResponse<PublicCategoryAttributes>> {
    const params = { locale: locale ?? parseLocale(req.headers['x-locale']) };
    const categories = await Category.getCategories(params.locale);
    return categories;
  }
  
}