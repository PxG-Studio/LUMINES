/**
 * API v1 Base Route
 * 
 * Provides API access for integrations
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getRateLimiter, DEFAULT_RATE_LIMITS } from '@/lib/rate-limiting/limiter';

export const GET = withAuth(async (request: NextRequest, context) => {
  const { userId } = context;

  // Check rate limit
  const limiter = getRateLimiter();
  const limitResult = limiter.checkLimit(`api:${userId}`, DEFAULT_RATE_LIMITS.api);

  if (!limitResult.allowed) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: limitResult.retryAfter,
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': DEFAULT_RATE_LIMITS.api.maxRequests.toString(),
          'X-RateLimit-Remaining': limitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(limitResult.resetTime).toISOString(),
          'Retry-After': limitResult.retryAfter?.toString() || '60',
        },
      }
    );
  }

  limiter.recordRequest(`api:${userId}`, true);

  return NextResponse.json({
    version: '1.0.0',
    endpoints: {
      projects: '/api/v1/projects',
      files: '/api/v1/files',
      assets: '/api/v1/assets',
      generate: '/api/v1/generate',
    },
    documentation: 'https://docs.spark.example.com/api/v1',
  });
});

