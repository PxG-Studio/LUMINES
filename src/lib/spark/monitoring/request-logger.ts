/**
 * Request Logger for SPARK
 * Simple request logging for production monitoring
 */

interface LogEntry {
  timestamp: string;
  method: string;
  path: string;
  statusCode?: number;
  duration?: number;
  error?: string;
  userAgent?: string;
  ip?: string;
}

export function logRequest(entry: LogEntry): void {
  if (process.env.NODE_ENV === 'production') {
    // In production, log to console (can be picked up by log aggregation)
    console.log(JSON.stringify({
      type: 'request',
      ...entry,
    }));
  } else {
    // In development, log with formatting
    console.log(`[${entry.timestamp}] ${entry.method} ${entry.path} ${entry.statusCode || ''} ${entry.duration ? `${entry.duration}ms` : ''}`);
    if (entry.error) {
      console.error(`  Error: ${entry.error}`);
    }
  }
}

export function logError(error: Error, context?: Record<string, unknown>): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    type: 'error',
    message: error.message,
    stack: error.stack,
    ...context,
  };

  if (process.env.NODE_ENV === 'production') {
    console.error(JSON.stringify(logEntry));
  } else {
    console.error('Error:', logEntry);
  }
}

