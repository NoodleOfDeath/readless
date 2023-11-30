/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request as ExpressRequest } from 'express';
import {
  Get,
  Query,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { GetSitemapRequest } from './types';
import { StaticGeneratorService } from '../../../../services';
import { AuthError, InternalError } from '../../middleware';
import {
  Cache,
  PublicSystemNotificationAttributes,
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
    return await SystemNotification.findAndCountAll();
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
      halflife: '1h',
      key: 'sitemap',
      value: sitemap,
    });
    return sitemap;
  }
  
}