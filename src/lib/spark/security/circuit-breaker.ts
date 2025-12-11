/**
 * Circuit Breaker Pattern for AI API Calls
 * 
 * Prevents cascading failures by stopping requests to failing services
 */

export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failures: number;
  successes: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

export interface CircuitBreakerConfig {
  failureThreshold: number; // Number of failures before opening
  successThreshold: number; // Number of successes to close from half-open
  timeout: number; // Time in ms before attempting half-open
  resetTimeout: number; // Time in ms before resetting failure count
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 60000, // 1 minute
  resetTimeout: 300000, // 5 minutes
};

class CircuitBreaker {
  private state: CircuitBreakerState['state'] = 'closed';
  private failures: number = 0;
  private successes: number = 0;
  private lastFailureTime: number = 0;
  private nextAttemptTime: number = 0;
  private config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get current state
   */
  getState(): CircuitBreakerState {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      nextAttemptTime: this.nextAttemptTime,
    };
  }

  /**
   * Check if request is allowed
   */
  isOpen(): boolean {
    const now = Date.now();

    // If closed, allow requests
    if (this.state === 'closed') {
      return false;
    }

    // If open, check if timeout has passed
    if (this.state === 'open') {
      if (now >= this.nextAttemptTime) {
        // Move to half-open
        this.state = 'half-open';
        this.successes = 0;
        return false; // Allow one request to test
      }
      return true; // Still open, block requests
    }

    // Half-open: allow requests but monitor closely
    return false;
  }

  /**
   * Record a successful request
   */
  recordSuccess(): void {
    if (this.state === 'half-open') {
      this.successes++;
      if (this.successes >= this.config.successThreshold) {
        // Close the circuit
        this.state = 'closed';
        this.failures = 0;
        this.successes = 0;
      }
    } else if (this.state === 'closed') {
      // Reset failure count on success
      const now = Date.now();
      if (now - this.lastFailureTime > this.config.resetTimeout) {
        this.failures = 0;
      }
    }
  }

  /**
   * Record a failed request
   */
  recordFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === 'half-open') {
      // Failed during half-open, open again
      this.state = 'open';
      this.nextAttemptTime = Date.now() + this.config.timeout;
      this.successes = 0;
    } else if (this.state === 'closed' && this.failures >= this.config.failureThreshold) {
      // Too many failures, open the circuit
      this.state = 'open';
      this.nextAttemptTime = Date.now() + this.config.timeout;
    }
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.successes = 0;
    this.lastFailureTime = 0;
    this.nextAttemptTime = 0;
  }
}

// Per-provider circuit breakers
const circuitBreakers = new Map<string, CircuitBreaker>();

/**
 * Get or create circuit breaker for a provider
 */
export function getCircuitBreaker(provider: string, config?: Partial<CircuitBreakerConfig>): CircuitBreaker {
  if (!circuitBreakers.has(provider)) {
    circuitBreakers.set(provider, new CircuitBreaker(config));
  }
  return circuitBreakers.get(provider)!;
}

/**
 * Execute function with circuit breaker protection
 */
export async function withCircuitBreaker<T>(
  provider: string,
  fn: () => Promise<T>,
  config?: Partial<CircuitBreakerConfig>
): Promise<T> {
  const breaker = getCircuitBreaker(provider, config);

  if (breaker.isOpen()) {
    throw new Error(`Circuit breaker is open for ${provider}. Service is unavailable.`);
  }

  try {
    const result = await fn();
    breaker.recordSuccess();
    return result;
  } catch (error) {
    breaker.recordFailure();
    throw error;
  }
}

