import { Get, Route } from 'tsoa';
import { Source } from '../../../../schema/v1/models';
import { FindAndCountOptions } from '../../../../schema/v1/models/types';

@Route('/v1/sources')
export class SourceController {
  @Get('/:category?/:subcategory?/:title?')
  public async getSources(
    category?: string,
    subcategory?: string,
    title?: string,
    pageSize = 10,
    page = 0,
    offset = pageSize * page,
  ): Promise<Source[]> {
    const options: FindAndCountOptions<Source> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    };
    const filters: Record<string, string> = {};
    if (title) filters.title = title;
    if (category) filters.category = category;
    if (subcategory) filters.subcategory = subcategory;
    if (Object.keys(filters).length > 0) {
      options.where = filters;
    }
    const sources = await Source.findAndCountAll(options);
    return sources.rows;
  }
}
