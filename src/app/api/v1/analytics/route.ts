/**
 * API v1 Analytics Endpoint
 * 
 * Get analytics data (requires admin or own data)
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getAnalyticsTracker } from '@/lib/analytics/tracker';
import { getCostTracker } from '@/lib/analytics/cost-tracker';

export const GET = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;
  const tracker = getAnalyticsTracker();
  const costTracker = getCostTracker();

  const metrics = tracker.getMetrics();
  const costMetrics = costTracker.getMetrics();
  const optimization = costTracker.getOptimizationRecommendations();

  return NextResponse.json({
    usage: metrics,
    costs: costMetrics,
    optimization,
  });
});

