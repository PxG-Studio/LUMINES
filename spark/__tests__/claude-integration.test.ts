import { describe, it, expect, beforeAll } from 'vitest';
import { generateWithClaude } from '../lib/ai/claude-client';

describe('Claude API Integration', () => {
  beforeAll(() => {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_key_here') {
      console.warn('⚠️  ANTHROPIC_API_KEY not configured. Skipping integration tests.');
    }
  });

  it('should generate a simple Unity script', async () => {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_key_here') {
      console.log('Skipping test - API key not configured');
      return;
    }

    const result = await generateWithClaude(
      'Create a simple PlayerController that moves with WASD keys',
      'claude-sonnet-3-5-20241022'
    );

    expect(result.success).toBe(true);
    expect(result.code).toBeDefined();
    expect(result.scriptName).toBeDefined();
    expect(result.code).toContain('using UnityEngine');
    expect(result.code).toContain('class');
  }, 30000);

  it('should handle API errors gracefully', async () => {
    const originalKey = process.env.ANTHROPIC_API_KEY;
    process.env.ANTHROPIC_API_KEY = '';

    const result = await generateWithClaude('test');

    expect(result.success).toBe(false);
    expect(result.error).toContain('API key not configured');

    process.env.ANTHROPIC_API_KEY = originalKey;
  });

  it('should extract script name from generated code', async () => {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_key_here') {
      console.log('Skipping test - API key not configured');
      return;
    }

    const result = await generateWithClaude(
      'Create a Coin script that rotates',
      'claude-sonnet-3-5-20241022'
    );

    expect(result.success).toBe(true);
    expect(result.scriptName).toBeTruthy();
    expect(result.scriptName).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
  }, 30000);
});
