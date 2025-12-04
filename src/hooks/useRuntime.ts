import { useState, useEffect, useCallback } from 'react';
import { useRuntimeEvents, useBuildEvents } from './useMessaging';
import type {
  RuntimeSession,
  RuntimeLog,
  BuildJob,
  ContainerStats,
} from '@/lib/runtime/types';
import {
  startContainer,
  stopContainer,
  restartContainer,
  getContainerStats,
} from '@/lib/runtime/client';

export function useRuntimeSession(sessionId: string) {
  const [session, setSession] = useState<RuntimeSession | null>(null);
  const [logs, setLogs] = useState<RuntimeLog[]>([]);
  const [stats, setStats] = useState<ContainerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useRuntimeEvents(sessionId, (event) => {
    if (event.type === 'status' && event.data?.status) {
      setSession((prev) =>
        prev ? { ...prev, status: event.data.status } : null
      );
    }

    if (event.type === 'log' && event.data) {
      setLogs((prev) => [...prev, event.data]);
    }

    if (event.type === 'error' && event.data?.error) {
      setSession((prev) =>
        prev ? { ...prev, error_message: event.data.error } : null
      );
    }
  });

  const start = useCallback(async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const result = await startContainer(sessionId, session.container_config);
      if (!result.success) {
        console.error('Failed to start container:', result.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, session]);

  const stop = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await stopContainer(sessionId);
      if (!result.success) {
        console.error('Failed to stop container:', result.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const restart = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await restartContainer(sessionId);
      if (!result.success) {
        console.error('Failed to restart container:', result.error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (session?.status === 'running') {
        const latestStats = await getContainerStats(sessionId);
        setStats(latestStats);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sessionId, session?.status]);

  return {
    session,
    logs,
    stats,
    isLoading,
    start,
    stop,
    restart,
  };
}

export function useBuildJob(projectId: string) {
  const [jobs, setJobs] = useState<BuildJob[]>([]);
  const [activeJob, setActiveJob] = useState<BuildJob | null>(null);

  useBuildEvents(projectId, (event) => {
    if (event.type === 'started' && event.data) {
      setJobs((prev) => [event.data, ...prev]);
      setActiveJob(event.data);
    }

    if (event.type === 'progress' && event.data) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === event.data.jobId
            ? { ...job, progress: event.data.progress }
            : job
        )
      );

      if (activeJob?.id === event.data.jobId) {
        setActiveJob((prev) =>
          prev ? { ...prev, progress: event.data.progress } : null
        );
      }
    }

    if (event.type === 'completed' && event.data) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === event.data.id
            ? { ...job, status: 'completed', progress: 100 }
            : job
        )
      );

      if (activeJob?.id === event.data.id) {
        setActiveJob(null);
      }
    }

    if (event.type === 'failed' && event.data) {
      setJobs((prev) =>
        prev.map((job) =>
          job.id === event.data.jobId
            ? { ...job, status: 'failed', error_message: event.data.error }
            : job
        )
      );

      if (activeJob?.id === event.data.jobId) {
        setActiveJob(null);
      }
    }
  });

  return {
    jobs,
    activeJob,
  };
}

export function useContainerStats(sessionId: string, enabled = true) {
  const [stats, setStats] = useState<ContainerStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const latestStats = await getContainerStats(sessionId);
        setStats(latestStats);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, [sessionId, enabled]);

  return { stats, isLoading };
}
