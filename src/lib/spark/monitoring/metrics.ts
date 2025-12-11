/**
 * Metrics Collection
 * 
 * Lightweight metrics collection in Prometheus format
 * Can be scraped by Prometheus or sent to monitoring services
 */

export interface Metric {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp?: number;
}

export interface CounterMetric extends Metric {
  type: 'counter';
}

export interface GaugeMetric extends Metric {
  type: 'gauge';
}

export interface HistogramMetric extends Metric {
  type: 'histogram';
  buckets?: number[];
}

type MetricType = CounterMetric | GaugeMetric | HistogramMetric;

class MetricsCollector {
  private counters: Map<string, number> = new Map();
  private gauges: Map<string, number> = new Map();
  private histograms: Map<string, number[]> = new Map();
  private metricLabels: Map<string, Record<string, string>> = new Map();

  /**
   * Increment a counter
   */
  increment(name: string, value: number = 1, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
    if (labels) {
      this.metricLabels.set(key, labels);
    }
  }

  /**
   * Set a gauge value
   */
  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    this.gauges.set(key, value);
    if (labels) {
      this.metricLabels.set(key, labels);
    }
  }

  /**
   * Record a histogram value
   */
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.getKey(name, labels);
    const values = this.histograms.get(key) || [];
    values.push(value);
    this.histograms.set(key, values);
    if (labels) {
      this.metricLabels.set(key, labels);
    }
  }

  /**
   * Get counter value
   */
  getCounter(name: string, labels?: Record<string, string>): number {
    const key = this.getKey(name, labels);
    return this.counters.get(key) || 0;
  }

  /**
   * Get gauge value
   */
  getGauge(name: string, labels?: Record<string, string>): number {
    const key = this.getKey(name, labels);
    return this.gauges.get(key) || 0;
  }

  /**
   * Get histogram values
   */
  getHistogram(name: string, labels?: Record<string, string>): number[] {
    const key = this.getKey(name, labels);
    return this.histograms.get(key) || [];
  }

  /**
   * Export metrics in Prometheus format
   */
  exportPrometheus(): string {
    const lines: string[] = [];

    // Export counters
    for (const [key, value] of this.counters.entries()) {
      const { name, labels } = this.parseKey(key);
      const labelStr = this.formatLabels(labels);
      lines.push(`${name}${labelStr} ${value}`);
    }

    // Export gauges
    for (const [key, value] of this.gauges.entries()) {
      const { name, labels } = this.parseKey(key);
      const labelStr = this.formatLabels(labels);
      lines.push(`${name}${labelStr} ${value}`);
    }

    // Export histograms
    for (const [key, values] of this.histograms.entries()) {
      const { name, labels } = this.parseKey(key);
      const labelStr = this.formatLabels(labels);
      const sum = values.reduce((a, b) => a + b, 0);
      const count = values.length;
      const avg = count > 0 ? sum / count : 0;

      lines.push(`${name}_sum${labelStr} ${sum}`);
      lines.push(`${name}_count${labelStr} ${count}`);
      lines.push(`${name}_avg${labelStr} ${avg}`);

      // Calculate percentiles
      const sorted = [...values].sort((a, b) => a - b);
      const p50 = this.percentile(sorted, 0.5);
      const p95 = this.percentile(sorted, 0.95);
      const p99 = this.percentile(sorted, 0.99);

      lines.push(`${name}_p50${labelStr} ${p50}`);
      lines.push(`${name}_p95${labelStr} ${p95}`);
      lines.push(`${name}_p99${labelStr} ${p99}`);
    }

    return lines.join('\n');
  }

  /**
   * Get all metrics as JSON
   */
  exportJSON(): {
    counters: Record<string, number>;
    gauges: Record<string, number>;
    histograms: Record<string, { values: number[]; sum: number; count: number; avg: number; p50: number; p95: number; p99: number }>;
  } {
    const counters: Record<string, number> = {};
    const gauges: Record<string, number> = {};
    const histograms: Record<string, any> = {};

    for (const [key, value] of this.counters.entries()) {
      counters[key] = value;
    }

    for (const [key, value] of this.gauges.entries()) {
      gauges[key] = value;
    }

    for (const [key, values] of this.histograms.entries()) {
      const sum = values.reduce((a, b) => a + b, 0);
      const count = values.length;
      const avg = count > 0 ? sum / count : 0;
      const sorted = [...values].sort((a, b) => a - b);
      const p50 = this.percentile(sorted, 0.5);
      const p95 = this.percentile(sorted, 0.95);
      const p99 = this.percentile(sorted, 0.99);

      histograms[key] = {
        values,
        sum,
        count,
        avg,
        p50,
        p95,
        p99,
      };
    }

    return { counters, gauges, histograms };
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
    this.metricLabels.clear();
  }

  /**
   * Get key for metric storage
   */
  private getKey(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }
    const labelStr = Object.entries(labels)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(',');
    return `${name}{${labelStr}}`;
  }

  /**
   * Parse key back to name and labels
   */
  private parseKey(key: string): { name: string; labels?: Record<string, string> } {
    const match = key.match(/^(.+?)\{(.+)\}$/);
    if (!match) {
      return { name: key };
    }

    const name = match[1];
    const labelStr = match[2];
    const labels: Record<string, string> = {};

    labelStr.split(',').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k && v) {
        labels[k] = v;
      }
    });

    return { name, labels };
  }

  /**
   * Format labels for Prometheus
   */
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

  /**
   * Calculate percentile
   */
  private percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[Math.max(0, index)] || 0;
  }
}

// Singleton instance
let collectorInstance: MetricsCollector | null = null;

/**
 * Get metrics collector instance
 */
export function getMetricsCollector(): MetricsCollector {
  if (!collectorInstance) {
    collectorInstance = new MetricsCollector();
  }
  return collectorInstance;
}

/**
 * Convenience functions
 */
export function incrementCounter(name: string, value: number = 1, labels?: Record<string, string>): void {
  getMetricsCollector().increment(name, value, labels);
}

export function setGauge(name: string, value: number, labels?: Record<string, string>): void {
  getMetricsCollector().setGauge(name, value, labels);
}

export function recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
  getMetricsCollector().recordHistogram(name, value, labels);
}

