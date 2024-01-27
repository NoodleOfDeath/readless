/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Get,
  Post,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { GetSitemapRequest } from './types';
import { MailService, StaticGeneratorService } from '../../../../services';
import {
  AuthError,
  InternalError,
  Request as ExpressRequest,
} from '../../middleware';
import {
  Cache,
  PublicSystemNotificationAttributes,
  SystemLog,
  SystemLogCreationAttributes,
  SystemNotification,
} from '../../schema';
import { BulkResponse } from '../types';

@Route('/v1/system')
@Tags('System')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class SystemController {

  @Get('/notifications')
  public static async getSystemNotifications(
    @Request() req: ExpressRequest
  ): Promise<BulkResponse<PublicSystemNotificationAttributes>> {
    return await SystemNotification.findAndCountAll({ order: [['createdAt', 'DESC']] });
  }
  
  @Get('/sitemap')
  public static async getSitemap(
    @Request() req: ExpressRequest,
    @Query() forceCache?: boolean
  ): Promise<string> {
    return this.getSitemapInternal({ forceCache });
  }

  public static async getSitemapInternal({ forceCache }: GetSitemapRequest) {
    const cache = await Cache.fromKey('sitemap');
    if (!forceCache && cache && cache.expiresSoon === false) {
      return cache.value;
    }
    const sitemap = await StaticGeneratorService.generateSitemap();
    await Cache.upsert({
      key: 'sitemap',
      lifespan: '1h',
      value: sitemap,
    });
    return sitemap;
  }
  
  @Post('/log')
  public static async logSystemEvent(
    @Request() req: ExpressRequest,
    @Body() e: SystemLogCreationAttributes,
  ): Promise<void> {
    await SystemLog.create(e);
    if (e.notify?.email) {
      const html = `
        <p>${e.notify.text ?? e.message}</p>
        <p>REQ: ${JSON.stringify(req.headers, null, 2)}</p>
      `;
      new MailService().sendMail({
        html,
        subject: e.notify.subject ?? e.message,
        to: e.notify.email,
      });
    }
  }
  
}