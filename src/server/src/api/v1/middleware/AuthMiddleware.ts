import { RequestHandler } from 'express';

import { AuthError, internalErrorHandler } from './internal-errors';
import { JWT } from '../../../services/types';

type AuthMiddlewareOptions = {
  required?: boolean;
  scope?: string[];
};

export const authMiddleware = (securityName: string, { required = false, scope = [] }: AuthMiddlewareOptions = {}): RequestHandler => async (req, res, next) => {
  try {
    delete req.body.jwt;
    delete req.query.jwt;
    delete req.body.refreshedJwt;
    delete req.query.refreshedJwt; 
    if (securityName === 'jwt') {
      const auth = req.get('authorization');
      if (auth) {
        const [type, token] = auth.split(' ');
        if (type === 'Bearer') {
          try {
            const jwt = JWT.from(token);
            if (required && !jwt.canAccess(scope)) {
              throw new AuthError('INSUFFICIENT_PERMISSIONS');
            }
            const { expired, refreshed } = await jwt.validate(false);
            if (!expired) {
              req.body.userId = jwt.userId;
              req.body.jwt = jwt.signed;
              req.query.userId = String(jwt.userId);
              req.query.jwt = jwt.signed;
            }
            if (refreshed) {
              req.body.refreshedJwt = refreshed.signed;
              req.query.refreshedJwt = refreshed.signed;
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