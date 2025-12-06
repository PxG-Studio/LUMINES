/**
 * AI Client Connection Pool Manager
 * 
 * Manages connection pooling, health monitoring, and connection reuse
 * for AI API clients (Claude and OpenAI)
 */

interface ConnectionHealth {
  provider: 'claude' | 'openai';
  healthy: boolean;
  lastCheck: number;
  consecutiveFailures: number;
  averageResponseTime: number;
}

interface ConnectionStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  lastUsed: number;
}

class AIConnectionPool {
  private health: Map<'claude' | 'openai', ConnectionHealth> = new Map();
  private stats: Map<'claude' | 'openai', ConnectionStats> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeHealth();
    this.startHealthChecks();
  }

  private initializeHealth(): void {
    this.health.set('claude', {
      provider: 'claude',
      healthy: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
      averageResponseTime: 0,
    });

    this.health.set('openai', {
      provider: 'openai',
      healthy: true,
      lastCheck: Date.now(),
      consecutiveFailures: 0,
      averageResponseTime: 0,
    });

    this.stats.set('claude', {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastUsed: 0,
    });

    this.stats.set('openai', {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      lastUsed: 0,
    });
  }

  /**
   * Record a successful request
   */
  recordSuccess(provider: 'claude' | 'openai', responseTime: number): void {
    const health = this.health.get(provider);
    const stats = this.stats.get(provider);

    if (health && stats) {
      health.healthy = true;
      health.consecutiveFailures = 0;
      health.lastCheck = Date.now();
      health.averageResponseTime = this.calculateMovingAverage(
        health.averageResponseTime,
        responseTime,
        stats.totalRequests
      );

      stats.totalRequests++;
      stats.successfulRequests++;
      stats.averageResponseTime = health.averageResponseTime;
      stats.lastUsed = Date.now();
    }
  }

  /**
   * Record a failed request
   */
  recordFailure(provider: 'claude' | 'openai', error?: Error): void {
    const health = this.health.get(provider);
    const stats = this.stats.get(provider);

    if (health && stats) {
      health.consecutiveFailures++;
      health.lastCheck = Date.now();

      // Mark as unhealthy after 3 consecutive failures
      if (health.consecutiveFailures >= 3) {
        health.healthy = false;
      }

      stats.totalRequests++;
      stats.failedRequests++;
      stats.lastUsed = Date.now();
    }
  }

  /**
   * Check if a provider is healthy
   */
  isHealthy(provider: 'claude' | 'openai'): boolean {
    const health = this.health.get(provider);
    return health?.healthy ?? false;
  }

  /**
   * Get connection health status
   */
  getHealth(provider: 'claude' | 'openai'): ConnectionHealth | null {
    return this.health.get(provider) || null;
  }

  /**
   * Get connection statistics
   */
  getStats(provider: 'claude' | 'openai'): ConnectionStats | null {
    return this.stats.get(provider) || null;
  }

  /**
   * Get all health statuses
   */
  getAllHealth(): Map<'claude' | 'openai', ConnectionHealth> {
    return new Map(this.health);
  }

  /**
   * Reset health status (for recovery)
   */
  resetHealth(provider: 'claude' | 'openai'): void {
    const health = this.health.get(provider);
    if (health) {
      health.healthy = true;
      health.consecutiveFailures = 0;
      health.lastCheck = Date.now();
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    // Check health every 5 minutes
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, 5 * 60 * 1000);
  }

  /**
   * Perform health checks on all providers
   */
  private async performHealthChecks(): Promise<void> {
    // Health checks would ping the API endpoints
    // For now, we rely on actual request results
    // In production, this could make lightweight API calls
  }

  /**
   * Calculate moving average
   */
  private calculateMovingAverage(
    currentAverage: number,
    newValue: number,
    sampleCount: number
  ): number {
    if (sampleCount === 0) return newValue;
    return (currentAverage * (sampleCount - 1) + newValue) / sampleCount;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }
}

// Singleton instance
let poolInstance: AIConnectionPool | null = null;

/**
 * Get the global connection pool instance
 */
export function getConnectionPool(): AIConnectionPool {
  if (!poolInstance) {
    poolInstance = new AIConnectionPool();
  }
  return poolInstance;
}

/**
 * Wrap an AI client function with connection pooling and health monitoring
 */
export function withConnectionPool<T>(
  provider: 'claude' | 'openai',
  fn: () => Promise<T>
): Promise<T> {
  const pool = getConnectionPool();
  const startTime = Date.now();

  return fn()
    .then((result) => {
      const responseTime = Date.now() - startTime;
      pool.recordSuccess(provider, responseTime);
      return result;
    })
    .catch((error) => {
      pool.recordFailure(provider, error instanceof Error ? error : undefined);
      throw error;
    });
}

