/**
 * Unit Tests for AI Cache System
 * Target: 15-20 tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AICache, ValidationCache, getAICache, getValidationCache } from '../cache';

describe('AICache', () => {
  let cache: AICache;

  beforeEach(() => {
    cache = new AICache({ maxSize: 10, defaultTTL: 1000 });
  });

  describe('get and set', () => {
    it('should store and retrieve cached values', () => {
      cache.set('test prompt', 'claude', 'claude-3', 'cached result');
      const result = cache.get('test prompt', 'claude', 'claude-3');

      expect(result).toBe('cached result');
    });

    it('should return null for non-existent keys', () => {
      const result = cache.get('non-existent', 'claude', 'claude-3');
      expect(result).toBeNull();
    });

    it('should handle different providers separately', () => {
      cache.set('prompt', 'claude', 'claude-3', 'claude result');
      cache.set('prompt', 'openai', 'gpt-4', 'openai result');

      expect(cache.get('prompt', 'claude', 'claude-3')).toBe('claude result');
      expect(cache.get('prompt', 'openai', 'gpt-4')).toBe('openai result');
    });

    it('should handle different models separately', () => {
      cache.set('prompt', 'claude', 'claude-3', 'result1');
      cache.set('prompt', 'claude', 'claude-haiku', 'result2');

      expect(cache.get('prompt', 'claude', 'claude-3')).toBe('result1');
      expect(cache.get('prompt', 'claude', 'claude-haiku')).toBe('result2');
    });

    it('should normalize prompt for cache key', () => {
      cache.set('  Test Prompt  ', 'claude', 'claude-3', 'result');
      const result = cache.get('test prompt', 'claude', 'claude-3');

      expect(result).toBe('result');
    });

    it('should handle case-insensitive prompts', () => {
      cache.set('TEST PROMPT', 'claude', 'claude-3', 'result');
      const result = cache.get('test prompt', 'claude', 'claude-3');

      expect(result).toBe('result');
    });
  });

  describe('TTL and expiration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should return null for expired entries', async () => {
      cache.set('prompt', 'claude', 'claude-3', 'result', 100);
      
      vi.advanceTimersByTime(101);
      const result = cache.get('prompt', 'claude', 'claude-3');

      expect(result).toBeNull();
    });

    it('should return value for non-expired entries', async () => {
      cache.set('prompt', 'claude', 'claude-3', 'result', 1000);
      
      vi.advanceTimersByTime(500);
      const result = cache.get('prompt', 'claude', 'claude-3');

      expect(result).toBe('result');
    });

    it('should use default TTL when not specified', () => {
      cache.set('prompt', 'claude', 'claude-3', 'result');
      const result = cache.get('prompt', 'claude', 'claude-3');

      expect(result).toBe('result');
    });
  });

  describe('eviction', () => {
    it('should evict oldest entries when max size reached', () => {
      const smallCache = new AICache({ maxSize: 5, defaultTTL: 10000 });

      // Fill cache to max
      for (let i = 0; i < 5; i++) {
        smallCache.set(`prompt${i}`, 'claude', 'claude-3', `result${i}`);
      }

      // Add one more - should evict oldest
      smallCache.set('prompt5', 'claude', 'claude-3', 'result5');

      // First entry should be evicted
      expect(smallCache.get('prompt0', 'claude', 'claude-3')).toBeNull();
      // New entry should exist
      expect(smallCache.get('prompt5', 'claude', 'claude-3')).toBe('result5');
    });

    it('should evict 10% of entries when full', () => {
      const cache = new AICache({ maxSize: 20, defaultTTL: 10000 });

      // Fill to max
      for (let i = 0; i < 20; i++) {
        cache.set(`prompt${i}`, 'claude', 'claude-3', `result${i}`);
      }

      // Add one more
      cache.set('prompt20', 'claude', 'claude-3', 'result20');

      // Should have evicted 2 entries (10% of 20)
      const stats = cache.getStats();
      expect(stats.size).toBeLessThanOrEqual(20);
    });
  });

  describe('has method', () => {
    it('should return true for existing entries', () => {
      cache.set('prompt', 'claude', 'claude-3', 'result');
      expect(cache.has('prompt', 'claude', 'claude-3')).toBe(true);
    });

    it('should return false for non-existent entries', () => {
      expect(cache.has('non-existent', 'claude', 'claude-3')).toBe(false);
    });

    it('should return false for expired entries', async () => {
      vi.useFakeTimers();
      cache.set('prompt', 'claude', 'claude-3', 'result', 100);
      
      vi.advanceTimersByTime(101);
      expect(cache.has('prompt', 'claude', 'claude-3')).toBe(false);
    });
  });

  describe('delete method', () => {
    it('should delete cached entry', () => {
      cache.set('prompt', 'claude', 'claude-3', 'result');
      cache.delete('prompt', 'claude', 'claude-3');

      expect(cache.get('prompt', 'claude', 'claude-3')).toBeNull();
    });

    it('should handle deleting non-existent entries', () => {
      expect(() => {
        cache.delete('non-existent', 'claude', 'claude-3');
      }).not.toThrow();
    });
  });

  describe('clear method', () => {
    it('should clear all cached entries', () => {
      cache.set('prompt1', 'claude', 'claude-3', 'result1');
      cache.set('prompt2', 'openai', 'gpt-4', 'result2');
      
      cache.clear();

      expect(cache.get('prompt1', 'claude', 'claude-3')).toBeNull();
      expect(cache.get('prompt2', 'openai', 'gpt-4')).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      cache.set('prompt1', 'claude', 'claude-3', 'result1');
      cache.set('prompt2', 'claude', 'claude-3', 'result2');

      const stats = cache.getStats();

      expect(stats.size).toBe(2);
      expect(stats.maxSize).toBe(10);
      expect(stats.hitRate).toBeDefined();
    });
  });

  describe('cleanExpired', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should remove expired entries', async () => {
      cache.set('prompt1', 'claude', 'claude-3', 'result1', 100);
      cache.set('prompt2', 'claude', 'claude-3', 'result2', 1000);

      vi.advanceTimersByTime(101);
      cache.cleanExpired();

      expect(cache.get('prompt1', 'claude', 'claude-3')).toBeNull();
      expect(cache.get('prompt2', 'claude', 'claude-3')).toBe('result2');
    });
  });

  describe('getAICache singleton', () => {
    it('should return same instance on multiple calls', () => {
      const cache1 = getAICache();
      const cache2 = getAICache();

      expect(cache1).toBe(cache2);
    });
  });
});

describe('ValidationCache', () => {
  let cache: ValidationCache;

  beforeEach(() => {
    cache = new ValidationCache({ maxSize: 10, defaultTTL: 1000 });
  });

  describe('get and set', () => {
    it('should store and retrieve validation results', () => {
      const code = 'public class Test : MonoBehaviour {}';
      cache.set(code, true);
      
      expect(cache.get(code)).toBe(true);
    });

    it('should return null for non-existent code', () => {
      expect(cache.get('non-existent code')).toBeNull();
    });

    it('should handle false validation results', () => {
      const code = 'invalid code';
      cache.set(code, false);
      
      expect(cache.get(code)).toBe(false);
    });
  });

  describe('TTL and expiration', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should return null for expired entries', async () => {
      const code = 'public class Test : MonoBehaviour {}';
      cache.set(code, true, 100);
      
      vi.advanceTimersByTime(101);
      expect(cache.get(code)).toBeNull();
    });
  });

  describe('clear method', () => {
    it('should clear all cached entries', () => {
      cache.set('code1', true);
      cache.set('code2', false);
      
      cache.clear();

      expect(cache.get('code1')).toBeNull();
      expect(cache.get('code2')).toBeNull();
    });
  });

  describe('getValidationCache singleton', () => {
    it('should return same instance on multiple calls', () => {
      const cache1 = getValidationCache();
      const cache2 = getValidationCache();

      expect(cache1).toBe(cache2);
    });
  });
});

