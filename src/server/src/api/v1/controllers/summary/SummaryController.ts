import { Op } from 'sequelize';
import {
  Body,
  Get,
  Path,
  Post,
  Query,
  Route,
  Security,
  Tags,
} from 'tsoa';

import {
  BulkResponse,
  FindAndCountOptions,
  InteractionRequest,
  InteractionResponse,
  InteractionType,
  SUMMARY_ATTRS,
  Summary,
  SummaryAttr,
  SummaryAttributes,
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

@Route('/v1/summary')
@Tags('Summary')
export class SummaryController {

  @Get('/')
  public static async getSummaries(
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<SummaryAttr>> {
    const options: FindAndCountOptions<Summary> = {
      attributes: [...SUMMARY_ATTRS],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    };
    options.where = applyFilter(filter);
    return await Summary.findAndCountAll(options);
  }

  @Get('/:category/')
  public static async getSummariesForCategory(
    @Path() category: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<{
    count: number;
    rows: SummaryAttr[];
  }> {
    const options: FindAndCountOptions<Summary> = {
      attributes: [...SUMMARY_ATTRS],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ category }, applyFilter(filter)].filter((f) => !!f) },
    };
    return await Summary.findAndCountAll(options);
  }

  @Get('/:category/:subcategory')
  public static async getSummariesForCategoryAndSubcategory(
    @Path() category: string,
    @Path() subcategory: string,
    @Query() filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<SummaryAttr>> {
    const options: FindAndCountOptions<Summary> = {
      attributes: [...SUMMARY_ATTRS],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
      where: { [Op.and]: [{ category }, { subcategory }, applyFilter(filter)].filter((f) => !!f) },
    };
    return await Summary.findAndCountAll(options);
  }

  @Get('/:category/:subcategory/:title')
  public static async getSummaryForCategoryAndSubcategoryAndTitle(
    @Path() category: string,
    @Path() subcategory: string,
    @Path() title: string
  ): Promise<SummaryAttributes> {
    const options: FindAndCountOptions<Summary> = {
      where: {
        category,
        subcategory,
        title,
      },
    };
    return await Summary.findOne(options);
  }
  
  @Security('jwt')
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<InteractionResponse> {
    const { user } = await User.from(body);
    const { value } = body;
    await user.interactWith({ id: targetId, type: 'summary' }, type, value);
    return { id: 0 };
  }

}
