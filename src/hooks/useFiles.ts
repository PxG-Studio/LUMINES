import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SlateFile, SlateFileInsert, SlateFileUpdate } from '../lib/database/types';
import { apiClient } from '../lib/api/client';
import type { FileTreeNode } from '../lib/utils/fileTree';
import { buildFileTree } from '../lib/utils/fileTree';

export function useFiles(projectId: string | null) {
  const [files, setFiles] = useState<SlateFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFiles = useCallback(async () => {
    if (!projectId) {
      setFiles([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<SlateFile[]>(`/files?projectId=${projectId}`);
      setFiles(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const fileTree = useMemo(() => buildFileTree(files), [files]);

  const createFile = async (file: SlateFileInsert): Promise<SlateFile> => {
    const newFile = await apiClient.post<SlateFile>('/files', file);
    setFiles((prev) => [...prev, newFile]);
    return newFile;
  };

  const updateFile = async (fileId: string, updates: SlateFileUpdate): Promise<SlateFile> => {
    const updatedFile = await apiClient.put<SlateFile>(`/files/${fileId}`, updates);
    setFiles((prev) => prev.map((f) => (f.id === fileId ? updatedFile : f)));
    return updatedFile;
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    await apiClient.delete(`/files/${fileId}`);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const searchFiles = async (query: string): Promise<SlateFile[]> => {
    if (!projectId) return [];
    return apiClient.get<SlateFile[]>(`/files/search?projectId=${projectId}&q=${encodeURIComponent(query)}`);
  };

  return {
    files,
    fileTree,
    loading,
    error,
    createFile,
    updateFile,
    deleteFile,
    searchFiles,
    refresh: fetchFiles,
  };
}

export function useFile(fileId: string | null) {
  const [file, setFile] = useState<SlateFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFile = useCallback(async () => {
    if (!fileId) {
      setFile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<SlateFile>(`/files/${fileId}`);
      setFile(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    fetchFile();
  }, [fetchFile]);

  const updateFile = async (updates: SlateFileUpdate): Promise<SlateFile> => {
    if (!fileId) throw new Error('File ID is required');
    const updatedFile = await apiClient.put<SlateFile>(`/files/${fileId}`, updates);
    setFile(updatedFile);
    return updatedFile;
  };

  return {
    file,
    loading,
    error,
    updateFile,
    refresh: fetchFile,
  };
}
