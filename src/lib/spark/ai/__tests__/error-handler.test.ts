/**
 * Comprehensive Unit Tests for AI Error Handler
 * Target: 15-20 tests covering retry logic and error parsing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  retryWithBackoff,
  isRetryableError,
  parseAnthropicError,
  parseOpenAIError,
  AIError,
  type RetryOptions,
} from '../error-handler';

describe('AI Error Handler', () => {
  describe('isRetryableError', () => {
    it('should return true for AIError with retryable flag', () => {
      const error = new AIError('Rate limit', 'claude', 'rate_limit', 429, true);
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for AIError with non-retryable flag', () => {
      const error = new AIError('Auth error', 'claude', 'auth_error', 401, false);
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return true for network errors', () => {
      const error = new Error('Network timeout');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for connection refused errors', () => {
      const error = new Error('ECONNREFUSED');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for rate limit errors', () => {
      const error = new Error('Rate limit exceeded');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for 429 status codes', () => {
      const error = new Error('HTTP 429 Too Many Requests');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for server errors (500-504)', () => {
      const errors = [
        new Error('HTTP 500 Internal Server Error'),
        new Error('HTTP 502 Bad Gateway'),
        new Error('HTTP 503 Service Unavailable'),
        new Error('HTTP 504 Gateway Timeout'),
      ];

      errors.forEach((error) => {
        expect(isRetryableError(error)).toBe(true);
      });
    });

    it('should return true for overloaded errors', () => {
      const error = new Error('Service temporarily unavailable');
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for non-retryable errors', () => {
      const error = new Error('Invalid request');
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('retryWithBackoff', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on retryable errors', async () => {
      const retryableError = new AIError('Rate limit', 'claude', 'rate_limit', 429, true);
      const fn = vi.fn()
        .mockRejectedValueOnce(retryableError)
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, { maxRetries: 3, initialDelayMs: 100 });
      
      await vi.advanceTimersByTimeAsync(100);
      const result = await promise;

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry on non-retryable errors', async () => {
      const nonRetryableError = new AIError('Auth error', 'claude', 'auth_error', 401, false);
      const fn = vi.fn().mockRejectedValue(nonRetryableError);

      await expect(retryWithBackoff(fn)).rejects.toThrow();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should respect maxRetries limit', async () => {
      const retryableError = new AIError('Rate limit', 'claude', 'rate_limit', 429, true);
      const fn = vi.fn().mockRejectedValue(retryableError);

      const promise = retryWithBackoff(fn, { maxRetries: 2, initialDelayMs: 100 });
      
      await vi.advanceTimersByTimeAsync(300);
      await expect(promise).rejects.toThrow();

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should use exponential backoff', async () => {
      const retryableError = new AIError('Rate limit', 'claude', 'rate_limit', 429, true);
      const fn = vi.fn()
        .mockRejectedValueOnce(retryableError)
        .mockRejectedValueOnce(retryableError)
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelayMs: 100,
        backoffMultiplier: 2,
      });

      // First retry after 100ms
      await vi.advanceTimersByTimeAsync(100);
      // Second retry after 200ms (100 * 2)
      await vi.advanceTimersByTimeAsync(200);
      
      const result = await promise;

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should respect maxDelayMs', async () => {
      const retryableError = new AIError('Rate limit', 'claude', 'rate_limit', 429, true);
      const fn = vi.fn()
        .mockRejectedValueOnce(retryableError)
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(fn, {
        maxRetries: 3,
        initialDelayMs: 1000,
        maxDelayMs: 2000,
        backoffMultiplier: 3,
      });

      // Should cap at 2000ms, not 3000ms
      await vi.advanceTimersByTimeAsync(2000);
      const result = await promise;

      expect(result).toBe('success');
    });

    it('should use default options when not provided', async () => {
      const fn = vi.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(fn);

      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('parseAnthropicError', () => {
    it('should parse API key errors', () => {
      const error = new Error('Invalid api_key');
      const result = parseAnthropicError(error);

      expect(result.provider).toBe('claude');
      expect(result.code).toBe('authentication_error');
      expect(result.statusCode).toBe(401);
      expect(result.retryable).toBe(false);
    });

    it('should parse rate limit errors', () => {
      const error = new Error('rate_limit');
      const result = parseAnthropicError(error);

      expect(result.provider).toBe('claude');
      expect(result.code).toBe('rate_limit_error');
      expect(result.statusCode).toBe(429);
      expect(result.retryable).toBe(true);
    });

    it('should parse overloaded errors', () => {
      const error = new Error('overloaded_error');
      const result = parseAnthropicError(error);

      expect(result.provider).toBe('claude');
      expect(result.code).toBe('overloaded_error');
      expect(result.statusCode).toBe(529);
      expect(result.retryable).toBe(true);
    });

    it('should parse server errors', () => {
      const errors = [
        new Error('HTTP 500'),
        new Error('HTTP 502'),
        new Error('HTTP 503'),
      ];

      errors.forEach((error) => {
        const result = parseAnthropicError(error);
        expect(result.provider).toBe('claude');
        expect(result.code).toBe('server_error');
        expect(result.statusCode).toBe(500);
        expect(result.retryable).toBe(true);
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Some unknown error');
      const result = parseAnthropicError(error);

      expect(result.provider).toBe('claude');
      expect(result.code).toBe('unknown_error');
      expect(result.retryable).toBe(false);
    });

    it('should handle non-Error objects', () => {
      const result = parseAnthropicError('string error');

      expect(result.provider).toBe('claude');
      expect(result.code).toBe('unknown_error');
      expect(result.retryable).toBe(false);
    });
  });

  describe('parseOpenAIError', () => {
    it('should parse API key errors', () => {
      const error = new Error('Invalid authentication');
      const result = parseOpenAIError(error);

      expect(result.provider).toBe('openai');
      expect(result.code).toBe('authentication_error');
      expect(result.statusCode).toBe(401);
      expect(result.retryable).toBe(false);
    });

    it('should parse rate limit errors', () => {
      const error = new Error('rate_limit');
      const result = parseOpenAIError(error);

      expect(result.provider).toBe('openai');
      expect(result.code).toBe('rate_limit_error');
      expect(result.statusCode).toBe(429);
      expect(result.retryable).toBe(true);
    });

    it('should parse quota exceeded errors', () => {
      const error = new Error('Insufficient quota');
      const result = parseOpenAIError(error);

      expect(result.provider).toBe('openai');
      expect(result.code).toBe('quota_exceeded');
      expect(result.statusCode).toBe(429);
      expect(result.retryable).toBe(false);
    });

    it('should parse model not found errors', () => {
      const error = new Error('model does not exist');
      const result = parseOpenAIError(error);

      expect(result.provider).toBe('openai');
      expect(result.code).toBe('model_not_found');
      expect(result.statusCode).toBe(404);
      expect(result.retryable).toBe(false);
    });

    it('should parse server errors', () => {
      const errors = [
        new Error('HTTP 500'),
        new Error('HTTP 502'),
        new Error('HTTP 503'),
      ];

      errors.forEach((error) => {
        const result = parseOpenAIError(error);
        expect(result.provider).toBe('openai');
        expect(result.code).toBe('server_error');
        expect(result.statusCode).toBe(500);
        expect(result.retryable).toBe(true);
      });
    });

    it('should handle unknown errors', () => {
      const error = new Error('Some unknown error');
      const result = parseOpenAIError(error);

      expect(result.provider).toBe('openai');
      expect(result.code).toBe('unknown_error');
      expect(result.retryable).toBe(false);
    });

    it('should handle non-Error objects', () => {
      const result = parseOpenAIError('string error');

      expect(result.provider).toBe('openai');
      expect(result.code).toBe('unknown_error');
      expect(result.retryable).toBe(false);
    });
  });

  describe('AIError class', () => {
    it('should create error with all properties', () => {
      const error = new AIError(
        'Test error',
        'claude',
        'test_code',
        500,
        true
      );

      expect(error.message).toBe('Test error');
      expect(error.provider).toBe('claude');
      expect(error.code).toBe('test_code');
      expect(error.statusCode).toBe(500);
      expect(error.retryable).toBe(true);
      expect(error.name).toBe('AIError');
    });

    it('should default retryable to false', () => {
      const error = new AIError('Test', 'openai');
      expect(error.retryable).toBe(false);
    });
  });
});

