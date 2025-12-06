/**
 * Metrics Helpers (Timers, Counters, Histograms)
 *
 * Lightweight in-memory metrics for observability
 */

interface Timer {
  start(): void;
  stop(): void;
  observe(ms: number): void;
}

interface Counter {
  inc(value?: number): void;
}

interface Histogram {
  observe(value: number): void;
}

class SimpleTimer implements Timer {
  private startTime = 0;
  private samples: number[] = [];

  start() {
    this.startTime = Date.now();
  }

  stop() {
    if (this.startTime > 0) {
      this.observe(Date.now() - this.startTime);
      this.startTime = 0;
    }
  }

  observe(ms: number) {
    this.samples.push(ms);
    if (this.samples.length > 1000) this.samples.shift();
  }

  getStats() {
    const sorted = [...this.samples].sort((a, b) => a - b);
    const len = sorted.length;
    if (len === 0) return { p50: 0, p95: 0, p99: 0, count: 0 };
    return {
      p50: sorted[Math.floor(len * 0.5)],
      p95: sorted[Math.floor(len * 0.95)],
      p99: sorted[Math.floor(len * 0.99)],
      count: len,
    };
  }
}

class SimpleCounter implements Counter {
  private value = 0;
  inc(v = 1) {
    this.value += v;
  }
  get() {
    return this.value;
  }
}

class SimpleHistogram implements Histogram {
  private buckets: Map<number, number> = new Map();
  observe(value: number) {
    const bucket = Math.floor(value / 10) * 10;
    this.buckets.set(bucket, (this.buckets.get(bucket) || 0) + 1);
  }
  getBuckets() {
    return Array.from(this.buckets.entries()).sort((a, b) => a[0] - b[0]);
  }
}

const timers = new Map<string, SimpleTimer>();
const counters = new Map<string, SimpleCounter>();
const histograms = new Map<string, SimpleHistogram>();

export function getTimer(name: string): Timer {
  if (!timers.has(name)) timers.set(name, new SimpleTimer());
  return timers.get(name)!;
}

export function getCounter(name: string): Counter {
  if (!counters.has(name)) counters.set(name, new SimpleCounter());
  return counters.get(name)!;
}

export function getHistogram(name: string): Histogram {
  if (!histograms.has(name)) histograms.set(name, new SimpleHistogram());
  return histograms.get(name)!;
}

export function getAllMetrics() {
  return {
    timers: Object.fromEntries(Array.from(timers.entries()).map(([k, v]) => [k, v.getStats()])),
    counters: Object.fromEntries(Array.from(counters.entries()).map(([k, v]) => [k, v.get()])),
    histograms: Object.fromEntries(Array.from(histograms.entries()).map(([k, v]) => [k, v.getBuckets()])),
  };
}
