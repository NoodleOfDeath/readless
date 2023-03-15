import { Op } from 'sequelize';
import {
  Get, Path, Query, Route, Tags, 
} from 'tsoa';

import { FindAndCountOptions, SOURCE_ATTRS } from '../../schema/types';
import {
  Source,
  SourceWithOutletAttr,
  SourceWithOutletName,
} from '../../schema/models';

function applyFilter(filter?: string) {
  if (!filter || filter.replace(/\s/g, '').length === 0) {
    return undefined;
  }
  return {
    [Op.or]: [
      { title: { [Op.iRegexp]: filter } },
      { originalTitle: { [Op.iRegexp]: filter } },
      { text: { [Op.iRegexp]: filter } },
      { abridged: { [Op.iRegexp]: filter } },
      { summary: { [Op.iRegexp]: filter } },
      { shortSummary: { [Op.iRegexp]: filter } },
      { bullets: { [Op.contains]: [filter] } },
      { category: { [Op.iRegexp]: filter } },
      { subcategory: { [Op.iRegexp]: filter } },
      { tags: { [Op.contains]: [filter] } },
      { url: { [Op.iRegexp]: filter } },
    ],
  };
}

@Route('/v1/sources')
@Tags('Sources')
export class SourceController {

  @Get('/')
  public async getSources(
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<{
    count: number;
    rows: SourceWithOutletAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    };
    options.where = applyFilter(filter);
    return await Source.findAndCountAll(options);
  }

  @Get('/:category/')
  public async getSourcesForCategory(
    @Path() category: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<{
    count: number;
    rows: SourceWithOutletAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ category }, applyFilter(filter)].filter((f) => !!f) },
    };
    return await Source.findAndCountAll(options);
  }

  @Get('/:category/:subcategory')
  public async getSourcesForCategoryAndSubcategory(
    @Path() category: string,
    @Path() subcategory: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
  ): Promise<{
    count: number;
    rows: SourceWithOutletAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ category }, { subcategory }, applyFilter(filter)].filter((f) => !!f) },
    };
    return await Source.findAndCountAll(options);
  }

  @Get('/:category/:subcategory/:title')
  public async getSourceForCategoryAndSubcategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string,
  ): Promise<SourceWithOutletName> {
    const options: FindAndCountOptions<Source> = {
      where: {
        category,
        subcategory,
        title,
      },
    };
    return await Source.findOne(options);
  }

}
