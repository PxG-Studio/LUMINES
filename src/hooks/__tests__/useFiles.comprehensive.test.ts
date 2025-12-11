import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFile, useFiles } from '../useFiles';

// Mock API calls
global.fetch = vi.fn();

describe('useFiles Hook - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFile', () => {
    it('should fetch file when fileId is provided', async () => {
      const mockFile = {
        id: 'file1',
        path: 'src/Main.cs',
        content: 'using System;',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFile,
      } as Response);

      const { result } = renderHook(() => useFile('file1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.file).toEqual(mockFile);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/files/file1'));
    });

    it('should not fetch when fileId is null', () => {
      const { result } = renderHook(() => useFile(null));

      expect(result.current.file).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle fetch errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useFile('file1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should update file when updateFile is called', async () => {
      const mockFile = {
        id: 'file1',
        content: 'original',
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockFile,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockFile, content: 'updated' }),
        } as Response);

      const { result } = renderHook(() => useFile('file1'));

      await waitFor(() => {
        expect(result.current.file).toBeDefined();
      });

      await result.current.updateFile({ content: 'updated' });

      await waitFor(() => {
        expect(result.current.file?.content).toBe('updated');
      });
    });
  });

  describe('useFiles', () => {
    it('should fetch files for project', async () => {
      const mockFiles = [
        { id: '1', path: 'src/File1.cs' },
        { id: '2', path: 'src/File2.cs' },
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockFiles,
      } as Response);

      const { result } = renderHook(() => useFiles('proj1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.files).toEqual(mockFiles);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/files?projectId=proj1'));
    });

    it('should handle empty files list', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const { result } = renderHook(() => useFiles('proj1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.files).toEqual([]);
    });

    it('should handle fetch errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useFiles('proj1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});
