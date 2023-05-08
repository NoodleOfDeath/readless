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
  Category,
  FindAndCountOptions,
  PublicCategoryAttributes,
} from '../../schema';

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
    @Query() userId?: number,
    @Query() filter?: string
  ): Promise<BulkResponse<PublicCategoryAttributes>> {
    const options: FindAndCountOptions<Category> = { order: [['name', 'ASC']] };
    const categories = await Category.scope('public').findAll(options);
    return {
      count: categories.length,
      rows: categories,
    };
  }
  
}