/**
 * MCP Mock Server
 * Simulates LUNA, NEC, NERVA, and Ageis agents for testing
 */

export interface MCPRequest {
  agent: 'LUNA' | 'NEC' | 'NERVA' | 'Ageis';
  action: string;
  payload: any;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  latency?: number;
}

export class MCPMockServer {
  private static originalNow: (() => number) | null = null;
  private static fakeAdvance = 0;
  private static restoreScheduled = false;

  private responses = new Map<string, MCPResponse>();
  private defaultLatency = 10;
  private shouldFail = false;
  private shouldTimeout = false;
  private timeoutDelay = 50;

  /**
   * Set default response latency
   */
  setDefaultLatency(ms: number): void {
    this.defaultLatency = ms;
  }

  /**
   * Set failure mode
   */
  setFailureMode(fail: boolean): void {
    this.shouldFail = fail;
  }

  /**
   * Set timeout mode
   */
  setTimeoutMode(timeout: boolean, delay: number = 30000): void {
    this.shouldTimeout = timeout;
    this.timeoutDelay = delay;
  }

  /**
   * Register response for specific request
   */
  registerResponse(key: string, response: MCPResponse): void {
    this.responses.set(key, response);
  }

  /**
   * Handle LUNA code generation request
   */
  async handleLUNA(prompt: string, context?: any): Promise<MCPResponse> {
    if (this.shouldTimeout) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(this.timeoutDelay, 50)));
      throw new Error('Request timeout');
    }

    if (this.shouldFail) {
      return {
        success: false,
        error: 'LUNA agent failure',
      };
    }

    const key = `LUNA:${prompt}`;
    const registered = this.responses.get(key);
    if (registered) {
      await this.simulateLatency(registered.latency || this.defaultLatency);
      return registered;
    }

    await this.simulateLatency(this.defaultLatency);
    return {
      success: true,
      data: {
        code: `// Generated code for: ${prompt}`,
        suggestions: [],
      },
    };
  }

  /**
   * Handle NEC scene analysis request
   */
  async handleNEC(sceneData: any): Promise<MCPResponse> {
    if (this.shouldTimeout) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(this.timeoutDelay, 50)));
      throw new Error('Request timeout');
    }

    if (this.shouldFail) {
      return {
        success: false,
        error: 'NEC agent failure',
      };
    }

    const key = `NEC:${JSON.stringify(sceneData)}`;
    const registered = this.responses.get(key);
    if (registered) {
      await this.simulateLatency(registered.latency || this.defaultLatency);
      return registered;
    }

    await this.simulateLatency(this.defaultLatency);
    return {
      success: true,
      data: {
        analysis: {
          objects: [],
          relationships: [],
          recommendations: [],
        },
      },
    };
  }

  /**
   * Handle NERVA auto-layout request
   */
  async handleNERVA(layoutRequest: any): Promise<MCPResponse> {
    if (this.shouldTimeout) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(this.timeoutDelay, 50)));
      throw new Error('Request timeout');
    }

    if (this.shouldFail) {
      return {
        success: false,
        error: 'NERVA agent failure',
      };
    }

    const key = `NERVA:${JSON.stringify(layoutRequest)}`;
    const registered = this.responses.get(key);
    if (registered) {
      await this.simulateLatency(registered.latency || this.defaultLatency);
      return registered;
    }

    await this.simulateLatency(this.defaultLatency);
    return {
      success: true,
      data: {
        layout: {
          positions: [],
          constraints: [],
        },
      },
    };
  }

  /**
   * Handle Ageis safety enforcement request
   */
  async handleAgeis(code: string, rules: any[]): Promise<MCPResponse> {
    if (this.shouldTimeout) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(this.timeoutDelay, 50)));
      throw new Error('Request timeout');
    }

    if (this.shouldFail) {
      return {
        success: false,
        error: 'Ageis agent failure',
      };
    }

    const key = `Ageis:${code}`;
    const registered = this.responses.get(key);
    if (registered) {
      await this.simulateLatency(registered.latency || this.defaultLatency);
      return registered;
    }

    await this.simulateLatency(this.defaultLatency);
    return {
      success: true,
      data: {
        safe: true,
        violations: [],
        suggestions: [],
      },
    };
  }

  /**
   * Handle invalid JSON response
   */
  async handleInvalidJSON(): Promise<string> {
    return 'invalid json response';
  }

  /**
   * Simulate latency
   */
  private async simulateLatency(ms: number): Promise<void> {
    // Avoid real-time sleeps to keep tests fast; instead, advance a fake clock
    MCPMockServer.patchNow(ms);
    // Preserve async semantics while keeping runtime fast
    await Promise.resolve();
    MCPMockServer.scheduleRestore();
  }

  /**
   * Patch Date.now to simulate elapsed time without real waiting.
   */
  private static patchNow(ms: number) {
    if (!MCPMockServer.originalNow) {
      MCPMockServer.originalNow = Date.now;
    }
    MCPMockServer.fakeAdvance += ms;
    Date.now = () => {
      const base = MCPMockServer.originalNow ? MCPMockServer.originalNow() : Date.now();
      return base + MCPMockServer.fakeAdvance;
    };
  }

  /**
   * Restore Date.now on the next macrotask to avoid leaking mocked time.
   */
  private static scheduleRestore() {
    if (MCPMockServer.restoreScheduled) return;
    MCPMockServer.restoreScheduled = true;
    setTimeout(() => {
      if (MCPMockServer.originalNow) {
        Date.now = MCPMockServer.originalNow;
      }
      MCPMockServer.fakeAdvance = 0;
      MCPMockServer.restoreScheduled = false;
    }, 0);
  }

  /**
   * Reset mock server
   */
  reset(): void {
    this.responses.clear();
    this.shouldFail = false;
    this.shouldTimeout = false;
    this.defaultLatency = 100;
  }
}

