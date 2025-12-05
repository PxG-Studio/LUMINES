import { useEffect, useState, useCallback } from 'react';
import { realtimeSubscriber } from '../lib/messaging/subscribers';

export interface RealtimeEvent {
  type: string;
  data: any;
  timestamp: string;
}

export function useRealtimeFile(fileId: string | null) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!fileId) return;

    const handler = (data: any) => {
      const event: RealtimeEvent = {
        type: data.type || 'file.updated',
        data,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      setEvents((prev) => [...prev, event]);
      setLastUpdate(new Date());
    };

    realtimeSubscriber.subscribeToFile(fileId, handler);

    return () => {
      realtimeSubscriber.unsubscribe(`file:${fileId}`);
    };
  }, [fileId]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, lastUpdate, clearEvents };
}

export function useRealtimeProject(projectId: string | null) {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const handler = (data: any) => {
      const event: RealtimeEvent = {
        type: data.type || 'project.updated',
        data,
        timestamp: data.timestamp || new Date().toISOString(),
      };
      setEvents((prev) => [...prev, event]);
      setLastUpdate(new Date());
    };

    realtimeSubscriber.subscribeToProject(projectId, handler);

    return () => {
      realtimeSubscriber.unsubscribe(`project:${projectId}`);
    };
  }, [projectId]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return { events, lastUpdate, clearEvents };
}

export function useRealtimeRuntime(sessionId: string | null) {
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const handler = (data: any) => {
      if (data.type === 'log' || data.log) {
        setLogs((prev) => [...prev, data.log || data]);
      }

      if (data.status) {
        setStatus(data.status);
      }
    };

    realtimeSubscriber.subscribeToRuntime(sessionId, handler);

    return () => {
      realtimeSubscriber.unsubscribe(`runtime:${sessionId}`);
    };
  }, [sessionId]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, status, clearLogs };
}

export function useRealtimeBuild(buildId: string | null) {
  const [logs, setLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!buildId) return;

    const handler = (data: any) => {
      if (data.log) {
        setLogs((prev) => [...prev, data.log]);
      }

      if (data.status) {
        setStatus(data.status);
      }

      if (data.progress !== undefined) {
        setProgress(data.progress);
      }
    };

    realtimeSubscriber.subscribeToBuild(buildId, handler);

    return () => {
      realtimeSubscriber.unsubscribe(`build:${buildId}`);
    };
  }, [buildId]);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return { logs, status, progress, clearLogs };
}
