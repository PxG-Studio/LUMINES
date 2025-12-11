import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET } from '../route';
import * as fileOps from '@/lib/database/operations/files';

// Mock the database operations
vi.mock('@/lib/database/operations/files', () => ({
  searchFiles: vi.fn(),
}));

describe('Files Search API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('GET /api/files/search', () => {
    it('should return search results for valid query', async () => {
      const mockResults = [
        { id: '1', path: 'src/Main.cs', content: 'main function' },
        { id: '2', path: 'src/GameManager.cs', content: 'game manager main' },
      ];

      vi.mocked(fileOps.searchFiles).mockResolvedValue(mockResults as any);

      const request = new NextRequest('http://localhost:3000/api/files/search?projectId=proj1&q=main');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockResults);
      expect(fileOps.searchFiles).toHaveBeenCalledWith('proj1', 'main');
    });

    it('should return 400 when projectId is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/files/search?q=main');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('projectId query parameter is required');
      expect(fileOps.searchFiles).not.toHaveBeenCalled();
    });

    it('should return 400 when query is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/files/search?projectId=proj1');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('q query parameter is required');
      expect(fileOps.searchFiles).not.toHaveBeenCalled();
    });

    it('should handle empty search results', async () => {
      vi.mocked(fileOps.searchFiles).mockResolvedValue([]);

      const request = new NextRequest('http://localhost:3000/api/files/search?projectId=proj1&q=nonexistent');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it('should handle special characters in query', async () => {
      const mockResults = [];
      vi.mocked(fileOps.searchFiles).mockResolvedValue(mockResults as any);

      const query = 'test@#$%';
      const request = new NextRequest(`http://localhost:3000/api/files/search?projectId=proj1&q=${encodeURIComponent(query)}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(fileOps.searchFiles).toHaveBeenCalledWith('proj1', query);
    });

    it('should handle very long queries', async () => {
      const longQuery = 'A'.repeat(1000);
      vi.mocked(fileOps.searchFiles).mockResolvedValue([]);

      const request = new NextRequest(`http://localhost:3000/api/files/search?projectId=proj1&q=${encodeURIComponent(longQuery)}`);
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should return 500 when database operation fails', async () => {
      vi.mocked(fileOps.searchFiles).mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/files/search?projectId=proj1&q=main');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to search files');
    });
  });
});
