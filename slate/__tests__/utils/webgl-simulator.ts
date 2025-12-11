/**
 * Deterministic WebGL simulator for SLATE editor-host tests.
 * Provides handshake, message queue, context loss/restore, and
 * deterministic timing without real delays.
 */
export class WebGLSimulator {
  private static originalNow: (() => number) | null = null;
  private static fakeAdvance = 0;
  private static restoreScheduled = false;

  private connected = false;
  private contextLost = false;
  private contextRestored = false;
  private timeoutEnabled = false;
  private timeoutMs = 5000;
  private defaultLatency = 0;
  private messageQueue: Array<{ type: string; data: any }> = [];
  private currentRequestToken = 0;

  // ---- Timing helpers (fake clock) ----
  private static patchNow(ms: number) {
    if (!WebGLSimulator.originalNow) {
      WebGLSimulator.originalNow = Date.now;
    }
    WebGLSimulator.fakeAdvance += ms;
    Date.now = () => {
      const base = WebGLSimulator.originalNow ? WebGLSimulator.originalNow() : Date.now();
      return base + WebGLSimulator.fakeAdvance;
    };
  }

  private static scheduleRestore() {
    if (WebGLSimulator.restoreScheduled) return;
    WebGLSimulator.restoreScheduled = true;
    setTimeout(() => {
      if (WebGLSimulator.originalNow) {
        Date.now = WebGLSimulator.originalNow;
      }
      WebGLSimulator.fakeAdvance = 0;
      WebGLSimulator.restoreScheduled = false;
    }, 0);
  }

  async wait(ms: number) {
    WebGLSimulator.patchNow(ms);
    await Promise.resolve();
    WebGLSimulator.scheduleRestore();
  }

  // ---- Controls ----
  setTimeoutMode(enabled: boolean, ms: number = 5000) {
    this.timeoutEnabled = enabled;
    this.timeoutMs = ms;
  }

  setDefaultLatency(ms: number) {
    this.defaultLatency = ms;
  }

  getLatency() {
    return this.defaultLatency;
  }

  // ---- Connection / handshake ----
  async handshake(): Promise<boolean> {
    const latency = this.defaultLatency || 0;
    if (this.timeoutEnabled) {
      await this.wait(this.timeoutMs);
      throw new Error('Handshake timeout');
    }
    // Mark connected immediately so callers that don't await still see connected=true
    this.connected = true;
    await this.wait(latency);
    return true;
  }

  isConnected(): boolean {
    return this.connected;
  }

  disconnect() {
    this.connected = false;
    this.messageQueue = [];
  }

  // ---- Messaging ----
  sendMessage(type: string, data: any) {
    if (!this.connected) throw new Error('Not connected');
    // Cap queue to avoid uncontrolled growth; drop oldest beyond 1000
    if (this.messageQueue.length > 1000) {
      this.messageQueue.shift();
    }
    this.messageQueue.push({ type, data });
  }

  receiveMessage(): { type: string; data: any } | null {
    return this.messageQueue.shift() || null;
  }

  // ---- Slow responses / cancellation ----
  async slowResponse(delay: number = 6000): Promise<void> {
    if (this.timeoutEnabled && delay > this.timeoutMs) {
      await this.wait(this.timeoutMs);
      throw new Error('Timeout');
    }
    await this.wait(delay);
  }

  async sendWithCancel(latency: number, timeout?: number): Promise<{ success: boolean }> {
    const token = ++this.currentRequestToken;
    const effectiveLatency = latency || this.defaultLatency;
    if (this.timeoutEnabled) {
      await this.wait(timeout ?? this.timeoutMs);
      throw new Error('Timeout');
    }
    if (timeout && effectiveLatency > timeout) {
      await this.wait(timeout);
      throw new Error('Timeout');
    }
    await this.wait(effectiveLatency);
    if (token !== this.currentRequestToken) {
      throw new Error('Cancelled');
    }
    return { success: true };
  }

  // ---- Context loss / restore ----
  simulateContextLoss(): void {
    this.contextLost = true;
    this.contextRestored = false;
  }

  simulateContextRestore(): void {
    this.contextLost = false;
    this.contextRestored = true;
  }

  isContextLost(): boolean {
    return this.contextLost;
  }

  isContextRestored(): boolean {
    return this.contextRestored;
  }

  // ---- Reset ----
  reset(): void {
    this.connected = false;
    this.contextLost = false;
    this.contextRestored = false;
    this.timeoutEnabled = false;
    this.timeoutMs = 5000;
    this.defaultLatency = 0;
    this.messageQueue = [];
    this.currentRequestToken = 0;
  }
}

