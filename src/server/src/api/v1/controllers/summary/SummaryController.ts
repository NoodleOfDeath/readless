//import ms from 'ms';
import { 
  Includeable, 
  Op,
  QueryTypes,
} from 'sequelize';
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

import { GET_SUMMARY_TOKEN_COUNTS } from './queries';
import { MailService } from '../../../../services';
import { PayloadWithUserId } from '../../../../services/types';
import { AuthError, InternalError } from '../../middleware';
import {
  BulkMetadataResponse,
  BulkResponse,
  Category,
  DestroyResponse,
  FindAndCountOptions,
  InteractionRequest,
  InteractionResponse,
  InteractionType,
  Outlet,
  PublicSummaryAttributes,
  Summary,
  SummaryInteraction,
  SummaryTokenAttributes,
  User,
} from '../../schema';
import { SummarySentimentAttributes, orderByToItems } from '../../schema/types';
import { BaseControllerWithPersistentStorageAccess } from '../Controller';

function parsePrefilter(prefilter: string) {
  return { [Op.or]: prefilter.split(',').map((c) => ({ [Op.iLike]: c.trim() })) };
}

function applyFilter(
  options: FindAndCountOptions<Summary>,
  filter = '', 
  ids: number[] = [], 
  excludeIds = false,
  matchType: 'any' | 'all' = 'any'
) {
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
  const query = (q ?? '').trim();
  if (prefilter) {
    const expr = /(\w+):([-\w.]*(?:,[-\w.]*)*)/gi;
    const matches = prefilter.matchAll(expr);
    if (matches) {
      const include: Includeable[] = [];
      for (const match of matches) {
        const [_, prefix, prefixValues] = match;
        const pf = parsePrefilter(prefixValues);
        if (/cat(egory)?/i.test(prefix)) {
          include.push({
            model: Category.scope('raw'),
            where: { name: pf },
          });
        }
        if (/outlet|source|src/i.test(prefix)) {
          include.push({
            model: Outlet.scope('raw'),
            where: { name: pf },
          });
        }
      }
      newOptions.include = include;
    }
  }
  if (query && query.length > 0) {
    const matches = query.replace(/\s\s+/g, ' ').matchAll(/(['"])(.+?)\1|\b([\S]+)\b/gm);
    if (matches) {
      const subqueries = [...matches].map((match) => ({
        boundaries: Boolean(match[1]),
        value: match[1] ? match[2] : match[3],
      }));
      where[Op.or] = [];
      if (matchType === 'all') {
        where[Op.or].push(subqueries.map((subquery) => ({ bullets: { [Op.contains] : [subquery.value] } })));
        where[Op.or].push(subqueries.map((subquery) => ({ shortSummary: { [Op.iRegexp] : subquery.boundaries ? `\\y${subquery.value}\\y` : subquery.value } })));
        where[Op.or].push(subqueries.map((subquery) => ({ summary: { [Op.iRegexp] : subquery.boundaries ? `\\y${subquery.value}\\y` : subquery.value } })));
        where[Op.or].push(subqueries.map((subquery) => ({ title: { [Op.iRegexp] : subquery.boundaries ? `\\y${subquery.value}\\y` : subquery.value } })));
      } else {
        for (const subquery of subqueries) {
          where[Op.or].push({
            [Op.or]: {
              bullets: { [Op.contains] : [subquery.value] },
              shortSummary: { [Op.iRegexp] : subquery.boundaries ? `\\y${subquery.value}\\y` : subquery.value },
              summary: { [Op.iRegexp] : subquery.boundaries ? `\\y${subquery.value}\\y` : subquery.value },
              title: { [Op.iRegexp] : subquery.boundaries ? `\\y${subquery.value}\\y` : subquery.value },
            },
          });
        }
      } 
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
export class SummaryController extends BaseControllerWithPersistentStorageAccess {

  @Get('/')
  public static async getSummaries(
    @Query() userId?: number,
    @Query() scope = 'public',
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() excludeIds?: boolean,
    @Query() match?: 'all' | 'any',
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() order: string[] = ['originalDate:desc', 'createdAt:desc']
  ): Promise<BulkMetadataResponse<PublicSummaryAttributes, { [key:string]: SummarySentimentAttributes }>> {
    const options: FindAndCountOptions<Summary> = {
      limit: pageSize,
      offset,
      order: orderByToItems(order),
    };
    const filteredOptions = applyFilter(options, filter, ids, excludeIds, match);
    const summaries = await Summary.scope(scope).findAndCountAll(filteredOptions);
    if (userId && scope === 'public') {
      await Promise.all(summaries.rows.map(async (row) => await row.addUserInteractions(userId)));
    }
    return summaries;
  }
  
  @Get('/trends')
  public static async getTrends(
    @Query() userId?: number,
    @Query() filter?: string,
    @Query() interval = '7d',
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() order: string[] = ['count:desc']
  ): Promise<BulkResponse<SummaryTokenAttributes>> {
    const records = await this.store.query(GET_SUMMARY_TOKEN_COUNTS, {
      nest: true,
      replacements: {
        interval,
        limit: Number(pageSize),
        offset,
        order,
      },
      type: QueryTypes.SELECT,
    });
    return (records?.[0] ?? { count: 0, rows: [] }) as BulkResponse<SummaryTokenAttributes>;
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
      await new MailService().sendMailFromTemplate({
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
