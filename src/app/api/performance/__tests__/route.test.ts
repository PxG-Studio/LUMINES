import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { performanceMonitor } from '@/lib/monitoring/performance';
import { authenticate } from '@/lib/middleware/auth';

// Mock dependencies
vi.mock('@/lib/monitoring/performance', () => ({
  performanceMonitor: {
    getMemoryUsage: vi.fn(),
    getStats: vi.fn(),
  },
}));

vi.mock('@/lib/middleware/auth', () => ({
  authenticate: vi.fn(),
}));

describe('Performance API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authenticate).mockResolvedValue(null); // Authenticated
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/performance', () => {
    it('should return performance metrics when authenticated', async () => {
      const mockMemoryUsage = {
        heapUsed: 50 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 10 * 1024 * 1024,
        rss: 200 * 1024 * 1024,
      };

      vi.mocked(performanceMonitor.getMemoryUsage).mockReturnValue(mockMemoryUsage);
      vi.mocked(performanceMonitor.getStats).mockReturnValue({ avg: 10, min: 5, max: 20 });

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.memory).toBeDefined();
      expect(data.memory.heapUsed).toBe(mockMemoryUsage.heapUsed);
      expect(data.memory.heapUsedPercentage).toBe(50);
      expect(data.api).toBeDefined();
      expect(data.database).toBeDefined();
      expect(data.cache).toBeDefined();
    });

    it('should return 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockResolvedValue(
        NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) as any
      );

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);

      expect(response.status).toBe(401);
    });

    it('should calculate heap usage percentage correctly', async () => {
      const mockMemoryUsage = {
        heapUsed: 75 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 0,
        rss: 0,
      };

      vi.mocked(performanceMonitor.getMemoryUsage).mockReturnValue(mockMemoryUsage);
      vi.mocked(performanceMonitor.getStats).mockReturnValue({ avg: 0 });

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);
      const data = await response.json();

      expect(data.memory.heapUsedPercentage).toBe(75);
    });

    it('should handle zero heap total', async () => {
      const mockMemoryUsage = {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0,
      };

      vi.mocked(performanceMonitor.getMemoryUsage).mockReturnValue(mockMemoryUsage);
      vi.mocked(performanceMonitor.getStats).mockReturnValue({ avg: 0 });

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);
      const data = await response.json();

      expect(data.memory.heapUsedPercentage).toBe(0);
    });

    it('should return API performance stats', async () => {
      const mockStats = {
        avg: 15.5,
        min: 5,
        max: 50,
        count: 100,
      };

      vi.mocked(performanceMonitor.getMemoryUsage).mockReturnValue({
        heapUsed: 50 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 0,
        rss: 0,
      });
      vi.mocked(performanceMonitor.getStats).mockReturnValue(mockStats);

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);
      const data = await response.json();

      expect(data.api.responseTime).toEqual(mockStats);
      expect(data.api.requestDuration).toEqual(mockStats);
    });

    it('should return database performance stats', async () => {
      const mockStats = { avg: 5, min: 1, max: 10 };

      vi.mocked(performanceMonitor.getMemoryUsage).mockReturnValue({
        heapUsed: 50 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 0,
        rss: 0,
      });
      vi.mocked(performanceMonitor.getStats).mockReturnValue(mockStats);

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);
      const data = await response.json();

      expect(data.database.queryTime).toEqual(mockStats);
      expect(data.database.queryDuration).toEqual(mockStats);
    });

    it('should return cache performance stats', async () => {
      const mockStats = { avg: 1, min: 0.5, max: 2 };

      vi.mocked(performanceMonitor.getMemoryUsage).mockReturnValue({
        heapUsed: 50 * 1024 * 1024,
        heapTotal: 100 * 1024 * 1024,
        external: 0,
        rss: 0,
      });
      vi.mocked(performanceMonitor.getStats).mockReturnValue(mockStats);

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);
      const data = await response.json();

      expect(data.cache.operationTime).toEqual(mockStats);
    });

    it('should return 500 when performance monitor fails', async () => {
      vi.mocked(performanceMonitor.getMemoryUsage).mockImplementation(() => {
        throw new Error('Monitor error');
      });

      const request = new NextRequest('http://localhost:3000/api/performance');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Internal server error');
    });
  });
});
