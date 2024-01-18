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
    const auth = req.get('authorization') || '';
    const [type, token] = auth.split(' ');
    if (type === 'Bearer') {
      const jwt = await JWT.from(token);
      const { expired } = await jwt.validate(false);
      if (!expired) {
        req.jwt = jwt;
        req.body.userId = jwt.userId;
      }
      if (scope) {
        if (expired) {
          throw new AuthError('EXPIRED_CREDENTIALS');
        }
        if (!jwt.canAccess(scope)) {
          throw new AuthError('INSUFFICIENT_PERMISSIONS');
        } 
      }
    } else 
    if (scope) {
      throw new AuthError('MISSING_AUTHORIZATION_HEADER');
    }
    next();
  } catch (e) {
    internalErrorHandler(res, e);
  }
};