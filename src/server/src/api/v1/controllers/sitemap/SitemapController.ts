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

import { StaticGeneratorService } from '../../../../services';
import { AuthError, InternalError } from '../../middleware';
import { Cache } from '../../schema';

export type GetSitemapRequest = {
  forceCache?: boolean;
};

@Route('/v1/sitemap')
@Tags('Sitemap')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class SitemapController {
  
  @Get('/')
  public static async getSitemap(
    @Request() _req: ExpressRequest,
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