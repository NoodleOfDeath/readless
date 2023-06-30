import { Request as ExpressRequest } from 'express';
import { QueryTypes } from 'sequelize';
import {
  Body,
  Delete,
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

import { GET_SUMMARIES } from './queries';
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
  PublicRecapAttributes,
  PublicSummaryAttributes,
  Recap,
  Summary,
  SummaryInteraction,
  User,
} from '../../schema';
import { PublicSummaryGroup } from '../../schema/types';
import { BaseControllerWithPersistentStorageAccess } from '../Controller';

type GetSummariesPayload = {
  filter?: string;
  matchType?: 'any' | 'all';
  page?: number;
  pageSize?: number;
  offset?: number;
  ids?: number | number[];
  excludeIds?: boolean;
  interval?: string;
  locale?: string;
  start?: string;
  end?: string;
  forceCache?: boolean;
};

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
    @Request() req?: ExpressRequest,
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() excludeIds = false,
    @Query() matchType?: 'all' | 'any',
    @Query() interval?: string,
    @Query() locale?: string,
    @Query() start?: string,
    @Query() end: string = start !== undefined ? new Date().toISOString() : undefined,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() forceCache = false
  ): Promise<BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>> {
    const version = req?.headers['x-app-version'];
    if (/^2\.\d\.\d$/.test(JSON.stringify(version) || '')) {
      return {
        count: 0,
        rows: [],
      };
    }
    return await this.getSummariesInternal({
      end,
      excludeIds,
      filter,
      forceCache,
      ids,
      interval,
      locale,
      matchType,
      offset,
      page,
      pageSize,
      start,
    });
  }

  public static async getSummariesInternal({
    filter,
    ids,
    excludeIds = false,
    matchType,
    interval,
    locale,
    start,
    end = start !== undefined ? new Date().toISOString() : undefined,
    pageSize = 10,
    page = 0,
    offset = pageSize * page,
    forceCache = false,
  }: GetSummariesPayload) {
    const { 
      categories, 
      outlets,
      interval: pastInterval,
      filter: query,
    } = applyFilter(filter, matchType);
    const startDate = parseDate(start) ? parseDate(start) : end !== undefined ? new Date(0) : undefined;
    const endDate = parseDate(end) ? parseDate(end) : start !== undefined ? new Date() : undefined;
    const idArray = typeof ids === 'number' ? [ids] : !ids || ids.length === 0 ? [-1] : ids;
    const replacements = {
      categories: categories.length === 0 ? [''] : categories,
      endDate: endDate ?? new Date(0),
      excludeIds,
      filter: query,
      ids: idArray,
      interval: (start !== undefined || end !== undefined) ? '0m' : (pastInterval ?? interval ?? '100y'),
      limit: Number(pageSize),
      locale: locale?.replace(/-[a-z]{2}$/i, '') ?? '',
      noCategories: categories.length === 0,
      noFilter: !filter,
      noIds: !ids || excludeIds,
      noOutlets: outlets.length === 0,
      offset: Number(offset),
      outlets: outlets.length === 0 ? [''] : outlets,
      startDate: startDate ?? new Date(),
    };
    const cacheKey = [
      'getSummaries',
      filter,
      idArray?.join(','),
      excludeIds,
      matchType,
      interval,
      locale,
      start,
      end,
      pageSize,
      page,
    ].join(':');
    if (!forceCache) {
      const cache = await Cache.fromKey(cacheKey);
      if (cache && cache.expiresSoon === false) {
        try {
          return JSON.parse(cache.value) as BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>;
        } catch (err) {
          console.error(err);
        }
      }
    }
    const records = (await this.store.query(GET_SUMMARIES, {
      nest: true,
      replacements,
      type: QueryTypes.SELECT,
    }))?.[0] ?? { count: 0, rows: [] };
    await Cache.upsert({
      halflife: process.env.CACHE_HALFLIFE || '2m',
      key: cacheKey,
      value: JSON.stringify(records),
    });
    return records as BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>;
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
  
  @Get('/recap')
  public static async getRecaps(
    @Request() _request: ExpressRequest,
    @Query() _filter?: string,
    @Query() pageSize = 10,
    @Query() page = 0
  ): Promise<BulkResponse<PublicRecapAttributes>> {
    const recaps = await Recap.scope('public').findAndCountAll({
      limit: pageSize,
      offset: pageSize * page,
      order: [['createdAt', 'DESC']],
    });
    return recaps;
  }

}
