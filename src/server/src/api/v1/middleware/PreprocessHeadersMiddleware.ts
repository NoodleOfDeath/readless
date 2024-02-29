import { internalErrorHandler } from './internal-errors';
import { RequestHandler } from './types';
import { CustomHeader, JWT } from '../controllers/types';

export const preprocessHeadersMiddleware: RequestHandler = async (req, res, next) => {
  try {
    delete req.body.userId;
    delete req.query.userId;
    const auth = req.get('authorization') || '';
    const [type, token] = auth.split(' ');
    if (type === 'Bearer') {
      const jwt = await JWT.from(token);
      req.jwt = jwt;
      req.body.userId = jwt.userId;
    }
    const version = req.get(CustomHeader.VERSION);
    req.version = version;
    next();
  } catch (e) {
    internalErrorHandler(res, e);
  }
};