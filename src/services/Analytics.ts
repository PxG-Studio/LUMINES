import { subscribe } from '../lib/messaging/client';

interface AnalyticsEvent {
  type: string;
  timestamp: number;
  projectId: string;
  userId?: string;
  data: Record<string, any>;
}

export class Analytics {
  private subscriptions: Map<string, () => void> = new Map();
  private eventBuffer: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  async start(): Promise<void> {
    console.log('Analytics service starting...');

    await this.subscribeToEvents();
    this.startFlushInterval();

    console.log('Analytics service started successfully');
  }

  async stop(): Promise<void> {
    console.log('Analytics service stopping...');

    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    await this.flushEvents();

    for (const [subject, unsubscribe] of this.subscriptions) {
      unsubscribe();
    }

    this.subscriptions.clear();
    this.eventBuffer = [];

    console.log('Analytics service stopped');
  }

  private async subscribeToEvents(): Promise<void> {
    const projectEvents = await subscribe('slate.project.*', async (msg: any) => {
      await this.trackEvent('project', msg);
    });
    this.subscriptions.set('project', projectEvents);

    const fileEvents = await subscribe('slate.file.*', async (msg: any) => {
      await this.trackEvent('file', msg);
    });
    this.subscriptions.set('file', fileEvents);

    const assetEvents = await subscribe('slate.asset.*', async (msg: any) => {
      await this.trackEvent('asset', msg);
    });
    this.subscriptions.set('asset', assetEvents);

    const runtimeEvents = await subscribe('slate.runtime.*', async (msg: any) => {
      await this.trackEvent('runtime', msg);
    });
    this.subscriptions.set('runtime', runtimeEvents);

    const buildEvents = await subscribe('slate.build.*', async (msg: any) => {
      await this.trackEvent('build', msg);
    });
    this.subscriptions.set('build', buildEvents);
  }

  private async trackEvent(category: string, msg: any): Promise<void> {
    const event: AnalyticsEvent = {
      type: `${category}.${msg.type}`,
      timestamp: msg.timestamp || Date.now(),
      projectId: msg.projectId || msg.data?.projectId || 'unknown',
      userId: msg.userId || msg.data?.userId,
      data: msg.data || {},
    };

    this.eventBuffer.push(event);

    if (this.eventBuffer.length >= 100) {
      await this.flushEvents();
    }
  }

  private startFlushInterval(): void {
    this.flushInterval = setInterval(async () => {
      await this.flushEvents();
    }, 30000);
  }

  private async flushEvents(): Promise<void> {
    if (this.eventBuffer.length === 0) return;

    const events = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      await this.persistEvents(events);

      await this.generateMetrics(events);
    } catch (error) {
      console.error('Failed to flush analytics events:', error);
      this.eventBuffer.push(...events);
    }
  }

  private async persistEvents(events: AnalyticsEvent[]): Promise<void> {
    console.log(`Persisting ${events.length} analytics events`);

    const eventsByType = events.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Event summary:', eventsByType);
  }

  private async generateMetrics(events: AnalyticsEvent[]): Promise<void> {
    const projectMetrics = this.calculateProjectMetrics(events);
    const userMetrics = this.calculateUserMetrics(events);
    const performanceMetrics = this.calculatePerformanceMetrics(events);

    console.log('Project metrics:', projectMetrics);
    console.log('User metrics:', userMetrics);
    console.log('Performance metrics:', performanceMetrics);
  }

  private calculateProjectMetrics(events: AnalyticsEvent[]): Record<string, any> {
    const projectEvents = events.filter((e) => e.type.startsWith('project.'));

    return {
      totalProjects: new Set(events.map((e) => e.projectId)).size,
      createdProjects: projectEvents.filter((e) => e.type === 'project.created').length,
      updatedProjects: projectEvents.filter((e) => e.type === 'project.updated').length,
      deletedProjects: projectEvents.filter((e) => e.type === 'project.deleted').length,
    };
  }

  private calculateUserMetrics(events: AnalyticsEvent[]): Record<string, any> {
    const activeUsers = new Set(
      events.filter((e) => e.userId).map((e) => e.userId)
    );

    return {
      activeUsers: activeUsers.size,
      totalEvents: events.length,
      eventsPerUser: activeUsers.size > 0 ? events.length / activeUsers.size : 0,
    };
  }

  private calculatePerformanceMetrics(events: AnalyticsEvent[]): Record<string, any> {
    const runtimeEvents = events.filter((e) => e.type.startsWith('runtime.'));
    const buildEvents = events.filter((e) => e.type.startsWith('build.'));

    const startedRuntimes = runtimeEvents.filter((e) => e.type === 'runtime.started').length;
    const failedRuntimes = runtimeEvents.filter((e) => e.type === 'runtime.error').length;

    const completedBuilds = buildEvents.filter((e) => e.type === 'build.completed').length;
    const failedBuilds = buildEvents.filter((e) => e.type === 'build.failed').length;

    return {
      runtimeSuccessRate:
        startedRuntimes > 0 ? ((startedRuntimes - failedRuntimes) / startedRuntimes) * 100 : 0,
      buildSuccessRate:
        completedBuilds + failedBuilds > 0
          ? (completedBuilds / (completedBuilds + failedBuilds)) * 100
          : 0,
      totalBuilds: completedBuilds + failedBuilds,
      totalRuntimes: startedRuntimes,
    };
  }
}

export const analytics = new Analytics();
