import { useState, useEffect, useMemo, useCallback } from 'react';
import type { SlateFile, SlateFileInsert, SlateFileUpdate } from '../lib/database/types';
import * as fileOps from '../lib/database/operations/files';
import type { FileTreeNode } from '../lib/database/operations/files';

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
      const data = await fileOps.listFiles(projectId);
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

  const fileTree = useMemo(() => fileOps.buildFileTree(files), [files]);

  const createFile = async (file: SlateFileInsert): Promise<SlateFile> => {
    const newFile = await fileOps.createFile(file);
    setFiles((prev) => [...prev, newFile]);
    return newFile;
  };

  const updateFile = async (fileId: string, updates: SlateFileUpdate): Promise<SlateFile> => {
    const updatedFile = await fileOps.updateFile(fileId, updates);
    setFiles((prev) => prev.map((f) => (f.id === fileId ? updatedFile : f)));
    return updatedFile;
  };

  const deleteFile = async (fileId: string): Promise<void> => {
    await fileOps.deleteFile(fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const searchFiles = async (query: string): Promise<SlateFile[]> => {
    if (!projectId) return [];
    return fileOps.searchFiles(projectId, query);
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
      const data = await fileOps.getFile(fileId);
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
    const updatedFile = await fileOps.updateFile(fileId, updates);
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
