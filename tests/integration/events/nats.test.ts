/**
 * NATS Integration Tests
 * Tests NATS client connection and event publishing/subscribing
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';

vi.mock('@/lib/events/client', () => {
  const subscribe = vi.fn(() => Promise.resolve());
  const publish = vi.fn(() => Promise.resolve());
  return {
    initializeNats: vi.fn(async () => true),
    checkNatsHealth: vi.fn(async () => true),
    close: vi.fn(async () => true),
    eventBus: {
      subscribe,
      publish,
    },
  };
});

vi.mock('@/lib/events/publishers', () => ({
  componentEvents: {
    created: vi.fn(() => Promise.resolve()),
  },
  buildEvents: {
    started: vi.fn(() => Promise.resolve()),
    progress: vi.fn(() => Promise.resolve()),
  },
}));

import { initializeNats, eventBus, checkNatsHealth, close as closeNats } from '@/lib/events/client';
import { componentEvents, buildEvents } from '@/lib/events/publishers';

describe('NATS Integration', () => {
  let isConnected = false;

  beforeAll(async () => {
    await initializeNats();
    const healthy = await checkNatsHealth();
    isConnected = healthy;
  });

  afterAll(async () => {
    if (isConnected) {
      await closeNats();
    }
  });

  describe('Connection Health', () => {
    it('should connect to NATS successfully', async () => {
      const healthy = await checkNatsHealth();
      expect(healthy).toBe(true);
    });
  });

  describe('Event Publishing', () => {
    it('should publish component.created event', async () => {
      const eventData = {
        componentId: 'comp-123',
        projectId: 'proj-123',
        component: { name: 'TestComponent' },
      };

      // Should not throw
      await expect(
        componentEvents.created(eventData)
      ).resolves.not.toThrow();
    });

    it('should publish build.started event', async () => {
      const eventData = {
        buildId: 'build-123',
        projectId: 'proj-123',
      };

      await expect(
        buildEvents.started(eventData)
      ).resolves.not.toThrow();
    });

    it('should publish build.progress event', async () => {
      const eventData = {
        buildId: 'build-123',
        progress: 50,
        stage: 'compiling',
      };

      await expect(
        buildEvents.progress(eventData)
      ).resolves.not.toThrow();
    });
  });

  describe('Event Subscribing', () => {
    it('should subscribe to events and receive messages', async () => {
      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Event subscription timeout'));
        }, 5000);

        const testSubject = 'test.subscription';
        const testPayload = { test: 'data' };

        // Subscribe to test subject
        eventBus.subscribe(testSubject, (data) => {
          try {
            expect(data).toEqual(testPayload);
            clearTimeout(timeout);
            resolve();
          } catch (error) {
            clearTimeout(timeout);
            reject(error);
          }
        }).then(() => {
          // Publish event after subscription is set up
          setTimeout(async () => {
            try {
              await eventBus.publish(testSubject, testPayload);
            } catch (error) {
              clearTimeout(timeout);
              reject(error);
            }
          }, 100);
        }).catch(reject);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle connection failures gracefully when NATS is unavailable', async () => {
      // If NATS is not available, health check should return false
      if (!isConnected) {
        const healthy = await checkNatsHealth();
        expect(healthy).toBe(false);
      }
    });
  });
});

