import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useProject, useProjects } from '../useProjects';

// Mock API calls
global.fetch = vi.fn();

describe('useProjects Hook - Comprehensive Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useProject', () => {
    it('should fetch project when projectId is provided', async () => {
      const mockProject = {
        id: 'proj1',
        name: 'Test Project',
        description: 'Test description',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProject,
      } as Response);

      const { result } = renderHook(() => useProject('proj1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.project).toEqual(mockProject);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/projects/proj1'));
    });

    it('should not fetch when projectId is null', () => {
      const { result } = renderHook(() => useProject(null));

      expect(result.current.project).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should handle 404 when project not found', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Project not found' }),
      } as Response);

      const { result } = renderHook(() => useProject('nonexistent'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should update project when updateProject is called', async () => {
      const mockProject = {
        id: 'proj1',
        name: 'Original',
      };

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockProject,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockProject, name: 'Updated' }),
        } as Response);

      const { result } = renderHook(() => useProject('proj1'));

      await waitFor(() => {
        expect(result.current.project).toBeDefined();
      });

      await result.current.updateProject({ name: 'Updated' });

      await waitFor(() => {
        expect(result.current.project?.name).toBe('Updated');
      });
    });
  });

  describe('useProjects', () => {
    it('should fetch projects for user', async () => {
      const mockProjects = [
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' },
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockProjects,
      } as Response);

      const { result } = renderHook(() => useProjects('user1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.projects).toEqual(mockProjects);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/projects?userId=user1'));
    });

    it('should handle empty projects list', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const { result } = renderHook(() => useProjects('user1'));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.projects).toEqual([]);
    });

    it('should create new project', async () => {
      const newProject = {
        id: 'new1',
        name: 'New Project',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => newProject,
      } as Response);

      const { result } = renderHook(() => useProjects('user1'));

      await result.current.createProject({
        name: 'New Project',
        user_id: 'user1',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/projects'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });
});
