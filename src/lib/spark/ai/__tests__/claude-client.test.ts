/**
 * Comprehensive Unit Tests for Claude Client
 * Target: 15-20 tests covering all scenarios
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWithClaude, type GenerateResult, type ClaudeModel } from '../claude-client';
import Anthropic from '@anthropic-ai/sdk';

// Mock Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      messages: {
        create: vi.fn(),
      },
    })),
  };
});

// Mock error handler
vi.mock('../error-handler', () => ({
  retryWithBackoff: vi.fn((fn) => fn()),
  parseAnthropicError: vi.fn((error) => ({
    message: error?.message || 'Unknown error',
    provider: 'claude',
    code: 'unknown_error',
    statusCode: 500,
    retryable: false,
  })),
}));

// Mock connection pool
vi.mock('../connection-pool', () => ({
  withConnectionPool: vi.fn((provider, fn) => fn()),
}));

describe('Claude Client - generateWithClaude', () => {
  let mockAnthropic: any;
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.ANTHROPIC_API_KEY;
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
    
    mockAnthropic = new Anthropic();
    // Setup default mock response
    mockAnthropic.messages.create = vi.fn().mockResolvedValue({
      content: [{
        type: 'text',
        text: 'using UnityEngine;\n\npublic class Test : MonoBehaviour { }',
      }],
      usage: {
        input_tokens: 100,
        output_tokens: 50,
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.ANTHROPIC_API_KEY = originalEnv;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
  });

  describe('when API key is configured', () => {
    it('should generate code successfully with valid response', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: 'using UnityEngine;\n\npublic class PlayerController : MonoBehaviour {\n    void Update() {}\n}',
        }],
        usage: {
          input_tokens: 100,
          output_tokens: 50,
        },
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithClaude('Create a player controller');

      expect(result.success).toBe(true);
      expect(result.code).toContain('PlayerController');
      expect(result.scriptName).toBe('PlayerController');
      expect(result.tokensUsed).toBe(150);
      expect(result.inputTokens).toBe(100);
      expect(result.outputTokens).toBe(50);
    });

    it('should extract script name from class declaration', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: 'using UnityEngine;\n\npublic class EnemyAI : MonoBehaviour {}',
        }],
        usage: { input_tokens: 50, output_tokens: 30 },
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithClaude('Create enemy AI');

      expect(result.success).toBe(true);
      expect(result.scriptName).toBe('EnemyAI');
    });

    it('should use default script name when class not found', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: 'using UnityEngine;\n\n// Some code without class declaration',
        }],
        usage: { input_tokens: 50, output_tokens: 30 },
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithClaude('Create something');

      expect(result.success).toBe(true);
      expect(result.scriptName).toBe('GeneratedScript');
    });

    it('should handle different Claude models', async () => {
      const models: ClaudeModel[] = [
        'claude-sonnet-3-5-20241022',
        'claude-3-5-sonnet-20240620',
        'claude-3-haiku-20240307',
      ];

      for (const model of models) {
        const mockResponse = {
          content: [{ type: 'text', text: 'public class Test : MonoBehaviour {}' }],
          usage: { input_tokens: 50, output_tokens: 30 },
        };

        mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

        const result = await generateWithClaude('Test', model);

        expect(result.success).toBe(true);
        expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
          expect.objectContaining({ model })
        );
      }
    });

    it('should handle empty response text', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: '' }],
        usage: { input_tokens: 50, output_tokens: 0 },
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithClaude('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No code generated. Please try again.');
      expect(result.tokensUsed).toBe(50);
    });

    it('should handle missing usage information', async () => {
      const mockResponse = {
        content: [{
          type: 'text',
          text: 'public class Test : MonoBehaviour {}',
        }],
        usage: undefined,
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithClaude('Test');

      expect(result.success).toBe(true);
      expect(result.tokensUsed).toBe(0);
      expect(result.inputTokens).toBe(0);
      expect(result.outputTokens).toBe(0);
    });
  });

  describe('when API key is not configured', () => {
    it('should return error when ANTHROPIC_API_KEY is missing', async () => {
      delete process.env.ANTHROPIC_API_KEY;

      const result = await generateWithClaude('Test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('ANTHROPIC_API_KEY');
      expect(mockAnthropic.messages.create).not.toHaveBeenCalled();
    });

    it('should return error when ANTHROPIC_API_KEY is empty', async () => {
      process.env.ANTHROPIC_API_KEY = '';

      const result = await generateWithClaude('Test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('ANTHROPIC_API_KEY');
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      const apiError = new Error('API rate limit exceeded');
      mockAnthropic.messages.create = vi.fn().mockRejectedValue(apiError);

      const { parseAnthropicError } = await import('../error-handler');
      vi.mocked(parseAnthropicError).mockReturnValue({
        message: 'Rate limit exceeded',
        provider: 'claude',
        code: 'rate_limit_error',
        statusCode: 429,
        retryable: true,
      } as any);

      const result = await generateWithClaude('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Rate limit exceeded');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network timeout');
      mockAnthropic.messages.create = vi.fn().mockRejectedValue(networkError);

      const { parseAnthropicError } = await import('../error-handler');
      vi.mocked(parseAnthropicError).mockReturnValue({
        message: 'Network error',
        provider: 'claude',
        code: 'network_error',
        statusCode: undefined,
        retryable: true,
      } as any);

      const result = await generateWithClaude('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle authentication errors', async () => {
      const authError = new Error('Invalid API key');
      mockAnthropic.messages.create = vi.fn().mockRejectedValue(authError);

      const { parseAnthropicError } = await import('../error-handler');
      vi.mocked(parseAnthropicError).mockReturnValue({
        message: 'Invalid API key',
        provider: 'claude',
        code: 'authentication_error',
        statusCode: 401,
        retryable: false,
      } as any);

      const result = await generateWithClaude('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid API key');
    });
  });

  describe('prompt handling', () => {
    it('should include system prompt in API call', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'public class Test : MonoBehaviour {}' }],
        usage: { input_tokens: 50, output_tokens: 30 },
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      await generateWithClaude('Create a test script');

      expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining('Create a test script'),
            }),
          ]),
        })
      );
    });

    it('should use default model when not specified', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'public class Test : MonoBehaviour {}' }],
        usage: { input_tokens: 50, output_tokens: 30 },
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      await generateWithClaude('Test');

      expect(mockAnthropic.messages.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'claude-sonnet-3-5-20241022',
        })
      );
    });
  });

  describe('token counting', () => {
    it('should correctly calculate total tokens', async () => {
      const mockResponse = {
        content: [{ type: 'text', text: 'public class Test : MonoBehaviour {}' }],
        usage: {
          input_tokens: 150,
          output_tokens: 75,
        },
      };

      mockAnthropic.messages.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithClaude('Test');

      expect(result.tokensUsed).toBe(225);
      expect(result.inputTokens).toBe(150);
      expect(result.outputTokens).toBe(75);
    });
  });
});

