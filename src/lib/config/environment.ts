/**
 * Environment Configuration System
 * 
 * Typed environment variables with validation.
 * Replaces all hardcoded IPs, ports, and URLs.
 */

import { z } from 'zod';

/**
 * Environment variable schema
 * All variables are validated on startup
 */
const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Application URLs
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_BASE: z.string().url().optional(),
  NEXT_PUBLIC_LUMENFORGE_DOMAIN: z.string().default('lumenforge.io'),
  NEXT_PUBLIC_NOCTURNA_ID_URL: z.string().url().optional(),

  // Database Configuration
  DATABASE_URL: z.string().url().optional(),
  DATABASE_HOST: z.string().default('192.168.86.27'),
  DATABASE_PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('5432'),
  DATABASE_NAME: z.string().default('lumines'),
  DATABASE_USER: z.string().optional(),
  DATABASE_PASSWORD: z.string().optional(),
  DATABASE_POOL_MIN: z.string().transform(Number).pipe(z.number().int().positive()).default('2'),
  DATABASE_POOL_MAX: z.string().transform(Number).pipe(z.number().int().positive()).default('10'),

  // Redis Configuration
  REDIS_URL: z.string().url().optional(),
  REDIS_HOST: z.string().default('192.168.86.27'),
  REDIS_PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z.string().transform(Number).pipe(z.number().int().min(0).max(15)).default('0'),
  REDIS_TTL: z.string().transform(Number).pipe(z.number().int().positive()).default('3600'),

  // NATS Configuration
  NATS_URL: z.string().url().optional(),
  NATS_HOST: z.string().default('192.168.86.27'),
  NATS_PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('4222'),
  NATS_CLUSTER: z.string().default('lumines-cluster'),
  NATS_USER: z.string().optional(),
  NATS_PASSWORD: z.string().optional(),

  // Container Registry Configuration
  REGISTRY_URL: z.string().url().optional(),
  REGISTRY_HOST: z.string().default('192.168.86.27'),
  REGISTRY_PORT: z.string().transform(Number).pipe(z.number().int().positive()).default('5000'),
  REGISTRY_USER: z.string().optional(),
  REGISTRY_PASSWORD: z.string().optional(),

  // Kubernetes Configuration
  K8S_NAMESPACE: z.string().default('lumines'),
  K8S_CONTROL_NODE_IP: z.string().ip().default('192.168.86.114'),
  K8S_COMPUTE_NODE_IP: z.string().ip().default('192.168.86.115'),

  // Service Ports
  PORT_LANDING: z.string().transform(Number).pipe(z.number().int().positive()).default('3000'),
  PORT_SLATE: z.string().transform(Number).pipe(z.number().int().positive()).default('3001'),
  PORT_IGNITION: z.string().transform(Number).pipe(z.number().int().positive()).default('3002'),
  PORT_SPARK: z.string().transform(Number).pipe(z.number().int().positive()).default('3003'),
  PORT_IGNIS: z.string().transform(Number).pipe(z.number().int().positive()).default('3004'),
  PORT_WAYPOINT: z.string().transform(Number).pipe(z.number().int().positive()).default('3005'),

  // Authentication
  NOCTURNA_JWT_SECRET: z.string().optional(),
  NOCTURNA_JWT_AUDIENCE: z.string().default('lumines.nocturna.network'),

  // AI Configuration (SPARK)
  SPARK_AI_ENDPOINT: z.string().url().optional(),
  SPARK_AI_API_KEY: z.string().optional(),
  SPARK_ANTHROPIC_API_KEY: z.string().optional(),

  // Rate Limiting
  RATE_LIMIT_FREE: z.string().transform(Number).pipe(z.number().int().positive()).default('10'),
  RATE_LIMIT_PRO: z.string().transform(Number).pipe(z.number().int().positive()).default('100'),
  RATE_LIMIT_ENTERPRISE: z.string().transform(Number).pipe(z.number().int().positive()).default('1000'),
});

type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validated environment configuration
 * Throws error on startup if validation fails
 */
function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors
        .filter((e) => e.code === 'invalid_type' && e.received === 'undefined')
        .map((e) => e.path.join('.'))
        .join(', ');

      const invalid = error.errors
        .filter((e) => e.code !== 'invalid_type')
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('\n  ');

      const message = [
        '❌ Environment configuration validation failed!',
        '',
        missing ? `Missing required variables:\n  ${missing}\n` : '',
        invalid ? `Invalid variable values:\n  ${invalid}\n` : '',
        'See .env.example for required variables.',
      ]
        .filter(Boolean)
        .join('\n');

      throw new Error(message);
    }
    throw error;
  }
}

// Export validated config
export const env = validateEnv();

/**
 * Helper to get service URLs
 */
export const serviceUrls = {
  landing: env.NEXT_PUBLIC_APP_URL || `http://${env.K8S_CONTROL_NODE_IP}:${env.PORT_LANDING}`,
  slate: `http://${env.K8S_COMPUTE_NODE_IP}:${env.PORT_SLATE}`,
  ignition: `http://${env.K8S_CONTROL_NODE_IP}:${env.PORT_IGNITION}`,
  spark: `http://${env.K8S_COMPUTE_NODE_IP}:${env.PORT_SPARK}`,
  ignis: `http://${env.K8S_CONTROL_NODE_IP}:${env.PORT_IGNIS}`,
  waypoint: `http://${env.K8S_COMPUTE_NODE_IP}:${env.PORT_WAYPOINT}`,
};

/**
 * Helper to get database connection string
 */
export const getDatabaseUrl = (): string => {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }
  if (!env.DATABASE_USER || !env.DATABASE_PASSWORD) {
    throw new Error('Either DATABASE_URL or both DATABASE_USER and DATABASE_PASSWORD must be provided');
  }
  return `postgresql://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`;
};

/**
 * Helper to get Redis connection string
 */
export const getRedisUrl = (): string => {
  if (env.REDIS_URL) {
    return env.REDIS_URL;
  }
  const auth = env.REDIS_PASSWORD ? `:${env.REDIS_PASSWORD}@` : '';
  return `redis://${auth}${env.REDIS_HOST}:${env.REDIS_PORT}/${env.REDIS_DB}`;
};

/**
 * Helper to get NATS connection string
 */
export const getNatsUrl = (): string => {
  if (env.NATS_URL) {
    return env.NATS_URL;
  }
  const auth = env.NATS_USER && env.NATS_PASSWORD 
    ? `${env.NATS_USER}:${env.NATS_PASSWORD}@` 
    : '';
  return `nats://${auth}${env.NATS_HOST}:${env.NATS_PORT}`;
};

/**
 * Helper to get container registry URL
 */
export const getRegistryUrl = (): string => {
  if (env.REGISTRY_URL) {
    return env.REGISTRY_URL;
  }
  return `https://${env.REGISTRY_HOST}:${env.REGISTRY_PORT}`;
};

