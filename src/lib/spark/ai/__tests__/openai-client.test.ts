/**
 * Comprehensive Unit Tests for OpenAI Client
 * Target: 15-20 tests covering all scenarios
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateWithOpenAI, type GenerateResult, type OpenAIModel } from '../openai-client';
import OpenAI from 'openai';

// Mock OpenAI SDK
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn(),
        },
      },
    })),
  };
});

// Mock error handler
vi.mock('../error-handler', () => ({
  retryWithBackoff: vi.fn((fn) => fn()),
  parseOpenAIError: vi.fn((error) => ({
    message: error?.message || 'Unknown error',
    provider: 'openai',
    code: 'unknown_error',
    statusCode: 500,
    retryable: false,
  })),
}));

// Mock connection pool
vi.mock('../connection-pool', () => ({
  withConnectionPool: vi.fn((provider, fn) => fn()),
}));

describe('OpenAI Client - generateWithOpenAI', () => {
  let mockOpenAI: any;
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.OPENAI_API_KEY;
    process.env.OPENAI_API_KEY = 'test-api-key';
    
    mockOpenAI = new OpenAI();
    // Setup default mock response
    mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue({
      choices: [{
        message: {
          content: 'using UnityEngine;\n\npublic class Test : MonoBehaviour { }',
        },
      }],
      usage: {
        prompt_tokens: 100,
        completion_tokens: 50,
      },
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.OPENAI_API_KEY = originalEnv;
    } else {
      delete process.env.OPENAI_API_KEY;
    }
  });

  describe('when API key is configured', () => {
    it('should generate code successfully with valid response', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'using UnityEngine;\n\npublic class PlayerController : MonoBehaviour {\n    void Update() {}\n}',
          },
        }],
        usage: {
          prompt_tokens: 100,
          completion_tokens: 50,
        },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithOpenAI('Create a player controller');

      expect(result.success).toBe(true);
      expect(result.code).toContain('PlayerController');
      expect(result.scriptName).toBe('PlayerController');
      expect(result.tokensUsed).toBe(150);
      expect(result.inputTokens).toBe(100);
      expect(result.outputTokens).toBe(50);
    });

    it('should extract script name from class declaration', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'using UnityEngine;\n\npublic class EnemyAI : MonoBehaviour {}',
          },
        }],
        usage: { prompt_tokens: 50, completion_tokens: 30 },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithOpenAI('Create enemy AI');

      expect(result.success).toBe(true);
      expect(result.scriptName).toBe('EnemyAI');
    });

    it('should use default script name when class not found', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'using UnityEngine;\n\n// Some code without class declaration',
          },
        }],
        usage: { prompt_tokens: 50, completion_tokens: 30 },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithOpenAI('Create something');

      expect(result.success).toBe(true);
      expect(result.scriptName).toBe('GeneratedScript');
    });

    it('should handle different OpenAI models', async () => {
      const models: OpenAIModel[] = ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo'];

      for (const model of models) {
        const mockResponse = {
          choices: [{ message: { content: 'public class Test : MonoBehaviour {}' } }],
          usage: { prompt_tokens: 50, completion_tokens: 30 },
        };

        mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

        const result = await generateWithOpenAI('Test', model);

        expect(result.success).toBe(true);
        expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
          expect.objectContaining({ model })
        );
      }
    });

    it('should handle empty response content', async () => {
      const mockResponse = {
        choices: [{ message: { content: '' } }],
        usage: { prompt_tokens: 50, completion_tokens: 0 },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithOpenAI('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No code generated. Please try again.');
      expect(result.tokensUsed).toBe(50);
    });

    it('should handle missing choices array', async () => {
      const mockResponse = {
        choices: [],
        usage: { prompt_tokens: 50, completion_tokens: 0 },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithOpenAI('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('No code generated. Please try again.');
    });

    it('should handle missing usage information', async () => {
      const mockResponse = {
        choices: [{
          message: {
            content: 'public class Test : MonoBehaviour {}',
          },
        }],
        usage: undefined,
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithOpenAI('Test');

      expect(result.success).toBe(true);
      expect(result.tokensUsed).toBe(0);
      expect(result.inputTokens).toBe(0);
      expect(result.outputTokens).toBe(0);
    });
  });

  describe('when API key is not configured', () => {
    it('should return error when OPENAI_API_KEY is missing', async () => {
      delete process.env.OPENAI_API_KEY;

      const result = await generateWithOpenAI('Test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('OPENAI_API_KEY');
      expect(mockOpenAI.chat.completions.create).not.toHaveBeenCalled();
    });

    it('should return error when OPENAI_API_KEY is empty', async () => {
      process.env.OPENAI_API_KEY = '';

      const result = await generateWithOpenAI('Test');

      expect(result.success).toBe(false);
      expect(result.error).toContain('OPENAI_API_KEY');
    });
  });

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      const apiError = new Error('API rate limit exceeded');
      mockOpenAI.chat.completions.create = vi.fn().mockRejectedValue(apiError);

      const { parseOpenAIError } = await import('../error-handler');
      vi.mocked(parseOpenAIError).mockReturnValue({
        message: 'Rate limit exceeded',
        provider: 'openai',
        code: 'rate_limit_error',
        statusCode: 429,
        retryable: true,
      } as any);

      const result = await generateWithOpenAI('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Rate limit exceeded');
    });

    it('should handle quota exceeded errors', async () => {
      const quotaError = new Error('Insufficient quota');
      mockOpenAI.chat.completions.create = vi.fn().mockRejectedValue(quotaError);

      const { parseOpenAIError } = await import('../error-handler');
      vi.mocked(parseOpenAIError).mockReturnValue({
        message: 'Quota exceeded',
        provider: 'openai',
        code: 'quota_exceeded',
        statusCode: 429,
        retryable: false,
      } as any);

      const result = await generateWithOpenAI('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Quota exceeded');
    });

    it('should handle model not found errors', async () => {
      const modelError = new Error('Model does not exist');
      mockOpenAI.chat.completions.create = vi.fn().mockRejectedValue(modelError);

      const { parseOpenAIError } = await import('../error-handler');
      vi.mocked(parseOpenAIError).mockReturnValue({
        message: 'Model not found',
        provider: 'openai',
        code: 'model_not_found',
        statusCode: 404,
        retryable: false,
      } as any);

      const result = await generateWithOpenAI('Test', 'gpt-4');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Model not found');
    });
  });

  describe('prompt handling', () => {
    it('should include system and user prompts in API call', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'public class Test : MonoBehaviour {}' } }],
        usage: { prompt_tokens: 50, completion_tokens: 30 },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      await generateWithOpenAI('Create a test script');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({ role: 'system' }),
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
        choices: [{ message: { content: 'public class Test : MonoBehaviour {}' } }],
        usage: { prompt_tokens: 50, completion_tokens: 30 },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      await generateWithOpenAI('Test');

      expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          model: 'gpt-4',
        })
      );
    });
  });

  describe('token counting', () => {
    it('should correctly calculate total tokens', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'public class Test : MonoBehaviour {}' } }],
        usage: {
          prompt_tokens: 200,
          completion_tokens: 100,
        },
      };

      mockOpenAI.chat.completions.create = vi.fn().mockResolvedValue(mockResponse);

      const result = await generateWithOpenAI('Test');

      expect(result.tokensUsed).toBe(300);
      expect(result.inputTokens).toBe(200);
      expect(result.outputTokens).toBe(100);
    });
  });
});

