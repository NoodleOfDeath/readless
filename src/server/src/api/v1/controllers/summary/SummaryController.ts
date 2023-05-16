//import ms from 'ms';
import { QueryTypes } from 'sequelize';
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

import { GET_SUMMARIES, GET_SUMMARY_TOKEN_COUNTS } from './queries';
import { MailService } from '../../../../services';
import { PayloadWithUserId } from '../../../../services/types';
import { AuthError, InternalError } from '../../middleware';
import {
  BulkMetadataResponse,
  BulkResponse,
  DestroyResponse,
  InteractionRequest,
  InteractionResponse,
  InteractionType,
  PublicSummaryAttributes,
  PublicSummaryTokenAttributes,
  Summary,
  SummaryInteraction,
  User,
} from '../../schema';
import { TokenType } from '../../schema/types';
import { BaseControllerWithPersistentStorageAccess } from '../Controller';

function applyFilter(
  filter = '', 
  matchType: 'any' | 'all' = 'any'
) {
  const categories: string[] = [];
  const outlets: string[] = [];
  if (!filter) {
    return {
      categories,
      filter: '.',
      outlets,
    };
  }
  const splitExpr = /\s*((?:\w+:(?:[-\w.]*(?:,[-\w.]*)*))(?:\s+\w+:(?:[-\w.]*(?:,[-\w.]*)*))*)?(.*)/i;
  const [_, prefilter, q] = splitExpr.exec(filter);
  const query = (q ?? '').trim();
  if (prefilter) {
    const expr = /(\w+):([-\w.]*(?:,[-\w.]*)*)/gi;
    const matches = prefilter.matchAll(expr);
    if (matches) {
      for (const match of matches) {
        const [_, prefix, prefixValues] = match;
        const pf = prefixValues.split(',');
        if (/cat(egory)?/i.test(prefix)) {
          categories.push(...pf);
        }
        if (/outlet|source|src/i.test(prefix)) {
          outlets.push(...pf);
        }
      }
    }
  }
  const parts: string[] = [];
  if (query && query.length > 0) {
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
    @Query() userId?: number,
    @Query() scope = 'public',
    @Query() filter = '.',
    @Query() ids: number[] = [],
    @Query() excludeIds = false,
    @Query() matchType?: 'all' | 'any',
    @Query() interval = '100y',
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() order: string[] = ['originalDate:desc', 'createdAt:desc']
  ): Promise<BulkMetadataResponse<PublicSummaryAttributes, { sentiment: number }>> {
    const { 
      categories, 
      outlets,
      filter: query,
    } = applyFilter(filter, matchType);
    const noOutlets = outlets.length === 0;
    const noCategories = categories.length === 0;
    const noIds = ids.length === 0;
    const records = await this.store.query(GET_SUMMARIES, {
      nest: true,
      replacements: {
        categories: categories.length === 0 ? [''] : categories,
        excludeIds,
        filter: query,
        ids: ids.length === 0 ? [-1] : ids,
        interval,
        limit: Number(pageSize),
        noCategories,
        noIds,
        noOutlets,
        offset: Number(offset),
        outlets: outlets.length === 0 ? [''] : outlets,
      },
      type: QueryTypes.SELECT,
    });
    if (!records || records.length === 0) {
      return { count: 0, rows: [] };
    }
    const record = records[0] as { count: number, overallSentiment: number };
    const response = {
      count: record.count,
      metadata: { sentiment: record.overallSentiment },
      rows: records,
    };
    return response as BulkMetadataResponse<PublicSummaryAttributes, { sentiment: number }>;
  }
  
  @Get('/trends')
  public static async getTrends(
    @Query() userId?: number,
    @Query() type?: TokenType,
    @Query() interval = '12h',
    @Query() min = 0,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() order: string[] = ['count:desc']
  ): Promise<BulkResponse<PublicSummaryTokenAttributes>> {
    const records = await this.store.query(GET_SUMMARY_TOKEN_COUNTS, {
      nest: true,
      replacements: {
        interval,
        limit: Number(pageSize),
        min: Number(min) < 2 ? 2 : Number(min),
        offset,
        order,
        type: type ?? '%',
      },
      type: QueryTypes.SELECT,
    });
    return (records?.[0] ?? { count: 0, rows: [] }) as BulkResponse<PublicSummaryTokenAttributes>;
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
