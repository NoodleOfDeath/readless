import { Request as ExpressRequest } from 'express';
import {
  Get,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { AuthError, InternalError } from '../../middleware';

export type StatsRequest = {
  filter?: string;
  interval?: string;
};

export type StatsResponse = {
  count?: number;
};

@Route('/v1/stats')
@Tags('Stats')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class StatsController {
  
  @Get('/')
  public static async getStats(
    @Request() req?: ExpressRequest
  ): Promise<StatsResponse> {
    return { count: 0 };
  }
  
}