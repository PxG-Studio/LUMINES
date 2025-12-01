/**
 * Logger Utility
 * EC-209, EC-210: Structured logging
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  private currentLevel: LogLevel = 'info';

  setLevel(level: LogLevel) {
    this.currentLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return this.levelPriority[level] >= this.levelPriority[this.currentLevel];
  }

  debug(message: string, data?: any) {
    if (this.shouldLog('debug')) {
      console.debug(`[debug] ${message}`, data ?? '');
    }
  }

  info(message: string, data?: any) {
    if (this.shouldLog('info')) {
      console.info(`[info] ${message}`, data ?? '');
    }
  }

  warn(message: string, data?: any) {
    if (this.shouldLog('warn')) {
      console.warn(`[warn] ${message}`, data ?? '');
    }
  }

  error(message: string, data?: any) {
    if (this.shouldLog('error')) {
      console.error(`[error] ${message}`, data ?? '');
    }
  }
}

export const logger = new Logger();
