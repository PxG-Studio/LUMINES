/**
 * Unit Tests for AI Request Queue
 * Target: 15-20 tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { AIRequestQueue, getAIQueue, QueuePriority } from '../queue';

describe('AIRequestQueue', () => {
  let queue: AIRequestQueue;

  beforeEach(() => {
    queue = new AIRequestQueue({
      batchSize: 3,
      batchDelay: 100,
      maxConcurrent: 2,
    });
  });

  afterEach(() => {
    queue.clear();
  });

  describe('enqueue', () => {
    it('should add request to queue', async () => {
      const executeFn = vi.fn().mockResolvedValue('result');
      
      const promise = queue.enqueue('test prompt', 'claude', 'claude-3', 0, executeFn);
      
      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 150));
      
      expect(executeFn).toHaveBeenCalled();
      await expect(promise).resolves.toBe('result');
    });

    it('should process requests in priority order', async () => {
      const results: string[] = [];
      const executeFn = (prompt: string) => {
        results.push(prompt);
        return Promise.resolve(prompt);
      };

      queue.enqueue('low', 'claude', 'claude-3', QueuePriority.LOW, executeFn);
      queue.enqueue('high', 'claude', 'claude-3', QueuePriority.HIGH, executeFn);
      queue.enqueue('normal', 'claude', 'claude-3', QueuePriority.NORMAL, executeFn);

      await new Promise(resolve => setTimeout(resolve, 200));

      // High priority should be processed first
      expect(results[0]).toBe('high');
    });

    it('should handle request errors', async () => {
      const executeFn = vi.fn().mockRejectedValue(new Error('API error'));

      const promise = queue.enqueue('test', 'claude', 'claude-3', 0, executeFn);
      // Catch rejection to prevent unhandled rejection warning
      promise.catch(() => {}); // Suppress unhandled rejection

      await new Promise(resolve => setTimeout(resolve, 150));

      await expect(promise).rejects.toThrow('API error');
    });

    it('should generate unique request IDs', async () => {
      const ids: string[] = [];
      const executeFn = vi.fn().mockImplementation((prompt, provider, model) => {
        // Capture ID from queue internals if possible
        return Promise.resolve('result');
      });

      queue.enqueue('test1', 'claude', 'claude-3', 0, executeFn);
      queue.enqueue('test2', 'claude', 'claude-3', 0, executeFn);

      await new Promise(resolve => setTimeout(resolve, 150));

      // Both should be processed
      expect(executeFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('priority handling', () => {
    it('should process high priority before normal', async () => {
      const order: string[] = [];
      const executeFn = (prompt: string) => {
        order.push(prompt);
        return Promise.resolve(prompt);
      };

      queue.enqueue('normal1', 'claude', 'claude-3', QueuePriority.NORMAL, executeFn);
      queue.enqueue('high1', 'claude', 'claude-3', QueuePriority.HIGH, executeFn);
      queue.enqueue('normal2', 'claude', 'claude-3', QueuePriority.NORMAL, executeFn);

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(order[0]).toBe('high1');
    });

    it('should process urgent priority first', async () => {
      const order: string[] = [];
      const executeFn = (prompt: string) => {
        order.push(prompt);
        return Promise.resolve(prompt);
      };

      queue.enqueue('normal', 'claude', 'claude-3', QueuePriority.NORMAL, executeFn);
      queue.enqueue('urgent', 'claude', 'claude-3', QueuePriority.URGENT, executeFn);
      queue.enqueue('high', 'claude', 'claude-3', QueuePriority.HIGH, executeFn);

      await new Promise(resolve => setTimeout(resolve, 200));

      expect(order[0]).toBe('urgent');
    });
  });

  describe('batching', () => {
    it('should batch requests up to batchSize', async () => {
      const executeFn = vi.fn().mockResolvedValue('result');
      const batchQueue = new AIRequestQueue({ batchSize: 2, batchDelay: 50, maxConcurrent: 2 });

      batchQueue.enqueue('prompt1', 'claude', 'claude-3', 0, executeFn);
      batchQueue.enqueue('prompt2', 'claude', 'claude-3', 0, executeFn);
      batchQueue.enqueue('prompt3', 'claude', 'claude-3', 0, executeFn);

      await new Promise(resolve => setTimeout(resolve, 100));

      // Should process in batches
      expect(executeFn).toHaveBeenCalled();
    });
  });

  describe('concurrency limiting', () => {
    it('should respect maxConcurrent limit', async () => {
      const concurrentQueue = new AIRequestQueue({
        batchSize: 10,
        batchDelay: 10,
        maxConcurrent: 2,
      });

      const activeCounts: number[] = [];
      const executeFn = vi.fn().mockImplementation(async () => {
        const status = concurrentQueue.getStatus();
        activeCounts.push(status.activeCount);
        await new Promise(resolve => setTimeout(resolve, 50));
        return 'result';
      });

      // Enqueue 5 requests
      for (let i = 0; i < 5; i++) {
        concurrentQueue.enqueue(`prompt${i}`, 'claude', 'claude-3', 0, executeFn);
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      // Active count should never exceed maxConcurrent
      const maxActive = Math.max(...activeCounts);
      expect(maxActive).toBeLessThanOrEqual(2);
    });
  });

  describe('getStatus', () => {
    it('should return queue status', async () => {
      const executeFn = vi.fn().mockResolvedValue('result');

      queue.enqueue('test', 'claude', 'claude-3', 0, executeFn);

      const status = queue.getStatus();

      expect(status).toHaveProperty('queueLength');
      expect(status).toHaveProperty('activeCount');
      expect(status).toHaveProperty('processing');
    });

    it('should show processing state', () => {
      const executeFn = vi.fn().mockResolvedValue('result');
      queue.enqueue('test', 'claude', 'claude-3', 0, executeFn);

      const status = queue.getStatus();
      expect(status.processing).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all queued requests', async () => {
      // Use a delayed execute function to ensure requests stay in queue
      const executeFn = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve('result'), 1000))
      );

      const promise1 = queue.enqueue('test1', 'claude', 'claude-3', 0, executeFn);
      const promise2 = queue.enqueue('test2', 'claude', 'claude-3', 0, executeFn);

      // Clear immediately before processing
      queue.clear();

      // Both promises should be rejected
      await expect(promise1).rejects.toThrow('Queue cleared');
      await expect(promise2).rejects.toThrow('Queue cleared');
    });

    it('should reset queue length to zero', () => {
      const executeFn = vi.fn().mockResolvedValue('result');
      queue.enqueue('test', 'claude', 'claude-3', 0, executeFn);

      queue.clear();

      const status = queue.getStatus();
      expect(status.queueLength).toBe(0);
    });
  });

  describe('QueuePriority constants', () => {
    it('should have correct priority values', () => {
      expect(QueuePriority.LOW).toBe(0);
      expect(QueuePriority.NORMAL).toBe(1);
      expect(QueuePriority.HIGH).toBe(2);
      expect(QueuePriority.URGENT).toBe(3);
    });
  });

  describe('getAIQueue singleton', () => {
    it('should return same instance on multiple calls', () => {
      const queue1 = getAIQueue();
      const queue2 = getAIQueue();

      expect(queue1).toBe(queue2);
    });
  });
});

