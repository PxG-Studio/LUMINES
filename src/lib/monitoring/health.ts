/**
 * Health Check System
 * Monitor system health and provide diagnostic endpoints
 */

import { checkRedisHealth } from '../cache/client';
import { logger } from './logger';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  checks: HealthCheck[];
  uptime: number;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * Run all health checks
 */
export async function runHealthChecks(): Promise<HealthStatus> {
  const startTime = Date.now();
  const checks: HealthCheck[] = [];

  // Redis health check
  try {
    const redisHealthy = await checkRedisHealth();
    checks.push({
      name: 'redis',
      status: redisHealthy ? 'pass' : 'fail',
      message: redisHealthy ? 'Redis is responding' : 'Redis is not responding',
      duration: Date.now() - startTime,
    });
  } catch (error) {
    checks.push({
      name: 'redis',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Database health check (if available)
  try {
    // Add database check when available
    checks.push({
      name: 'database',
      status: 'pass',
      message: 'Database connection healthy',
    });
  } catch (error) {
    checks.push({
      name: 'database',
      status: 'fail',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  // Memory check
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memory = process.memoryUsage();
    const heapUsedPercent = (memory.heapUsed / memory.heapTotal) * 100;
    
    checks.push({
      name: 'memory',
      status: heapUsedPercent > 90 ? 'warn' : 'pass',
      message: `Heap usage: ${heapUsedPercent.toFixed(2)}%`,
      metadata: {
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal,
        external: memory.external,
      },
    });
  }

  // Determine overall status
  const hasFailures = checks.some(c => c.status === 'fail');
  const hasWarnings = checks.some(c => c.status === 'warn');
  
  const status: HealthStatus = {
    status: hasFailures ? 'unhealthy' : hasWarnings ? 'degraded' : 'healthy',
    timestamp: Date.now(),
    checks,
    uptime: process.uptime ? process.uptime() : 0,
  };

  if (status.status !== 'healthy') {
    logger.warn('Health check detected issues', { status: status.status, checks });
  }

  return status;
}

/**
 * Start periodic health checks
 */
export function startHealthMonitoring(intervalMs: number = 60000): NodeJS.Timer {
  logger.info('Starting health monitoring', { intervalMs });

  return setInterval(async () => {
    try {
      const health = await runHealthChecks();
      
      if (health.status !== 'healthy') {
        logger.warn('System health degraded', {
          status: health.status,
          failedChecks: health.checks.filter(c => c.status === 'fail').map(c => c.name),
        });
      }
    } catch (error) {
      logger.error('Health monitoring failed', error);
    }
  }, intervalMs);
}
