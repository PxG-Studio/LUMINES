/**
 * SPARK Initialization
 * 
 * Initializes SPARK-specific services on app startup
 */

import { setupGlobalErrorHandler } from '@/lib/spark/monitoring/error-logging';

let initialized = false;

/**
 * Initialize SPARK services
 * Safe to call multiple times (idempotent)
 */
export function initializeSpark(): void {
  // Prevent multiple initializations
  if (initialized) {
    return;
  }

  // Sentry error monitoring is optional
  // To enable: install @sentry/nextjs and configure SENTRY_DSN
  // For now, Sentry is disabled to avoid build-time dependency issues

  // Setup global error handler (client-side only)
  if (typeof window !== 'undefined') {
    setupGlobalErrorHandler();
  }

  initialized = true;

  if (process.env.NODE_ENV === 'development') {
    console.log('[SPARK] Initialized');
  }
}

