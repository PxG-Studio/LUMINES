/**
 * Security Headers Middleware
 * Production-ready security headers configuration
 */

import { NextResponse } from 'next/server';

/**
 * Security headers configuration
 */
export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: 'unsafe-eval' may be needed for some libraries
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ].join('; '),

  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',

  // X-Frame-Options
  'X-Frame-Options': 'DENY',

  // X-XSS-Protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer-Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions-Policy
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
  ].join(', '),

  // Strict-Transport-Security (HSTS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Cross-Origin-Embedder-Policy
  'Cross-Origin-Embedder-Policy': 'require-corp',

  // Cross-Origin-Opener-Policy
  'Cross-Origin-Opener-Policy': 'same-origin',

  // Cross-Origin-Resource-Policy
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Get security headers for API responses
 */
export function getSecurityHeaders(): Record<string, string> {
  return { ...securityHeaders };
}


