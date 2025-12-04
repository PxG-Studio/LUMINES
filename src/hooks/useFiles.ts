import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SlateFile, SlateFileInsert, SlateFileUpdate } from '../lib/database/types';
import * as fileOps from '../lib/database/operations/files';
import type { FileTreeNode } from '../lib/database/operations/files';

export function useFiles(projectId: string | null) {
  const queryClient = useQueryClient();

  const { data: files = [], isLoading: loading, error } = useQuery({
    queryKey: ['files', projectId],
    queryFn: () => fileOps.listFiles(projectId!),
    enabled: !!projectId,
  });

  const fileTree = useMemo(() => fileOps.buildFileTree(files), [files]);

  const createFileMutation = useMutation({
    mutationFn: (file: SlateFileInsert) => fileOps.createFile(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', projectId] });
    },
  });

  const updateFileMutation = useMutation({
    mutationFn: ({ fileId, updates }: { fileId: string; updates: SlateFileUpdate }) =>
      fileOps.updateFile(fileId, updates),
    onMutate: async ({ fileId, updates }) => {
      await queryClient.cancelQueries({ queryKey: ['files', projectId] });
      await queryClient.cancelQueries({ queryKey: ['file', fileId] });

      const previousFiles = queryClient.getQueryData<SlateFile[]>(['files', projectId]);
      const previousFile = queryClient.getQueryData<SlateFile>(['file', fileId]);

      if (previousFiles) {
        queryClient.setQueryData<SlateFile[]>(['files', projectId], (old = []) =>
          old.map((f) => (f.id === fileId ? { ...f, ...updates, updated_at: new Date().toISOString() } : f))
        );
      }

      if (previousFile) {
        queryClient.setQueryData<SlateFile>(['file', fileId], {
          ...previousFile,
          ...updates,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousFiles, previousFile };
    },
    onError: (err, { fileId }, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData(['files', projectId], context.previousFiles);
      }
      if (context?.previousFile) {
        queryClient.setQueryData(['file', fileId], context.previousFile);
      }
    },
    onSettled: (data, error, { fileId }) => {
      queryClient.invalidateQueries({ queryKey: ['files', projectId] });
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: (fileId: string) => fileOps.deleteFile(fileId),
    onMutate: async (fileId) => {
      await queryClient.cancelQueries({ queryKey: ['files', projectId] });
      const previousFiles = queryClient.getQueryData<SlateFile[]>(['files', projectId]);

      queryClient.setQueryData<SlateFile[]>(['files', projectId], (old = []) =>
        old.filter((f) => f.id !== fileId)
      );

      return { previousFiles };
    },
    onError: (err, fileId, context) => {
      if (context?.previousFiles) {
        queryClient.setQueryData(['files', projectId], context.previousFiles);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['files', projectId] });
    },
  });

  const searchFiles = async (query: string): Promise<SlateFile[]> => {
    if (!projectId) return [];
    return fileOps.searchFiles(projectId, query);
  };

  return {
    files,
    fileTree,
    loading,
    error: error as Error | null,
    createFile: createFileMutation.mutateAsync,
    updateFile: (fileId: string, updates: SlateFileUpdate) =>
      updateFileMutation.mutateAsync({ fileId, updates }),
    deleteFile: deleteFileMutation.mutateAsync,
    searchFiles,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['files', projectId] }),
  };
}

export function useFile(fileId: string | null) {
  const queryClient = useQueryClient();

  const { data: file = null, isLoading: loading, error } = useQuery({
    queryKey: ['file', fileId],
    queryFn: () => fileOps.getFile(fileId!),
    enabled: !!fileId,
  });

  const updateFileMutation = useMutation({
    mutationFn: (updates: SlateFileUpdate) => fileOps.updateFile(fileId!, updates),
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['file', fileId] });
      const previousFile = queryClient.getQueryData<SlateFile>(['file', fileId]);

      if (previousFile) {
        queryClient.setQueryData<SlateFile>(['file', fileId], {
          ...previousFile,
          ...updates,
          version: previousFile.version + 1,
          updated_at: new Date().toISOString(),
        });
      }

      return { previousFile };
    },
    onError: (err, updates, context) => {
      if (context?.previousFile) {
        queryClient.setQueryData(['file', fileId], context.previousFile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['file', fileId] });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  return {
    file,
    loading,
    error: error as Error | null,
    updateFile: updateFileMutation.mutateAsync,
    refresh: () => queryClient.invalidateQueries({ queryKey: ['file', fileId] }),
  };
}
