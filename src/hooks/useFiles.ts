import { useState, useEffect, useCallback } from 'react';
import type { SlateFile, SlateFileInsert, SlateFileUpdate } from '../lib/database/types';
import * as fileOps from '../lib/database/operations/files';
import type { FileTreeNode } from '../lib/database/operations/files';

export function useFiles(projectId: string | null) {
  const [files, setFiles] = useState<SlateFile[]>([]);
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadFiles = useCallback(async () => {
    if (!projectId) {
      setFiles([]);
      setFileTree([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await fileOps.listFiles(projectId);
      setFiles(data);
      setFileTree(fileOps.buildFileTree(data));
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const createFile = useCallback(
    async (file: SlateFileInsert): Promise<SlateFile> => {
      const newFile = await fileOps.createFile(file);
      await loadFiles();
      return newFile;
    },
    [loadFiles]
  );

  const updateFile = useCallback(
    async (fileId: string, updates: SlateFileUpdate): Promise<SlateFile> => {
      const updated = await fileOps.updateFile(fileId, updates);
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? updated : f))
      );
      return updated;
    },
    []
  );

  const deleteFile = useCallback(
    async (fileId: string): Promise<void> => {
      await fileOps.deleteFile(fileId);
      await loadFiles();
    },
    [loadFiles]
  );

  const searchFiles = useCallback(
    async (query: string): Promise<SlateFile[]> => {
      if (!projectId) return [];
      return fileOps.searchFiles(projectId, query);
    },
    [projectId]
  );

  return {
    files,
    fileTree,
    loading,
    error,
    createFile,
    updateFile,
    deleteFile,
    searchFiles,
    refresh: loadFiles,
  };
}

export function useFile(fileId: string | null) {
  const [file, setFile] = useState<SlateFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadFile = useCallback(async () => {
    if (!fileId) {
      setFile(null);
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
    loadFile();
  }, [loadFile]);

  const updateFile = useCallback(
    async (updates: SlateFileUpdate): Promise<SlateFile | null> => {
      if (!fileId) return null;
      const updated = await fileOps.updateFile(fileId, updates);
      setFile(updated);
      return updated;
    },
    [fileId]
  );

  return {
    file,
    loading,
    error,
    updateFile,
    refresh: loadFile,
  };
}
