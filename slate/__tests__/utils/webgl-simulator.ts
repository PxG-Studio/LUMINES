/**
 * WebGL Context Loss Simulator
 * Simulates WebGL context loss scenarios for resilience testing
 */

export class WebGLSimulator {
  private contextLost = false;
  private contextRestored = false;
  private listeners: Array<() => void> = [];
  private restoreListeners: Array<() => void> = [];

  /**
   * Simulate WebGL context loss
   */
  simulateContextLoss(): void {
    this.contextLost = true;
    this.contextRestored = false;
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Simulate WebGL context restoration
   */
  simulateContextRestore(): void {
    this.contextLost = false;
    this.contextRestored = true;
    this.restoreListeners.forEach((listener) => listener());
  }

  /**
   * Check if context is lost
   */
  isContextLost(): boolean {
    return this.contextLost;
  }

  /**
   * Check if context is restored
   */
  isContextRestored(): boolean {
    return this.contextRestored;
  }

  /**
   * Add context loss listener
   */
  onContextLost(listener: () => void): void {
    this.listeners.push(listener);
  }

  /**
   * Add context restore listener
   */
  onContextRestore(listener: () => void): void {
    this.restoreListeners.push(listener);
  }

  /**
   * Create mock WebGL context
   */
  createMockContext(canvas: HTMLCanvasElement): WebGLRenderingContext | null {
    if (this.contextLost) {
      return null;
    }

    // Mock WebGL context
    const mockContext = {
      canvas,
      drawingBufferWidth: canvas.width,
      drawingBufferHeight: canvas.height,
      getParameter: vi.fn(),
      getExtension: vi.fn(),
      createShader: vi.fn(),
      shaderSource: vi.fn(),
      compileShader: vi.fn(),
      getShaderParameter: vi.fn(),
      createProgram: vi.fn(),
      attachShader: vi.fn(),
      linkProgram: vi.fn(),
      useProgram: vi.fn(),
      createBuffer: vi.fn(),
      bindBuffer: vi.fn(),
      bufferData: vi.fn(),
      enable: vi.fn(),
      disable: vi.fn(),
      clear: vi.fn(),
      clearColor: vi.fn(),
      viewport: vi.fn(),
      drawArrays: vi.fn(),
      drawElements: vi.fn(),
      getError: vi.fn(() => 0), // NO_ERROR
    } as any;

    return mockContext;
  }

  /**
   * Reset simulator state
   */
  reset(): void {
    this.contextLost = false;
    this.contextRestored = false;
    this.listeners = [];
    this.restoreListeners = [];
  }
}

/**
 * Unity WebGL handshake simulator
 */
export class UnityWebGLHandshakeSimulator {
  private connected = false;
  private handshakeTimeout = 5000;
  private messageQueue: Array<{ type: string; data: any }> = [];

  /**
   * Simulate handshake
   */
  async handshake(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.connected = true;
        resolve(true);
      }, 100);

      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('Handshake timeout'));
        }
      }, this.handshakeTimeout);
    });
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Send message
   */
  sendMessage(type: string, data: any): void {
    if (!this.connected) {
      throw new Error('Not connected');
    }
    this.messageQueue.push({ type, data });
  }

  /**
   * Receive message
   */
  receiveMessage(): { type: string; data: any } | null {
    return this.messageQueue.shift() || null;
  }

  /**
   * Simulate connection loss
   */
  disconnect(): void {
    this.connected = false;
    this.messageQueue = [];
  }

  /**
   * Simulate slow response
   */
  async slowResponse(delay: number = 6000): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

