import { request, publish } from '../messaging/client';
import { NatsSubjects } from '../messaging/subjects';
import type {
  RuntimeCommand,
  RuntimeCommandResult,
  ContainerConfig,
  ContainerStats,
} from './types';

const REGISTRY_URL = import.meta.env.VITE_REGISTRY_URL || 'https://192.168.86.27:5000';

export async function startContainer(
  sessionId: string,
  config: ContainerConfig,
  timeout = 30000
): Promise<RuntimeCommandResult> {
  try {
    const command: RuntimeCommand = {
      type: 'start',
      session_id: sessionId,
      timeout,
    };

    await publish(NatsSubjects.runtime.started(sessionId), {
      type: 'started',
      sessionId,
      timestamp: Date.now(),
      data: config,
    });

    const result = await request(
      `slate.container.start.${sessionId}`,
      { config, command },
      timeout
    );

    return result;
  } catch (error) {
    console.error('Failed to start container:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function stopContainer(
  sessionId: string,
  timeout = 10000
): Promise<RuntimeCommandResult> {
  try {
    const command: RuntimeCommand = {
      type: 'stop',
      session_id: sessionId,
      timeout,
    };

    await publish(NatsSubjects.runtime.stopped(sessionId), {
      type: 'stopped',
      sessionId,
      timestamp: Date.now(),
    });

    const result = await request(
      `slate.container.stop.${sessionId}`,
      { command },
      timeout
    );

    return result;
  } catch (error) {
    console.error('Failed to stop container:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function restartContainer(
  sessionId: string,
  timeout = 30000
): Promise<RuntimeCommandResult> {
  try {
    const command: RuntimeCommand = {
      type: 'restart',
      session_id: sessionId,
      timeout,
    };

    const result = await request(
      `slate.container.restart.${sessionId}`,
      { command },
      timeout
    );

    return result;
  } catch (error) {
    console.error('Failed to restart container:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function executeCommand(
  sessionId: string,
  command: string,
  args?: string[],
  timeout = 5000
): Promise<RuntimeCommandResult> {
  try {
    const runtimeCommand: RuntimeCommand = {
      type: 'execute',
      session_id: sessionId,
      command,
      args,
      timeout,
    };

    const result = await request(
      `slate.container.execute.${sessionId}`,
      { command: runtimeCommand },
      timeout
    );

    return result;
  } catch (error) {
    console.error('Failed to execute command:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function getContainerStats(
  sessionId: string,
  timeout = 5000
): Promise<ContainerStats | null> {
  try {
    const command: RuntimeCommand = {
      type: 'stats',
      session_id: sessionId,
    };

    const result = await request(
      `slate.container.stats.${sessionId}`,
      { command },
      timeout
    );

    if (result.success && result.stats) {
      return result.stats;
    }

    return null;
  } catch (error) {
    console.error('Failed to get container stats:', error);
    return null;
  }
}

export async function publishRuntimeLog(
  sessionId: string,
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  metadata?: Record<string, any>
): Promise<void> {
  await publish(NatsSubjects.runtime.log(sessionId), {
    type: 'log',
    sessionId,
    timestamp: Date.now(),
    data: {
      level,
      message,
      metadata,
    },
  });
}

export async function publishRuntimeError(
  sessionId: string,
  error: string,
  metadata?: Record<string, any>
): Promise<void> {
  await publish(NatsSubjects.runtime.error(sessionId), {
    type: 'error',
    sessionId,
    timestamp: Date.now(),
    data: {
      error,
      metadata,
    },
  });
}

export function getImageUrl(image: string, tag: string): string {
  return `${REGISTRY_URL}/${image}:${tag}`;
}

export function getDefaultUnityConfig(projectId: string): ContainerConfig {
  return {
    image: 'slate/unity-runtime',
    tag: 'latest',
    name: `slate-unity-${projectId}`,
    ports: {
      '8080': 8080,
      '7777': 7777,
    },
    env: {
      PROJECT_ID: projectId,
      UNITY_LOG_LEVEL: 'info',
      ENABLE_PROFILER: 'true',
    },
    volumes: [
      {
        host: `/var/slate/projects/${projectId}`,
        container: '/app/project',
        readOnly: false,
      },
      {
        host: `/var/slate/assets/${projectId}`,
        container: '/app/assets',
        readOnly: true,
      },
    ],
    memory: '4g',
    cpus: 2,
    gpu: true,
    networkMode: 'bridge',
  };
}

export function getDefaultUnrealConfig(projectId: string): ContainerConfig {
  return {
    image: 'slate/unreal-runtime',
    tag: 'latest',
    name: `slate-unreal-${projectId}`,
    ports: {
      '8080': 8080,
      '7777': 7777,
    },
    env: {
      PROJECT_ID: projectId,
      UE_LOG_LEVEL: 'info',
    },
    volumes: [
      {
        host: `/var/slate/projects/${projectId}`,
        container: '/app/project',
        readOnly: false,
      },
    ],
    memory: '8g',
    cpus: 4,
    gpu: true,
    networkMode: 'bridge',
  };
}
