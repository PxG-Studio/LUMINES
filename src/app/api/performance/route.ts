/**
 * Performance Metrics Endpoint
 * GET /api/performance
 */

import { NextResponse, NextRequest } from 'next/server';
import { performanceMonitor } from '@/lib/monitoring/performance';
import { applyStandardHeaders } from '@/lib/api/headers';
import { authenticate } from '@/lib/middleware/auth';

/**
 * GET /api/performance
 * Get performance metrics and statistics
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  // Authentication required
  const authResponse = await authenticate(request);
  if (authResponse) {
    return authResponse; // Returns 401 if not authenticated
  }

  try {
    // Get memory usage
    const memoryUsage = performanceMonitor.getMemoryUsage();

    // Get performance stats for common metrics
    const stats = {
      memory: {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        external: memoryUsage.external,
        rss: memoryUsage.rss,
        heapUsedPercentage: memoryUsage.heapTotal > 0
          ? (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
          : 0,
      },
      api: {
        responseTime: performanceMonitor.getStats('api_response_time'),
        requestDuration: performanceMonitor.getStats('http_request_duration_ms'),
      },
      database: {
        queryTime: performanceMonitor.getStats('database_query_time'),
        queryDuration: performanceMonitor.getStats('database_query_duration_ms'),
      },
      cache: {
        operationTime: performanceMonitor.getStats('cache_operation_time'),
      },
    };

    const response = NextResponse.json(stats);
    return applyStandardHeaders(response);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    const response = NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
    return applyStandardHeaders(response);
  }
}

