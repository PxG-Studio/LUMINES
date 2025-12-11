import { webglSimulator } from '../../slate/simulators/webglSimulator';

/**
 * Deterministic MCP Mock Server for SLATE test suites.
 * Simulates compile, fs operations, metrics, runtime pulses, and protocol handshakes.
 */
export class MCPMockServer {
  private latency = 0;
  private fs = new Map<string, string>();

  constructor() {}

  setLatency(ms: number) {
    this.latency = ms;
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.latency));
  }

  /**
   * Entry point the tests call.
   */
  async handle(route: string, body?: any) {
    switch (route) {
      case '/handshake':
        return this.handshake();
      case '/capabilities':
        return this.capabilities();
      case '/compile':
        return this.compile(body);
      case '/runtime/pulse':
        return this.runtimePulse();
      case '/runtime/metrics':
        return this.metrics();
      case '/fs/read':
        return this.fsRead(body);
      case '/fs/write':
        return this.fsWrite(body);
      case '/timeout/test':
        return this.timeoutTest();
      default:
        return { status: 404, ok: false, error: 'Not Found' };
    }
  }

  /**
   * Deterministic handshake.
   */
  async handshake() {
    await this.delay();
    return {
      status: 200,
      ok: true,
      data: {
        protocol: 'mcp-mock',
        version: '1.0',
        webgl: webglSimulator.handshake(),
      },
    };
  }

  /**
   * Capabilities endpoint.
   */
  async capabilities() {
    await this.delay();
    return {
      status: 200,
      ok: true,
      data: {
        compile: true,
        fs: true,
        metrics: true,
        runtimePulse: true,
      },
    };
  }

  /**
   * Deterministic mock compiler.
   */
  async compile(body: any) {
    await this.delay();
    if (!body || !body.source) {
      return { status: 400, ok: false, error: 'Missing source' };
    }

    return {
      status: 200,
      ok: true,
      data: {
        bytecode: '<mock-bytecode>',
        warnings: [],
        errors: [],
      },
    };
  }

  /**
   * Runtime pulse.
   */
  async runtimePulse() {
    await this.delay();
    return {
      status: 200,
      ok: true,
      data: {
        pulse: 'ok',
        load: webglSimulator.getLoad(),
      },
    };
  }

  /**
   * Deterministic runtime metrics.
   */
  async metrics() {
    await this.delay();
    return {
      status: 200,
      ok: true,
      data: {
        cpu: 0.12,
        mem: 42,
        ticks: 1,
      },
    };
  }

  /**
   * FS read.
   */
  async fsRead(body: any) {
    await this.delay();
    const path = body?.path;
    if (!path) return { status: 400, ok: false, error: 'Missing path' };

    return {
      status: 200,
      ok: true,
      data: {
        path,
        content: this.fs.get(path) ?? '',
      },
    };
  }

  /**
   * FS write.
   */
  async fsWrite(body: any) {
    await this.delay();
    const path = body?.path;
    const content = body?.content;
    if (!path) return { status: 400, ok: false, error: 'Missing path' };

    this.fs.set(path, content ?? '');

    return {
      status: 200,
      ok: true,
      data: {
        written: true,
        path,
      },
    };
  }

  /**
   * Deterministic timeout test.
   */
  async timeoutTest() {
    await this.delay();
    return {
      status: 200,
      ok: true,
      data: {
        timeout: false,
      },
    };
  }
}

export const mcpMockServer = new MCPMockServer();

