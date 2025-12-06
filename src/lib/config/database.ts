/**
 * Database Configuration
 * PostgreSQL connection configuration using environment variables
 */

import { env, getDatabaseUrl } from './environment';

export const databaseConfig = {
  url: getDatabaseUrl(),
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  database: env.DATABASE_NAME,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  pool: {
    min: env.DATABASE_POOL_MIN,
    max: env.DATABASE_POOL_MAX,
  },
  ssl: env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false, // TODO: Configure proper SSL certificates
  } : false,
} as const;

