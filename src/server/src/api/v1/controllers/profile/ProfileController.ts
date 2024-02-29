import {
  Get,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from 'tsoa';

import { ProfileResponse } from './types';
import {
  AuthError,
  Request as ExpressRequest,
  InternalError,
} from '../../middleware';
import { Achievements, UserStats } from '../../schema';
import { BaseControllerWithPersistentStorageAccess } from '../Controller';

@Route('/v1/profile')
@Tags('Profile')
@Security('jwt')
@SuccessResponse('200', 'OK')
@SuccessResponse('201', 'Created')
@SuccessResponse('204', 'No Content')
@Response<AuthError>(401, 'Unauthorized')
@Response<InternalError>(500, 'Internal Server Error')
export class ProfileController extends BaseControllerWithPersistentStorageAccess {

  @Get('/')
  @Security('jwt', ['standard:read'])
  public static async getProfile(
    @Request() req: ExpressRequest
  ): Promise<ProfileResponse> {
    const user = req.jwt.user;
    await user.syncProfile(req);
    const userData = user.toJSON();
    return { profile: userData.profile };
  }

  @Get('/achievements')
  @Security('jwt', ['standard:read'])
  public static async getAchievements(
    @Request() req: ExpressRequest
  ): Promise<Achievements> {
    const user = req.jwt.user;
    return await user.getAchievements();
  }

  @Get('/stats')
  @Security('jwt', ['standard:read'])
  public static async getUserStats(
    @Request() req: ExpressRequest
  ): Promise<UserStats> {
    const user = req.jwt.user;
    return await user.getStats();
  }

}
