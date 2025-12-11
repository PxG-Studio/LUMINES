/**
 * Error Logging Integration
 * 
 * Connects error handler to logging system
 * Provides error aggregation and dashboard integration
 */

import { logEvent, AuditEvent } from './audit';
import { getAnalyticsTracker } from '../analytics/tracker';

export interface ErrorLogEntry {
  id: string;
  timestamp: number;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  requestId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface ErrorAggregation {
  errorType: string;
  count: number;
  firstOccurrence: number;
  lastOccurrence: number;
  affectedUsers: Set<string>;
  contexts: Array<Record<string, any>>;
}

class ErrorLogger {
  private errors: Map<string, ErrorLogEntry> = new Map();
  private aggregations: Map<string, ErrorAggregation> = new Map();
  private maxErrors: number = 10000; // Keep last 10k errors

  /**
   * Log an error
   */
  async logError(
    error: Error | string,
    context?: {
      userId?: string;
      requestId?: string;
      userAgent?: string;
      ipAddress?: string;
      [key: string]: any;
    }
  ): Promise<string> {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const isErrorObject = error instanceof Error;

    const entry: ErrorLogEntry = {
      id: errorId,
      timestamp: Date.now(),
      level: 'error',
      message: isErrorObject ? error.message : error,
      stack: isErrorObject ? error.stack : undefined,
      context: context || {},
      userId: context?.userId,
      requestId: context?.requestId,
      userAgent: context?.userAgent,
      ipAddress: context?.ipAddress,
    };

    // Store error
    this.errors.set(errorId, entry);

    // Cleanup old errors
    if (this.errors.size > this.maxErrors) {
      const oldest = Array.from(this.errors.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.errors.delete(oldest[0]);
    }

    // Aggregate error
    this.aggregateError(entry);

    // Log to audit system
    await logEvent(
      AuditEvent.SYSTEM_ERROR,
      {
        errorId,
        message: entry.message,
        stack: entry.stack,
        context: entry.context,
      },
      context?.userId,
      {
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      }
    );

    // Track in analytics
    const analytics = getAnalyticsTracker();
    analytics.track('error_occurred', {
      error_id: errorId,
      error_message: entry.message,
      error_type: this.getErrorType(entry),
      user_id: context?.userId,
    });

    // In production, also send to external logging service
    await this.sendToLoggingService(entry);

    return errorId;
  }

  /**
   * Log a warning
   */
  async logWarning(
    message: string,
    context?: Record<string, any>
  ): Promise<string> {
    const warningId = `warning-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const entry: ErrorLogEntry = {
      id: warningId,
      timestamp: Date.now(),
      level: 'warning',
      message,
      context: context || {},
      userId: context?.userId,
    };

    this.errors.set(warningId, entry);

    await logEvent(
      AuditEvent.SYSTEM_ERROR,
      {
        errorId: warningId,
        message,
        level: 'warning',
        context,
      },
      context?.userId
    );

    return warningId;
  }

  /**
   * Aggregate error for analytics
   */
  private aggregateError(entry: ErrorLogEntry): void {
    const errorType = this.getErrorType(entry);
    const existing = this.aggregations.get(errorType);

    if (existing) {
      existing.count++;
      existing.lastOccurrence = entry.timestamp;
      if (entry.userId) {
        existing.affectedUsers.add(entry.userId);
      }
      if (entry.context) {
        existing.contexts.push(entry.context);
        // Keep only last 10 contexts
        if (existing.contexts.length > 10) {
          existing.contexts.shift();
        }
      }
    } else {
      this.aggregations.set(errorType, {
        errorType,
        count: 1,
        firstOccurrence: entry.timestamp,
        lastOccurrence: entry.timestamp,
        affectedUsers: new Set(entry.userId ? [entry.userId] : []),
        contexts: entry.context ? [entry.context] : [],
      });
    }
  }

  /**
   * Get error type from error entry
   */
  private getErrorType(entry: ErrorLogEntry): string {
    if (entry.stack) {
      // Extract error type from stack trace
      const match = entry.stack.match(/^(\w+Error|Error):/);
      if (match) {
        return match[1];
      }
    }

    // Try to infer from message
    const message = entry.message.toLowerCase();
    if (message.includes('network') || message.includes('fetch')) {
      return 'NetworkError';
    }
    if (message.includes('timeout')) {
      return 'TimeoutError';
    }
    if (message.includes('validation')) {
      return 'ValidationError';
    }
    if (message.includes('authentication') || message.includes('unauthorized')) {
      return 'AuthenticationError';
    }

    return 'UnknownError';
  }

  /**
   * Send error to external logging service
   */
  private async sendToLoggingService(entry: ErrorLogEntry): Promise<void> {
    // In production, this would send to:
    // - Sentry
    // - LogRocket
    // - Datadog
    // - CloudWatch
    // - etc.

    const loggingServiceUrl = process.env.LOGGING_SERVICE_URL;
    if (!loggingServiceUrl) {
      return; // No external logging configured
    }

    try {
      await fetch(loggingServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LOGGING_SERVICE_KEY}`,
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Don't throw - logging failures shouldn't break the app
      console.error('Failed to send error to logging service:', error);
    }
  }

