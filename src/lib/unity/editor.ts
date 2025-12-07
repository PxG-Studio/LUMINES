import { request, publish } from '../messaging/client';
import type { UnityEditorCommand, UnityEditorResponse, UnityPlayModeState, UnityPlayModeCommand } from './types';

export async function executeEditorMethod(
  projectId: string,
  className: string,
  methodName: string,
  args?: string[],
  timeout = 30000
): Promise<UnityEditorResponse> {
  const command: UnityEditorCommand = {
    type: 'executeMethod',
    method: `${className}.${methodName}`,
    args,
    projectPath: `/var/slate/projects/${projectId}`,
  };

  try {
    const response = await request(
      `slate.unity.editor.execute.${projectId}`,
      { command },
      timeout
    );

    return response as UnityEditorResponse;
  } catch (error) {
    return {
      success: false,
      exitCode: 1,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: 0,
    };
  }
}

export async function runUnityBatchMode(
  projectId: string,
  args: string[],
  logFile?: string,
  timeout = 300000
): Promise<UnityEditorResponse> {
  const command: UnityEditorCommand = {
    type: 'batch',
    args,
    logFile,
    projectPath: `/var/slate/projects/${projectId}`,
  };

  try {
    const response = await request(
      `slate.unity.editor.batch.${projectId}`,
      { command },
      timeout
    );

    return response as UnityEditorResponse;
  } catch (error) {
    return {
      success: false,
      exitCode: 1,
      output: '',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: 0,
    };
  }
}

export async function refreshAssetDatabase(projectId: string): Promise<UnityEditorResponse> {
  return executeEditorMethod(projectId, 'UnityEditor.AssetDatabase', 'Refresh');
}

export async function compileScripts(projectId: string): Promise<UnityEditorResponse> {
  return executeEditorMethod(
    projectId,
    'UnityEditor.Compilation.CompilationPipeline',
    'RequestScriptCompilation'
  );
}

export async function clearConsole(projectId: string): Promise<void> {
  await publish(`slate.unity.editor.console.clear.${projectId}`, {
    type: 'clearConsole',
    projectId,
    timestamp: Date.now(),
  });
}

export async function getEditorPreference(
  projectId: string,
  key: string
): Promise<string | null> {
  const response = await executeEditorMethod(
    projectId,
    'UnityEditor.EditorPrefs',
    'GetString',
    [key]
  );

  if (response.success) {
    return response.output.trim();
  }

  return null;
}

export async function setEditorPreference(
  projectId: string,
  key: string,
  value: string
): Promise<boolean> {
  const response = await executeEditorMethod(
    projectId,
    'UnityEditor.EditorPrefs',
    'SetString',
    [key, value]
  );

  return response.success;
}

export async function enterPlayMode(projectId: string): Promise<void> {
  const command: UnityPlayModeCommand = {
    action: 'play',
  };

  await publish(`slate.unity.playmode.${projectId}`, {
    type: 'playModeCommand',
    projectId,
    timestamp: Date.now(),
    data: command,
  });
}

export async function exitPlayMode(projectId: string): Promise<void> {
  const command: UnityPlayModeCommand = {
    action: 'stop',
  };

  await publish(`slate.unity.playmode.${projectId}`, {
    type: 'playModeCommand',
    projectId,
    timestamp: Date.now(),
    data: command,
  });
}

export async function pausePlayMode(projectId: string): Promise<void> {
  const command: UnityPlayModeCommand = {
    action: 'pause',
  };

  await publish(`slate.unity.playmode.${projectId}`, {
    type: 'playModeCommand',
    projectId,
    timestamp: Date.now(),
    data: command,
  });
}

export async function stepFrame(projectId: string): Promise<void> {
  const command: UnityPlayModeCommand = {
    action: 'step',
  };

  await publish(`slate.unity.playmode.${projectId}`, {
    type: 'playModeCommand',
    projectId,
    timestamp: Date.now(),
    data: command,
  });
}

export async function setTimeScale(projectId: string, timeScale: number): Promise<void> {
  const command: UnityPlayModeCommand = {
    action: 'play',
    params: {
      timeScale: Math.max(0, Math.min(100, timeScale)),
    },
  };

  await publish(`slate.unity.playmode.${projectId}`, {
    type: 'playModeCommand',
    projectId,
    timestamp: Date.now(),
    data: command,
  });
}

export async function setTargetFrameRate(projectId: string, frameRate: number): Promise<void> {
  const command: UnityPlayModeCommand = {
    action: 'play',
    params: {
      targetFrameRate: Math.max(-1, frameRate),
    },
  };

  await publish(`slate.unity.playmode.${projectId}`, {
    type: 'playModeCommand',
    projectId,
    timestamp: Date.now(),
    data: command,
  });
}

export async function getPlayModeState(projectId: string): Promise<UnityPlayModeState | null> {
  try {
    const response = await request(
      `slate.unity.playmode.state.${projectId}`,
      { projectId },
      5000
    );

    return response as UnityPlayModeState;
  } catch (error) {
    console.error('Failed to get play mode state:', error);
    return null;
  }
}

export async function openScene(projectId: string, scenePath: string): Promise<UnityEditorResponse> {
  return executeEditorMethod(
    projectId,
    'UnityEditor.SceneManagement.EditorSceneManager',
    'OpenScene',
    [scenePath]
  );
}

export async function saveCurrentScene(projectId: string): Promise<UnityEditorResponse> {
  return executeEditorMethod(
    projectId,
    'UnityEditor.SceneManagement.EditorSceneManager',
    'SaveOpenScenes'
  );
}

export async function createNewScene(
  projectId: string,
  scenePath: string,
  setup: 'DefaultGameObjects' | 'EmptyScene' = 'DefaultGameObjects'
): Promise<UnityEditorResponse> {
  return executeEditorMethod(
    projectId,
    'UnityEditor.SceneManagement.EditorSceneManager',
    'NewScene',
    [setup, scenePath]
  );
}

export interface UnityLogEntry {
  type: 'log' | 'warning' | 'error';
  message: string;
  stackTrace?: string;
  timestamp: number;
}

export async function subscribeToEditorLogs(
  projectId: string,
  callback: (log: UnityLogEntry) => void
): Promise<() => void> {
  return () => {};
}

export async function exportPackage(
  projectId: string,
  assetPaths: string[],
  outputPath: string,
  options?: {
    includeLibraryAssets?: boolean;
    includeDependencies?: boolean;
    interactive?: boolean;
  }
): Promise<UnityEditorResponse> {
  return executeEditorMethod(
    projectId,
    'UnityEditor.AssetDatabase',
    'ExportPackage',
    [assetPaths.join(','), outputPath, JSON.stringify(options || {})]
  );
}

export async function importPackage(
  projectId: string,
  packagePath: string,
  interactive = false
): Promise<UnityEditorResponse> {
  return executeEditorMethod(
    projectId,
    'UnityEditor.AssetDatabase',
    'ImportPackage',
    [packagePath, interactive.toString()]
  );
}
