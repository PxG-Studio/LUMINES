/**
 * SPARK Health Check Endpoint
 * 
 * Simple health check for SPARK MVP 1
 * Checks API key configuration and basic service status
 */

import { NextResponse } from 'next/server';

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
  } else {
    checks.checks.memory = 'healthy';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}

