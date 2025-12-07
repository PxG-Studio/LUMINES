import { query } from '../database/client';
import { publish } from '../messaging/client';

export interface ErrorContext {
  userId?: string;
  projectId?: string;
  componentStack?: string;
  userAction?: string;
  metadata?: Record<string, any>;
}

export interface SlateError {
  id: string;
  user_id?: string;
  project_id?: string;
  error_type: string;
  error_message: string;
  error_stack?: string;
  context: Record<string, any>;
  severity: 'info' | 'warning' | 'error' | 'critical';
  created_at: Date;
}

/**
 * Centralized error handler for SLATE
 * Logs errors to PostgreSQL and publishes events via NATS
 */
export class ErrorHandler {
  /**
   * Handle and log error
   */
  static async handleError(
    error: Error,
    context: ErrorContext = {}
  ): Promise<void> {
    if (import.meta.env.DEV) {
      console.error('Error:', error, context);
    }

    try {
      await this.logError(error, context);
      await this.publishErrorEvent(error, context);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  /**
   * Log error to PostgreSQL
   */
  private static async logError(
    error: Error,
    context: ErrorContext
  ): Promise<void> {
    try {
      await query(
        `INSERT INTO slate_error_logs
         (user_id, project_id, error_type, error_message, error_stack, context, severity)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          context.userId || null,
          context.projectId || null,
          error.name || 'Error',
          error.message,
          error.stack || null,
          JSON.stringify(context.metadata || {}),
          this.determineSeverity(error),
        ]
      );
    } catch (dbError) {
      console.error('Failed to log error to database:', dbError);
    }
  }

  /**
   * Publish error event via NATS
   */
  private static async publishErrorEvent(
    error: Error,
    context: ErrorContext
  ): Promise<void> {
    try {
      await publish('slate.error.occurred', {
        errorType: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        userId: context.userId,
        projectId: context.projectId,
        metadata: context.metadata,
        timestamp: new Date().toISOString(),
      });
    } catch (publishError) {
      console.error('Failed to publish error event:', publishError);
    }
  }

  /**
   * Determine error severity
   */
  private static determineSeverity(error: Error): 'info' | 'warning' | 'error' | 'critical' {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (message.includes('critical') || message.includes('fatal')) {
      return 'critical';
    }

    if (name.includes('network') || name.includes('timeout')) {
      return 'warning';
    }

    if (name.includes('validation') || name.includes('permission')) {
      return 'warning';
    }

    return 'error';
  }

  /**
   * Create user-friendly error message
   */
  static getUserMessage(error: Error): string {
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return 'Connection failed. Please check your internet connection.';
    }

    if (message.includes('permission') || message.includes('forbidden')) {
      return 'You don\'t have permission to perform this action.';
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return 'Invalid input. Please check your data and try again.';
    }

    if (message.includes('not found') || message.includes('404')) {
      return 'The requested resource was not found.';
    }

    if (message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    if (message.includes('authentication') || message.includes('unauthorized')) {
      return 'Authentication required. Please sign in.';
    }

    return error.message || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Get error logs for project
   */
  static async getProjectErrors(
    projectId: string,
    limit: number = 50
  ): Promise<SlateError[]> {
    const result = await query<SlateError>(
      `SELECT * FROM slate_error_logs
       WHERE project_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [projectId, limit]
    );

    return result.rows;
  }

  /**
   * Get error logs for user
   */
  static async getUserErrors(
    userId: string,
    limit: number = 50
  ): Promise<SlateError[]> {
    const result = await query<SlateError>(
      `SELECT * FROM slate_error_logs
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  }

  /**
   * Clear old error logs (cleanup)
   */
  static async clearOldErrors(daysOld: number = 30): Promise<number> {
    const result = await query(
      `DELETE FROM slate_error_logs
       WHERE created_at < NOW() - INTERVAL '${daysOld} days'
       RETURNING id`
    );

    return result.rowCount || 0;
  }
}

/**
 * Log error helper function
 */
export async function logError(params: {
  error: Error;
  errorInfo?: React.ErrorInfo;
  context?: Record<string, any>;
}): Promise<void> {
  await ErrorHandler.handleError(params.error, {
    componentStack: params.errorInfo?.componentStack,
    metadata: params.context,
  });
}

/**
 * Custom error classes
 */
export class DatabaseError extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends Error {
  constructor(message: string = 'Permission denied') {
    super(message);
    this.name = 'PermissionError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
  }
}
