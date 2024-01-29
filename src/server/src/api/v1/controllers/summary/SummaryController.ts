/* eslint-disable @typescript-eslint/no-unused-vars */
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
} from '../';
import { BaseControllerWithPersistentStorageAccess } from '../';
import { SupportedLocale } from '../../../../core/locales';
import { MailService } from '../../../../services';
import {
  AuthError,
  Request as ExpressRequest,
  InternalError,
} from '../../middleware';
import {
  InteractionCreationAttributes,
  InteractionType,
  PublicRecapAttributes,
  PublicSummaryAttributes,
  PublicSummaryGroup,
  Recap,
  SearchSummariesPayload,
  Summary,
  SummaryInteraction,
} from '../../schema';
import { JwtRequest } from '../types';

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
      version: req.version,
    });
  }
  
  public static async getTopStoriesInternal({ interval = '1d', ...payload }: SearchSummariesPayload) {
    return await Summary.getTopStories({ interval, ...payload });
  }
  
  @Post('/interact/:targetId/:type')
  public static async interactWithSummary(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: Partial<InteractionCreationAttributes>
  ): Promise<PublicSummaryAttributes> {
    const user = req.jwt?.user;
    if (body.revert && user) {
      await SummaryInteraction.destroy({
        where: {
          targetId,
          type, 
          userId: user.id,
        },
      });
    }
    const interaction = await SummaryInteraction.create({
      ...body,
      remoteAddr: req.ip, 
      targetId, 
      type, 
      userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    if (type === 'feedback') {
      await new MailService().sendMail({
        from: 'hello@readless.ai',
        subject: 'Feedback',
        text: [body.content, JSON.stringify(body.metadata)].join('\n\n'),
        to: 'feedback@readless.ai',
      });
    }
    const resource = await Summary.scope('public').findByPk(targetId);
    return resource;
  }

  @Post('/recap/interact/:targetId/:type')
  public static async interactWithRecap(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Path() type: InteractionType,
    @Body() body: Partial<InteractionCreationAttributes>
  ): Promise<PublicRecapAttributes> {
    const user = req.jwt?.user;
    const interaction = await SummaryInteraction.create({
      ...body,
      remoteAddr: req.ip, 
      targetId, 
      type, 
      userId: user?.id,
    });
    if (!interaction) {
      throw new InternalError('Failed to create interaction');
    }
    const resource = await Recap.scope('public').findByPk(targetId);
    return resource;
  }
  
  @Security('jwt', ['god:*'])
  @Delete('/:targetId')
  public static async destroySummary(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Body() body: JwtRequest
  ): Promise<DestroyResponse> {
    const user = req.jwt?.user;
    await user?.destroySummary(targetId);
    return { success: true };
  }
  
  @Security('jwt', ['god:*'])
  @Patch('/restore/:targetId')
  public static async restoreSummary(
    @Request() req: ExpressRequest,
    @Path() targetId: number,
    @Body() body: JwtRequest
  ): Promise<DestroyResponse> {
    const user = req.jwt?.user;
    await user?.restoreSummary(targetId);
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
