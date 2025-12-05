import { publish } from '../messaging/client';
import type { UnityBuildTarget, UnityBuildPlatform } from './types';

export interface UnityBuildConfiguration {
  target: UnityBuildTarget;
  outputPath: string;
  scenes?: string[];
  options: UnityBuildOptions;
}

export interface UnityBuildOptions {
  developmentBuild: boolean;
  autoConnectProfiler: boolean;
  allowDebugging: boolean;
  buildScriptsOnly: boolean;
  compressWithLz4: boolean;
  compressWithLz4HC: boolean;
  strictMode: boolean;
  detailedBuildReport: boolean;
  cleanBuildCache: boolean;
  showBuiltPlayer: boolean;
}

export async function buildUnityPlayer(
  projectId: string,
  config: UnityBuildConfiguration
): Promise<string> {
  const buildId = crypto.randomUUID();

  await publish(`slate.unity.build.start`, {
    type: 'buildStart',
    projectId,
    buildId,
    timestamp: Date.now(),
    data: config,
  });

  return buildId;
}

export function getDefaultBuildOptions(): UnityBuildOptions {
  return {
    developmentBuild: false,
    autoConnectProfiler: false,
    allowDebugging: false,
    buildScriptsOnly: false,
    compressWithLz4: false,
    compressWithLz4HC: true,
    strictMode: true,
    detailedBuildReport: true,
    cleanBuildCache: false,
    showBuiltPlayer: false,
  };
}

export function getDevelopmentBuildOptions(): UnityBuildOptions {
  return {
    developmentBuild: true,
    autoConnectProfiler: true,
    allowDebugging: true,
    buildScriptsOnly: false,
    compressWithLz4: true,
    compressWithLz4HC: false,
    strictMode: false,
    detailedBuildReport: true,
    cleanBuildCache: false,
    showBuiltPlayer: true,
  };
}

export function getReleaseBuildOptions(): UnityBuildOptions {
  return {
    developmentBuild: false,
    autoConnectProfiler: false,
    allowDebugging: false,
    buildScriptsOnly: false,
    compressWithLz4: false,
    compressWithLz4HC: true,
    strictMode: true,
    detailedBuildReport: true,
    cleanBuildCache: true,
    showBuiltPlayer: false,
  };
}

export function getUnityBuildPlatforms(): Array<{
  id: UnityBuildPlatform;
  name: string;
  icon: string;
  architectures: string[];
}> {
  return [
    {
      id: 'StandaloneWindows64',
      name: 'Windows (x64)',
      icon: 'monitor',
      architectures: ['x86_64'],
    },
    {
      id: 'StandaloneOSX',
      name: 'macOS',
      icon: 'apple',
      architectures: ['x86_64', 'ARM64', 'Universal'],
    },
    {
      id: 'StandaloneLinux64',
      name: 'Linux (x64)',
      icon: 'box',
      architectures: ['x86_64'],
    },
    {
      id: 'iOS',
      name: 'iOS',
      icon: 'smartphone',
      architectures: ['ARM64'],
    },
    {
      id: 'Android',
      name: 'Android',
      icon: 'smartphone',
      architectures: ['ARMv7', 'ARM64', 'x86'],
    },
    {
      id: 'WebGL',
      name: 'WebGL',
      icon: 'globe',
      architectures: ['WebAssembly'],
    },
    {
      id: 'PS5',
      name: 'PlayStation 5',
      icon: 'gamepad-2',
      architectures: ['x86_64'],
    },
    {
      id: 'XboxOne',
      name: 'Xbox Series X|S',
      icon: 'gamepad-2',
      architectures: ['x86_64'],
    },
    {
      id: 'Switch',
      name: 'Nintendo Switch',
      icon: 'gamepad-2',
      architectures: ['ARM64'],
    },
  ];
}

export async function getActiveBuildTarget(projectId: string): Promise<UnityBuildPlatform> {
  return 'StandaloneWindows64';
}

export async function switchBuildTarget(
  projectId: string,
  platform: UnityBuildPlatform
): Promise<void> {
  await publish(`slate.unity.build.switchTarget`, {
    type: 'switchTarget',
    projectId,
    timestamp: Date.now(),
    data: { platform },
  });
}

export async function getBuildReport(
  projectId: string,
  buildId: string
): Promise<UnityBuildReport | null> {
  return null;
}

export interface UnityBuildReport {
  summary: UnityBuildSummary;
  steps: UnityBuildStep[];
  assets: UnityBuildAssetInfo[];
  files: UnityBuildFileInfo[];
}

export interface UnityBuildSummary {
  platform: UnityBuildPlatform;
  result: 'Succeeded' | 'Failed' | 'Cancelled' | 'Unknown';
  totalTime: number;
  totalSize: number;
  totalErrors: number;
  totalWarnings: number;
  buildStartedAt: string;
  buildEndedAt: string;
  outputPath: string;
}

export interface UnityBuildStep {
  name: string;
  duration: number;
  depth: number;
  messages: Array<{ type: 'error' | 'warning' | 'info'; content: string }>;
}

export interface UnityBuildAssetInfo {
  path: string;
  size: number;
  packed: boolean;
}

export interface UnityBuildFileInfo {
  path: string;
  role: 'MainData' | 'AssetBundle' | 'StreamingAsset' | 'Resources';
  size: number;
}

export function estimateUnityBuildSize(
  platform: UnityBuildPlatform,
  scriptingBackend: 'Mono' | 'IL2CPP',
  stripEngineCode: boolean
): number {
  const baseSizes: Record<UnityBuildPlatform, number> = {
    StandaloneWindows: 50,
    StandaloneWindows64: 55,
    StandaloneOSX: 60,
    StandaloneLinux64: 55,
    iOS: 80,
    Android: 70,
    WebGL: 25,
    PS5: 100,
    XboxOne: 100,
    Switch: 90,
  };

  let size = baseSizes[platform] || 50;

  if (scriptingBackend === 'IL2CPP') {
    size *= 1.5;
  }

  if (stripEngineCode) {
    size *= 0.7;
  }

  return Math.round(size);
}

export function getRecommendedScriptingBackend(
  platform: UnityBuildPlatform
): 'Mono' | 'IL2CPP' {
  const il2cppPlatforms: UnityBuildPlatform[] = ['iOS', 'WebGL', 'PS5', 'XboxOne', 'Switch'];
  return il2cppPlatforms.includes(platform) ? 'IL2CPP' : 'Mono';
}

export function validateBuildConfiguration(config: UnityBuildConfiguration): string[] {
  const errors: string[] = [];

  if (!config.outputPath) {
    errors.push('Output path is required');
  }

  if (config.scenes && config.scenes.length === 0) {
    errors.push('At least one scene must be selected');
  }

  if (config.target.developmentBuild && config.target.scriptDebugging && config.target.scriptingBackend === 'IL2CPP') {
    errors.push('Script debugging is not recommended with IL2CPP in development builds');
  }

  return errors;
}
