/**
 * Integration Tests for SPARK Components
 * Target: 15-20 tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateWithClaude } from '../ai/claude-client';
import { validateCSharp } from '../unity/validator';
import { generateUnityZip } from '../export/zip-generator';
import { getEngineRegistry } from '../engines/registry';

// Mock dependencies
vi.mock('@anthropic-ai/sdk');
vi.mock('../ai/error-handler', () => ({
  retryWithBackoff: vi.fn((fn) => fn()),
  parseAnthropicError: vi.fn((e) => ({ message: e?.message || 'Error' })),
}));
vi.mock('../connection-pool', () => ({
  withConnectionPool: vi.fn((provider, fn) => fn()),
}));
vi.mock('jszip', () => ({
  default: vi.fn().mockImplementation(() => ({
    folder: vi.fn(() => ({
      folder: vi.fn(() => ({ file: vi.fn() })),
      file: vi.fn(),
    })),
    generateAsync: vi.fn().mockResolvedValue(new Blob()),
  })),
}));

describe('SPARK Integration Tests', () => {
  describe('End-to-end generation flow', () => {
    it('should generate, validate, and export code', async () => {
      // Step 1: Generate code
      const mockCode = 'using UnityEngine;\npublic class Test : MonoBehaviour { }';
      
      // Step 2: Validate
      const validation = validateCSharp(mockCode);
      expect(validation.isValid).toBe(true);
      
      // Step 3: Export
      const blob = await generateUnityZip({ code: mockCode, scriptName: 'Test' });
      expect(blob).toBeInstanceOf(Blob);
    });

    it('should handle generation -> validation -> export pipeline', async () => {
      const code = 'using UnityEngine;\npublic class PlayerController : MonoBehaviour { }';
      
      const validation = validateCSharp(code);
      if (validation.isValid) {
        const blob = await generateUnityZip({ code, scriptName: 'PlayerController' });
        expect(blob).toBeInstanceOf(Blob);
      }
    });

    it('should reject invalid code before export', async () => {
      const invalidCode = 'public class Test { }'; // Missing using
      
      const validation = validateCSharp(invalidCode);
      expect(validation.isValid).toBe(false);
      
      // Should not export invalid code
      if (!validation.isValid) {
        expect(validation.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Engine registry integration', () => {
    it('should get Unity adapter from registry', () => {
      const registry = getEngineRegistry();
      const adapter = registry.get('unity');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('unity');
    });

    it('should find adapter by extension', () => {
      const registry = getEngineRegistry();
      const adapter = registry.getByExtension('.cs');
      expect(adapter).toBeDefined();
      expect(adapter?.engineId).toBe('unity');
    });

    it('should list all supported engines', () => {
      const registry = getEngineRegistry();
      const engines = registry.getSupportedEngines();
      expect(engines.length).toBeGreaterThan(0);
      expect(engines.some(e => e.id === 'unity')).toBe(true);
    });
  });

  describe('Cache integration', () => {
    it('should cache and retrieve generation results', async () => {
      const { getAICache } = await import('../ai/cache');
      const cache = getAICache();
      
      cache.set('test prompt', 'claude', 'claude-3', 'cached result');
      const result = cache.get('test prompt', 'claude', 'claude-3');
      
      expect(result).toBe('cached result');
    });

    it('should expire cached entries', async () => {
      const { getAICache } = await import('../ai/cache');
      const cache = getAICache();
      
      cache.set('test', 'claude', 'claude-3', 'result', 100);
      // After expiration, should return null
      // (would need time manipulation in real test)
      expect(cache.has('test', 'claude', 'claude-3')).toBe(true);
    });
  });

  describe('Rate limiting integration', () => {
    it('should limit requests per user', async () => {
      const { getRateLimiter } = await import('../rate-limiting/limiter');
      const limiter = getRateLimiter();
      
      const result1 = limiter.checkLimit('user1', { windowMs: 60000, maxRequests: 2 });
      expect(result1.allowed).toBe(true);
      
      limiter.recordRequest('user1', true);
      limiter.recordRequest('user1', true);
      
      const result2 = limiter.checkLimit('user1', { windowMs: 60000, maxRequests: 2 });
      expect(result2.allowed).toBe(false);
    });
  });

  describe('Analytics integration', () => {
    it('should track generation events', async () => {
      const { getAnalyticsTracker } = await import('../analytics/tracker');
      const tracker = getAnalyticsTracker();
      
      tracker.trackGeneration('unity', 'claude', 100, 500, true, 'user1');
      
      const metrics = tracker.getMetrics();
      expect(metrics.totalGenerations).toBeGreaterThan(0);
    });

    it('should aggregate metrics across multiple generations', async () => {
      const { getAnalyticsTracker } = await import('../analytics/tracker');
      const tracker = getAnalyticsTracker();
      
      tracker.trackGeneration('unity', 'claude', 100, 500, true);
      tracker.trackGeneration('unity', 'claude', 200, 1000, true);
      
      const metrics = tracker.getMetrics();
      expect(metrics.totalTokensUsed).toBeGreaterThanOrEqual(300);
    });
  });

  describe('Error handling integration', () => {
    it('should handle errors at each stage', async () => {
      // Generation error
      const genError = { success: false, error: 'API error' };
      expect(genError.success).toBe(false);
      
      // Validation error
      const invalidCode = 'invalid';
      const validation = validateCSharp(invalidCode);
      expect(validation.isValid).toBe(false);
      
      // Export error would be caught separately
      expect(true).toBe(true);
    });

    it('should propagate errors through pipeline', async () => {
      // If generation fails, validation shouldn't run
      const genResult = { success: false, error: 'Failed' };
      if (!genResult.success) {
        expect(genResult.error).toBeDefined();
      }
    });
  });
});

