/**
 * Comprehensive Error Handling Utilities
 * EC-LAND-601 to EC-LAND-650: Error handling edge cases fixes
 */

/**
 * Error Boundary Manager
 * EC-LAND-601 to EC-LAND-610: Error boundaries
 */
export class ErrorBoundaryManager {
  private static errorBoundaries = new Map<string, {
    componentStack?: string;
    error?: Error;
    errorInfo?: any;
  }>();

  /**
   * Register error boundary
   * EC-LAND-601
   */
  static registerError(
    boundaryId: string,
    error: Error,
    errorInfo?: any
  ): void {
    this.errorBoundaries.set(boundaryId, {
      error,
      errorInfo,
      componentStack: errorInfo?.componentStack,
    });

    // EC-LAND-606: Log error
    this.logError(error, errorInfo);
  }

  /**
   * Get error for boundary
   * EC-LAND-607
   */
  static getError(boundaryId: string): Error | null {
    const errorData = this.errorBoundaries.get(boundaryId);
    return errorData?.error || null;
  }

  /**
   * Clear error
   * EC-LAND-608
   */
  static clearError(boundaryId: string): void {
    this.errorBoundaries.delete(boundaryId);
  }

  /**
   * Log error
   * EC-LAND-606, EC-LAND-631
   */
  static logError(error: Error, errorInfo?: any): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    };

    // EC-LAND-632: Structured logging
    console.error('Error Boundary:', errorData);

    // EC-LAND-636: Send to monitoring service (in production)
    if (typeof window !== 'undefined' && (window as any).errorReporting) {
      (window as any).errorReporting.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo?.componentStack,
          },
        },
      });
    }
  }

  /**
   * Check if error is recoverable
   * EC-LAND-608
   */
  static isRecoverable(error: Error): boolean {
    // Network errors are usually recoverable
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return true;
    }

    // Syntax errors are not recoverable
    if (error.name === 'SyntaxError') {
      return false;
    }

    // Type errors might be recoverable
    if (error.name === 'TypeError') {
      return true;
    }

    return false;
  }
}

/**
 * User-Friendly Error Messages
 * EC-LAND-611 to EC-LAND-620: User-friendly error messages
 */
export class UserFriendlyErrors {
  private static errorMessages: Record<string, string> = {
    'network': 'Connection problem. Please check your internet and try again.',
    'timeout': 'Request took too long. Please try again.',
    'server': 'Server error. We\'re working on it. Please try again later.',
    'not-found': 'The requested resource was not found.',
    'unauthorized': 'You don\'t have permission to access this resource.',
    'forbidden': 'Access denied. Please contact support if you believe this is an error.',
    'validation': 'Please check your input and try again.',
    'unknown': 'Something went wrong. Please try again or contact support.',
  };

  /**
   * Get user-friendly error message
   * EC-LAND-611, EC-LAND-612
   */
  static getMessage(error: Error | string, context?: string): string {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorName = typeof error === 'string' ? 'unknown' : error.name.toLowerCase();

    // EC-LAND-617: Contextual messages
    if (context) {
      const contextualMessage = this.getContextualMessage(context, errorMessage);
      if (contextualMessage) return contextualMessage;
    }

    // Check for specific error types
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return this.errorMessages.network;
    }

    if (errorMessage.includes('timeout')) {
      return this.errorMessages.timeout;
    }

    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return this.errorMessages['not-found'];
    }

    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return this.errorMessages.unauthorized;
    }

    if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
      return this.errorMessages.forbidden;
    }

    if (errorMessage.includes('500') || errorMessage.includes('server')) {
      return this.errorMessages.server;
    }

    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return this.errorMessages.validation;
    }

    // EC-LAND-613: Localized messages (placeholder)
    return this.errorMessages[errorName] || this.errorMessages.unknown;
  }

  /**
   * Get contextual error message
   * EC-LAND-617
   */
  private static getContextualMessage(context: string, errorMessage: string): string | null {
    const contextualMessages: Record<string, Record<string, string>> = {
      'form': {
        'email': 'Please enter a valid email address.',
        'password': 'Password must be at least 8 characters.',
        'required': 'This field is required.',
      },
      'upload': {
        'size': 'File is too large. Please choose a smaller file.',
        'type': 'File type not supported. Please choose a different file.',
      },
      'payment': {
        'card': 'Please check your card details and try again.',
        'declined': 'Payment was declined. Please try a different payment method.',
      },
    };

    return contextualMessages[context]?.[errorMessage.toLowerCase()] || null;
  }

  /**
   * Make error message actionable
   * EC-LAND-612
   */
  static makeActionable(message: string, action?: string): string {
    if (action) {
      return `${message} ${action}`;
    }
    return message;
  }

  /**
   * Check if error message is dismissible
   * EC-LAND-615
   */
  static isDismissible(error: Error): boolean {
    // Network errors can be dismissed
    if (error.message.includes('network')) {
      return true;
    }

    // Validation errors can be dismissed
    if (error.message.includes('validation')) {
      return true;
    }

    // Server errors should not be dismissed immediately
    if (error.message.includes('500') || error.message.includes('server')) {
      return false;
    }

    return true;
  }
}

