/**
 * Metrics Endpoint
 * 
 * Exposes metrics in Prometheus format for scraping
 */

import { NextResponse } from 'next/server';
import { getMetricsCollector } from '@/lib/spark/monitoring/metrics';

export async function GET() {
  try {
    const collector = getMetricsCollector();
    const prometheusFormat = collector.exportPrometheus();

    return new NextResponse(prometheusFormat, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      },
    });
  } catch (error) {
    console.error('Failed to export metrics:', error);
    return NextResponse.json(
      { error: 'Failed to export metrics' },
      { status: 500 }
    );
  }
}
