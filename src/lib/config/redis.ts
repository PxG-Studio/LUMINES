/**
 * Redis Configuration
 * Redis connection configuration using environment variables
 */

import { env, getRedisUrl } from './environment';

export const redisConfig = {
  url: getRedisUrl(),
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  db: env.REDIS_DB,
  ttl: env.REDIS_TTL,
  // Connection pool settings
  retryStrategy: (times: number) => {
    if (times > 10) {
      return null; // Stop retrying after 10 attempts
    }
    return Math.min(times * 100, 3000); // Exponential backoff, max 3s
  },
  reconnectOnError: (err: Error) => {
    const targetErrors = ['READONLY', 'ECONNREFUSED', 'ETIMEDOUT'];
    return targetErrors.some(targetError => err.message.includes(targetError));
  },
} as const;

