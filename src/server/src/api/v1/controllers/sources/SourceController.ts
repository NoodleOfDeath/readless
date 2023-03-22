import { Op } from 'sequelize';
import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from 'tsoa';

import {
  BulkResponse,
  FindAndCountOptions,
  InteractionRequest,
  InteractionResponse,
  InteractionType,
  SOURCE_ATTRS,
  Source,
  SourceAttr,
  SourceAttributes,
  User,
} from '../../schema';

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
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<SourceAttr>> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset,
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
    @Query() offset = pageSize * page
  ): Promise<{
    count: number;
    rows: SourceAttr[];
  }> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset,
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
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<SourceAttr>> {
    const options: FindAndCountOptions<Source> = {
      attributes: [...SOURCE_ATTRS],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ category }, { subcategory }, applyFilter(filter)].filter((f) => !!f) },
    };
    return await Source.findAndCountAll(options);
  }

  @Get('/:category/:subcategory/:title')
  public async getSourceForCategoryAndSubcategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string
  ): Promise<SourceAttributes> {
    const options: FindAndCountOptions<Source> = {
      where: {
        category,
        subcategory,
        title,
      },
    };
    return await Source.findOne(options);
  }
  
  @Post('/interact/:targetId/:type')
  public async interactWithSource(
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<InteractionResponse> {
    const { user } = await User.from(body);
    console.log(user);
    return { id: 0 };
  }

}
