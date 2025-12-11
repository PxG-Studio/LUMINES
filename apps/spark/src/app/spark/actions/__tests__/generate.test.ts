/**
 * Unit Tests for Generate Server Action
 * Target: 15-20 tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateUnityScript, updateUserPrefs } from '../generate';

// Mock dependencies
vi.mock('@/lib/spark/unity/validator', () => ({
  validateCSharp: vi.fn(),
}));

vi.mock('@/lib/spark/ai/claude-client', () => ({
  generateWithClaude: vi.fn(),
}));

vi.mock('@/lib/spark/ai/openai-client', () => ({
  generateWithOpenAI: vi.fn(),
}));

vi.mock('@/lib/database/operations/spark', () => ({
  getUserPreferences: vi.fn(),
  logGeneration: vi.fn(),
  updateUserPreferences: vi.fn(),
}));

vi.mock('@/lib/spark/auth/user-context', () => ({
  getCurrentUserId: vi.fn(() => 'test-user-id'),
}));

describe('generateUnityScript', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate code successfully with Claude', async () => {
    const { generateWithClaude } = await import('@/lib/spark/ai/claude-client');
    const { validateCSharp } = await import('@/lib/spark/unity/validator');

    vi.mocked(generateWithClaude).mockResolvedValue({
      success: true,
      code: 'using UnityEngine;\npublic class Test : MonoBehaviour { }',
      scriptName: 'Test',
      tokensUsed: 100,
    });

    vi.mocked(validateCSharp).mockReturnValue({
      isValid: true,
      errors: [],
    });

    const result = await generateUnityScript('Create a test script');

    expect(result.success).toBe(true);
    expect(result.code).toContain('Test');
    expect(result.scriptName).toBe('Test');
  });

  it('should generate code successfully with OpenAI', async () => {
    const { generateWithOpenAI } = await import('@/lib/spark/ai/openai-client');
    const { validateCSharp } = await import('@/lib/spark/unity/validator');

    vi.mocked(generateWithOpenAI).mockResolvedValue({
      success: true,
      code: 'using UnityEngine;\npublic class Test : MonoBehaviour { }',
      scriptName: 'Test',
      tokensUsed: 100,
    });

    vi.mocked(validateCSharp).mockReturnValue({
      isValid: true,
      errors: [],
    });

    const result = await generateUnityScript('Create a test script', {
      provider: 'openai',
    });

    expect(result.success).toBe(true);
    expect(generateWithOpenAI).toHaveBeenCalled();
  });

  it('should use user preferences when available', async () => {
    const { getUserPreferences } = await import('@/lib/database/operations/spark');
    const { generateWithClaude } = await import('@/lib/spark/ai/claude-client');
    const { validateCSharp } = await import('@/lib/spark/unity/validator');

    vi.mocked(getUserPreferences).mockResolvedValue({
      ai_provider: 'claude',
      claude_model: 'claude-3-haiku-20240307',
    } as any);

    vi.mocked(generateWithClaude).mockResolvedValue({
      success: true,
      code: 'test code',
      scriptName: 'Test',
    });

    vi.mocked(validateCSharp).mockReturnValue({
      isValid: true,
      errors: [],
    });

    await generateUnityScript('Create test');

    expect(generateWithClaude).toHaveBeenCalledWith(
      'Create test',
      'claude-3-haiku-20240307'
    );
  });

  it('should validate generated code', async () => {
    const { generateWithClaude } = await import('@/lib/spark/ai/claude-client');
    const { validateCSharp } = await import('@/lib/spark/unity/validator');

    vi.mocked(generateWithClaude).mockResolvedValue({
      success: true,
      code: 'test code',
      scriptName: 'Test',
    });

    vi.mocked(validateCSharp).mockReturnValue({
      isValid: true,
      errors: [],
    });

    await generateUnityScript('Create test');

    expect(validateCSharp).toHaveBeenCalledWith('test code');
  });

  it('should return error when validation fails', async () => {
    const { generateWithClaude } = await import('@/lib/spark/ai/claude-client');
    const { validateCSharp } = await import('@/lib/spark/unity/validator');

    vi.mocked(generateWithClaude).mockResolvedValue({
      success: true,
      code: 'invalid code',
      scriptName: 'Test',
    });

    vi.mocked(validateCSharp).mockReturnValue({
      isValid: false,
      errors: ['Missing using statements'],
    });

    const result = await generateUnityScript('Create test');

    expect(result.success).toBe(false);
    expect(result.error).toContain('errors');
  });

  it('should handle API errors', async () => {
    const { generateWithClaude } = await import('@/lib/spark/ai/claude-client');

    vi.mocked(generateWithClaude).mockResolvedValue({
      success: false,
      error: 'API error',
    });

    const result = await generateUnityScript('Create test');

    expect(result.success).toBe(false);
    expect(result.error).toBe('API error');
  });

  it('should log generation to database', async () => {
    const { generateWithClaude } = await import('@/lib/spark/ai/claude-client');
    const { validateCSharp } = await import('@/lib/spark/unity/validator');
    const { logGeneration } = await import('@/lib/database/operations/spark');

    vi.mocked(generateWithClaude).mockResolvedValue({
      success: true,
      code: 'test code',
      scriptName: 'Test',
      tokensUsed: 100,
    });

    vi.mocked(validateCSharp).mockReturnValue({
      isValid: true,
      errors: [],
    });

    await generateUnityScript('Create test');

    expect(logGeneration).toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    const { generateWithClaude } = await import('@/lib/spark/ai/claude-client');
    const { validateCSharp } = await import('@/lib/spark/unity/validator');
    const { getUserPreferences } = await import('@/lib/database/operations/spark');

    vi.mocked(getUserPreferences).mockRejectedValue(new Error('DB error'));
    vi.mocked(generateWithClaude).mockResolvedValue({
      success: true,
      code: 'test code',
      scriptName: 'Test',
    });
    vi.mocked(validateCSharp).mockReturnValue({
      isValid: true,
      errors: [],
    });

    const result = await generateUnityScript('Create test');

    // Should still succeed despite DB error
    expect(result.success).toBe(true);
  });
});

describe('updateUserPrefs', () => {
  it('should update user preferences successfully', async () => {
    const { updateUserPreferences } = await import('@/lib/database/operations/spark');
    vi.mocked(updateUserPreferences).mockResolvedValue(undefined);

    const result = await updateUserPrefs({
      provider: 'claude',
      claudeModel: 'claude-3-haiku-20240307',
    });

    expect(result.success).toBe(true);
    expect(updateUserPreferences).toHaveBeenCalled();
  });

  it('should handle update errors', async () => {
    const { updateUserPreferences } = await import('@/lib/database/operations/spark');
    vi.mocked(updateUserPreferences).mockRejectedValue(new Error('Update failed'));

    const result = await updateUserPrefs({
      provider: 'claude',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Update failed');
  });
});

