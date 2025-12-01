/**
 * Analytics Utilities
 * EC-178, EC-179, EC-180: Analytics and tracking
 */
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean = true;

  constructor() {
    // Check if analytics should be enabled (respect user privacy)
    if (typeof window !== 'undefined') {
      // Check for Do Not Track
      this.enabled = !navigator.doNotTrack || navigator.doNotTrack === '0';
    }
  }

  track(event: AnalyticsEvent): void {
    if (!this.enabled) return;

    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now(),
    };

    this.events.push(eventWithTimestamp);

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to analytics service (e.g., Google Analytics, Plausible)
      // analyticsService.track(eventWithTimestamp);
    } else {
      // Log in development (but not in Storybook)
      const isStorybook = typeof window !== 'undefined' && 
        (window.location?.href?.includes('storybook') || 
         window.location?.href?.includes('localhost:6006') ||
         (window as any).__STORYBOOK_STORY_STORE__);
      if (!isStorybook) {
        console.log('[Analytics]', eventWithTimestamp);
      }
    }
  }

  pageView(path: string): void {
    this.track({
      name: 'page_view',
      properties: { path },
    });
  }

  click(element: string, properties?: Record<string, any>): void {
    this.track({
      name: 'click',
      properties: {
        element,
        ...properties,
      },
    });
  }

  error(error: Error, context?: Record<string, any>): void {
    this.track({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    });
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

export const analytics = new Analytics();