  /**
   * Get error by ID
   */
  getError(errorId: string): ErrorLogEntry | null {
    return this.errors.get(errorId) || null;
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 100): ErrorLogEntry[] {
    return Array.from(this.errors.values())
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Get error aggregations
   */
  getAggregations(): ErrorAggregation[] {
    return Array.from(this.aggregations.values())
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get errors by user
   */
  getErrorsByUser(userId: string): ErrorLogEntry[] {
    return Array.from(this.errors.values()).filter(
      (e) => e.userId === userId
    );
  }

  /**
   * Get error statistics
   */
  getStats(): {
    total: number;
    errors: number;
    warnings: number;
    byType: Record<string, number>;
    recentCount: number; // Last hour
  } {
    const now = Date.now();
    const oneHourAgo = now - 3600000;

    const stats = {
      total: this.errors.size,
      errors: 0,
      warnings: 0,
      byType: {} as Record<string, number>,
      recentCount: 0,
    };

    this.errors.forEach((entry) => {
      if (entry.level === 'error') {
        stats.errors++;
      } else if (entry.level === 'warning') {
        stats.warnings++;
      }

      const errorType = this.getErrorType(entry);
      stats.byType[errorType] = (stats.byType[errorType] || 0) + 1;

      if (entry.timestamp > oneHourAgo) {
        stats.recentCount++;
      }
    });

    return stats;
  }

  /**
   * Clear old errors
   */
  clearOldErrors(olderThan: number): void {
    const cutoff = Date.now() - olderThan;
    const toDelete: string[] = [];

    this.errors.forEach((entry, id) => {
      if (entry.timestamp < cutoff) {
        toDelete.push(id);
      }
    });

    toDelete.forEach((id) => this.errors.delete(id));
  }
}

// Singleton instance
let errorLoggerInstance: ErrorLogger | null = null;

/**
 * Get the global error logger
 */
export function getErrorLogger(): ErrorLogger {
  if (!errorLoggerInstance) {
    errorLoggerInstance = new ErrorLogger();
  }
  return errorLoggerInstance;
}

/**
 * Global error handler
 */
export function setupGlobalErrorHandler(): void {
  // Handle uncaught errors
  process.on('uncaughtException', async (error) => {
    const logger = getErrorLogger();
    await logger.logError(error, {
      source: 'uncaughtException',
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', async (reason) => {
    const logger = getErrorLogger();
    const error = reason instanceof Error ? reason : new Error(String(reason));
    await logger.logError(error, {
      source: 'unhandledRejection',
    });
  });

  // Handle browser errors (if running in browser context)
  if (typeof window !== 'undefined') {
    window.addEventListener('error', async (event) => {
      const logger = getErrorLogger();
      await logger.logError(event.error || new Error(event.message), {
        source: 'window.error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', async (event) => {
      const logger = getErrorLogger();
      const error = event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));
      await logger.logError(error, {
        source: 'unhandledrejection',
      });
    });
  }
}

