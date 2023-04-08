import { Op } from 'sequelize';
import {
  Body,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { PayloadWithUserId } from '../../../../services/types';
import { AuthError, InternalError } from '../../middleware';
import {
  BulkResponse,
  DestroyResponse,
  FindAndCountOptions,
  InteractionRequest,
  InteractionResponse,
  InteractionType,
  Summary,
  SummaryResponse,
  User,
} from '../../schema';
import { SummaryInteraction } from '../../schema/resources/summary/SummaryInteraction.model';

function applyFilter(filter?: string, ids?: number[]) {
  if (!filter || /\S+/.test(filter) === false) {
    return undefined;
  }
  const [q, prefix, prefixValue, q2] = /([^:]+)(?::([\w-]+)(?:\s+(.*))?)?/.exec(filter);
  let query = q;
  const where: FindAndCountOptions<Summary>['where'] = {};
  if (/cat(egory)?/i.test(prefix)) {
    const category = `%${prefixValue.replace(/-([a-z])/gi, ($0, $1) => ` ${$1}` )}%`;
    console.log(category);
    where.category = { [Op.iLike]: category };
    query = q2;
  }
  if (ids) {
    where.id = ids;
  }
  if (query) {
    const queries = query.split(' ');
    where[Op.or] = [];
    for (const query of queries) {
      where[Op.or].push({
        [Op.or]: {
          bullets: { [Op.contains] : [query] },
          longSummary: { [Op.iLike] : `%${query}%` },
          shortSummary: { [Op.iLike] : `%${query}%` },
          summary: { [Op.iLike] : `%${query}%` },
          tags: { [Op.contains] : [query] },
          text: { [Op.iLike] : `%${query}%` },
          title: { [Op.iLike] : `%${query}%` },
          url: { [Op.iLike] : `%${query}%` },
        },
      });
    }
  }
  return where;
}

@Route('/v1/summary')
@Tags('Summary')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class SummaryController {

  @Get('/')
  public static async getSummaries(
    @Query() userId?: number,
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkResponse<SummaryResponse>> {
    const options: FindAndCountOptions<Summary> = {
      attributes: { exclude: ['filteredText', 'rawText'] },
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    };
    const appliedFilter = applyFilter(filter, ids);
    if (appliedFilter) {
      options.where = appliedFilter;
    }
    const summaries = await Summary.findAndCountAll(options);
    if (userId) {
      await Promise.all(summaries.rows.map(async (row) => await row.addUserInteractions(userId)));
    }
    return summaries;
  }
  
  @Post('/interact/:targetId/view')
  public static async recordSummaryView(
    @Path() targetId: number,
    @Body() body: InteractionRequest
  ): Promise<InteractionResponse> {
    const {
      content, metadata, remoteAddr, 
    } = body;
    const interaction = await SummaryInteraction.create({
      content, metadata, remoteAddr, targetId, type: 'view',
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Summary.findByPk(targetId);
    return resource.toJSON().interactions;
  }
  
  @Security('jwt', ['standard:write'])
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<InteractionResponse> {
    const { user } = await User.from(body);
    const {
      content, metadata, remoteAddr, 
    } = body;
    const resource = await user.interactWithSummary(targetId, type, remoteAddr, content, metadata);
    return resource.toJSON().interactions;
  }
  
  @Security('jwt', ['god:*'])
  @Delete('/:targetId')
  public static async destroySummary(
    @Path() targetId: number,
    @Body() body: PayloadWithUserId
  ): Promise<DestroyResponse> {
    const { user } = await User.from(body);
    await user.destroySummary(targetId);
    return { success: true };
  }
  
  @Security('jwt', ['god:*'])
  @Patch('/restore/:targetId')
  public static async restoreSummary(
    @Path() targetId: number,
    @Body() body: PayloadWithUserId
  ): Promise<DestroyResponse> {
    const { user } = await User.from(body);
    await user.restoreSummary(targetId);
    return { success: true };
  }

}
