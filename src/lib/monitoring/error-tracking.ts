/**
 * Error Tracking System
 * Provides structured error tracking and reporting
 */

import { logger } from './logger';

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface TrackedError extends Error {
  context?: ErrorContext;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  reported?: boolean;
}

class ErrorTracker {
  private errorBuffer: TrackedError[] = [];
  private readonly maxBufferSize = 100;
  private readonly flushInterval = 60000; // 1 minute
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    // Start periodic flush
    if (typeof window === 'undefined') {
      this.startFlushTimer();
    }
  }

  /**
   * Track an error with context
   */
  trackError(
    error: Error | unknown,
    context: ErrorContext = {},
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    const trackedError: TrackedError = error instanceof Error
      ? error
      : new Error(String(error));

    trackedError.context = context;
    trackedError.severity = severity;
    trackedError.reported = false;

    // Log error
    logger.error('Error tracked', trackedError, context);

    // Add to buffer
    this.errorBuffer.push(trackedError);

    // Trim buffer if too large
    if (this.errorBuffer.length > this.maxBufferSize) {
      this.errorBuffer.shift();
    }

    // Report critical errors immediately
    if (severity === 'critical') {
      this.reportError(trackedError);
    }
  }

  /**
   * Report error to external service
   */
  private reportError(error: TrackedError): void {
    if (error.reported) {
      return;
    }

    try {
      // In production, send to error tracking service (Sentry, etc.)
      // For now, just mark as reported
      error.reported = true;

      // Example: Send to Sentry (if configured)
      // if (typeof window !== 'undefined' && (window as any).Sentry) {
      //   (window as any).Sentry.captureException(error, {
      //     tags: {
      //       severity: error.severity,
      //       component: error.context?.component,
      //     },
      //     extra: error.context?.metadata,
      //     user: error.context?.userId ? { id: error.context.userId } : undefined,
      //   });
      // }

      logger.info('Error reported to tracking service', {
        error: error.message,
        severity: error.severity,
        context: error.context,
      });
    } catch (reportError) {
      logger.error('Failed to report error', reportError);
    }
  }

  /**
   * Flush error buffer (report all errors)
   */
  flush(): void {
    const errorsToReport = this.errorBuffer.filter(e => !e.reported);
    
    for (const error of errorsToReport) {
      this.reportError(error);
    }

    // Clear reported errors from buffer
    this.errorBuffer = this.errorBuffer.filter(e => !e.reported);
  }

  /**
   * Start periodic flush timer
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Stop flush timer
   */
  stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }

    // Flush remaining errors
    this.flush();
  }

  /**
   * Get error statistics
   */
  getStats(): {
    total: number;
    bySeverity: Record<string, number>;
    recent: number;
  } {
    const bySeverity: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    for (const error of this.errorBuffer) {
      const severity = error.severity || 'medium';
      bySeverity[severity] = (bySeverity[severity] || 0) + 1;
    }

    return {
      total: this.errorBuffer.length,
      bySeverity,
      recent: this.errorBuffer.filter(e => !e.reported).length,
    };
  }
}

export const errorTracker = new ErrorTracker();

/**
 * Convenience function to track errors
 */
export function trackError(
  error: Error | unknown,
  context?: ErrorContext,
  severity?: 'low' | 'medium' | 'high' | 'critical'
): void {
  errorTracker.trackError(error, context, severity);
}

/**
 * Track API errors
 */
export function trackApiError(
  error: Error | unknown,
  request: {
    method: string;
    path: string;
    requestId?: string;
    userId?: string;
  },
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): void {
  trackError(error, {
    userId: request.userId,
    requestId: request.requestId,
    path: request.path,
    method: request.method,
    component: 'api',
  }, severity);
}

