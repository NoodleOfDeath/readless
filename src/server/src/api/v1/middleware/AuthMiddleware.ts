import { AuthError, internalErrorHandler } from './internal-errors';
import { RequestHandler } from './types';

type AuthMiddlewareOptions = {
  scope?: string[];
};

export const authMiddleware = ({ scope }: AuthMiddlewareOptions = {}): RequestHandler => async (req, res, next) => {
  try {
    const jwt = req.jwt;
    if (!jwt) {
      throw new AuthError('MISSING_AUTHORIZATION_HEADER');
    }
    const { expired } = await jwt.validate(false);
    if (expired) {
      throw new AuthError('EXPIRED_CREDENTIALS');
    }
    if (scope && !jwt.canAccess(scope)) {
      throw new AuthError('INSUFFICIENT_PERMISSIONS');
    } 
    next();
  } catch (e) {
    internalErrorHandler(res, e);
  }
};