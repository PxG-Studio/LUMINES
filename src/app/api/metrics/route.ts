/**
 * Prometheus Metrics Endpoint
 * GET /api/metrics
 */

import { NextResponse } from 'next/server';
import { metrics } from '@/lib/monitoring/metrics';
import { applyStandardHeaders } from '@/lib/api/headers';

/**
 * GET /api/metrics
 * Export metrics in Prometheus format
 */
export async function GET() {
  try {
    const prometheusMetrics = metrics.exportPrometheus();
    
    const response = NextResponse.text(prometheusMetrics, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    });
    
    return applyStandardHeaders(response, { noCache: true });
  } catch (error) {
    console.error('Error exporting metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

