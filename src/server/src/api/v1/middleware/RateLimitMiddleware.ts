import { Request, RequestHandler } from 'express';
import ms from 'ms';

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
        const data = limit.toJSON();
        if (data.expiresAt < new Date()) {
          await limit.update({
            expiresAt: new Date(Date.now() + duration),
            limit: options.limit,
            points: 0,
          });
          return next();
        }
        if (data.points >= options.limit) {
          return res.status(429).send('Too many requests');
        }
        await limit.update({ limit: options.limit, points: data.points + 1 });
      } else {
        await RateLimit.create({
          expiresAt: new Date(Date.now() + duration),
          key,
          limit: options.limit,
          points: 0,
        });
      }
      next();
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  };

};
