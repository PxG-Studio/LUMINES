import { query } from '../database/client';

export async function logError(params: {
  error: Error;
  errorInfo?: React.ErrorInfo;
  context?: Record<string, any>;
  level?: 'page' | 'component' | 'api';
}): Promise<void> {
  try {
    await query(
      `INSERT INTO slate_error_logs
       (error_type, error_message, error_stack, context, severity)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        params.error.name,
        params.error.message,
        params.error.stack || null,
        JSON.stringify({
          ...params.context,
          componentStack: params.errorInfo?.componentStack,
          level: params.level,
        }),
        'error',
      ]
    );
  } catch (logError) {
    console.error('Failed to log error to database:', logError);
  }
}
