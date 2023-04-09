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
  Outlet,
  PublicSummaryAttributes,
  Summary,
  SummaryInteraction,
  User,
} from '../../schema';

function parsePrefilter(prefilter: string) {
  return { [Op.or]: prefilter.split(',').map((c) => ({ [Op.iLike]: `%${c}%` })) };
}

function applyFilter(options: FindAndCountOptions<Summary>, filter?: string, ids?: number[]) {
  const newOptions = { ...options };
  if (!filter || /\S+/.test(filter) === false) {
    return newOptions;
  }
  const where: FindAndCountOptions<Summary>['where'] = {};
  const splitExpr = /\s*((?:[\w]+:(?:[-\w.]*(?:,[-\w.]*)*))(?:\s+[\w]+:(?:[-\w.]*(?:,[-\w.]*)*))*)(.*)/i;
  const [$0, prefilter, q] = splitExpr.exec(filter);
  let query = $0;
  if (prefilter) {
    const expr = /([\w]+):([-\w.]*(?:,[-\w.]*)*)/gi;
    const matches = prefilter.matchAll(expr);
    if (matches) {
      for (const match of matches) {
        const [_, prefix, prefixValues] = match;
        if (/cat(egory)?/i.test(prefix)) {
          where.category = parsePrefilter(prefixValues.replace(/-([a-z])/gi, (_, $1) => ` ${$1}`));
          query = q;
        }
        if (/outlet|source|src/i.test(prefix)) {
          newOptions.include = [{
            model: Outlet,
            where: { name: parsePrefilter(prefixValues) },
          }];
          query = q;
        }
      }
    }
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
  newOptions.where = where;
  return newOptions;
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
  ): Promise<BulkResponse<PublicSummaryAttributes>> {
    const options: FindAndCountOptions<Summary> = {
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    };
    const filteredOptions = applyFilter(options, filter, ids);
    const summaries = await Summary.scope('public').findAndCountAll(filteredOptions);
    await Promise.all(summaries.rows.map(async (row) => await SummaryInteraction.create({
      targetId: row.id,
      type: 'view',
    })));
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
    const resource = await Summary.scope('public').findByPk(targetId);
    return resource.interactions;
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
    return resource.interactions;
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
