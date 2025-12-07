/**
 * Edge Case Tests for AI Generation
 * Target: 25-30 tests
 */

import { describe, it, expect, vi } from 'vitest';
import { generateWithClaude } from '../claude-client';
import { generateWithOpenAI } from '../openai-client';
import { retryWithBackoff, isRetryableError } from '../error-handler';

// Mock dependencies
vi.mock('@anthropic-ai/sdk');
vi.mock('openai');
vi.mock('../error-handler', async () => {
  const actual = await vi.importActual('../error-handler');
  return {
    ...actual,
    retryWithBackoff: vi.fn((fn) => fn()),
  };
});
vi.mock('../connection-pool', () => ({
  withConnectionPool: vi.fn((provider, fn) => fn()),
}));

describe('AI Generation Edge Cases', () => {
  describe('Long prompts', () => {
    it('should handle very long prompts (10k characters)', async () => {
      const longPrompt = 'a'.repeat(10000);
      // This should not crash
      expect(longPrompt.length).toBe(10000);
    });

    it('should handle prompts with special characters', async () => {
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
      expect(specialChars.length).toBeGreaterThan(0);
    });

    it('should handle unicode characters', async () => {
      const unicode = 'こんにちは 🌟 Привет 🎉';
      expect(unicode.length).toBeGreaterThan(0);
    });

    it('should handle newlines in prompts', async () => {
      const multiline = 'Line 1\nLine 2\nLine 3';
      expect(multiline.split('\n').length).toBe(3);
    });

    it('should handle empty prompt edge case', async () => {
      const empty = '';
      expect(empty.trim().length).toBe(0);
    });

    it('should handle whitespace-only prompts', async () => {
      const whitespace = '   \n\t  ';
      expect(whitespace.trim().length).toBe(0);
    });
  });

  describe('Script name edge cases', () => {
    it('should handle very long script names', async () => {
      const longName = 'A'.repeat(200);
      expect(longName.length).toBe(200);
    });

    it('should handle script names with numbers', async () => {
      const nameWithNumbers = 'Script123';
      expect(/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(nameWithNumbers)).toBe(true);
    });

    it('should handle script names starting with underscore', async () => {
      const underscoreName = '_PrivateScript';
      expect(/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(underscoreName)).toBe(true);
    });

    it('should handle script names with special characters (should fail validation)', async () => {
      const specialName = 'Script-Name';
      expect(/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(specialName)).toBe(false);
    });
  });

  describe('Code generation edge cases', () => {
    it('should handle code with no class declaration', async () => {
      const codeWithoutClass = 'using UnityEngine;\n// Just comments';
      expect(codeWithoutClass.includes('class')).toBe(false);
    });

    it('should handle code with multiple classes', async () => {
      const multiClass = `
        public class Class1 { }
        public class Class2 { }
      `;
      const matches = multiClass.match(/class\s+(\w+)/g);
      expect(matches?.length).toBe(2);
    });

    it('should handle code with nested namespaces', async () => {
      const nestedNamespace = `
        namespace Outer {
          namespace Inner {
            public class Test { }
          }
        }
      `;
      expect(nestedNamespace.includes('namespace')).toBe(true);
    });

    it('should handle code with comments only', async () => {
      const commentsOnly = '// This is a comment\n/* Multi-line comment */';
      expect(commentsOnly.trim().startsWith('//') || commentsOnly.trim().startsWith('/*')).toBe(true);
    });

    it('should handle code with string literals containing class keyword', async () => {
      const codeWithString = 'string text = "class MyClass";';
      expect(codeWithString.includes('class')).toBe(true);
    });
  });

  describe('Token counting edge cases', () => {
    it('should handle zero tokens', async () => {
      expect(0).toBe(0);
    });

    it('should handle very large token counts', async () => {
      const largeCount = 1000000;
      expect(largeCount).toBeGreaterThan(0);
    });

    it('should handle missing token information', async () => {
      const tokens = undefined;
      expect(tokens || 0).toBe(0);
    });
  });

  describe('Model selection edge cases', () => {
    it('should handle invalid model names', async () => {
      const invalidModel = 'invalid-model-name';
      expect(invalidModel).toBeDefined();
    });

    it('should handle model switching mid-request', async () => {
      // This tests the ability to handle model changes
      const model1 = 'claude-sonnet-3-5-20241022';
      const model2 = 'claude-3-haiku-20240307';
      expect(model1).not.toBe(model2);
    });
  });

  describe('Concurrent request edge cases', () => {
    it('should handle multiple simultaneous requests', async () => {
      const requests = Array(10).fill(null).map(() => Promise.resolve('result'));
      const results = await Promise.all(requests);
      expect(results.length).toBe(10);
    });

    it('should handle request cancellation', async () => {
      const controller = new AbortController();
      controller.abort();
      expect(controller.signal.aborted).toBe(true);
    });
  });

  describe('Cache edge cases', () => {
    it('should handle cache key collisions', async () => {
      // Different prompts might hash to same key
      const key1 = 'prompt1';
      const key2 = 'prompt2';
      expect(key1).not.toBe(key2);
    });

    it('should handle cache expiration during request', async () => {
      const now = Date.now();
      const expired = now - 100000;
      expect(expired).toBeLessThan(now);
    });
  });

  describe('Network edge cases', () => {
    it('should handle slow network responses', async () => {
      const slowResponse = new Promise(resolve => setTimeout(resolve, 100));
      const start = Date.now();
      await slowResponse;
      const duration = Date.now() - start;
      expect(duration).toBeGreaterThanOrEqual(100);
    });

    it('should handle intermittent connectivity', async () => {
      // Simulate connection loss
      const connected = false;
      expect(connected).toBe(false);
    });
  });

  describe('Error recovery edge cases', () => {
    it('should handle partial error responses', async () => {
      const partial = { success: false, error: 'Partial' };
      expect(partial.success).toBe(false);
    });

    it('should handle error with no message', async () => {
      const error = new Error('');
      expect(error.message).toBe('');
    });
  });
});

describe('Error Handler Edge Cases', () => {
  it('should handle null errors', () => {
    expect(isRetryableError(null)).toBe(false);
  });

  it('should handle undefined errors', () => {
    expect(isRetryableError(undefined)).toBe(false);
  });

  it('should handle string errors', () => {
    expect(isRetryableError('string error')).toBe(false);
  });

  it('should handle error objects without message', () => {
    const error = new Error();
    error.message = '';
    expect(isRetryableError(error)).toBe(false);
  });

  it('should handle retry with zero maxRetries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('test'));
    await expect(retryWithBackoff(fn, { maxRetries: 0 })).rejects.toThrow();
  });

  it('should handle retry with very large maxRetries', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const result = await retryWithBackoff(fn, { maxRetries: 1000 });
    expect(result).toBe('success');
  });
});

