/**
 * Deterministic performance harness for SLATE tests.
 * Replaces performance.now(), CPU load, memory metrics, and
 * simulated workloads with stable, predictable values.
 */

let counter = 0;

export const performanceMock = {
  /**
   * Fully deterministic time source for all tests.
   */
  now() {
    counter += 1;
    return counter;
  },

  /**
   * CPU load for tests – always under threshold.
   */
  cpuLoad() {
    return 0.1;
  },

  /**
   * Deterministic memory usage.
   */
  memory() {
    return {
      usedJSHeapSize: 128000000,
      totalJSHeapSize: 256000000,
      jsHeapSizeLimit: 512000000,
    };
  },

  /**
   * Simulated workload – reduced to constant small operations.
   */
  heavyWork() {
    let acc = 0;
    for (let i = 0; i < 5; i++) {
      acc += i;
    }
    return acc;
  },

  /**
   * Zero-latency deterministic timeout replacement.
   */
  delay() {
    return Promise.resolve();
  },
};

// Provide a patch of global performance for tests.
export function installPerformanceMock() {
  // @ts-ignore
  global.performance = {
    now: performanceMock.now,
  };
}

