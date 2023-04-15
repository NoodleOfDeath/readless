import { Request, RequestHandler } from 'express';
import ms from 'ms';

import { AuthError, internalErrorHandler } from './internal-errors';
import { RateLimit } from '../schema';

export type Duration = `${number}${'ms'|'s'|'m'|'h'|'d'|'w'|'M'|'y'}`;
export type RateLimitString = `${number}${'/'|'every'|'per'}${Duration}`;

export type RateLimitOptions = {
  duration: number | Duration;
  limit: number;
  path?: string | ((req: Request) => string);
};

function parseRateLimitString(rateLimitString: RateLimitString): RateLimitOptions {
  const [limit, period] = rateLimitString.split(/\s*(?:\/|every|per)\s*/i);
  const duration = ms(period);
  return {
    duration: Number.isNaN(duration) ? ms('15m') : duration,
    limit: Number.isNaN(parseInt(limit)) ? 100 : parseInt(limit),
    path: (req) => [req.method, req.path].join(':'),
  };
}

export const rateLimitMiddleware = (
  opts: RateLimitString | RateLimitOptions = {
    duration: ms('15m'), 
    limit: 100, 
    path: (req) => [req.method, req.path].join(':'), 
  }
): RequestHandler => {
  const options = typeof opts === 'string' ? parseRateLimitString(opts) : opts;
  const duration = typeof options.duration === 'string' ? ms(options.duration) : options.duration;
  return async (req, res, next) => {
    const path = options.path instanceof Function ? options.path(req) : options.path;
    const key = path ? [req.ip, path].join(':') : req.ip;
    try {
      const limit = await RateLimit.findOne({ where: { key } });
      if (limit) {
        if (await limit.isSaturated()) {
          res.status(429).json(new AuthError('TOO_MANY_REQUESTS'));
          return;
        }
        await limit.advance();
      } else {
        await RateLimit.create({
          expiresAt: new Date(Date.now() + duration),
          key,
          limit: options.limit,
          points: 0,
          window: duration,
        });
      }
      next();
    } catch (e) {
      internalErrorHandler(res, e);
    }
  };

};
