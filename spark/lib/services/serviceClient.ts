/**
 * Service Client with Connection Pooling, Retries, and Preflight Checks
 *
 * High-performance HTTP client for MCP/CV/ASR services
 */

import { setTimeout as sleep } from "timers/promises";

interface ServiceConfig {
  baseUrl: string;
  token?: string;
  timeoutMs?: number;
  maxRetries?: number;
  maxPayloadBytes?: number;
}

class ServiceClient {
  private pool: Map<string, AbortController[]> = new Map();
  private readonly maxConcurrent = 10;

  constructor(private config: ServiceConfig) {}

  private async acquireSlot(key: string): Promise<() => void> {
    const controllers = this.pool.get(key) || [];
    while (controllers.length >= this.maxConcurrent) {
      await sleep(50);
    }
    const ctrl = new AbortController();
    controllers.push(ctrl);
    this.pool.set(key, controllers);
    return () => {
      const idx = controllers.indexOf(ctrl);
      if (idx >= 0) controllers.splice(idx, 1);
    };
  }

  private preflightCheck(path: string, bodySize: number): void {
    if (this.config.maxPayloadBytes && bodySize > this.config.maxPayloadBytes) {
      throw new Error(`Payload too large: ${bodySize} > ${this.config.maxPayloadBytes}`);
    }
  }

  async call<T>(path: string, body: any, options?: { signal?: AbortSignal }): Promise<T> {
    const bodyStr = JSON.stringify(body);
    this.preflightCheck(path, Buffer.byteLength(bodyStr, "utf8"));

    const release = await this.acquireSlot(path);
    const ctrl = new AbortController();
    if (options?.signal) {
      options.signal.addEventListener("abort", () => ctrl.abort());
    }

    let attempt = 0;
    const maxRetries = this.config.maxRetries ?? 3;
    let lastErr: any;

    while (attempt < maxRetries) {
      try {
        const timeoutId = setTimeout(() => ctrl.abort(), this.config.timeoutMs ?? 10000);
        const res = await fetch(`${this.config.baseUrl}${path}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(this.config.token ? { Authorization: `Bearer ${this.config.token}` } : {}),
          },
          body: bodyStr,
          signal: ctrl.signal,
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }
        release();
        return await res.json();
      } catch (err: any) {
        if (err.name === "AbortError") {
          release();
          throw err;
        }
        lastErr = err;
        attempt++;
        if (attempt < maxRetries) {
          const delay = 100 * Math.pow(2, attempt) + Math.random() * 50;
          await sleep(delay);
        }
      }
    }
    release();
    throw lastErr;
  }
}

export const unityMcpClient = new ServiceClient({
  baseUrl: process.env.UNITY_MCP_URL || "http://localhost:8080/mcp",
  token: process.env.UNITY_MCP_TOKEN,
  timeoutMs: 10000,
  maxRetries: 3,
  maxPayloadBytes: 200_000,
});

export const cvServiceClient = new ServiceClient({
  baseUrl: process.env.CV_SERVICE_URL || "http://localhost:8081",
  token: process.env.CV_SERVICE_TOKEN,
  timeoutMs: 30000,
  maxRetries: 2,
  maxPayloadBytes: 10_000_000,
});

export const asrServiceClient = new ServiceClient({
  baseUrl: process.env.ASR_SERVICE_URL || "http://localhost:8082",
  token: process.env.ASR_SERVICE_TOKEN,
  timeoutMs: 60000,
  maxRetries: 2,
  maxPayloadBytes: 50_000_000,
});
