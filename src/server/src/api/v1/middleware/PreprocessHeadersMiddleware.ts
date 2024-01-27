import { internalErrorHandler } from './internal-errors';
import { RequestHandler } from './types';
import { JWT } from '../controllers/types';

export const preprocessHeadersMiddleware: RequestHandler = async (req, res, next) => {
  try {
    delete req.body.userId;
    delete req.query.userId;
    req.ip = req.get('x-forwarded-from') || req.ip;
    const auth = req.get('authorization') || '';
    const [type, token] = auth.split(' ');
    if (type === 'Bearer') {
      const jwt = await JWT.from(token);
      req.jwt = jwt;
      req.body.userId = jwt.userId;
    }
    next();
  } catch (e) {
    internalErrorHandler(res, e);
  }
};