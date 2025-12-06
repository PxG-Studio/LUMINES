/**
 * API Response Headers Utilities
 * Helper functions for adding security and caching headers
 */

import { NextResponse } from 'next/server';

export interface SecurityHeaders {
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security'?: string;
  'Content-Security-Policy'?: string;
}

export interface CacheHeaders {
  'Cache-Control': string;
  'ETag'?: string;
  'Last-Modified'?: string;
}

/**
 * Default security headers
 */
export const defaultSecurityHeaders: SecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

/**
 * Production security headers (includes HSTS)
 */
export const productionSecurityHeaders: SecurityHeaders = {
  ...defaultSecurityHeaders,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
};

/**
 * Add security headers to response
 */
export function addSecurityHeaders(
  response: NextResponse,
  isProduction: boolean = false
): NextResponse {
  const headers = isProduction ? productionSecurityHeaders : defaultSecurityHeaders;

  for (const [key, value] of Object.entries(headers)) {
    if (value) {
      response.headers.set(key, value);
    }
  }

  return response;
}

/**
 * Add caching headers to response
 */
export function addCacheHeaders(
  response: NextResponse,
  maxAge: number = 3600, // 1 hour default
  isPublic: boolean = false,
  mustRevalidate: boolean = false
): NextResponse {
  const directives: string[] = [];

  if (isPublic) {
    directives.push('public');
  } else {
    directives.push('private');
  }

  directives.push(`max-age=${maxAge}`);

  if (mustRevalidate) {
    directives.push('must-revalidate');
  }

  response.headers.set('Cache-Control', directives.join(', '));

  return response;
}

/**
 * Add no-cache headers (for dynamic content)
 */
export function addNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  return response;
}

/**
 * Add CORS headers
 */
export function addCORSHeaders(
  response: NextResponse,
  origin: string | null = null,
  allowedMethods: string[] = ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
): NextResponse {
  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  response.headers.set('Access-Control-Allow-Methods', allowedMethods.join(', '));
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

/**
 * Add rate limit headers
 */
export function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  reset: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());

  return response;
}

/**
 * Add API version header
 */
export function addVersionHeader(response: NextResponse, version: string = '1.0.0'): NextResponse {
  response.headers.set('X-API-Version', version);
  return response;
}

/**
 * Apply standard API headers (security + version)
 */
export function applyStandardHeaders(
  response: NextResponse,
  options: {
    isProduction?: boolean;
    version?: string;
    noCache?: boolean;
    cacheMaxAge?: number;
  } = {}
): NextResponse {
  const {
    isProduction = process.env.NODE_ENV === 'production',
    version = '1.0.0',
    noCache = true,
    cacheMaxAge = 0,
  } = options;

  // Security headers
  addSecurityHeaders(response, isProduction);

  // Version header
  addVersionHeader(response, version);

  // Cache headers
  if (noCache) {
    addNoCacheHeaders(response);
  } else if (cacheMaxAge > 0) {
    addCacheHeaders(response, cacheMaxAge, false, true);
  }

  return response;
}

