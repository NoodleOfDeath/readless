import { AuthError, internalErrorHandler } from './internal-errors';
import { RequestHandler } from './types';
import { JWT } from '../controllers/types';

type AuthMiddlewareOptions = {
  scope?: string[];
};

export const authMiddleware = ({ scope }: AuthMiddlewareOptions = {}): RequestHandler => async (req, res, next) => {
  try {
    delete req.body.userId;
    delete req.query.userId;
    if (scope) {
      const auth = req.get('authorization');
      if (!auth) {
        throw new AuthError('MISSING_AUTHORIZATION_HEADER');
      }
      const [type, token] = auth.split(' ');
      if (type === 'Bearer') {
        try {
          const jwt = await JWT.from(token);
          if (!jwt.canAccess(scope)) {
            throw new AuthError('INSUFFICIENT_PERMISSIONS');
          }
          const { expired } = await jwt.validate(false);
          if (expired) {
            throw new AuthError('EXPIRED_CREDENTIALS');
          }
          req.jwt = jwt;
          req.body.userId = jwt.userId;
        } catch (e) {
          throw new AuthError('BAD_REQUEST');
        }
      }
      throw new AuthError('MISSING_AUTHORIZATION_HEADER');
    }
    next();
  } catch (e) {
    internalErrorHandler(res, e);
  }
};