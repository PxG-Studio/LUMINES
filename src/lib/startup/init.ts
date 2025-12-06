/**
 * Application Startup Initialization
 * 
 * Validates environment, initializes services, and sets up error handling
 */

import { validateEnvironmentOnStartup, checkRequiredServices } from '../config/validate';
import { env } from '../config/environment';
import { checkDatabaseHealth } from '../db/client';
import { checkRedisHealth } from '../cache/client';
import { initializeNats, checkNatsHealth } from '../events/client';
import { initializeEventSubscribers } from '../events/subscribers';

/**
 * Initialize application on startup
 * Call this at the very beginning of your application entry point
 */
export async function initializeApplication(): Promise<void> {
  try {
    // 1. Validate environment configuration
    console.log('🔍 Validating environment configuration...');
    validateEnvironmentOnStartup();

    // 2. Check required services
    console.log('🔍 Checking required services...');
    const services = checkRequiredServices();
    if (!services.allConfigured) {
      console.warn('⚠️  Some services are not fully configured:', {
        database: services.database ? '✅' : '❌',
        redis: services.redis ? '✅' : '⚠️  (optional)',
        nats: services.nats ? '⚠️  (optional)' : '⚠️  (optional)',
      });
    }

    // 3. Log startup info
    if (env.NODE_ENV === 'development') {
      console.log('🚀 Starting LUMINES in development mode');
    } else {
      console.log('🚀 Starting LUMINES in production mode');
    }

    // 4. Initialize database connection
    if (services.database) {
      console.log('🔌 Initializing database connection...');
      const dbHealthy = await checkDatabaseHealth();
      if (dbHealthy) {
        console.log('✅ Database connected and healthy');
      } else {
        console.warn('⚠️  Database connection check failed, but continuing...');
      }
    }

    // 5. Initialize Redis connection
    console.log('🔌 Initializing Redis connection...');
    const redisHealthy = await checkRedisHealth();
    if (redisHealthy) {
      console.log('✅ Redis connected and healthy');
    } else {
      console.warn('⚠️  Redis connection check failed, but continuing...');
    }

    // 6. Initialize NATS connection (async, don't block startup)
    if (services.nats) {
      console.log('🔌 Initializing NATS connection...');
      try {
        await initializeNats();
        const natsHealthy = await checkNatsHealth();
        if (natsHealthy) {
          console.log('✅ NATS connected and healthy');
          // Initialize event subscribers
          initializeEventSubscribers();
          console.log('✅ Event subscribers initialized');
        } else {
          console.warn('⚠️  NATS health check failed, but continuing...');
        }
      } catch (error) {
        console.warn('⚠️  NATS initialization failed, but continuing:', error);
      }
    }

    console.log('✅ Application initialization complete');
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    // Don't exit in production - allow graceful degradation
    if (env.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(onShutdown?: () => Promise<void>): void {
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}, initiating graceful shutdown...`);

    try {
      // Close database connections
      const { db } = await import('../db/client');
      await db.close();
      console.log('✅ Database connections closed');

      // Close Redis connections
      const { cache } = await import('../cache/client');
      await cache.close();
      console.log('✅ Redis connections closed');

      // Close NATS connections
      const { eventBus } = await import('../events/client');
      await eventBus.close();
      console.log('✅ NATS connections closed');

      // Call custom shutdown handler
      if (onShutdown) {
        await onShutdown();
      }

      console.log('✅ Graceful shutdown complete');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
