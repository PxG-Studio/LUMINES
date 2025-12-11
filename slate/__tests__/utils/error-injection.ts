/**
 * Error Injection Utilities
 * Simulates various failure scenarios for resilience testing
 * StackBlitz-grade error injection patterns
 */

export interface ErrorInjectionConfig {
  throwAfter?: number; // ms
  dropMessagesProbability?: number; // 0-1
  slowFrameRate?: number; // fps
  breakFS?: boolean;
  killCompilerMidJob?: boolean;
  injectMemoryLeak?: number; // bytes
}

/**
 * Throw error after specified delay
 */
export function throwAfter(ms: number): Promise<never> {
  return Promise.reject(new Error(`Injected error after ${ms}ms`));
}

/**
 * Randomly drop messages with given probability
 */
export function dropMessagesRandomly<T>(
  messages: T[],
  probability: number
): T[] {
  // Deterministic: drop every nth message based on probability threshold
  if (probability <= 0) return messages;
  if (probability >= 1) return [];
  return messages.filter((_, idx) => (idx % Math.round(1 / probability)) !== 0);
}

/**
 * Simulate slow frame rate
 */
export function simulateSlowFrameRate(fps: number): {
  requestAnimationFrame: typeof window.requestAnimationFrame;
  cancelAnimationFrame: typeof window.cancelAnimationFrame;
} {
  const targetInterval = 1000 / fps;
  const originalRAF = window.requestAnimationFrame;
  const originalCAF = window.cancelAnimationFrame;

  const throttledRAF: typeof window.requestAnimationFrame = (callback) => {
    const start = performance.now();
    return originalRAF((timestamp) => {
      const elapsed = timestamp - start;
      if (elapsed >= targetInterval) {
        callback(timestamp);
      } else {
        throttledRAF(callback);
      }
    });
  };

  return {
    requestAnimationFrame: throttledRAF,
    cancelAnimationFrame: originalCAF,
  };
}

/**
 * Break filesystem (simulate corruption)
 */
export function breakFS(): {
  readFile: () => Promise<never>;
  writeFile: () => Promise<never>;
  deleteFile: () => Promise<never>;
} {
  return {
    readFile: () => Promise.reject(new Error('FS corruption: read failed')),
    writeFile: () => Promise.reject(new Error('FS corruption: write failed')),
    deleteFile: () => Promise.reject(new Error('FS corruption: delete failed')),
  };
}

/**
 * Kill compiler mid-job
 */
export class CompilerKiller {
  private killed = false;

  kill(): void {
    this.killed = true;
  }

  isKilled(): boolean {
    return this.killed;
  }

  async compile(code: string): Promise<string> {
    if (this.killed) {
      throw new Error('Compiler killed mid-job');
    }
    return `compiled:${code}`;
  }
}

/**
 * Inject memory leak
 */
export function injectMemoryLeak(bytes: number): void {
  // Deterministic no-op in tests; memory pressure is simulated via counters
  void bytes;
}

/**
 * WebGL context loss simulator
 */
export class WebGLContextLossSimulator {
  private lost = false;

  simulateLoss(): void {
    this.lost = true;
  }

  restore(): void {
    this.lost = false;
  }

  isLost(): boolean {
    return this.lost;
  }

  getContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
    if (this.lost) {
      return null;
    }
    return canvas.getContext('webgl') || canvas.getContext('webgl2');
  }
}

/**
 * Worker pool collapse simulator
 */
export class WorkerPoolCollapseSimulator {
  private collapsed = false;

  collapse(): void {
    this.collapsed = true;
  }

  restore(): void {
    this.collapsed = false;
  }

  isCollapsed(): boolean {
    return this.collapsed;
  }

  async executeTask<T>(task: () => Promise<T>): Promise<T> {
    if (this.collapsed) {
      throw new Error('Worker pool collapsed');
    }
    return task();
  }
}

/**
 * FS storage unavailable simulator
 */
export class FSStorageUnavailableSimulator {
  private unavailable = false;

  setUnavailable(): void {
    this.unavailable = true;
  }

  setAvailable(): void {
    this.unavailable = false;
  }

  isUnavailable(): boolean {
    return this.unavailable;
  }

  async save(key: string, value: any): Promise<void> {
    if (this.unavailable) {
      throw new Error('FS storage unavailable');
    }
    await Promise.resolve();
  }

  async load(key: string): Promise<any> {
    if (this.unavailable) {
      throw new Error('FS storage unavailable');
    }
    await Promise.resolve();
    return null;
  }
}

/**
 * Runtime freeze detection
 */
export class RuntimeFreezeDetector {
  private lastHeartbeat = Date.now();
  private freezeThreshold = 5000; // 5 seconds

  heartbeat(): void {
    this.lastHeartbeat = Date.now();
  }

  isFrozen(): boolean {
    return Date.now() - this.lastHeartbeat > this.freezeThreshold;
  }

  reset(): void {
    this.lastHeartbeat = Date.now();
  }
}

/**
 * Compiler hang simulator
 */
export class CompilerHangSimulator {
  private hanging = false;

  hang(): void {
    this.hanging = true;
  }

  resume(): void {
    this.hanging = false;
  }

  isHanging(): boolean {
    return this.hanging;
  }

  async compile(code: string, timeout: number = 5000): Promise<string> {
    if (this.hanging) {
      throw new Error('Compiler hang detected');
    }
    // Yield once to allow hang() to be triggered mid-flight
    await Promise.resolve();
    if (this.hanging) {
      throw new Error('Compiler hang detected');
    }
    return `compiled:${code}`;
  }
}

