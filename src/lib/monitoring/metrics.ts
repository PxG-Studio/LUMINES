/**
 * Metrics Collection System
 * Provides Prometheus-compatible metrics
 */

interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp?: number;
}

interface CounterMetric {
  name: string;
  value: number;
  labels?: Record<string, string>;
}

interface HistogramMetric {
  name: string;
  value: number;
  labels?: Record<string, string>;
}

class MetricsCollector {
  private counters: Map<string, CounterMetric> = new Map();
  private histograms: Map<string, HistogramMetric[]> = new Map();
  private gauges: Map<string, number> = new Map();

  /**
   * Increment a counter metric
   */
  incrementCounter(name: string, labels?: Record<string, string>, value: number = 1): void {
    const key = this.getMetricKey(name, labels);
    const existing = this.counters.get(key);
    
    if (existing) {
      existing.value += value;
    } else {
      this.counters.set(key, { name, value, labels });
    }
  }

  /**
   * Record a histogram value
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getMetricKey(name, labels);
    const existing = this.histograms.get(key) || [];
    existing.push({ name, value, labels });
    
    // Keep only last 1000 values per histogram
    if (existing.length > 1000) {
      existing.shift();
    }
    
    this.histograms.set(key, existing);
  }

  /**
   * Set a gauge value
   */
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getMetricKey(name, labels);
    this.gauges.set(key, value);
  }

  /**
   * Get counter value
   */
  getCounter(name: string, labels?: Record<string, string>): number {
    const key = this.getMetricKey(name, labels);
    return this.counters.get(key)?.value || 0;
  }

  /**
   * Get histogram statistics
   */
  getHistogramStats(name: string, labels?: Record<string, string>): {
    count: number;
    sum: number;
    min: number;
    max: number;
    avg: number;
  } | null {
    const key = this.getMetricKey(name, labels);
    const values = this.histograms.get(key) || [];
    
    if (values.length === 0) {
      return null;
    }

    const nums = values.map(v => v.value);
    const sum = nums.reduce((a, b) => a + b, 0);
    
    return {
      count: values.length,
      sum,
      min: Math.min(...nums),
      max: Math.max(...nums),
      avg: sum / values.length,
    };
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus(): string {
    const lines: string[] = [];

    // Export counters
    for (const [key, counter] of this.counters.entries()) {
      const labelsStr = this.formatLabels(counter.labels);
      lines.push(`# TYPE ${counter.name} counter`);
      lines.push(`${counter.name}${labelsStr} ${counter.value}`);
    }

    // Export histograms
    for (const [key, histogram] of this.histograms.entries()) {
      if (histogram.length === 0) continue;

      const labelsStr = this.formatLabels(histogram[0].labels);
      const stats = this.getHistogramStats(histogram[0].name, histogram[0].labels);
      
      if (stats) {
        lines.push(`# TYPE ${histogram[0].name} histogram`);
        lines.push(`${histogram[0].name}_count${labelsStr} ${stats.count}`);
        lines.push(`${histogram[0].name}_sum${labelsStr} ${stats.sum}`);
        lines.push(`${histogram[0].name}_min${labelsStr} ${stats.min}`);
        lines.push(`${histogram[0].name}_max${labelsStr} ${stats.max}`);
        lines.push(`${histogram[0].name}_avg${labelsStr} ${stats.avg}`);
      }
    }

    // Export gauges
    for (const [key, value] of this.gauges.entries()) {
      const name = key.split('{')[0];
      const labelsStr = key.includes('{') ? `{${key.split('{')[1]}` : '';
      lines.push(`# TYPE ${name} gauge`);
      lines.push(`${name}${labelsStr} ${value}`);
    }

    return lines.join('\n') + '\n';
  }

  /**
   * Reset all metrics (for testing)
   */
  reset(): void {
    this.counters.clear();
    this.histograms.clear();
    this.gauges.clear();
  }

  private getMetricKey(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    return `${name}{${labelStr}}`;
  }

  private formatLabels(labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return '';
    }
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}="${v}"`)
      .join(',');
    return `{${labelStr}}`;
  }
}

export const metrics = new MetricsCollector();

// Convenience functions
export function incrementApiRequest(method: string, path: string, statusCode: number): void {
  metrics.incrementCounter('http_requests_total', {
    method,
    path,
    status: statusCode.toString(),
  });
}

export function recordApiDuration(method: string, path: string, duration: number): void {
  metrics.recordHistogram('http_request_duration_ms', duration, {
    method,
    path,
  });
}

export function incrementDatabaseQuery(queryType: string, success: boolean): void {
  metrics.incrementCounter('database_queries_total', {
    type: queryType,
    status: success ? 'success' : 'error',
  });
}

export function recordDatabaseDuration(queryType: string, duration: number): void {
  metrics.recordHistogram('database_query_duration_ms', duration, {
    type: queryType,
  });
}

export function incrementCacheOperation(operation: 'hit' | 'miss'): void {
  metrics.incrementCounter('cache_operations_total', {
    operation,
  });
}

export function setActiveConnections(service: string, count: number): void {
  metrics.setGauge('active_connections', count, { service });
}

