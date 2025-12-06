/**
 * Health Check Endpoint
 * Used by Kubernetes liveness and readiness probes
 */

import { NextResponse } from 'next/server';
import { checkRequiredServices } from '@/lib/config/validate';
import { checkDatabaseHealth } from '@/lib/db/client';
import { checkRedisHealth } from '@/lib/cache/client';
import { checkNatsHealth } from '@/lib/events/client';

/**
 * Check actual service health using real connections
 */
async function checkServiceHealth(): Promise<{
  database: { status: string; message?: string; healthy?: boolean };
  redis: { status: string; message?: string; healthy?: boolean };
  nats: { status: string; message?: string; healthy?: boolean };
}> {
  const services = checkRequiredServices();
  
  const results = {
    database: { status: 'unknown' as string, message: '' as string | undefined, healthy: false as boolean },
    redis: { status: 'unknown' as string, message: '' as string | undefined, healthy: false as boolean },
    nats: { status: 'unknown' as string, message: '' as string | undefined, healthy: false as boolean },
  };

  // Check database health
  if (services.database) {
    try {
      const healthy = await checkDatabaseHealth();
      results.database = {
        status: healthy ? 'healthy' : 'unhealthy',
        message: healthy ? 'Connection successful' : 'Connection failed',
        healthy,
      };
    } catch (error) {
      results.database = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Health check error',
        healthy: false,
      };
    }
  } else {
    results.database = {
      status: 'not_configured',
      message: 'Database credentials not provided',
      healthy: false,
    };
  }

  // Check Redis health
  try {
    const healthy = await checkRedisHealth();
    results.redis = {
      status: healthy ? 'healthy' : 'unhealthy',
      message: healthy ? 'Connection successful' : 'Connection failed',
      healthy,
    };
  } catch (error) {
    results.redis = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Health check error',
      healthy: false,
    };
  }

  // Check NATS health (only if configured)
  if (services.nats) {
    try {
      const healthy = await checkNatsHealth();
      results.nats = {
        status: healthy ? 'healthy' : 'unhealthy',
        message: healthy ? 'Connection successful' : 'Connection failed',
        healthy,
      };
    } catch (error) {
      results.nats = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Health check error',
        healthy: false,
      };
    }
  } else {
    results.nats = {
      status: 'not_configured',
      message: 'NATS not configured (optional)',
      healthy: true, // Not required
    };
  }

  return results;
}

export async function GET() {
  try {
    const services = await checkServiceHealth();
    
    // Determine overall health status
    // App is healthy if:
    // - Database is healthy (critical)
    // - Redis is healthy (important but can degrade)
    // - NATS is healthy OR not configured (optional)
    const criticalHealthy = services.database.healthy === true;
    const redisHealthy = services.redis.healthy === true || services.redis.status === 'not_configured';
    const natsHealthy = services.nats.healthy === true || services.nats.status === 'not_configured';
    
    const overallHealthy = criticalHealthy && redisHealthy && natsHealthy;
    const status = overallHealthy ? 'ok' : criticalHealthy ? 'degraded' : 'unhealthy';

    const health = {
      status,
      timestamp: new Date().toISOString(),
      services,
      uptime: process.uptime(),
    };

    // Return 200 for ok/degraded, 503 for unhealthy
    const statusCode = status === 'ok' ? 200 : status === 'degraded' ? 200 : 503;
    return NextResponse.json(health, { status: statusCode });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
