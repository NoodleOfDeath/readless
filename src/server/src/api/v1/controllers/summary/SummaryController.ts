//import ms from 'ms';
import { QueryTypes } from 'sequelize';
import {
  Body,
  Delete,
  Deprecated,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { GET_SUMMARIES, GET_SUMMARY_TOKEN_COUNTS } from './queries';
import {
  BulkMetadataResponse,
  BulkResponse,
  DestroyResponse,
  InteractionRequest,
} from '../';
import { MailService } from '../../../../services';
import { PayloadWithUserId } from '../../../../services/types';
import { parseDate } from '../../../../utils';
import { AuthError, InternalError } from '../../middleware';
import {
  Cache,
  InteractionType,
  PublicSummaryAttributes,
  PublicTokenAttributes,
  PublicTokenTypeAttributes,
  Summary,
  SummaryInteraction,
  TokenType,
  User,
} from '../../schema';
import { PublicSummaryGroups, TokenTypeName } from '../../schema/types';
import { BaseControllerWithPersistentStorageAccess } from '../Controller';

function parseTimeInterval(str: string) {
  const matches = str.match(/(\d+)\s*(months?|m(?:in(?:ute)?s?)?|h(?:(?:ou)?rs?)?|d(?:ays?)?|w(?:(?:ee)?ks?)?|y(?:(?:ea)?rs?)?)/i);
  if (matches && matches[1] && matches[2]) {
    const n = matches[1];
    const unit = matches[2];
    if (n && unit) {
      return `${n}${/month/i.test(unit) ? unit : unit[0]}`;
    }
  }
}

function applyFilter(
  filter = '', 
  matchType: 'any' | 'all' = 'any'
) {
  const categories: string[] = [];
  const outlets: string[] = [];
  let interval: string;
  if (!filter) {
    return {
      categories,
      filter: '.',
      outlets,
    };
  }
  const splitExpr = /\s*((?:\w+:(?:[-\w.]*(?:,[-\w.]*)*))(?:\s+\w+:(?:[-\w.]*(?:,[-\w.]*)*))*)?(.*)/i;
  const [_, prefilter, q] = splitExpr.exec(filter);
  let query = (q ?? '').trim();
  if (prefilter) {
    const expr = /(\w+):([-\w.]*(?:,[-\w.]*)*)/gi;
    const matches = prefilter.matchAll(expr);
    if (matches) {
      for (const match of matches) {
        const [_, prefix, prefixValues] = match;
        const pf = prefixValues.split(',');
        if (/^cat(egory)?$/i.test(prefix)) {
          categories.push(...pf);
        }
        if (/^(?:outlet|source|src)$/i.test(prefix)) {
          outlets.push(...pf);
        }
        if (/^[lp]ast$/i.test(prefix)) {
          const timeInterval = parseTimeInterval(prefixValues);
          if (timeInterval) {
            interval = timeInterval;
          }
        }
      }
    }
  }
  const parts: string[] = [];
  if (query && query.length > 0) {
    const timeMatches = query.match(/(.*?)(?:in\s+)?(?:the\s+)?[pl]ast\s+(\d+\s*(?:months?|m(?:in(?:ute)?s?)?|h(?:(?:ou)?rs?)?|d(?:ays?)?|w(?:(?:ee)?ks?)?|y(?:(?:ea)?rs?)?))/i);
    if (!interval && timeMatches && timeMatches[2]) {
      interval = parseTimeInterval(timeMatches[2]);
      if (interval) {
        query = timeMatches[1];
      }
    }
    const matches = 
      query.replace(/\s\s+/g, ' ')
        .replace(/[-+*|=<>.^$!?(){}[\]\\]/g, ($0) => `\\${$0}`)
        .matchAll(/(['"])(.+?)\1|\b([\S]+)\b/gm);
    if (matches) {
      const subqueries = [...matches].map((match) => ({
        boundaries: Boolean(match[1]),
        value: (match[1] ? match[2] : match[3]).replace(/['"]/g, ($0) => `\\${$0}`),
      }));
      if (matchType === 'all') {
        //
      } else {
        parts.push(...subqueries.map((subquery) => subquery.boundaries ? `(?:(?:^|\\y)${subquery.value}(?:\\y|$))` : `(?:${subquery.value})`));
      }
    }
  }
  return {
    categories,
    filter: parts.join('|'),
    interval,
    outlets,
  };
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
    @Request() req,
    @Query() userId?: number,
    @Query() _scope = 'public',
    @Query() filter?: string,
    @Query() ids: number[] = [],
    @Query() excludeIds = false,
    @Query() matchType?: 'all' | 'any',
    @Query() interval?: string,
    @Query() locale = '',
    @Query() start?: string,
    @Query() end: string = start !== undefined ? new Date().toISOString() : undefined,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page
  ): Promise<BulkMetadataResponse<PublicSummaryGroups, { sentiment: number }>> {
    const version = req.headers['x-app-version'];
    if (/^2\.\d\.\d$/.test(version)) {
      return {
        count: 0,
        rows: [],
      };
    }
    const { 
      categories, 
      outlets,
      interval: pastInterval,
      filter: query,
    } = applyFilter(filter, matchType);
    const noOutlets = outlets.length === 0;
    const noCategories = categories.length === 0;
    const noIds = ids.length === 0 || excludeIds;
    const startDate = parseDate(start) ? parseDate(start) : end !== undefined ? new Date(0) : undefined;
    const endDate = parseDate(end) ? parseDate(end) : start !== undefined ? new Date() : undefined;
    const cacheKey = [
      '/getSummaries',
      JSON.stringify(outlets),
      JSON.stringify(categories),
      JSON.stringify(ids),
      excludeIds,
      interval,
      startDate.toISOString(),
      endDate.toISOString(),
      limit,
      offset,
      locale,
      filter,
    ].join('§');
    const cache = await Cache.fromKey(cacheKey);
    if (cache && cache.expiresSoon() === false) {
      return cache.value as BulkMetadataResponse<PublicSummaryGroups, { sentiment: number }>;
    }
    const records = (await this.store.query(GET_SUMMARIES, {
      nest: true,
      replacements: {
        categories: categories.length === 0 ? [''] : categories,
        endDate: endDate ?? new Date(0),
        excludeIds,
        filter: query,
        ids: ids.length === 0 ? [-1] : ids,
        interval: (start !== undefined || end !== undefined) ? '0m' : (pastInterval ?? interval ?? '100y'),
        limit: Number(pageSize),
        locale: locale?.replace(/-[a-z]{2}$/i, '') ?? '',
        noCategories,
        noFilter: !filter,
        noIds,
        noOutlets,
        offset: Number(offset),
        outlets: outlets.length === 0 ? [''] : outlets,
        startDated: startDate ?? new Date(),
      },
      type: QueryTypes.SELECT,
    }))?.[0] ?? { count: 0, rows: [] };
    await Cache.upsert({
      halflife: process.env.CACHE_HALFLIFE || '2m',
      key: cacheKey,
      value: JSON.stringify(records),
    });
    return records as BulkMetadataResponse<PublicSummaryGroups, { sentiment: number }>;
  }
  
  @Get('/topics')
  public static async getTopics(
    @Query() userId?: number,
    @Query() type?: TokenTypeName,
    @Query() interval = '1d',
    @Query() min = 0,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() order: string[] = ['count:desc']
  ): Promise<BulkResponse<PublicTokenAttributes>> {
    const filter = `^(?:${type})$`;
    const startDate = new Date();
    const endDate = new Date();
    const records = await this.store.query(GET_SUMMARY_TOKEN_COUNTS, {
      nest: true,
      replacements: {
        endDate,
        interval,
        limit: Number(pageSize),
        min: Number(min) < 2 ? 2 : Number(min),
        offset,
        order,
        startDate,
        type: type ? filter : '.',
      },
      type: QueryTypes.SELECT,
    });
    return (records?.[0] ?? { count: 0, rows: [] }) as BulkResponse<PublicTokenAttributes>;
  }
  
  @Get('/trends')
  @Deprecated()
  public static async getTrends(
    @Query() userId?: number,
    @Query() type?: TokenTypeName,
    @Query() interval = '1d',
    @Query() min = 0,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() order: string[] = ['count:desc']
  ): Promise<BulkResponse<PublicTokenAttributes>> {
    return await this.getTopics(userId, type, interval, min, pageSize, page, offset, order);
  }
  
  @Get('/topics/groups')
  public static async getTopicGroups(): Promise<BulkResponse<PublicTokenTypeAttributes>> {
    return await TokenType.scope('public').findAndCountAll();
  }
  
  @Security('jwt')
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<PublicSummaryAttributes> {
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
    return resource;
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
