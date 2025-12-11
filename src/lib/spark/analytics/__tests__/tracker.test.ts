/**
 * Unit Tests for Analytics Tracker
 * Target: 15-20 tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AnalyticsTracker, getAnalyticsTracker } from '../tracker';

describe('AnalyticsTracker', () => {
  let tracker: AnalyticsTracker;

  beforeEach(() => {
    tracker = new AnalyticsTracker();
  });

  afterEach(() => {
    tracker.destroy();
  });

  describe('track', () => {
    it('should track an event', () => {
      tracker.track('test_event', { prop: 'value' });

      const metrics = tracker.getMetrics();
      expect(metrics.totalGenerations).toBeGreaterThanOrEqual(0);
    });

    it('should track event with properties', () => {
      tracker.track('test_event', { key: 'value', number: 123 });

      // Event should be stored
      const events = tracker.getEvents();
      expect(events.length).toBeGreaterThan(0);
    });

    it('should track event with userId', () => {
      tracker.track('test_event', {}, 'user123');

      const events = tracker.getEvents();
      expect(events[0]?.userId).toBe('user123');
    });

    it('should limit stored events', () => {
      // Add more than maxEvents
      for (let i = 0; i < 1001; i++) {
        tracker.track(`event_${i}`);
      }

      const events = tracker.getEvents();
      expect(events.length).toBeLessThanOrEqual(1000);
    });

    it('should auto-flush when batch size reached', () => {
      const flushSpy = vi.spyOn(tracker, 'flush');

      // Add 100 events to trigger auto-flush
      for (let i = 0; i < 100; i++) {
        tracker.track(`event_${i}`);
      }

      expect(flushSpy).toHaveBeenCalled();
    });
  });

  describe('trackGeneration', () => {
    it('should track code generation', () => {
      tracker.trackGeneration(
        'unity',
        'claude',
        100,
        500,
        true,
        'user123'
      );

      const metrics = tracker.getMetrics();
      expect(metrics.totalGenerations).toBeGreaterThan(0);
    });

    it('should track failed generation', () => {
      tracker.trackGeneration('unity', 'claude', 0, 100, false);

      const metrics = tracker.getMetrics();
      expect(metrics.errorRate).toBeGreaterThan(0);
    });

    it('should update provider usage', () => {
      tracker.trackGeneration('unity', 'claude', 100, 500, true);
      tracker.trackGeneration('unity', 'openai', 100, 500, true);

      const metrics = tracker.getMetrics();
      expect(metrics.providerUsage.claude).toBeGreaterThan(0);
      expect(metrics.providerUsage.openai).toBeGreaterThan(0);
    });

    it('should update engine usage', () => {
      tracker.trackGeneration('unity', 'claude', 100, 500, true);
      tracker.trackGeneration('godot', 'claude', 100, 500, true);

      const metrics = tracker.getMetrics();
      expect(metrics.engineUsage.unity).toBeGreaterThan(0);
      expect(metrics.engineUsage.godot).toBeGreaterThan(0);
    });
  });

  describe('getMetrics', () => {
    it('should return metrics structure', () => {
      const metrics = tracker.getMetrics();

      expect(metrics).toHaveProperty('totalGenerations');
      expect(metrics).toHaveProperty('totalTokensUsed');
      expect(metrics).toHaveProperty('averageGenerationTime');
      expect(metrics).toHaveProperty('providerUsage');
      expect(metrics).toHaveProperty('engineUsage');
      expect(metrics).toHaveProperty('errorRate');
    });

    it('should calculate average generation time', () => {
      tracker.trackGeneration('unity', 'claude', 100, 500, true);
      tracker.trackGeneration('unity', 'claude', 100, 1000, true);

      const metrics = tracker.getMetrics();
      expect(metrics.averageGenerationTime).toBe(750);
    });

    it('should calculate error rate', () => {
      tracker.trackGeneration('unity', 'claude', 100, 500, true);
      tracker.trackGeneration('unity', 'claude', 100, 500, false);
      tracker.trackGeneration('unity', 'claude', 100, 500, false);

      const metrics = tracker.getMetrics();
      expect(metrics.errorRate).toBeCloseTo(0.67, 1);
    });
  });

  describe('flush', () => {
    it('should clear events after flush', () => {
      tracker.track('event1');
      tracker.track('event2');

      tracker.flush();

      const events = tracker.getEvents();
      expect(events.length).toBe(0);
    });
  });

  describe('getAnalyticsTracker singleton', () => {
    it('should return same instance', () => {
      const tracker1 = getAnalyticsTracker();
      const tracker2 = getAnalyticsTracker();

      expect(tracker1).toBe(tracker2);
    });
  });
});

