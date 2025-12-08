/**
 * SPARK Health Check Endpoint
 * 
 * Simple health check for SPARK MVP 1
 * Checks API key configuration and basic service status
 */

import { NextResponse } from 'next/server';
import { getCircuitBreaker } from '@/lib/spark/security/circuit-breaker';
import { getMetricsCollector } from '@/lib/spark/monitoring/metrics';
import { getErrorTracker } from '@/lib/spark/monitoring/error-tracker';

export async function GET() {
  const checks = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'spark',
    version: '1.0.0',
    checks: {
      apiKeys: {
        anthropic: !!process.env.ANTHROPIC_API_KEY,
        openai: !!process.env.OPENAI_API_KEY,
        status: 'unknown' as string,
      },
      memory: 'unknown' as string,
      circuitBreakers: {
        claude: 'unknown' as string,
        openai: 'unknown' as string,
      },
      metrics: {
        available: false,
      },
      errorTracking: {
        available: false,
      },
    },
  };

  // Check API key configuration
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  
  if (hasAnthropic || hasOpenAI) {
    checks.checks.apiKeys.status = 'configured';
  } else {
    checks.checks.apiKeys.status = 'missing';
    checks.status = 'degraded';
  }

  // Check memory usage
  const memoryUsage = process.memoryUsage();
  const memoryUsageMB = memoryUsage.heapUsed / 1024 / 1024;
  const memoryLimitMB = (memoryUsage.heapTotal / 1024 / 1024) * 2;

  if (memoryUsageMB > memoryLimitMB * 0.9) {
    checks.checks.memory = 'warning';
    checks.status = 'degraded';
  } else {
    checks.checks.memory = 'healthy';
  }

  // Check circuit breakers
  try {
    const claudeBreaker = getCircuitBreaker('claude');
    const openaiBreaker = getCircuitBreaker('openai');
    checks.checks.circuitBreakers.claude = claudeBreaker.getState().state;
    checks.checks.circuitBreakers.openai = openaiBreaker.getState().state;

    if (claudeBreaker.getState().state === 'open' && openaiBreaker.getState().state === 'open') {
      checks.status = 'unhealthy';
    }
  } catch (error) {
    checks.checks.circuitBreakers.claude = 'error';
    checks.checks.circuitBreakers.openai = 'error';
  }

  // Check metrics collector
  try {
    const metrics = getMetricsCollector();
    checks.checks.metrics.available = true;
  } catch (error) {
    checks.checks.metrics.available = false;
  }

  // Check error tracker
  try {
    const tracker = getErrorTracker();
    const stats = tracker.getStatistics();
    checks.checks.errorTracking.available = true;
    if (stats.bySeverity.critical > 10) {
      checks.status = 'unhealthy';
    }
  } catch (error) {
    checks.checks.errorTracking.available = false;
  }

  const statusCode = checks.status === 'healthy' ? 200 : checks.status === 'degraded' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}

