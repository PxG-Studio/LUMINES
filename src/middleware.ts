/**
 * Next.js Root Middleware
 * Applies security, rate limiting, and logging to all requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/security/rate-limiter';
import { applySecurityHeaders } from '@/lib/security/security-headers';
import { logger } from '@/lib/monitoring/logger';

/**
 * Rate limiting configuration per route
 */
const RATE_LIMIT_CONFIG: Record<string, { limiter: typeof rateLimiters.standard; paths: string[] }> = {
  api: {
    limiter: rateLimiters.standard, // 100 requests per 15 minutes
    paths: ['/api'],
  },
  auth: {
    limiter: rateLimiters.strict, // 10 requests per minute
    paths: ['/api/auth'],
  },
  public: {
    limiter: rateLimiters.relaxed, // 1000 requests per hour
    paths: ['/'],
  },
};

/**
 * Get rate limiter for a given path
 */
function getRateLimiterForPath(pathname: string) {
  // Check auth routes first (most restrictive)
  if (pathname.startsWith('/api/auth')) {
    return RATE_LIMIT_CONFIG.auth.limiter;
  }
  
  // Check API routes
  if (pathname.startsWith('/api')) {
    return RATE_LIMIT_CONFIG.api.limiter;
  }
  
  // Default to relaxed for public routes
  return RATE_LIMIT_CONFIG.public.limiter;
}

/**
 * Check if path should be excluded from rate limiting
 */
function shouldSkipRateLimit(pathname: string): boolean {
  // Skip rate limiting for health checks and metrics (monitoring needs)
  const skipPaths = [
    '/api/health',
    '/api/metrics',
    '/api/health/db',
    '/api/health/cache',
    '/api/health/nats',
  ];
  
  return skipPaths.some(path => pathname.startsWith(path));
}

/**
 * Main middleware function
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();

  // Apply rate limiting (except for health checks)
  if (!shouldSkipRateLimit(pathname)) {
    const limiter = getRateLimiterForPath(pathname);
    const rateLimitResult = await limiter.middleware(request);
    
    // If rate limit exceeded, return 429 response
    if (rateLimitResult) {
      logger.warn('Rate limit exceeded', {
        path: pathname,
        ip: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
      });
      return rateLimitResult;
    }
  }

  // Create response
  const response = NextResponse.next();

  // Apply security headers
  applySecurityHeaders(response);

  // Add request ID for tracing
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  // Log request (async, don't block)
  const duration = Date.now() - startTime;
  logger.info('Request processed', {
    method: request.method,
    path: pathname,
    status: response.status,
    duration,
    requestId,
    ip: request.headers.get('x-forwarded-for') || request.ip || 'unknown',
    userAgent: request.headers.get('user-agent') || 'unknown',
  });

  return response;
}

/**
 * Middleware matcher - specify which routes to run middleware on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};

