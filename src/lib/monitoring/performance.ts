/**
 * Performance Monitoring System
 * Tracks performance metrics and provides performance insights
 */

import { logger } from './logger';
import { metrics } from './metrics';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  labels?: Record<string, string>;
}

export interface PerformanceThreshold {
  name: string;
  warning: number;
  critical: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
}

class PerformanceMonitor {
  private thresholds: Map<string, PerformanceThreshold> = new Map();
  private metrics: PerformanceMetric[] = [];
  private readonly maxMetrics = 1000;

  constructor() {
    // Set default thresholds
    this.setDefaultThresholds();
  }

  /**
   * Set default performance thresholds
   */
  private setDefaultThresholds(): void {
    // API response time thresholds
    this.setThreshold({
      name: 'api_response_time',
      warning: 500,
      critical: 1000,
      unit: 'ms',
    });

    // Database query time thresholds
    this.setThreshold({
      name: 'database_query_time',
      warning: 100,
      critical: 500,
      unit: 'ms',
    });

    // Cache operation time thresholds
    this.setThreshold({
      name: 'cache_operation_time',
      warning: 10,
      critical: 50,
      unit: 'ms',
    });

    // Memory usage thresholds
    this.setThreshold({
      name: 'memory_usage',
      warning: 80,
      critical: 90,
      unit: 'percentage',
    });
  }

  /**
   * Set performance threshold
   */
  setThreshold(threshold: PerformanceThreshold): void {
    this.thresholds.set(threshold.name, threshold);
  }

  /**
   * Record a performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    // Add to metrics array
    this.metrics.push(metric);

    // Trim if too large
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Record in metrics system
    metrics.recordHistogram(metric.name, metric.value, metric.labels || {});

    // Check threshold
    const threshold = this.thresholds.get(metric.name);
    if (threshold && threshold.unit === metric.unit) {
      const level = this.checkThreshold(metric.value, threshold);
      if (level === 'critical') {
        logger.error('Performance threshold exceeded (critical)', undefined, {
          metric: metric.name,
          value: metric.value,
          threshold: threshold.critical,
          unit: metric.unit,
        });
      } else if (level === 'warning') {
        logger.warn('Performance threshold exceeded (warning)', {
          metric: metric.name,
          value: metric.value,
          threshold: threshold.warning,
          unit: metric.unit,
        });
      }
    }
  }

  /**
   * Check if value exceeds threshold
   */
  private checkThreshold(
    value: number,
    threshold: PerformanceThreshold
  ): 'ok' | 'warning' | 'critical' {
    if (value >= threshold.critical) {
      return 'critical';
    }
    if (value >= threshold.warning) {
      return 'warning';
    }
    return 'ok';
  }

  /**
   * Measure execution time of a function
   */
  async measureExecution<T>(
    name: string,
    fn: () => Promise<T>,
    labels?: Record<string, string>
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;

      this.recordMetric({
        name,
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        labels,
      });

      return result;
    } catch (error) {
      const duration = performance.now() - start;

      this.recordMetric({
        name: `${name}_error`,
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        labels: { ...labels, error: 'true' },
      });

      throw error;
    }
  }

  /**
   * Get performance statistics
   */
  getStats(name: string, labels?: Record<string, string>): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    let filtered = this.metrics.filter(m => m.name === name);

    // Filter by labels if provided
    if (labels) {
      filtered = filtered.filter(m => {
        if (!m.labels) return false;
        return Object.entries(labels).every(
          ([key, value]) => m.labels?.[key] === value
        );
      });
    }

    if (filtered.length === 0) {
      return null;
    }

    const values = filtered.map(m => m.value).sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;

    return {
      count: values.length,
      avg,
      min: values[0],
      max: values[values.length - 1],
      p50: values[Math.floor(values.length * 0.5)],
      p95: values[Math.floor(values.length * 0.95)],
      p99: values[Math.floor(values.length * 0.99)],
    };
  }

  /**
   * Get memory usage
   */
  getMemoryUsage(): {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  } {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage();
    }
    return { heapUsed: 0, heapTotal: 0, external: 0, rss: 0 };
  }

  /**
   * Record memory usage
   */
  recordMemoryUsage(): void {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      const totalMemory = usage.heapTotal || 1;
      const usedPercentage = (usage.heapUsed / totalMemory) * 100;

      this.recordMetric({
        name: 'memory_usage',
        value: usedPercentage,
        unit: 'percentage',
        timestamp: Date.now(),
      });

      this.recordMetric({
        name: 'memory_heap_used',
        value: usage.heapUsed,
        unit: 'bytes',
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export function measureExecution<T>(
  name: string,
  fn: () => Promise<T>,
  labels?: Record<string, string>
): Promise<T> {
  return performanceMonitor.measureExecution(name, fn, labels);
}

/**
 * Start memory monitoring (runs periodically)
 */
export function startMemoryMonitoring(intervalMs: number = 60000): () => void {
  const interval = setInterval(() => {
    performanceMonitor.recordMemoryUsage();
  }, intervalMs);

  // Return stop function
  return () => clearInterval(interval);
}

