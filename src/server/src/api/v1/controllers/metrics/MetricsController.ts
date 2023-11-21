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

import { MetricsResponse } from './types';
import { AuthError, InternalError } from '../../middleware';
import { User } from '../../schema';

export type StatsRequest = {
  filter?: string;
  interval?: string;
};

export type StatsResponse = {
  count?: number;
};

@Route('/v1/metrics')
@Tags('Metrics')
@Security('jwt')
@SuccessResponse(200, 'OK')
@SuccessResponse(201, 'Created')
@SuccessResponse(204, 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Error')
export class MetricsController {

  @Get('/')
  @Security('jwt', ['standard:read'])
  public static async getMetrics(
    @Request() req: ExpressRequest
  ): Promise<MetricsResponse> {
    const user = await User.from({ jwt: req.body.jwt });
    return await User.getMetrics(user);
  }
  
}