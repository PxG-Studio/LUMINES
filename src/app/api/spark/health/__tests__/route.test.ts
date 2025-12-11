/**
 * Unit Tests for Health Check API Route
 * Target: 8-10 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../route';

describe('Health Check API Route - GET', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should return healthy status when API keys are configured', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    process.env.OPENAI_API_KEY = 'test-key';

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('healthy');
    expect(data.checks.apiKeys.status).toBe('configured');
  });

  it('should return degraded status when no API keys', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.status).toBe('degraded');
    expect(data.checks.apiKeys.status).toBe('missing');
  });

  it('should return healthy with only Anthropic key', async () => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    delete process.env.OPENAI_API_KEY;

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.checks.apiKeys.anthropic).toBe(true);
  });

  it('should return healthy with only OpenAI key', async () => {
    delete process.env.ANTHROPIC_API_KEY;
    process.env.OPENAI_API_KEY = 'test-key';

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.checks.apiKeys.openai).toBe(true);
  });

  it('should include timestamp in response', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.timestamp).toBeDefined();
    expect(new Date(data.timestamp).getTime()).toBeGreaterThan(0);
  });

  it('should include service information', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.service).toBe('spark');
    expect(data.version).toBe('1.0.0');
  });

  it('should check memory usage', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data.checks.memory).toBeDefined();
    expect(['healthy', 'warning']).toContain(data.checks.memory);
  });

  it('should return correct structure', async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('service');
    expect(data).toHaveProperty('version');
    expect(data).toHaveProperty('checks');
    expect(data.checks).toHaveProperty('apiKeys');
    expect(data.checks).toHaveProperty('memory');
  });
});

