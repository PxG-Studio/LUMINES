import { describe, it, expect, beforeAll, vi } from 'vitest';

// Mock the Anthropic SDK
vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class Anthropic {
      messages = {
        create: vi.fn().mockResolvedValue({
          content: [{
            type: 'text',
            text: `using UnityEngine;
using System.Collections;

/// <summary>
/// A simple PlayerController
/// </summary>
public class PlayerController : MonoBehaviour
{
    void Update()
    {
        float h = Input.GetAxis("Horizontal");
        float v = Input.GetAxis("Vertical");
        transform.Translate(new Vector3(h, 0, v) * Time.deltaTime);
    }
}`
          }]
        })
      };
    }
  };
});

import { generateWithClaude } from '../lib/ai/claude-client';

describe('Claude API Integration', () => {
  beforeAll(() => {
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'your_anthropic_key_here') {
      console.warn('⚠️  ANTHROPIC_API_KEY not configured. Skipping integration tests.');
    }
  });

  it('should generate a simple Unity script', async () => {
    // Set a mock API key for testing
    process.env.ANTHROPIC_API_KEY = 'test-key';

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
    // Set a mock API key for testing
    process.env.ANTHROPIC_API_KEY = 'test-key';

    const result = await generateWithClaude(
      'Create a Coin script that rotates',
      'claude-sonnet-3-5-20241022'
    );

    expect(result.success).toBe(true);
    expect(result.scriptName).toBeTruthy();
    expect(result.scriptName).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
  }, 30000);
});
