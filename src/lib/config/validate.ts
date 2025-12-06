/**
 * Environment Validation
 * 
 * Validates environment variables on application startup.
 * Provides helpful error messages for missing or invalid variables.
 */

import { env } from './environment';

/**
 * Validate environment configuration on startup
 * Call this at application entry point
 */
export function validateEnvironmentOnStartup(): void {
  try {
    // Environment validation happens during import via zod schema
    // This function provides a clear entry point for validation
    console.log('✅ Environment configuration validated');
    
    // Log non-sensitive config (for debugging)
    if (process.env.NODE_ENV === 'development') {
      console.log('📋 Configuration:', {
        nodeEnv: env.NODE_ENV,
        database: {
          host: env.DATABASE_HOST,
          port: env.DATABASE_PORT,
          database: env.DATABASE_NAME,
          poolMin: env.DATABASE_POOL_MIN,
          poolMax: env.DATABASE_POOL_MAX,
        },
        redis: {
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
          db: env.REDIS_DB,
        },
        nats: {
          host: env.NATS_HOST,
          port: env.NATS_PORT,
          cluster: env.NATS_CLUSTER,
        },
        k8s: {
          namespace: env.K8S_NAMESPACE,
          controlNode: env.K8S_CONTROL_NODE_IP,
          computeNode: env.K8S_COMPUTE_NODE_IP,
        },
      });
    }
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    process.exit(1);
  }
}

/**
 * Check if all required services are configured
 */
export function checkRequiredServices(): {
  database: boolean;
  redis: boolean;
  nats: boolean;
  allConfigured: boolean;
} {
  const database = !!(env.DATABASE_USER && env.DATABASE_PASSWORD);
  const redis = true; // Redis password is optional
  const nats = true; // NATS auth is optional
  
  return {
    database,
    redis,
    nats,
    allConfigured: database && redis && nats,
  };
}

