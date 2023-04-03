import { RequestHandler } from 'express';

import { AuthError, internalErrorHandler } from './internal-errors';
import { Jwt } from '../../../services/types';

type AuthMiddlewareOptions = {
  required?: boolean;
  scope?: string[];
};

export const authMiddleware = (securityName: string, { required = false, scope = [] }: AuthMiddlewareOptions = {}): RequestHandler => async (req, res, next) => {
  try {
    if (securityName === 'jwt') {
      if (req.headers.authorization) {
        const [type, token] = req.headers.authorization.split(' ');
        if (type === 'Bearer') {
          try {
            const jwt = Jwt.from(token);
            if (required && !jwt.canAccess(scope)) {
              throw new AuthError('INSUFFICIENT_PERMISSIONS');
            }
            const { expired, refreshed } = await jwt.validate(false);
            if (!expired) {
              req.body.userId = jwt.userId;
              req.body.token = jwt.signed;
              req.query.userId = String(jwt.userId);
              req.query.token = jwt.signed;
            }
            if (refreshed) {
              req.body.refreshedToken = refreshed.signed;
              req.query.refreshedToken = refreshed.signed;
            }
          } catch (e) {
            if (required) {
              throw new AuthError('INVALID_CREDENTIALS');
            }
          }
        } else if (required) {
          throw new AuthError('INVALID_CREDENTIALS');
        }
      } else if (required) {
        throw new AuthError('MISSING_AUTHORIZATION_HEADER');
      }
      next();
    }
  } catch (e) {
    internalErrorHandler(res, e);
  }
};