import Redis, { RedisOptions } from 'ioredis';

let redisClient: Redis | null = null;
let sentinelClient: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redisClient) {
    const host = import.meta.env.VITE_REDIS_HOST || '192.168.86.27';
    const port = parseInt(import.meta.env.VITE_REDIS_PORT || '6379');
    const db = parseInt(import.meta.env.VITE_REDIS_DB || '0');
    const password = import.meta.env.VITE_REDIS_PASSWORD;

    const options: RedisOptions = {
      host,
      port,
      db,
      password: password || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    };

    redisClient = new Redis(options);

    redisClient.on('connect', () => {
      console.log('Redis connected to', `${host}:${port}`);
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redisClient.on('ready', () => {
      console.log('Redis ready');
    });

    redisClient.on('close', () => {
      console.log('Redis connection closed');
    });
  }

  return redisClient;
}

export function getSentinelClient(): Redis | null {
  const sentinelHost = import.meta.env.VITE_REDIS_SENTINEL_HOST;

  if (!sentinelHost) {
    return null;
  }

  if (!sentinelClient) {
    const sentinelPort = parseInt(import.meta.env.VITE_REDIS_SENTINEL_PORT || '26379');
    const masterName = import.meta.env.VITE_REDIS_MASTER_NAME || 'mymaster';
    const password = import.meta.env.VITE_REDIS_PASSWORD;

    const options: RedisOptions = {
      sentinels: [
        { host: sentinelHost, port: sentinelPort }
      ],
      name: masterName,
      password: password || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    };

    sentinelClient = new Redis(options);

    sentinelClient.on('error', (err) => {
      console.error('Redis Sentinel error:', err);
    });
  }

  return sentinelClient;
}

export function getActiveRedisClient(): Redis {
  const sentinel = getSentinelClient();
  return sentinel || getRedisClient();
}

export async function closeRedisConnections(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }

  if (sentinelClient) {
    await sentinelClient.quit();
    sentinelClient = null;
  }
}

export { redisClient, sentinelClient };
