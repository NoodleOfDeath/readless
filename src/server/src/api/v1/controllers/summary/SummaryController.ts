/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request as ExpressRequest } from 'express';
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

import {
  BulkMetadataResponse,
  BulkResponse,
  DestroyResponse,
  InteractionRequest,
} from '../';
import { BaseControllerWithPersistentStorageAccess } from '../';
import { SupportedLocale } from '../../../../core/locales';
import { MailService } from '../../../../services';
import { JwtRequest } from '../../../../services/types';
import { AuthError, InternalError } from '../../middleware';
import {
  InteractionType,
  PublicRecapAttributes,
  PublicSummaryAttributes,
  PublicSummaryGroup,
  Recap,
  SearchSummariesPayload,
  Summary,
  SummaryInteraction,
  User,
} from '../../schema';

@Route('/v1/summary')
@Tags('Summaries')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class SummaryController extends BaseControllerWithPersistentStorageAccess {

  @Get('/')
  public static async getSummaries(
    @Request() req: ExpressRequest,
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() excludeIds = false,
    @Query() matchType?: 'all' | 'any',
    @Query() interval?: string,
    @Query() locale?: SupportedLocale,
    @Query() start?: string,
    @Query() end: string = start !== undefined ? new Date().toISOString() : undefined,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() forceCache = false
  ): Promise<BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>> {
    const params = this.serializeParams(req);
    return await Summary.getSummaries({
      end,
      excludeIds,
      filter,
      forceCache,
      ids,
      interval,
      matchType,
      offset,
      page,
      pageSize,
      start,
      ...params,
      locale: locale ?? params.locale,
    });
  }
  
  public static async getSummariesInternal(payload: SearchSummariesPayload) {
    return await Summary.getSummaries(payload); 
  }

  @Get('/top')
  public static async getTopStories(
    @Request() req: ExpressRequest,
    @Query() filter?: string,
    @Query() ids?: number[],
    @Query() excludeIds = false,
    @Query() matchType?: 'all' | 'any',
    @Query() interval = '1d',
    @Query() locale?: SupportedLocale,
    @Query() start?: string,
    @Query() end: string = start !== undefined ? new Date().toISOString() : undefined,
    @Query() pageSize = 10,
    @Query() page = 0,
    @Query() offset = pageSize * page,
    @Query() forceCache = false
  ): Promise<BulkMetadataResponse<PublicSummaryGroup, { sentiment: number }>> {
    const version = JSON.stringify(req?.headers?.['x-app-version']);
    return await Summary.getTopStories({
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
      version,
    });
  }
  
  public static async getTopStoriesInternal({ interval = '1d', ...payload }: SearchSummariesPayload) {
    return await Summary.getTopStories({ interval, ...payload });
  }
  
  @Security('jwt')
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: InteractionRequest
  ): Promise<PublicSummaryAttributes> {
    const user = await User.fromJwt(req.body, { ignoreIfNotResolved: true, ...req.body });
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
        from: 'hello@readless.ai',
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
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Body() body: JwtRequest
  ): Promise<DestroyResponse> {
    const user = await User.fromJwt(req.body, { ignoreIfNotResolved: true, ...req.body });
    await user.destroySummary(targetId);
    return { success: true };
  }
  
  @Security('jwt', ['god:*'])
  @Patch('/restore/:targetId')
  public static async restoreSummary(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Body() body: JwtRequest
  ): Promise<DestroyResponse> {
    const user = await User.fromJwt(req.body, { ignoreIfNotResolved: true, ...req.body });
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
