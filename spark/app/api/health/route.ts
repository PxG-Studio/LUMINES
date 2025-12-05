/**
 * Health Check Endpoint
 * 
 * Used by Kubernetes liveness and readiness probes
 */

import { NextResponse } from 'next/server';
import { query } from '@/lib/database/postgres-client';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: 'unknown',
      memory: 'unknown',
    },
  };

  // Check database connection
  try {
    await query('SELECT 1');
    checks.checks.database = 'healthy';
  } catch (error) {
    checks.checks.database = 'unhealthy';
    checks.status = 'unhealthy';
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
  const memoryLimitMB = (memoryUsage.heapTotal / 1024 / 1024) * 2; // Rough estimate

  if (memoryUsageMB > memoryLimitMB * 0.9) {
    checks.checks.memory = 'warning';
  } else {
    checks.checks.memory = 'healthy';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}

