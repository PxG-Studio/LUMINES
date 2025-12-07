"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { TaskStatus, FileChange, TokenUsage, GenerationMetadata } from '@/lib/types/progress';

interface UseProgressReturn {
  currentTask: TaskStatus | null;
  tasks: TaskStatus[];
  fileChanges: FileChange[];
  tokenUsage: TokenUsage;
  metadata: GenerationMetadata | null;
  updateTask: (taskId: string, updates: Partial<TaskStatus>) => void;
  addTask: (task: TaskStatus) => void;
  completeTask: (taskId: string) => void;
  failTask: (taskId: string, error?: string) => void;
  addFileChange: (change: FileChange) => void;
  updateTokenUsage: (usage: Partial<TokenUsage>) => void;
  updateMetadata: (metadata: Partial<GenerationMetadata>) => void;
  reset: () => void;
  getProgressPercentage: () => number;
  getTotalDuration: () => number;
}

const DEFAULT_TOKEN_LIMIT = 100000000;

export function useProgress(): UseProgressReturn {
  const [currentTask, setCurrentTask] = useState<TaskStatus | null>(null);
  const [tasks, setTasks] = useState<TaskStatus[]>([]);
  const [fileChanges, setFileChanges] = useState<FileChange[]>([]);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage>({
    used: 0,
    remaining: DEFAULT_TOKEN_LIMIT,
    limit: DEFAULT_TOKEN_LIMIT,
  });
  const [metadata, setMetadata] = useState<GenerationMetadata | null>(null);
  const taskTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const startTimeRef = useRef<Date | null>(null);

  const updateTask = useCallback((taskId: string, updates: Partial<TaskStatus>) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updated = { ...task, ...updates };

        if (currentTask?.id === taskId) {
          setCurrentTask(updated);
        }

        if (updates.status === 'in-progress' && !task.startTime) {
          updated.startTime = new Date();
          if (!startTimeRef.current) {
            startTimeRef.current = updated.startTime;
          }
        }
        if (updates.status === 'completed' || updates.status === 'failed') {
          updated.endTime = new Date();
          if (task.startTime) {
            updated.duration = updated.endTime.getTime() - task.startTime.getTime();
          }
        }

        return updated;
      }
      return task;
    }));
  }, [currentTask]);

  const addTask = useCallback((task: TaskStatus) => {
    setTasks(prev => {
      if (prev.find(t => t.id === task.id)) {
        return prev;
      }
      return [...prev, task];
    });

    if (task.status === 'in-progress') {
      setCurrentTask(task);
    }
  }, []);

  const completeTask = useCallback((taskId: string) => {
    updateTask(taskId, {
      status: 'completed',
      endTime: new Date(),
    });

    setCurrentTask(prev => prev?.id === taskId ? null : prev);

    setTasks(prev => {
      const nextTask = prev.find(t => t.status === 'pending');
      if (nextTask) {
        setCurrentTask({ ...nextTask, status: 'in-progress', startTime: new Date() });
        return prev.map(t => t.id === nextTask.id ? { ...t, status: 'in-progress', startTime: new Date() } : t);
      }
      return prev;
    });
  }, [updateTask]);

  const failTask = useCallback((taskId: string, error?: string) => {
    updateTask(taskId, {
      status: 'failed',
      endTime: new Date(),
      error,
    });
    setCurrentTask(null);
  }, [updateTask]);

  const addFileChange = useCallback((change: FileChange) => {
    setFileChanges(prev => {
      if (prev.find(f => f.path === change.path && f.type === change.type)) {
        return prev;
      }
      return [...prev, { ...change, timestamp: new Date() }];
    });
  }, []);

  const updateTokenUsage = useCallback((usage: Partial<TokenUsage>) => {
    setTokenUsage(prev => {
      const updated = { ...prev, ...usage, lastUpdated: new Date() };
      if (usage.used !== undefined) {
        updated.remaining = Math.max(0, updated.limit - updated.used);
      }
      return updated;
    });
  }, []);

  const updateMetadata = useCallback((meta: Partial<GenerationMetadata>) => {
    setMetadata(prev => prev ? { ...prev, ...meta } : null);
  }, []);

  const reset = useCallback(() => {
    setTasks([]);
    setCurrentTask(null);
    setFileChanges([]);
    setMetadata(null);
    startTimeRef.current = null;
    taskTimers.current.forEach(timer => clearTimeout(timer));
    taskTimers.current.clear();
  }, []);

  const getProgressPercentage = useCallback(() => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  }, [tasks]);

  const getTotalDuration = useCallback(() => {
    if (!startTimeRef.current) return 0;
    return Date.now() - startTimeRef.current.getTime();
  }, []);

  useEffect(() => {
    return () => {
      taskTimers.current.forEach(timer => clearTimeout(timer));
      taskTimers.current.clear();
    };
  }, []);

  return {
    currentTask,
    tasks,
    fileChanges,
    tokenUsage,
    metadata,
    updateTask,
    addTask,
    completeTask,
    failTask,
    addFileChange,
    updateTokenUsage,
    updateMetadata,
    reset,
    getProgressPercentage,
    getTotalDuration,
  };
}
