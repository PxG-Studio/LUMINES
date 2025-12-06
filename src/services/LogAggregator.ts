import { subscribe } from '../lib/messaging/client';
import { addRuntimeLog } from '../lib/database/operations/runtime';

export class LogAggregator {
  private subscriptions: Map<string, () => void> = new Map();
  private logBuffer: Map<string, any[]> = new Map();
  private flushInterval: NodeJS.Timeout | null = null;

  async start(): Promise<void> {
    console.log('Log Aggregator starting...');

    await this.subscribeToLogs();
    this.startFlushInterval();

    console.log('Log Aggregator started successfully');
  }

  async stop(): Promise<void> {
    console.log('Log Aggregator stopping...');

    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    await this.flushAllLogs();

    for (const [subject, unsubscribe] of this.subscriptions) {
      unsubscribe();
    }

    this.subscriptions.clear();
    this.logBuffer.clear();

    console.log('Log Aggregator stopped');
  }

  private async subscribeToLogs(): Promise<void> {
    const unsubscribe = await subscribe('slate.runtime.log.*', async (msg: any) => {
      const { sessionId, data } = msg;
      await this.handleLog(sessionId, data);
    });

    this.subscriptions.set('runtime.log', unsubscribe);

    const buildUnsubscribe = await subscribe('slate.build.*.log', async (msg: any) => {
      const { projectId, data } = msg;
      console.log(`Build log [${projectId}]:`, data.message);
    });

    this.subscriptions.set('build.log', buildUnsubscribe);

    const assetUnsubscribe = await subscribe('slate.asset.*.log', async (msg: any) => {
      const { projectId, assetId, data } = msg;
      console.log(`Asset log [${projectId}/${assetId}]:`, data.message);
    });

    this.subscriptions.set('asset.log', assetUnsubscribe);
  }

  private async handleLog(sessionId: string, data: any): Promise<void> {
    const { level, message, metadata } = data;

    if (!this.logBuffer.has(sessionId)) {
      this.logBuffer.set(sessionId, []);
    }

    this.logBuffer.get(sessionId)!.push({
      sessionId,
      level,
      message,
      metadata,
      timestamp: Date.now(),
    });

    if (level === 'error' || level === 'warn') {
      await this.flushSessionLogs(sessionId);
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(async () => {
      await this.flushAllLogs();
    }, 5000);
  }

  private async flushAllLogs(): Promise<void> {
    for (const [sessionId] of this.logBuffer) {
      await this.flushSessionLogs(sessionId);
    }
  }

  private async flushSessionLogs(sessionId: string): Promise<void> {
    const logs = this.logBuffer.get(sessionId);
    if (!logs || logs.length === 0) return;

    try {
      for (const log of logs) {
        await addRuntimeLog(log.sessionId, log.level, log.message, log.metadata);
      }

      this.logBuffer.delete(sessionId);
    } catch (error) {
      console.error(`Failed to flush logs for session ${sessionId}:`, error);
    }
  }
}

export const logAggregator = new LogAggregator();
