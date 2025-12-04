import { useState, useEffect, useCallback } from 'react';
import type { SlateProject, SlateProjectInsert, SlateProjectUpdate } from '../lib/database/types';
import * as projectOps from '../lib/database/operations/projects';

export function useProjects(userId: string) {
  const [projects, setProjects] = useState<SlateProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!userId) return;

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
    fetchProjects();
  }, [fetchProjects]);

  const createProject = async (project: SlateProjectInsert): Promise<SlateProject> => {
    const newProject = await projectOps.createProject(project);
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (projectId: string, updates: SlateProjectUpdate): Promise<SlateProject> => {
    const updatedProject = await projectOps.updateProject(projectId, updates);
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)));
    return updatedProject;
  };

  const deleteProject = async (projectId: string): Promise<void> => {
    await projectOps.deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refresh: fetchProjects,
  };
}

export function useProject(projectId: string | null) {
  const [project, setProject] = useState<SlateProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
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

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
}
