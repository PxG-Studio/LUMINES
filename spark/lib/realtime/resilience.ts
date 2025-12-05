/**
 * SPARK Real-Time Resilience Layer (Production)
 *
 * Implements retry logic, exponential backoff, circuit breakers, and health checks
 * Prevents cascading failures and ensures graceful degradation
 */

export interface RetryConfig {
  maxAttempts: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitter: boolean;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeoutMs: number;
}

export type CircuitState = "closed" | "open" | "half-open";

export class CircuitBreaker {
  private state: CircuitState = "closed";
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime: number = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      // Check if we should transition to half-open
      if (Date.now() - this.lastFailureTime > this.config.resetTimeoutMs) {
        this.state = "half-open";
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        this.timeout(this.config.timeout),
      ]);

      // Success
      this.onSuccess();
      return result as T;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;

    if (this.state === "half-open") {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = "closed";
        this.successCount = 0;
      }
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.config.failureThreshold) {
      this.state = "open";
    }
  }

  private async timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Circuit breaker timeout")), ms)
    );
  }

  getState(): CircuitState {
    return this.state;
  }

  reset(): void {
    this.state = "closed";
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }
}

export class RetryStrategy {
  private config: RetryConfig;

  constructor(config: RetryConfig) {
    this.config = config;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on last attempt
        if (attempt === this.config.maxAttempts - 1) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }

    throw lastError || new Error("All retry attempts failed");
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay = Math.min(
      this.config.initialDelayMs * Math.pow(this.config.backoffMultiplier, attempt),
      this.config.maxDelayMs
    );

    if (this.config.jitter) {
      // Add random jitter (0-100% of delay)
      return exponentialDelay * (0.5 + Math.random() * 0.5);
    }

    return exponentialDelay;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export class HealthCheck {
  private healthy: boolean = true;
  private lastCheckTime: number = 0;
  private failureCount: number = 0;
  private readonly maxFailures: number = 3;
  private readonly checkIntervalMs: number = 30000; // 30 seconds

  async check(healthFn: () => Promise<boolean>): Promise<boolean> {
    const now = Date.now();

    // Only check if enough time has passed
    if (now - this.lastCheckTime < this.checkIntervalMs) {
      return this.healthy;
    }

    this.lastCheckTime = now;

    try {
      const result = await healthFn();

      if (result) {
        this.failureCount = 0;
        this.healthy = true;
      } else {
        this.failureCount++;
        if (this.failureCount >= this.maxFailures) {
          this.healthy = false;
        }
      }
    } catch (error) {
      this.failureCount++;
      if (this.failureCount >= this.maxFailures) {
        this.healthy = false;
      }
    }

    return this.healthy;
  }

  isHealthy(): boolean {
    return this.healthy;
  }

  reset(): void {
    this.healthy = true;
    this.failureCount = 0;
    this.lastCheckTime = 0;
  }
}

// Default configurations
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
  jitter: true,
};

export const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000, // 30 seconds
  resetTimeoutMs: 60000, // 1 minute
};
