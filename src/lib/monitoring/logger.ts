/**
 * Structured Logging System
 * Provides request/response logging and structured log output
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

interface RequestLog {
  method: string;
  url: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body?: any;
  timestamp: string;
  requestId: string;
}

interface ResponseLog {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  body?: any;
  duration: number;
  timestamp: string;
  requestId: string;
}

class Logger {
  private isDevelopment: boolean;
  private minLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = {
        ...context,
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack,
        } : String(error),
      };
      console.error(this.formatMessage('error', message, errorContext));
    }
  }

  /**
   * Log HTTP request
   */
  logRequest(request: RequestLog): void {
    this.info('HTTP Request', {
      requestId: request.requestId,
      method: request.method,
      path: request.path,
      query: request.query,
      ...(this.isDevelopment && { headers: request.headers }),
      ...(this.isDevelopment && request.body && { body: request.body }),
    });
  }

  /**
   * Log HTTP response
   */
  logResponse(response: ResponseLog): void {
    const level = response.statusCode >= 500 ? 'error' : response.statusCode >= 400 ? 'warn' : 'info';
    
    this[level]('HTTP Response', {
      requestId: response.requestId,
      statusCode: response.statusCode,
      statusText: response.statusText,
      duration: `${response.duration}ms`,
      ...(this.isDevelopment && { headers: response.headers }),
      ...(this.isDevelopment && response.body && { body: response.body }),
    });
  }

  /**
   * Log database query
   */
  logQuery(query: string, params?: any, duration?: number): void {
    this.debug('Database Query', {
      query,
      params,
      ...(duration && { duration: `${duration}ms` }),
    });
  }

  /**
   * Log cache operation
   */
  logCache(operation: 'get' | 'set' | 'delete', key: string, hit?: boolean): void {
    this.debug('Cache Operation', {
      operation,
      key,
      hit,
    });
  }

  /**
   * Log event publish
   */
  logEvent(event: string, data?: any): void {
    this.info('Event Published', {
      event,
      ...(data && { data }),
    });
  }
}

export const logger = new Logger();

