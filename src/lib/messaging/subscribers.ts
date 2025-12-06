import { subscribe } from './client';
import { subscribe as natsSubscribe } from './events';

export interface MessageHandler<T = any> {
  (data: T): void | Promise<void>;
}

export class RealtimeSubscriber {
  private subscriptions: Map<string, any> = new Map();

  async subscribeToFile(fileId: string, handler: MessageHandler): Promise<void> {
    const subject = `slate.file.*.${fileId}`;
    const sub = await subscribe(subject, handler);
    this.subscriptions.set(`file:${fileId}`, sub);
  }

  async subscribeToProject(projectId: string, handler: MessageHandler): Promise<void> {
    const subject = `slate.project.*.${projectId}`;
    const sub = await subscribe(subject, handler);
    this.subscriptions.set(`project:${projectId}`, sub);
  }

  async subscribeToRuntime(sessionId: string, handler: MessageHandler): Promise<void> {
    const subject = `slate.runtime.*.${sessionId}`;
    const sub = await subscribe(subject, handler);
    this.subscriptions.set(`runtime:${sessionId}`, sub);
  }

  async subscribeToBuild(buildId: string, handler: MessageHandler): Promise<void> {
    const subject = `slate.build.*.${buildId}`;
    const sub = await subscribe(subject, handler);
    this.subscriptions.set(`build:${buildId}`, sub);
  }

  async subscribeToAssets(projectId: string, handler: MessageHandler): Promise<void> {
    const subject = `slate.asset.*.${projectId}`;
    const sub = await subscribe(subject, handler);
    this.subscriptions.set(`asset:${projectId}`, sub);
  }

  unsubscribe(key: string): void {
    const sub = this.subscriptions.get(key);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
  }
}

export const realtimeSubscriber = new RealtimeSubscriber();
