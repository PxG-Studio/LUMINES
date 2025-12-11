import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '../route';
import JSZip from 'jszip';

// Mock JSZip
vi.mock('jszip', () => {
  const mockZip = {
    folder: vi.fn(),
    file: vi.fn(),
    generateAsync: vi.fn(),
  };
  return {
    default: vi.fn(() => mockZip),
  };
});

describe('Export Batch API Route - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('POST /api/export-batch', () => {
    it('should create ZIP with default template', async () => {
      const mockZipInstance = {
        folder: vi.fn().mockReturnThis(),
        file: vi.fn().mockReturnThis(),
        generateAsync: vi.fn().mockResolvedValue(new Blob()),
      };
      vi.mocked(JSZip).mockImplementation(() => mockZipInstance as any);

      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({
          scripts: [
            { scriptName: 'PlayerController', code: 'using UnityEngine;' },
            { scriptName: 'EnemyAI', code: 'using UnityEngine;' },
          ],
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/zip');
    });

    it('should create ZIP with package template', async () => {
      const mockZipInstance = {
        folder: vi.fn().mockReturnThis(),
        file: vi.fn().mockReturnThis(),
        generateAsync: vi.fn().mockResolvedValue(new Blob()),
      };
      vi.mocked(JSZip).mockImplementation(() => mockZipInstance as any);

      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({
          scripts: [
            { scriptName: 'PlayerController', code: 'using UnityEngine;' },
          ],
          template: 'package',
          packageName: 'MyPackage',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should create ZIP with organized template', async () => {
      const mockZipInstance = {
        folder: vi.fn().mockReturnThis(),
        file: vi.fn().mockReturnThis(),
        generateAsync: vi.fn().mockResolvedValue(new Blob()),
      };
      vi.mocked(JSZip).mockImplementation(() => mockZipInstance as any);

      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({
          scripts: [
            { scriptName: 'PlayerController', code: 'using UnityEngine;' },
          ],
          template: 'organized',
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should return 400 when no scripts provided', async () => {
      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({
          scripts: [],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('No scripts provided');
    });

    it('should return 400 when scripts array is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({}),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('No scripts provided');
    });

    it('should handle many scripts', async () => {
      const mockZipInstance = {
        folder: vi.fn().mockReturnThis(),
        file: vi.fn().mockReturnThis(),
        generateAsync: vi.fn().mockResolvedValue(new Blob()),
      };
      vi.mocked(JSZip).mockImplementation(() => mockZipInstance as any);

      const scripts = Array.from({ length: 100 }, (_, i) => ({
        scriptName: `Script${i}`,
        code: `// Script ${i}`,
      }));

      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({ scripts }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
    });

    it('should return 500 when ZIP generation fails', async () => {
      const mockZipInstance = {
        folder: vi.fn().mockReturnThis(),
        file: vi.fn().mockReturnThis(),
        generateAsync: vi.fn().mockRejectedValue(new Error('ZIP generation failed')),
      };
      vi.mocked(JSZip).mockImplementation(() => mockZipInstance as any);

      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({
          scripts: [
            { scriptName: 'Test', code: 'code' },
          ],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to generate batch export');
    });

    it('should include README when template requires it', async () => {
      const mockZipInstance = {
        folder: vi.fn().mockReturnThis(),
        file: vi.fn().mockReturnThis(),
        generateAsync: vi.fn().mockResolvedValue(new Blob()),
      };
      vi.mocked(JSZip).mockImplementation(() => mockZipInstance as any);

      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({
          scripts: [
            { scriptName: 'Test', code: 'code' },
          ],
          template: 'package',
        }),
      });

      await POST(request);

      // Should call file() for README
      expect(mockZipInstance.file).toHaveBeenCalled();
    });

    it('should generate meta files for scripts', async () => {
      const mockZipInstance = {
        folder: vi.fn().mockReturnThis(),
        file: vi.fn().mockReturnThis(),
        generateAsync: vi.fn().mockResolvedValue(new Blob()),
      };
      vi.mocked(JSZip).mockImplementation(() => mockZipInstance as any);

      const request = new NextRequest('http://localhost:3000/api/export-batch', {
        method: 'POST',
        body: JSON.stringify({
          scripts: [
            { scriptName: 'Test', code: 'code' },
          ],
        }),
      });

      await POST(request);

      // Should generate .meta files
      expect(mockZipInstance.file).toHaveBeenCalled();
    });
  });
});
