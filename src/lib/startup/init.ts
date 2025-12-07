/**
 * Application Initialization
 * Runs on server startup to initialize services
 */

import { checkRedisHealth } from '@/lib/cache/client';

/**
 * Initialize application services
 */
export async function initializeApplication(): Promise<void> {
  try {
    // Check Redis connection
    const redisHealthy = await checkRedisHealth();
    if (!redisHealthy) {
      console.warn('⚠️  Redis connection check failed');
    } else {
      console.log('✅ Redis connection healthy');
    }

    // Database health check can be added when database client is available
    // For now, we'll skip it to avoid import errors

    console.log('✅ Application initialization complete');
  } catch (error) {
    console.error('❌ Application initialization failed:', error);
    // Don't throw - allow app to start even if initialization fails
  }
}
