import { useState, useEffect, useCallback } from 'react';
import type { SlateProject, SlateProjectInsert, SlateProjectUpdate } from '../lib/database/types';
import * as projectOps from '../lib/database/operations/projects';

export function useProjects(userId: string) {
  const [projects, setProjects] = useState<SlateProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectOps.listProjects(userId);
      setProjects(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(
    async (project: SlateProjectInsert): Promise<SlateProject> => {
      const newProject = await projectOps.createProject(project);
      setProjects((prev) => [newProject, ...prev]);
      return newProject;
    },
    []
  );

  const updateProject = useCallback(
    async (projectId: string, updates: SlateProjectUpdate): Promise<SlateProject> => {
      const updated = await projectOps.updateProject(projectId, updates);
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      );
      return updated;
    },
    []
  );

  const deleteProject = useCallback(async (projectId: string): Promise<void> => {
    await projectOps.deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refresh: loadProjects,
  };
}

export function useProject(projectId: string | null) {
  const [project, setProject] = useState<SlateProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      return;
    }

    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectOps.getProject(projectId);
        setProject(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  return { project, loading, error };
}
