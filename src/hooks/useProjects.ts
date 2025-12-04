import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SlateProject, SlateProjectInsert, SlateProjectUpdate } from '../lib/database/types';
import * as projectOps from '../lib/database/operations/projects';

export function useProjects(userId: string) {
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading: loading, error } = useQuery({
    queryKey: ['projects', userId],
    queryFn: () => projectOps.listProjects(userId),
  });

  const createProjectMutation = useMutation({
    mutationFn: (project: SlateProjectInsert) => projectOps.createProject(project),
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects', userId] });
      const previousProjects = queryClient.getQueryData<SlateProject[]>(['projects', userId]);

      queryClient.setQueryData<SlateProject[]>(['projects', userId], (old = []) => [
        { ...newProject, id: 'temp-' + Date.now(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() } as SlateProject,
        ...old,
      ]);

      return { previousProjects };
    },
    onError: (err, newProject, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects', userId], context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ projectId, updates }: { projectId: string; updates: SlateProjectUpdate }) =>
      projectOps.updateProject(projectId, updates),
    onMutate: async ({ projectId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['projects', userId] });
      const previousProjects = queryClient.getQueryData<SlateProject[]>(['projects', userId]);

      queryClient.setQueryData<SlateProject[]>(['projects', userId], (old = []) =>
        old.map((p) => (p.id === projectId ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
      );

      return { previousProjects };
    },
    onError: (err, variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects', userId], context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: string) => projectOps.deleteProject(projectId),
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: ['projects', userId] });
      const previousProjects = queryClient.getQueryData<SlateProject[]>(['projects', userId]);

      queryClient.setQueryData<SlateProject[]>(['projects', userId], (old = []) =>
        old.filter((p) => p.id !== projectId)
      );

      return { previousProjects };
    },
    onError: (err, projectId, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects', userId], context.previousProjects);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', userId] });
    },
  });

  return {
    projects,
    loading,
    error: error as Error | null,
    createProject: createProjectMutation.mutateAsync,
    updateProject: (projectId: string, updates: SlateProjectUpdate) =>
      updateProjectMutation.mutateAsync({ projectId, updates }),
    deleteProject: deleteProjectMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['projects', userId] }),
  };
}

export function useProject(projectId: string | null) {
  const { data: project = null, isLoading: loading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectOps.getProject(projectId!),
    enabled: !!projectId,
  });

  return { project, loading, error: error as Error | null };
}
