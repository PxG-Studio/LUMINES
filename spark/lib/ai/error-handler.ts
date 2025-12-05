/**
 * AI Error Handling and Retry Logic
 */

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
}

export class AIError extends Error {
  constructor(
    message: string,
    public readonly provider: 'claude' | 'openai',
    public readonly code?: string,
    public readonly statusCode?: number,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'AIError';
  }
}

/**
 * Determine if an error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AIError) {
    return error.retryable;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Network errors
    if (message.includes('network') || message.includes('timeout') || message.includes('econnrefused')) {
      return true;
    }

    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      return true;
    }

    // Server errors
    if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
      return true;
    }

    // Temporary unavailability
    if (message.includes('overloaded') || message.includes('temporarily unavailable')) {
      return true;
    }
  }

  return false;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function calculateBackoffDelay(
  attemptNumber: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number
): number {
  const delay = initialDelayMs * Math.pow(backoffMultiplier, attemptNumber - 1);
  return Math.min(delay, maxDelayMs);
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
  } = options;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if error is not retryable
      if (!isRetryableError(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay and wait
      const delay = calculateBackoffDelay(attempt, initialDelayMs, maxDelayMs, backoffMultiplier);
      console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Log error using error logging system
 */
export async function logAIError(error: unknown, context?: Record<string, any>): Promise<void> {
  const { getErrorLogger } = await import('../monitoring/error-logging');
  const logger = getErrorLogger();
  
  const errorObj = error instanceof Error ? error : new Error(String(error));
  await logger.logError(errorObj, {
    ...context,
    source: 'ai-error-handler',
  });
}

/**
 * Parse Anthropic API errors
 */
export function parseAnthropicError(error: unknown): AIError {
  if (error instanceof Error) {
    const message = error.message;

    // API key errors
    if (message.includes('api_key') || message.includes('authentication')) {
      return new AIError(
        'Invalid or missing Anthropic API key. Please check your configuration.',
        'claude',
        'authentication_error',
        401,
        false
      );
    }

    // Rate limiting
    if (message.includes('rate_limit') || message.includes('429')) {
      return new AIError(
        'Anthropic API rate limit exceeded. Please try again in a moment.',
        'claude',
        'rate_limit_error',
        429,
        true
      );
    }

    // Overloaded
    if (message.includes('overloaded_error') || message.includes('529')) {
      return new AIError(
        'Anthropic API is temporarily overloaded. Please try again.',
        'claude',
        'overloaded_error',
        529,
        true
      );
    }

    // Server errors
    if (message.includes('500') || message.includes('502') || message.includes('503')) {
      return new AIError(
        'Anthropic API server error. Please try again.',
        'claude',
        'server_error',
        500,
        true
      );
    }

    // Generic error
    return new AIError(message, 'claude', 'unknown_error', undefined, false);
  }

  return new AIError('Unknown error occurred', 'claude', 'unknown_error', undefined, false);
}

/**
 * Parse OpenAI API errors
 */
export function parseOpenAIError(error: unknown): AIError {
  if (error instanceof Error) {
    const message = error.message;

    // API key errors
    if (message.includes('api_key') || message.includes('authentication') || message.includes('401')) {
      return new AIError(
        'Invalid or missing OpenAI API key. Please check your configuration.',
        'openai',
        'authentication_error',
        401,
        false
      );
    }

    // Rate limiting
    if (message.includes('rate_limit') || message.includes('429')) {
      return new AIError(
        'OpenAI API rate limit exceeded. Please try again in a moment.',
        'openai',
        'rate_limit_error',
        429,
        true
      );
    }

    // Quota exceeded
    if (message.includes('quota') || message.includes('insufficient_quota')) {
      return new AIError(
        'OpenAI API quota exceeded. Please check your billing.',
        'openai',
        'quota_exceeded',
        429,
        false
      );
    }

    // Server errors
    if (message.includes('500') || message.includes('502') || message.includes('503')) {
      return new AIError(
        'OpenAI API server error. Please try again.',
        'openai',
        'server_error',
        500,
        true
      );
    }

    // Model not available
    if (message.includes('model') && message.includes('does not exist')) {
      return new AIError(
        'The selected OpenAI model is not available for your account.',
        'openai',
        'model_not_found',
        404,
        false
      );
    }

    // Generic error
    return new AIError(message, 'openai', 'unknown_error', undefined, false);
  }

  return new AIError('Unknown error occurred', 'openai', 'unknown_error', undefined, false);
}
