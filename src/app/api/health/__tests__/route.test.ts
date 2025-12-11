import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { query } from '@/lib/database/postgres-client';

// Mock database client
vi.mock('@/lib/database/postgres-client', () => ({
  query: vi.fn(),
}));

describe('Health API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.memoryUsage mock
    vi.spyOn(process, 'memoryUsage').mockReturnValue({
      heapUsed: 50 * 1024 * 1024, // 50MB
      heapTotal: 100 * 1024 * 1024, // 100MB
      external: 0,
      rss: 0,
      arrayBuffers: 0,
    } as NodeJS.MemoryUsage);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return healthy status when all checks pass', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [{ '?column?': 1 }] } as any);

      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.checks.database).toBe('healthy');
      expect(data.checks.memory).toBe('healthy');
      expect(data.timestamp).toBeDefined();
    });

    it('should return unhealthy status when database check fails', async () => {
      vi.mocked(query).mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.status).toBe('unhealthy');
      expect(data.checks.database).toBe('unhealthy');
    });

    it('should return memory warning when memory usage is high', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [{ '?column?': 1 }] } as any);
      vi.spyOn(process, 'memoryUsage').mockReturnValue({
        heapUsed: 95 * 1024 * 1024, // 95MB (high usage)
        heapTotal: 100 * 1024 * 1024, // 100MB
        external: 0,
        rss: 0,
        arrayBuffers: 0,
      } as NodeJS.MemoryUsage);

      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.checks.memory).toBe('warning');
    });

    it('should include timestamp in response', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [{ '?column?': 1 }] } as any);

      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);
      const data = await response.json();

      expect(data.timestamp).toBeDefined();
      expect(new Date(data.timestamp).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should check database connection', async () => {
      vi.mocked(query).mockResolvedValue({ rows: [{ '?column?': 1 }] } as any);

      const request = new NextRequest('http://localhost:3000/api/health');
      await GET(request);

      expect(query).toHaveBeenCalledWith('SELECT 1');
    });

    it('should handle database timeout gracefully', async () => {
      vi.mocked(query).mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      const request = new NextRequest('http://localhost:3000/api/health');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(503);
      expect(data.checks.database).toBe('unhealthy');
    });
  });
});
