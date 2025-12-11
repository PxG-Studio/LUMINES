/**
 * Next.js Middleware
 * 
 * Handles CDN headers, authentication, and request routing
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cdnMiddleware } from './config/cdn.config';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply CDN headers
  const cdnHeaders = cdnMiddleware(request);
  cdnHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    if (origin && isAllowedOrigin(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }

  return response;
}

function isAllowedOrigin(origin: string): boolean {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
  return allowedOrigins.includes(origin) || origin.includes('localhost');
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

