/**
 * Usage Analytics Tracker
 * 
 * Tracks user actions, feature usage, and performance metrics
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsMetrics {
  totalGenerations: number;
  totalTokensUsed: number;
  averageGenerationTime: number;
  providerUsage: Record<string, number>;
  engineUsage: Record<string, number>;
  errorRate: number;
}

class AnalyticsTracker {
  private events: AnalyticsEvent[] = [];
  private maxEvents = 1000;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Auto-flush every 5 minutes
    this.startAutoFlush(5 * 60 * 1000);
  }

  /**
   * Track an event
   */
  track(eventName: string, properties?: Record<string, any>, userId?: string, sessionId?: string): void {
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      userId,
      sessionId,
    };

    this.events.push(event);

    // Prevent memory overflow
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Flush if batch size reached
    if (this.events.length >= 100) {
      this.flush();
    }
  }

  /**
   * Track code generation
   */
  trackGeneration(
    engine: string,
    provider: string,
    tokensUsed: number,
    generationTime: number,
    success: boolean,
    userId?: string,
    sessionId?: string
  ): void {
    this.track(
      'code_generation',
      {
        engine,
        provider,
        tokensUsed,
        generationTime,
        success,
      },
      userId,
      sessionId
    );
  }

  /**
   * Track feature usage
   */
  trackFeature(feature: string, properties?: Record<string, any>, userId?: string): void {
    this.track(`feature_${feature}`, properties, userId);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>, userId?: string): void {
    this.track(
      'error',
      {
        message: error.message,
        stack: error.stack,
        ...context,
      },
      userId
    );
  }

  /**
   * Track performance metric
   */
  trackPerformance(metric: string, value: number, unit: string = 'ms', userId?: string): void {
    this.track(
      'performance',
      {
        metric,
        value,
        unit,
      },
      userId
    );
  }

  /**
   * Get analytics metrics
   */
  getMetrics(): AnalyticsMetrics {
    const generations = this.events.filter((e) => e.name === 'code_generation');
    const errors = this.events.filter((e) => e.name === 'error');

    const totalGenerations = generations.length;
    const totalTokensUsed = generations.reduce(
      (sum, e) => sum + (e.properties?.tokensUsed || 0),
      0
    );
    const averageGenerationTime =
      generations.reduce((sum, e) => sum + (e.properties?.generationTime || 0), 0) /
      (totalGenerations || 1);

    const providerUsage: Record<string, number> = {};
    const engineUsage: Record<string, number> = {};

    generations.forEach((e) => {
      const provider = e.properties?.provider || 'unknown';
      const engine = e.properties?.engine || 'unknown';

      providerUsage[provider] = (providerUsage[provider] || 0) + 1;
      engineUsage[engine] = (engineUsage[engine] || 0) + 1;
    });

    const errorRate = totalGenerations > 0 ? errors.length / totalGenerations : 0;

    return {
      totalGenerations,
      totalTokensUsed,
      averageGenerationTime,
      providerUsage,
      engineUsage,
      errorRate,
    };
  }

  /**
   * Flush events to server
   */
  async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    try {
      // In production, send to analytics endpoint
      if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events: eventsToFlush }),
        });
      } else {
        // Development: log to console
        console.log('Analytics events:', eventsToFlush);
      }
    } catch (error) {
      console.error('Failed to flush analytics:', error);
      // Re-add events if flush failed
      this.events.unshift(...eventsToFlush);
    }
  }

  /**
   * Start auto-flush interval
   */
  private startAutoFlush(intervalMs: number): void {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, intervalMs);
  }

  /**
   * Stop auto-flush
   */
  stopAutoFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }
}

// Singleton instance
let trackerInstance: AnalyticsTracker | null = null;

/**
 * Get the global analytics tracker instance
 */
export function getAnalyticsTracker(): AnalyticsTracker {
  if (!trackerInstance) {
    trackerInstance = new AnalyticsTracker();
  }
  return trackerInstance;
}

