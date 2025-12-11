/**
 * Error Tracking Service
 * 
 * Lightweight error tracking that doesn't require external services
 * Can be extended to integrate with Sentry, LogRocket, etc.
 */

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
  url?: string;
  method?: string;
  [key: string]: any;
}

export interface TrackedError {
  id: string;
  timestamp: number;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  fingerprint: string; // For grouping similar errors
}

class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();
  private errorCounts: Map<string, number> = new Map();
  private maxErrors: number = 1000; // Keep last 1000 errors

  /**
   * Track an error
   */
  trackError(
    error: Error | string,
    context: ErrorContext = {},
    severity: TrackedError['severity'] = 'medium'
  ): string {
    const errorId = `err-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const isErrorObject = error instanceof Error;
    const message = isErrorObject ? error.message : error;
    const stack = isErrorObject ? error.stack : undefined;

    // Create fingerprint for grouping
    const fingerprint = this.createFingerprint(message, stack);

    const trackedError: TrackedError = {
      id: errorId,
      timestamp: Date.now(),
      message,
      stack,
      context,
      severity,
      fingerprint,
    };

    // Store error
    this.errors.set(errorId, trackedError);

    // Count errors by fingerprint
    const count = this.errorCounts.get(fingerprint) || 0;
    this.errorCounts.set(fingerprint, count + 1);

    // Cleanup old errors
    if (this.errors.size > this.maxErrors) {
      const oldest = Array.from(this.errors.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.errors.delete(oldest[0]);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorTracker]', {
        id: errorId,
        message,
        severity,
        context,
      });
    }

    // TODO: Send to external service (Sentry, LogRocket, etc.)
    // This can be done asynchronously to not block the request
    this.sendToExternalService(trackedError).catch(err => {
      console.error('Failed to send error to external service:', err);
    });

    return errorId;
  }

  /**
   * Get error by ID
   */
  getError(errorId: string): TrackedError | undefined {
    return this.errors.get(errorId);
  }

  /**
   * Get error count for a fingerprint
   */
  getErrorCount(fingerprint: string): number {
    return this.errorCounts.get(fingerprint) || 0;
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 50): TrackedError[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: TrackedError['severity']): TrackedError[] {
    return Array.from(this.errors.values())
      .filter(err => err.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Get error statistics
   */
  getStatistics(): {
    total: number;
    bySeverity: Record<TrackedError['severity'], number>;
    topErrors: Array<{ fingerprint: string; count: number; message: string }>;
  } {
    const errors = Array.from(this.errors.values());
    const bySeverity: Record<TrackedError['severity'], number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    errors.forEach(err => {
      bySeverity[err.severity]++;
    });

    // Get top errors by count
    const topErrors = Array.from(this.errorCounts.entries())
      .map(([fingerprint, count]) => {
        const error = errors.find(e => e.fingerprint === fingerprint);
        return {
          fingerprint,
          count,
          message: error?.message || 'Unknown error',
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      total: errors.length,
      bySeverity,
      topErrors,
    };
  }

  /**
   * Create fingerprint for error grouping
   */
  private createFingerprint(message: string, stack?: string): string {
    // Use message as base
    let fingerprint = message.slice(0, 100);

    // Add stack trace location if available
    if (stack) {
      const stackLines = stack.split('\n');
      if (stackLines.length > 1) {
        // Use first stack frame location
        const firstFrame = stackLines[1];
        const match = firstFrame.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
        if (match) {
          fingerprint += `:${match[2]}:${match[3]}`;
        }
      }
    }

    return fingerprint;
  }

  /**
   * Send error to external service (async, non-blocking)
   */
  private async sendToExternalService(error: TrackedError): Promise<void> {
    // Check if external service is configured
    const sentryDsn = process.env.SENTRY_DSN;
    const logRocketAppId = process.env.LOGROCKET_APP_ID;
    const errorTrackingUrl = process.env.ERROR_TRACKING_URL;

    // Priority: Sentry > LogRocket > Custom URL
    if (sentryDsn) {
      // TODO: Integrate with Sentry SDK
      // await Sentry.captureException(new Error(error.message), {
      //   contexts: { custom: error.context },
      //   level: error.severity,
      //   fingerprint: [error.fingerprint],
      // });
    } else if (logRocketAppId) {
      // TODO: Integrate with LogRocket
    } else if (errorTrackingUrl) {
      // Send to custom error tracking endpoint
      try {
        await fetch(errorTrackingUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(error),
        });
      } catch (err) {
        // Silently fail - don't break the app if error tracking fails
      }
    }
  }

  /**
   * Clear all errors
   */
  clear(): void {
    this.errors.clear();
    this.errorCounts.clear();
  }
}

// Singleton instance
let trackerInstance: ErrorTracker | null = null;

/**
 * Get error tracker instance
 */
export function getErrorTracker(): ErrorTracker {
  if (!trackerInstance) {
    trackerInstance = new ErrorTracker();
  }
  return trackerInstance;
}

/**
 * Track an error (convenience function)
 */
export function trackError(
  error: Error | string,
  context: ErrorContext = {},
  severity: TrackedError['severity'] = 'medium'
): string {
  return getErrorTracker().trackError(error, context, severity);
}

