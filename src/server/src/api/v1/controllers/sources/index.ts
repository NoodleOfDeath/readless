import { SourceAttributes } from './../../../../schema/v1/models/source.model';
import { Get, Query, Path, Route } from 'tsoa';
import { Source } from '../../../../schema/v1/models';
import { FindAndCountOptions } from '../../../../schema/v1/models/types';

@Route('/v1/sources')
export class SourceController {
  @Get('/')
  public async getSources(
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<SourceAttributes[]> {
    const options: FindAndCountOptions<Source> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    };
    const sources = await Source.findAndCountAll(options);
    return sources.rows;
  }

  @Get('/:category/')
  public async getSourcesForCategory(
    @Path() category: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<SourceAttributes[]> {
    const options: FindAndCountOptions<Source> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
      },
    };
    const sources = await Source.findAndCountAll(options);
    return sources.rows;
  }

  @Get('/:category/:subcategory')
  public async getSourcesForCategoryAndSubCategory(
    @Path() category: string,
    @Path() subcategory: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<SourceAttributes[]> {
    const options: FindAndCountOptions<Source> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
        subcategory,
      },
    };
    const sources = await Source.findAndCountAll(options);
    return sources.rows;
  }

  @Get('/:category/:subcategory/:title')
  public async getSourcesForCategoryAndSubCategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<SourceAttributes[]> {
    const options: FindAndCountOptions<Source> = {
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: {
        category,
        subcategory,
        title,
      },
    };
    const sources = await Source.findAndCountAll(options);
    return sources.rows;
  }
}
