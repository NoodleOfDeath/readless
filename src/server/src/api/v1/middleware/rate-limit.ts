import RateLimitMiddleware, { Options } from 'express-rate-limit';
import IORedis from 'ioredis';
import RedisStore, { RedisReply } from 'rate-limit-redis';

export type RateLimit = [max: number, windowMs: number];
export type RateLimitOptions = Options & {
  rate: RateLimit; // shorthand for max/windowMs
  prefix: string;
};

export type RateLimitString = `${number}${'every' | 'in' | 'per' | '/'}${number}${
  | ('ms' | 'millisecond' | 'milliseconds')
  | ('s' | 'sec' | 'secs' | 'second' | 'seconds')
  | ('m' | 'min' | 'mins' | 'minute' | 'minutes')
  | ('h' | 'hr' | 'hrs' | 'hour' | 'hours')
  | ('d' | 'day' | 'days')}`;

export const DEFAULT_RATE_LIMIT: RateLimitString = '120 per 2 min'; // 120 requests per 2 minutes
export const DEFAULT_WINDOW_MS = 2 * 60 * 1000;
export const DEFAULT_MAX = 120;

function parseRateLimitString(limit: RateLimitString): Partial<RateLimitOptions> {
  const [max, interval] = limit.split(/\s*(?:every|in|per|\/)\s*/);
  const [_,
    window,
    unit] = /(\d+)\s*(ms|milliseconds?|s|secs?|seconds?|m|mins?|minutes?|hr?|hrs?|hours?|d|days?)/.exec(interval) || [];
  const rate: RateLimit = [
    Number.parseInt(max),
    Number.parseInt(window) *
    (/ms|milliseconds?/.test(unit)
      ? 1
      : /s|secs?|seconds?/.test(unit)
        ? 1000
        : /m|mins?|minutes?/.test(unit)
          ? 1000 * 60
          : /hr?|hrs?|hours?/.test(unit)
            ? 1000 * 60 * 60
            : /d|days?/.test(unit)
              ? 1000 * 60 * 60 * 24
              : 1),
  ];
  return { rate };
}

export const rateLimit = (
  opts: RateLimitString | Partial<RateLimitOptions> = DEFAULT_RATE_LIMIT,
  redisClient: IORedis = new IORedis(process.env.REDIS_CONNECTION_STRING),
) => {
  const options: Partial<RateLimitOptions> = typeof opts === 'string' ? parseRateLimitString(opts) : opts;
  const {
    rate,
    windowMs = rate ? rate[1] : DEFAULT_WINDOW_MS,
    max = rate ? rate[0] : DEFAULT_MAX,
    standardHeaders = true,
    legacyHeaders = false,
    prefix = `${Date.now()}.${Math.random().toString(32)}`,
    handler = (_, response, __, options) => {
      response.status(options.statusCode).json({ message: 'too many requests' });
    },
  } = options;
  return RateLimitMiddleware({
    handler,
    legacyHeaders,
    max,
    standardHeaders,
    store: new RedisStore({
      prefix,
      sendCommand: (...args: [command: string, ...args: (string | Buffer | number)[]]) =>
        redisClient.call(...args) as Promise<RedisReply | RedisReply[]>,
    }),
    windowMs,
  });
};
