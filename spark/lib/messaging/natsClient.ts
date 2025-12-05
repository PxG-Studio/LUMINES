/**
 * NATS Client Initialization and Connection Management
 *
 * Singleton NATS connection with auto-reconnect and health checks
 */

interface NatsMessage {
  subject: string;
  data: string;
  headers?: Record<string, string>;
}

class NatsClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnects = 10;
  private readonly reconnectDelay = 1000;
  private subscriptions = new Map<string, Set<(msg: NatsMessage) => void>>();
  private connectionPromise: Promise<void> | null = null;

  constructor(private url: string) {}

  async connect(): Promise<void> {
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("NATS connected");
        this.reconnectAttempts = 0;
        this.resubscribeAll();
        resolve();
      };

      this.ws.onerror = (err) => {
        console.error("NATS connection error:", err);
        reject(err);
      };

      this.ws.onclose = () => {
        console.log("NATS disconnected");
        this.connectionPromise = null;
        this.attemptReconnect();
      };

      this.ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data);
          if (msg.subject && msg.data) {
            this.handleMessage({
              subject: msg.subject,
              data: msg.data,
              headers: msg.headers,
            });
          }
        } catch (error) {
          console.error("NATS message parse error:", error);
        }
      };
    });

    return this.connectionPromise;
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnects) {
      console.error("Max NATS reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`NATS reconnect attempt ${this.reconnectAttempts}`);
      this.connect().catch((err) =>
        console.error("NATS reconnect failed:", err)
      );
    }, delay);
  }

  private resubscribeAll(): void {
    for (const [subject] of this.subscriptions) {
      this.sendOp({
        op: "SUB",
        subject,
        sid: `sub-${subject}`,
      });
    }
  }

  private handleMessage(msg: NatsMessage): void {
    for (const [pattern, handlers] of this.subscriptions) {
      if (this.matchSubject(msg.subject, pattern)) {
        for (const handler of handlers) {
          try {
            handler(msg);
          } catch (error) {
            console.error("NATS handler error:", error);
          }
        }
      }
    }
  }

  private matchSubject(subject: string, pattern: string): boolean {
    if (pattern === subject) return true;
    if (!pattern.includes("*")) return false;

    const patternParts = pattern.split(".");
    const subjectParts = subject.split(".");

    if (patternParts.length !== subjectParts.length) return false;

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === "*") continue;
      if (patternParts[i] !== subjectParts[i]) return false;
    }

    return true;
  }

  subscribe(
    subject: string,
    handler: (msg: NatsMessage) => void
  ): () => void {
    if (!this.subscriptions.has(subject)) {
      this.subscriptions.set(subject, new Set());
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.sendOp({
          op: "SUB",
          subject,
          sid: `sub-${subject}`,
        });
      }
    }

    this.subscriptions.get(subject)!.add(handler);

    return () => {
      const handlers = this.subscriptions.get(subject);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.subscriptions.delete(subject);
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.sendOp({
              op: "UNSUB",
              sid: `sub-${subject}`,
            });
          }
        }
      }
    };
  }

  async publish(subject: string, data: any): Promise<void> {
    await this.connect();

    if (this.ws?.readyState !== WebSocket.OPEN) {
      throw new Error("NATS not connected");
    }

    const payload = typeof data === "string" ? data : JSON.stringify(data);
    const encoded = btoa(payload);

    this.sendOp({
      op: "PUB",
      subject,
      data: encoded,
    });
  }

  private sendOp(op: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(op));
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.connect();
      return this.ws?.readyState === WebSocket.OPEN;
    } catch {
      return false;
    }
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscriptions.clear();
    this.connectionPromise = null;
  }
}

let clientInstance: NatsClient | null = null;

export function getNatsClient(): NatsClient {
  if (!clientInstance) {
    const url =
      process.env.NEXT_PUBLIC_NATS_WS_URL ||
      process.env.NATS_WS_URL ||
      "ws://192.168.86.27:4222";
    clientInstance = new NatsClient(url);
  }
  return clientInstance;
}

export function closeNatsClient(): void {
  if (clientInstance) {
    clientInstance.close();
    clientInstance = null;
  }
}
