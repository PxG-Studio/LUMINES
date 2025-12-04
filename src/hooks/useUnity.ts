import { useState, useEffect, useCallback } from 'react';
import { subscribe } from '../lib/messaging/client';
import {
  syncUnityProject,
  initializeUnityProject,
  getUnityProjectMetadata,
  cleanUnityProject,
  rebuildUnityLibrary,
  validateUnityProject,
  type UnitySyncOptions,
  type UnitySyncResult,
} from '../lib/unity/sync';
import {
  enterPlayMode,
  exitPlayMode,
  pausePlayMode,
  getPlayModeState,
  executeEditorMethod,
  refreshAssetDatabase,
  compileScripts,
  type UnityEditorResponse,
  type UnityPlayModeState,
} from '../lib/unity/editor';
import {
  buildUnityPlayer,
  getDefaultBuildOptions,
  getDevelopmentBuildOptions,
  getReleaseBuildOptions,
  type UnityBuildConfiguration,
  type UnityBuildOptions,
} from '../lib/unity/build';
import {
  subscribeToProfilerData,
  type UnityProfilerFrame,
} from '../lib/unity/profiler';
import type { UnityProject } from '../lib/unity/types';

export function useUnityProject(projectId: string | null) {
  const [project, setProject] = useState<UnityProject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUnityProjectMetadata(projectId);
      setProject(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const refresh = useCallback(() => {
    return load();
  }, [load]);

  const clean = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      await cleanUnityProject(projectId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clean project');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, refresh]);

  const rebuildLibrary = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      await rebuildUnityLibrary(projectId);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rebuild library');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, refresh]);

  return {
    project,
    isLoading,
    error,
    refresh,
    clean,
    rebuildLibrary,
  };
}

export function useUnitySync() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UnitySyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sync = useCallback(async (
    projectPath: string,
    userId: string,
    options?: UnitySyncOptions
  ) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const syncResult = await syncUnityProject(projectPath, userId, options);
      setResult(syncResult);
      return syncResult;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sync failed';
      setError(errorMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initialize = useCallback(async (
    projectName: string,
    unityVersion: string,
    userId: string,
    template?: 'empty' | '2d' | '3d' | 'urp' | 'hdrp'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await initializeUnityProject(projectName, unityVersion, userId, template);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Initialization failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validate = useCallback(async (projectPath: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await validateUnityProject(projectPath);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Validation failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sync,
    initialize,
    validate,
    isLoading,
    result,
    error,
  };
}

export function useUnityPlayMode(projectId: string | null) {
  const [state, setState] = useState<UnityPlayModeState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const playModeState = await getPlayModeState(projectId);
      setState(playModeState);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;

    refresh();

    const unsubscribe = subscribe(
      `slate.unity.playmode.${projectId}`,
      (msg: any) => {
        if (msg.data?.state) {
          setState(msg.data.state);
        }
      }
    );

    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }, [projectId, refresh]);

  const play = useCallback(async () => {
    if (!projectId) return;
    await enterPlayMode(projectId);
  }, [projectId]);

  const stop = useCallback(async () => {
    if (!projectId) return;
    await exitPlayMode(projectId);
  }, [projectId]);

  const pause = useCallback(async () => {
    if (!projectId) return;
    await pausePlayMode(projectId);
  }, [projectId]);

  return {
    state,
    isLoading,
    isPlaying: state?.isPlaying ?? false,
    isPaused: state?.isPaused ?? false,
    play,
    stop,
    pause,
    refresh,
  };
}

export function useUnityEditor(projectId: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<UnityEditorResponse | null>(null);

  const execute = useCallback(async (
    className: string,
    methodName: string,
    args?: string[]
  ) => {
    if (!projectId) {
      throw new Error('No project ID');
    }

    setIsLoading(true);
    try {
      const response = await executeEditorMethod(projectId, className, methodName, args);
      setLastResponse(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const refreshAssets = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const response = await refreshAssetDatabase(projectId);
      setLastResponse(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const compile = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const response = await compileScripts(projectId);
      setLastResponse(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  return {
    execute,
    refreshAssets,
    compile,
    isLoading,
    lastResponse,
  };
}

export function useUnityBuild(projectId: string | null) {
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const unsubscribe = subscribe(
      `slate.unity.build.progress.${projectId}`,
      (msg: any) => {
        if (msg.data?.progress !== undefined) {
          setProgress(msg.data.progress);
        }
        if (msg.data?.buildId) {
          setCurrentBuildId(msg.data.buildId);
        }
        if (msg.type === 'buildCompleted' || msg.type === 'buildFailed') {
          setIsBuilding(false);
          setProgress(0);
        }
      }
    );

    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }, [projectId]);

  const build = useCallback(async (config: UnityBuildConfiguration) => {
    if (!projectId) {
      throw new Error('No project ID');
    }

    setIsBuilding(true);
    setProgress(0);

    try {
      const buildId = await buildUnityPlayer(projectId, config);
      setCurrentBuildId(buildId);
      return buildId;
    } catch (err) {
      setIsBuilding(false);
      throw err;
    }
  }, [projectId]);

  return {
    build,
    isBuilding,
    progress,
    currentBuildId,
    getDefaultOptions: getDefaultBuildOptions,
    getDevelopmentOptions: getDevelopmentBuildOptions,
    getReleaseOptions: getReleaseBuildOptions,
  };
}

export function useUnityProfiler(projectId: string | null, enabled = true) {
  const [frames, setFrames] = useState<UnityProfilerFrame[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    if (!projectId || !enabled) return;

    const unsubscribe = subscribeToProfilerData(projectId, (frame) => {
      setFrames((prev) => [...prev.slice(-299), frame]);
    });

    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }, [projectId, enabled]);

  const start = useCallback(() => {
    setIsRecording(true);
    setFrames([]);
  }, []);

  const stop = useCallback(() => {
    setIsRecording(false);
  }, []);

  const clear = useCallback(() => {
    setFrames([]);
  }, []);

  return {
    frames,
    isRecording,
    start,
    stop,
    clear,
  };
}

export function useUnityLogs(projectId: string | null) {
  const [logs, setLogs] = useState<Array<{
    type: 'log' | 'warning' | 'error';
    message: string;
    stackTrace?: string;
    timestamp: number;
  }>>([]);

  useEffect(() => {
    if (!projectId) return;

    const unsubscribe = subscribe(
      `slate.unity.logs.${projectId}`,
      (msg: any) => {
        if (msg.data?.log) {
          setLogs((prev) => [...prev.slice(-999), msg.data.log]);
        }
      }
    );

    return () => {
      unsubscribe.then(unsub => unsub());
    };
  }, [projectId]);

  const clear = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    clear,
  };
}
