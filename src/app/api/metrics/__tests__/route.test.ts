import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import { getMetricsCollector } from '@/lib/spark/monitoring/metrics';

// Mock metrics collector
vi.mock('@/lib/spark/monitoring/metrics', () => ({
  getMetricsCollector: vi.fn(),
}));

describe('Metrics API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/metrics', () => {
    it('should return Prometheus format metrics', async () => {
      const mockCollector = {
        exportPrometheus: vi.fn().mockReturnValue('http_requests_total 100\n'),
      };
      vi.mocked(getMetricsCollector).mockReturnValue(mockCollector as any);

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await GET(request);
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/plain; version=0.0.4');
      expect(text).toBe('http_requests_total 100\n');
      expect(mockCollector.exportPrometheus).toHaveBeenCalled();
    });

    it('should handle empty metrics', async () => {
      const mockCollector = {
        exportPrometheus: vi.fn().mockReturnValue(''),
      };
      vi.mocked(getMetricsCollector).mockReturnValue(mockCollector as any);

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await GET(request);
      const text = await response.text();

      expect(response.status).toBe(200);
      expect(text).toBe('');
    });

    it('should return 500 when metrics export fails', async () => {
      const mockCollector = {
        exportPrometheus: vi.fn().mockImplementation(() => {
          throw new Error('Metrics export failed');
        }),
      };
      vi.mocked(getMetricsCollector).mockReturnValue(mockCollector as any);

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to export metrics');
    });

    it('should return 500 when collector is unavailable', async () => {
      vi.mocked(getMetricsCollector).mockImplementation(() => {
        throw new Error('Collector unavailable');
      });

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to export metrics');
    });

    it('should return valid Prometheus format', async () => {
      const prometheusMetrics = `# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total 100
database_queries_total 50
`;
      const mockCollector = {
        exportPrometheus: vi.fn().mockReturnValue(prometheusMetrics),
      };
      vi.mocked(getMetricsCollector).mockReturnValue(mockCollector as any);

      const request = new NextRequest('http://localhost:3000/api/metrics');
      const response = await GET(request);
      const text = await response.text();

      expect(text).toContain('http_requests_total');
      expect(text).toContain('database_queries_total');
    });
  });
});
