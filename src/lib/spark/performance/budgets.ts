/**
 * Performance Budgets and Monitoring
 * 
 * Defines and monitors performance budgets for bundle sizes,
 * generation times, and API response times
 */

export interface PerformanceBudget {
  name: string;
  metric: 'bundle_size' | 'generation_time' | 'api_response_time' | 'page_load_time';
  limit: number;
  unit: 'bytes' | 'kb' | 'mb' | 'ms' | 's';
  severity: 'warning' | 'error';
}

export interface BudgetViolation {
  budget: PerformanceBudget;
  actual: number;
  exceeded: number;
  timestamp: number;
}

class PerformanceBudgetMonitor {
  private budgets: PerformanceBudget[] = [];
  private violations: BudgetViolation[] = [];
  private metrics: Map<string, number[]> = new Map();

  constructor() {
    this.initializeDefaultBudgets();
  }

  /**
   * Initialize default performance budgets
   */
  private initializeDefaultBudgets(): void {
    this.budgets = [
      {
        name: 'Main Bundle Size',
        metric: 'bundle_size',
        limit: 500 * 1024, // 500 KB
        unit: 'bytes',
        severity: 'warning',
      },
      {
        name: 'Total Bundle Size',
        metric: 'bundle_size',
        limit: 2 * 1024 * 1024, // 2 MB
        unit: 'bytes',
        severity: 'error',
      },
      {
        name: 'Generation Time (p95)',
        metric: 'generation_time',
        limit: 5000, // 5 seconds
        unit: 'ms',
        severity: 'warning',
      },
      {
        name: 'Generation Time (p99)',
        metric: 'generation_time',
        limit: 10000, // 10 seconds
        unit: 'ms',
        severity: 'error',
      },
      {
        name: 'API Response Time',
        metric: 'api_response_time',
        limit: 2000, // 2 seconds
        unit: 'ms',
        severity: 'warning',
      },
      {
        name: 'Page Load Time',
        metric: 'page_load_time',
        limit: 3000, // 3 seconds
        unit: 'ms',
        severity: 'warning',
      },
    ];
  }

  /**
   * Record a metric value
   */
  recordMetric(metric: PerformanceBudget['metric'], value: number): void {
    const key = metric;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    this.metrics.get(key)!.push(value);

    // Check against budgets
    this.checkBudgets(metric, value);
  }

  /**
   * Check metrics against budgets
   */
  private checkBudgets(metric: PerformanceBudget['metric'], value: number): void {
    const relevantBudgets = this.budgets.filter((b) => b.metric === metric);

    for (const budget of relevantBudgets) {
      const limit = this.convertToBaseUnit(budget.limit, budget.unit);
      const actualValue = this.convertToBaseUnit(value, budget.unit);

      if (actualValue > limit) {
        const violation: BudgetViolation = {
          budget,
          actual: value,
          exceeded: actualValue - limit,
          timestamp: Date.now(),
        };

        this.violations.push(violation);

        // Keep only last 100 violations
        if (this.violations.length > 100) {
          this.violations.shift();
        }

        // Log violation
        if (budget.severity === 'error') {
          console.error('Performance budget exceeded:', violation);
        } else {
          console.warn('Performance budget warning:', violation);
        }
      }
    }
  }

  /**
   * Convert value to base unit
   */
  private convertToBaseUnit(value: number, unit: PerformanceBudget['unit']): number {
    switch (unit) {
      case 'kb':
        return value * 1024;
      case 'mb':
        return value * 1024 * 1024;
      case 's':
        return value * 1000;
      default:
        return value;
    }
  }

  /**
   * Get current metric statistics
   */
  getMetricStats(metric: PerformanceBudget['metric']): {
    count: number;
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    const values = this.metrics.get(metric);
    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);

    return {
      count: sorted.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / sorted.length,
      p50: this.percentile(sorted, 50),
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99),
    };
  }

  /**
   * Calculate percentile
   */
  private percentile(sorted: number[], p: number): number {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Get all budgets
   */
  getBudgets(): PerformanceBudget[] {
    return [...this.budgets];
  }

  /**
   * Get recent violations
   */
  getViolations(limit: number = 10): BudgetViolation[] {
    return this.violations.slice(-limit).reverse();
  }

  /**
   * Add custom budget
   */
  addBudget(budget: PerformanceBudget): void {
    this.budgets.push(budget);
  }

  /**
   * Check if any budgets are currently violated
   */
  hasViolations(): boolean {
    return this.violations.length > 0;
  }

  /**
   * Get summary report
   */
  getSummary(): {
    budgets: PerformanceBudget[];
    violations: BudgetViolation[];
    metrics: Record<string, ReturnType<PerformanceBudgetMonitor['getMetricStats']>>;
  } {
    const metrics: Record<string, ReturnType<PerformanceBudgetMonitor['getMetricStats']>> = {};
    for (const metric of ['bundle_size', 'generation_time', 'api_response_time', 'page_load_time'] as const) {
      const stats = this.getMetricStats(metric);
      if (stats) {
        metrics[metric] = stats;
      }
    }

    return {
      budgets: this.getBudgets(),
      violations: this.getViolations(50),
      metrics,
    };
  }
}

// Singleton instance
let monitorInstance: PerformanceBudgetMonitor | null = null;

/**
 * Get the global performance budget monitor
 */
export function getPerformanceMonitor(): PerformanceBudgetMonitor {
  if (!monitorInstance) {
    monitorInstance = new PerformanceBudgetMonitor();
  }
  return monitorInstance;
}

/**
 * Record bundle size
 */
export function recordBundleSize(size: number): void {
  getPerformanceMonitor().recordMetric('bundle_size', size);
}

/**
 * Record generation time
 */
export function recordGenerationTime(timeMs: number): void {
  getPerformanceMonitor().recordMetric('generation_time', timeMs);
}

/**
 * Record API response time
 */
export function recordAPIResponseTime(timeMs: number): void {
  getPerformanceMonitor().recordMetric('api_response_time', timeMs);
}

/**
 * Record page load time
 */
export function recordPageLoadTime(timeMs: number): void {
  getPerformanceMonitor().recordMetric('page_load_time', timeMs);
}