/**
 * Error Recovery Manager
 * EC-LAND-621 to EC-LAND-630: Error recovery
 */
export class ErrorRecoveryManager {
  /**
   * Auto-recover from error
   * EC-LAND-621
   */
  static async autoRecover(
    error: Error,
    recoveryFn: () => Promise<void>
  ): Promise<boolean> {
    // Only auto-recover from certain errors
    if (!this.isAutoRecoverable(error)) {
      return false;
    }

    try {
      await recoveryFn();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if error is auto-recoverable
   * EC-LAND-621
   */
  private static isAutoRecoverable(error: Error): boolean {
    // Network errors are auto-recoverable
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return true;
    }

    // Timeout errors are auto-recoverable
    if (error.message.includes('timeout')) {
      return true;
    }

    return false;
  }

  /**
   * User-initiated recovery
   * EC-LAND-622
   */
  static async userRecover(
    recoveryFn: () => Promise<void>
  ): Promise<{ success: boolean; error?: Error }> {
    try {
      await recoveryFn();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Log recovery attempt
   * EC-LAND-623
   */
  static logRecovery(
    error: Error,
    recoveryType: 'auto' | 'user',
    success: boolean
  ): void {
    console.log('Error Recovery:', {
      error: error.message,
      type: recoveryType,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Test recovery
   * EC-LAND-624
   */
  static async testRecovery(recoveryFn: () => Promise<void>): Promise<boolean> {
    try {
      await recoveryFn();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Error Logging & Monitoring
 * EC-LAND-631 to EC-LAND-640: Error logging
 */
export class ErrorLogger {
  private static errorLog: Array<{
    error: Error;
    context?: any;
    timestamp: string;
    userAgent?: string;
    url?: string;
  }> = [];
  private static readonly MAX_LOG_SIZE = 100;

  /**
   * Log error
   * EC-LAND-631, EC-LAND-632
   */
  static log(error: Error, context?: any): void {
    const errorEntry = {
      error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    this.errorLog.push(errorEntry);

    // EC-LAND-634: Limit log size
    if (this.errorLog.length > this.MAX_LOG_SIZE) {
      this.errorLog.shift();
    }

    // EC-LAND-632: Structured logging
    console.error('Error Logged:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: errorEntry.timestamp,
    });

    // EC-LAND-636: Send to monitoring service
    this.sendToMonitoring(error, context);
  }

  /**
   * Get error log
   * EC-LAND-633
   */
  static getLog(): typeof this.errorLog {
    return [...this.errorLog];
  }

  /**
   * Search error log
   * EC-LAND-633
   */
  static searchLog(query: string): typeof this.errorLog {
    return this.errorLog.filter(entry =>
      entry.error.message.toLowerCase().includes(query.toLowerCase()) ||
      entry.error.stack?.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Clear error log
   * EC-LAND-634
   */
  static clearLog(): void {
    this.errorLog = [];
  }

  /**
   * Send error to monitoring service
   * EC-LAND-636
   */
  private static sendToMonitoring(error: Error, context?: any): void {
    // In production, send to error monitoring service
    if (typeof window !== 'undefined' && (window as any).errorReporting) {
      (window as any).errorReporting.captureException(error, {
        extra: context,
      });
    }
  }

  /**
   * Get error frequency
   * EC-LAND-639
   */
  static getErrorFrequency(errorMessage: string, timeWindow: number = 60000): number {
    const now = Date.now();
    return this.errorLog.filter(entry => {
      const timeDiff = now - new Date(entry.timestamp).getTime();
      return (
        entry.error.message === errorMessage &&
        timeDiff < timeWindow
      );
    }).length;
  }

  /**
   * Analyze error trends
   * EC-LAND-640
   */
  static analyzeTrends(): {
    mostCommon: string;
    frequency: number;
    recentErrors: number;
  } {
    const errorCounts = new Map<string, number>();
    const oneHourAgo = Date.now() - 3600000;

    this.errorLog.forEach(entry => {
      const count = errorCounts.get(entry.error.message) || 0;
      errorCounts.set(entry.error.message, count + 1);
    });

    let mostCommon = '';
    let maxCount = 0;
    errorCounts.forEach((count, message) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = message;
      }
    });

    const recentErrors = this.errorLog.filter(entry => {
      const timestamp = new Date(entry.timestamp).getTime();
      return timestamp > oneHourAgo;
    }).length;

    return {
      mostCommon,
      frequency: maxCount,
      recentErrors,
    };
  }
}

/**
 * Validation Error Handler
 * EC-LAND-641 to EC-LAND-650: Validation errors
 */
export class ValidationErrorHandler {
  /**
   * Show validation error
   * EC-LAND-641
   */
  static showError(
    fieldId: string,
    message: string,
    field: HTMLElement
  ): void {
    // Remove existing error
    this.clearError(fieldId);

    // Create error element
    const errorElement = document.createElement('div');
    errorElement.id = `error-${fieldId}`;
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'assertive');

    // Insert after field
    field.parentElement?.insertBefore(errorElement, field.nextSibling);

    // Associate with field
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorElement.id);
  }

  /**
   * Clear validation error
   * EC-LAND-641
   */
  static clearError(fieldId: string): void {
    const errorElement = document.getElementById(`error-${fieldId}`);
    if (errorElement) {
      errorElement.remove();
    }

    const field = document.getElementById(fieldId);
    if (field) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  }

  /**
   * Real-time validation
   * EC-LAND-643
   */
  static setupRealTimeValidation(
    field: HTMLElement,
    validator: (value: string) => string | null
  ): () => void {
    const handleInput = () => {
      const value = (field as HTMLInputElement).value;
      const error = validator(value);

      if (error) {
        this.showError(field.id, error, field);
      } else {
        this.clearError(field.id);
      }
    };

    field.addEventListener('input', handleInput);
    field.addEventListener('blur', handleInput);

    return () => {
      field.removeEventListener('input', handleInput);
      field.removeEventListener('blur', handleInput);
    };
  }

  /**
   * Prioritize validation errors
   * EC-LAND-650
   */
  static prioritizeErrors(errors: Array<{ field: string; message: string; priority: number }>): Array<{ field: string; message: string }> {
    return errors
      .sort((a, b) => b.priority - a.priority)
      .map(({ field, message }) => ({ field, message }));
  }
}

/**
 * API Error Handler
 * EC-LAND-651 to EC-LAND-660: API error handling
 */
export class APIErrorHandler {
  /**
   * Handle API error
   * EC-LAND-651
   */
  static handle(error: any): {
    type: 'network' | 'timeout' | 'server' | 'client' | 'unknown';
    message: string;
    status?: number;
    retryable: boolean;
  } {
    // EC-LAND-652: Parse error response
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      return {
        type: this.getErrorType(status),
        message: data?.message || this.getStatusMessage(status),
        status,
        retryable: this.isRetryable(status),
      };
    }

    // EC-LAND-655: Handle timeout
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'Request timed out. Please try again.',
        retryable: true,
      };
    }

    // EC-LAND-656: Handle network errors
    if (!error.response && error.request) {
      return {
        type: 'network',
        message: 'Network error. Please check your connection.',
        retryable: true,
      };
    }

    return {
      type: 'unknown',
      message: error.message || 'An error occurred',
      retryable: false,
    };
  }

  private static getErrorType(status: number): 'network' | 'timeout' | 'server' | 'client' | 'unknown' {
    if (status >= 500) return 'server';
    if (status >= 400) return 'client';
    return 'unknown';
  }

  private static getStatusMessage(status: number): string {
    const messages: Record<number, string> = {
      400: 'Bad request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'Forbidden. You don\'t have permission.',
      404: 'Resource not found.',
      429: 'Too many requests. Please try again later.',
      500: 'Server error. Please try again later.',
      502: 'Bad gateway. Please try again later.',
      503: 'Service unavailable. Please try again later.',
      504: 'Gateway timeout. Please try again.',
    };

    return messages[status] || 'An error occurred';
  }

  private static isRetryable(status: number): boolean {
    // 5xx errors are usually retryable
    if (status >= 500) return true;
    // 429 (rate limit) is retryable
    if (status === 429) return true;
    // 4xx errors are usually not retryable
    return false;
  }
}

/**
 * Async Error Handler
 * EC-LAND-671 to EC-LAND-680: Async error handling
 */
export class AsyncErrorHandler {
  /**
   * Handle promise rejection
   * EC-LAND-671
   */
  static handlePromiseRejection(error: any): void {
    ErrorLogger.log(
      error instanceof Error ? error : new Error(String(error))
    );
  }

  /**
   * Wrap async function with error handling
   * EC-LAND-672
   */
  static wrapAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T
  ): T {
    return (async (...args: Parameters<T>) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handlePromiseRejection(error);
        throw error;
      }
    }) as T;
  }

  /**
   * Handle setTimeout errors
   * EC-LAND-673
   */
  static safeSetTimeout(
    callback: () => void,
    delay: number
  ): number {
    return window.setTimeout(() => {
      try {
        callback();
      } catch (error) {
        this.handlePromiseRejection(error);
      }
    }, delay);
  }

  /**
   * Handle setInterval errors
   * EC-LAND-674
   */
  static safeSetInterval(
    callback: () => void,
    delay: number
  ): number {
    return window.setInterval(() => {
      try {
        callback();
      } catch (error) {
        this.handlePromiseRejection(error);
      }
    }, delay);
  }
}

// Initialize global error handlers
if (typeof window !== 'undefined') {
  // EC-LAND-671: Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    AsyncErrorHandler.handlePromiseRejection(event.reason);
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    ErrorLogger.log(event.error || new Error(event.message));
  });
}

