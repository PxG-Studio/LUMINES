/**
 * Git Provider Component
 * 
 * Provides Git operations using simple-git
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import simpleGit, { SimpleGit, StatusResult } from 'simple-git';
import { useWissilFS } from '@/wissil/runtime/fs/wissilFs';

export interface GitStatus {
  current: string | null;
  tracking: string | null;
  ahead: number;
  behind: number;
  files: Array<{
    path: string;
    index: string;
    working_dir: string;
  }>;
  staged: string[];
  not_added: string[];
  conflicted: string[];
  created: string[];
  deleted: string[];
  modified: string[];
  renamed: string[];
}

export interface GitCommit {
  hash: string;
  date: Date;
  message: string;
  author: string;
  refs: string;
}

interface GitContextValue {
  git: SimpleGit | null;
  status: GitStatus | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  init: () => Promise<void>;
  add: (files: string[]) => Promise<void>;
  commit: (message: string) => Promise<void>;
  push: () => Promise<void>;
  pull: () => Promise<void>;
  checkout: (branch: string) => Promise<void>;
  createBranch: (branch: string) => Promise<void>;
  getBranches: () => Promise<string[]>;
  getCommits: (limit?: number) => Promise<GitCommit[]>;
  getDiff: (file?: string) => Promise<string>;
}

const GitContext = createContext<GitContextValue | null>(null);

export const useGit = () => {
  const context = useContext(GitContext);
  if (!context) {
    throw new Error('useGit must be used within GitProvider');
  }
  return context;
};

export interface GitProviderProps {
  children: React.ReactNode;
  workingDir?: string;
}

export const GitProvider: React.FC<GitProviderProps> = ({
  children,
  workingDir = process.cwd(),
}) => {
  const [git, setGit] = useState<SimpleGit | null>(null);
  const [status, setStatus] = useState<GitStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const fs = useWissilFS();

  // Initialize Git
  useEffect(() => {
    const initGit = async () => {
      try {
        // In browser, we need to use WebContainer or a proxy
        // For now, we'll create a mock Git instance
        // In production, this would connect to a backend service
        const gitInstance = simpleGit(workingDir);
        setGit(gitInstance);
        await refreshStatus(gitInstance);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize Git');
        setError(error);
        console.error('Git initialization error:', error);
      }
    };

    initGit();
  }, [workingDir]);

  // Refresh Git status
  const refreshStatus = useCallback(async (gitInstance: SimpleGit) => {
    try {
      setIsLoading(true);
      const statusResult = await gitInstance.status();

      const gitStatus: GitStatus = {
        current: statusResult.current || null,
        tracking: statusResult.tracking || null,
        ahead: statusResult.ahead,
        behind: statusResult.behind,
        files: statusResult.files.map((f) => ({
          path: f.path,
          index: f.index,
          working_dir: f.working_dir,
        })),
        staged: statusResult.staged,
        not_added: statusResult.not_added,
        conflicted: statusResult.conflicted,
        created: statusResult.created,
        deleted: statusResult.deleted,
        modified: statusResult.modified,
        renamed: statusResult.renamed,
      };

      setStatus(gitStatus);
      setError(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to get Git status');
      setError(error);
      console.error('Git status error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (git) {
      await refreshStatus(git);
    }
  }, [git, refreshStatus]);

  const init = useCallback(async () => {
    if (!git) return;
    try {
      setIsLoading(true);
      await git.init();
      await refreshStatus(git);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to initialize Git repository');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [git, refreshStatus]);

  const add = useCallback(async (files: string[]) => {
    if (!git) return;
    try {
      setIsLoading(true);
      await git.add(files);
      await refreshStatus(git);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stage files');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [git, refreshStatus]);

  const commit = useCallback(async (message: string) => {
    if (!git) return;
    try {
      setIsLoading(true);
      await git.commit(message);
      await refreshStatus(git);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to commit');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [git, refreshStatus]);

  const push = useCallback(async () => {
    if (!git) return;
    try {
      setIsLoading(true);
      await git.push();
      await refreshStatus(git);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to push');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [git, refreshStatus]);

  const pull = useCallback(async () => {
    if (!git) return;
    try {
      setIsLoading(true);
      await git.pull();
      await refreshStatus(git);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to pull');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [git, refreshStatus]);

  const checkout = useCallback(async (branch: string) => {
    if (!git) return;
    try {
      setIsLoading(true);
      await git.checkout(branch);
      await refreshStatus(git);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to checkout branch');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [git, refreshStatus]);

  const createBranch = useCallback(async (branch: string) => {
    if (!git) return;
    try {
      setIsLoading(true);
      await git.checkoutLocalBranch(branch);
      await refreshStatus(git);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create branch');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [git, refreshStatus]);

  const getBranches = useCallback(async (): Promise<string[]> => {
    if (!git) return [];
    try {
      const branches = await git.branchLocal();
      return branches.all;
    } catch (err) {
      console.error('Failed to get branches:', err);
      return [];
    }
  }, [git]);

  const getCommits = useCallback(async (limit = 50): Promise<GitCommit[]> => {
    if (!git) return [];
    try {
      const log = await git.log({ maxCount: limit });
      return log.all.map((commit) => ({
        hash: commit.hash,
        date: new Date(commit.date),
        message: commit.message,
        author: commit.author_name,
        refs: commit.refs,
      }));
    } catch (err) {
      console.error('Failed to get commits:', err);
      return [];
    }
  }, [git]);

  const getDiff = useCallback(async (file?: string): Promise<string> => {
    if (!git) return '';
    try {
      if (file) {
        return await git.diff([file]);
      }
      return await git.diff();
    } catch (err) {
      console.error('Failed to get diff:', err);
      return '';
    }
  }, [git]);

  const value: GitContextValue = {
    git,
    status,
    isLoading,
    error,
    refresh,
    init,
    add,
    commit,
    push,
    pull,
    checkout,
    createBranch,
    getBranches,
    getCommits,
    getDiff,
  };

  return <GitContext.Provider value={value}>{children}</GitContext.Provider>;
};

export default GitProvider;

