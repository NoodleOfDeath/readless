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

import {
  MetricType,
  MetricsRequest,
  MetricsResponse,
} from './types';
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
    @Request() req: ExpressRequest,
    @Query() type?: MetricType[],
    @Query() after?: Date,
    @Query() before?: Date
  ): Promise<MetricsResponse> {
    const user = await User.fromJwt(req.body, { ignoreIfNotResolved: true, ...req.body });
    return await User.getMetrics(user);
  }

  public static async getMetricsInternal(req: ExpressRequest, query: MetricsRequest): Promise<MetricsResponse> {
    const user = await User.from({ jwt: req.body.jwt });
    return await User.getMetrics(user, query);
  }
  
}