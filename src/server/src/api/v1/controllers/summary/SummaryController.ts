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

import { MailService } from '../../../../services';
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
import { orderByToItems } from '../../schema/types';

function parsePrefilter(prefilter: string) {
  return { [Op.or]: prefilter.split(',').map((c) => ({ [Op.iLike]: `%${c}%` })) };
}

function applyFilter(options: FindAndCountOptions<Summary>, filter = '', ids: number[] = [], excludeIds = false) {
  const newOptions = { ...options };
  if (!filter && ids.length === 0) {
    return newOptions;
  }
  const where: FindAndCountOptions<Summary>['where'] = {};
  if (ids.length > 0) {
    const set = Array.isArray(ids) ? ids : [ids];
    where.id = excludeIds ? { [Op.notIn]: set } : { [Op.in]: set };
  }
  const splitExpr = /\s*((?:\w+:(?:[-\w.]*(?:,[-\w.]*)*))(?:\s+\w+:(?:[-\w.]*(?:,[-\w.]*)*))*)?(.*)/i;
  const [_, prefilter, q] = splitExpr.exec(filter);
  const query = q ?? '';
  if (prefilter) {
    const expr = /(\w+):([-\w.]*(?:,[-\w.]*)*)/gi;
    const matches = prefilter.matchAll(expr);
    if (matches) {
      for (const match of matches) {
        const [_, prefix, prefixValues] = match;
        const pf = parsePrefilter(prefixValues);
        if (/cat(egory)?/i.test(prefix)) {
          where.category = pf;
        }
        if (/outlet|source|src/i.test(prefix)) {
          newOptions.include = [{
            model: Outlet,
            where: { name: pf },
          }];
        }
      }
    }
  }
  if (query && query.length > 0) {
    const subqueries = query.replace(/\s\s+/g, ' ').split(' ');
    where[Op.or] = [];
    for (const subquery of subqueries) {
      where[Op.or].push({
        [Op.or]: {
          bullets: { [Op.contains] : [subquery] },
          longSummary: { [Op.iLike] : `%${subquery}%` },
          shortSummary: { [Op.iLike] : `%${subquery}%` },
          summary: { [Op.iLike] : `%${subquery}%` },
          tags: { [Op.contains] : [subquery] },
          text: { [Op.iLike] : `%${subquery}%` },
          title: { [Op.iLike] : `%${subquery}%` },
          url: { [Op.iLike] : `%${subquery}%` },
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
    @Query() scope = 'public',
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() excludeIds?: boolean,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() order: string[] = ['createdAt:desc', 'originalDate:desc']
  ): Promise<BulkResponse<PublicSummaryAttributes>> {
    const options: FindAndCountOptions<Summary> = {
      limit: pageSize,
      offset,
      order: orderByToItems(order),
    };
    const filteredOptions = applyFilter(options, filter, ids, excludeIds);
    const summaries = await Summary.scope(scope).findAndCountAll(filteredOptions);
    await Promise.all(summaries.rows.map(async (row) => await SummaryInteraction.create({
      targetId: row.id,
      type: 'view',
    })));
    if (userId && scope === 'public') {
      await Promise.all(summaries.rows.map(async (row) => await row.addUserInteractions(userId)));
    }
    return summaries;
  }
  
  @Security('jwt')
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<InteractionResponse> {
    const { user } = await User.from(body, { ignoreIfNotResolved: true });
    const {
      content, metadata, remoteAddr, 
    } = body;
    const interaction = await SummaryInteraction.create({
      content, metadata, remoteAddr, targetId, type, userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    if (type === 'feedback') {
      await new MailService().sendMail({
        from: 'user@readless.ai',
        subject: 'Feedback',
        text: [content, JSON.stringify(metadata)].join('\n\n'),
        to: 'feedback@readless.ai',
      });
    }
    const resource = await Summary.scope('public').findByPk(targetId);
    if (user) {
      await resource.addUserInteractions(user.id);
    }
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
