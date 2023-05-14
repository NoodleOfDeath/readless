import { Request, RequestHandler } from 'express';
import ms from 'ms';

import { AuthError, internalErrorHandler } from './internal-errors';
import { Query, RateLimit } from '../schema';

export type Duration = `${number}${'ms'|'s'|'m'|'h'|'d'|'w'|'M'|'y'}`;
export type RateLimitString = `${number}${'/'|'every'|'per'}${Duration}`;

export function parseDuration(period: number | string) {
  const duration = typeof period === 'number' ? period : ms(period);
  return !Number.isNaN(duration) ? duration : undefined;
}

export type RateLimitOptions = {
  duration: number | string;
  limit: number;
  path?: string | ((req: Request) => string);
};

function parseRateLimitString(rateLimitString: RateLimitString): RateLimitOptions {
  const [limit, period] = rateLimitString.split(/\s*(?:\/|every|per)\s*/i);
  return {
    duration: parseDuration(period) ?? ms('10m'),
    limit: Number.isNaN(Number.parseInt(limit)) ? 200 : Number.parseInt(limit),
    path: (req) => [req.method, req.path].join(':'),
  };
}

export const rateLimitMiddleware = (
  opts: RateLimitString | RateLimitOptions = {
    duration: ms('10m'), 
    limit: 200, 
    path: (req) => [req.method, req.path].join(':'), 
  }
): RequestHandler => {
  const options = typeof opts === 'string' ? parseRateLimitString(opts) : opts;
  const duration = parseDuration(options.duration);
  return async (req, res, next) => {
    const path = options.path instanceof Function ? options.path(req) : options.path;
    try {
      await Query.create({
        appVersion: JSON.stringify(req.headers['x-app-version']),
        path,
        remoteAddr: req.ip,
        userAgent: JSON.stringify(req.headers['user-agent']),
      });
      const key = path ? [req.ip, path].join(':') : req.ip;
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
