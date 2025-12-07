/**
 * Unit Tests for Export API Route
 * Target: 15-20 tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/spark/export/zip-generator', () => ({
  generateUnityZip: vi.fn(),
}));

vi.mock('@/lib/security/rate-limiter', () => ({
  rateLimiters: {
    standard: {
      middleware: vi.fn(),
    },
  },
}));

vi.mock('@/lib/spark/monitoring/request-logger', () => ({
  logRequest: vi.fn(),
  logError: vi.fn(),
}));

describe('Export API Route - POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should export ZIP successfully', async () => {
    const { generateUnityZip } = await import('@/lib/spark/export/zip-generator');
    const { rateLimiters } = await import('@/lib/security/rate-limiter');

    const mockBlob = new Blob(['zip content'], { type: 'application/zip' });
    vi.mocked(generateUnityZip).mockResolvedValue(mockBlob);
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({
        code: 'using UnityEngine;\npublic class Test : MonoBehaviour { }',
        scriptName: 'Test',
      }),
    });

    const response = await POST(request);
    const blob = await response.blob();

    expect(response.status).toBe(200);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('should return 429 on rate limit', async () => {
    const { rateLimiters } = await import('@/lib/security/rate-limiter');
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(
      new Response(JSON.stringify({ error: 'Rate limited' }), { status: 429 })
    );

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ code: 'test', scriptName: 'Test' }),
    });

    const response = await POST(request);

    expect(response.status).toBe(429);
  });

  it('should return 400 for empty code', async () => {
    const { rateLimiters } = await import('@/lib/security/rate-limiter');
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ code: '', scriptName: 'Test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid or empty code');
  });

  it('should return 400 for missing code', async () => {
    const { rateLimiters } = await import('@/lib/security/rate-limiter');
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ scriptName: 'Test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid or empty code');
  });

  it('should return 400 for empty script name', async () => {
    const { rateLimiters } = await import('@/lib/security/rate-limiter');
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ code: 'test code', scriptName: '' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Invalid or empty scriptName');
  });

  it('should validate script name format', async () => {
    const { rateLimiters } = await import('@/lib/security/rate-limiter');
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ code: 'test code', scriptName: '123Invalid' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('valid C# identifier');
  });

  it('should accept valid script names', async () => {
    const { generateUnityZip } = await import('@/lib/spark/export/zip-generator');
    const { rateLimiters } = await import('@/lib/security/rate-limiter');

    vi.mocked(generateUnityZip).mockResolvedValue(new Blob());
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const validNames = ['TestScript', 'Test_Script', '_TestScript'];

    for (const name of validNames) {
      const request = new NextRequest('http://localhost/api/export', {
        method: 'POST',
        body: JSON.stringify({ code: 'test code', scriptName: name }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    }
  });

  it('should handle ZIP generation errors', async () => {
    const { generateUnityZip } = await import('@/lib/spark/export/zip-generator');
    const { rateLimiters } = await import('@/lib/security/rate-limiter');

    vi.mocked(generateUnityZip).mockRejectedValue(new Error('ZIP generation failed'));
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ code: 'test code', scriptName: 'Test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeDefined();
  });

  it('should set correct content type headers', async () => {
    const { generateUnityZip } = await import('@/lib/spark/export/zip-generator');
    const { rateLimiters } = await import('@/lib/security/rate-limiter');

    vi.mocked(generateUnityZip).mockResolvedValue(new Blob());
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ code: 'test code', scriptName: 'Test' }),
    });

    const response = await POST(request);

    expect(response.headers.get('content-type')).toContain('application/zip');
  });

  it('should log requests', async () => {
    const { generateUnityZip } = await import('@/lib/spark/export/zip-generator');
    const { rateLimiters } = await import('@/lib/security/rate-limiter');
    const { logRequest } = await import('@/lib/spark/monitoring/request-logger');

    vi.mocked(generateUnityZip).mockResolvedValue(new Blob());
    vi.mocked(rateLimiters.standard.middleware).mockResolvedValue(null);

    const request = new NextRequest('http://localhost/api/export', {
      method: 'POST',
      body: JSON.stringify({ code: 'test code', scriptName: 'Test' }),
    });

    await POST(request);

    expect(logRequest).toHaveBeenCalled();
  });
});

