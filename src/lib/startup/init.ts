/**
 * Application Startup Initialization
 * 
 * Validates environment, initializes services, and sets up error handling
 */

import { validateEnvironmentOnStartup, checkRequiredServices } from '../config/validate';
import { env } from '../config/environment';

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
        nats: services.nats ? '✅' : '⚠️  (optional)',
      });
    }

    // 3. Log startup info
    if (env.NODE_ENV === 'development') {
      console.log('🚀 Starting LUMINES in development mode');
    } else {
      console.log('🚀 Starting LUMINES in production mode');
    }

    // 4. TODO: Initialize database connection pool
    // if (services.database) {
    //   await initializeDatabase();
    // }

    // 5. TODO: Initialize Redis connection
    // if (services.redis) {
    //   await initializeRedis();
    // }

    // 6. TODO: Initialize NATS connection
    // if (services.nats) {
    //   await initializeNats();
    // }

    // 7. TODO: Initialize event subscribers
    // if (services.nats) {
    //   initializeEventSubscribers();
    // }

    console.log('✅ Application initialization complete');
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler
 */
export function setupGracefulShutdown(onShutdown?: () => Promise<void>): void {
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}, initiating graceful shutdown...`);

    try {
      // TODO: Close database connections
      // await db.close();

      // TODO: Close Redis connections
      // await cache.close();

      // TODO: Close NATS connections
      // await eventBus.close();

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

