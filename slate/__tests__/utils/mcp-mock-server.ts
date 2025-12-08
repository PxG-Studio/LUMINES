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
  private responses = new Map<string, MCPResponse>();
  private defaultLatency = 100;
  private shouldFail = false;
  private shouldTimeout = false;
  private timeoutDelay = 30000;

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
      await new Promise((resolve) => setTimeout(resolve, this.timeoutDelay));
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
      await new Promise((resolve) => setTimeout(resolve, this.timeoutDelay));
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
      await new Promise((resolve) => setTimeout(resolve, this.timeoutDelay));
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
      await new Promise((resolve) => setTimeout(resolve, this.timeoutDelay));
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
    await new Promise((resolve) => setTimeout(resolve, ms));
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

