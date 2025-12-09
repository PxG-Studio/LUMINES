export type WebGLHandshake = {
  gpu: string;
  vendor: string;
  context: string;
  version: string;
};

/**
 * A deterministic WebGL simulator for SLATE's test environment.
 * Provides predictable, stable responses for all tests that interact
 * with GPU-like functionality.
 */
export class WebGLSimulator {
  private latency = 0;
  private timeoutMode: "fast" | "real" = "fast";
  private listeners = new Map<string, Set<(data?: any) => void>>();

  constructor() {}

  /**
   * Minimal, deterministic handshake the tests expect.
   */
  handshake(): WebGLHandshake {
    return {
      gpu: "MockGPU",
      vendor: "SlateSimulated",
      context: "webgl2",
      version: "2.0-mock",
    };
  }

  /**
   * Set artificial latency for GPU operations.
   */
  setDefaultLatency(ms: number) {
    this.latency = ms;
  }

  /**
   * Test harness uses this to force near-zero delays.
   */
  setTimeoutMode(mode: "fast" | "real") {
    this.timeoutMode = mode;
  }

  /**
   * Simulated GPU load as a stable deterministic value.
   */
  getLoad(): number {
    // Deterministic value expected by tests.
    return 0.15;
  }

  /**
   * Simplified event subscription system.
   */
  on(event: string, handler: (data?: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  /**
   * Emit event deterministically.
   */
  emit(event: string, data?: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((h) => h(data));
    }
  }

  /**
   * Simulate context lost.
   */
  loseContext() {
    this.emit("context-lost", {});
  }

  /**
   * Simulate context restored.
   */
  restoreContext() {
    this.emit("context-restored", {});
  }

  /**
   * Delay helper obeying timeout mode.
   */
  private delay(): Promise<void> {
    const ms = this.timeoutMode === "fast" ? 0 : this.latency;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export a singleton for test usage.
export const webglSimulator = new WebGLSimulator();

