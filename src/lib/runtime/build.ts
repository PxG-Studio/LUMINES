import { publish } from '../messaging/client';
import { NatsSubjects } from '../messaging/subjects';
import type { BuildJobInsert } from './types';

export interface BuildOptions {
  clean?: boolean;
  verbose?: boolean;
  parallelJobs?: number;
  optimization?: 'none' | 'basic' | 'full';
  compressionFormat?: 'none' | 'lz4' | 'gzip';
  includeDebugSymbols?: boolean;
}

export async function startBuild(
  projectId: string,
  userId: string,
  job: BuildJobInsert,
  options?: BuildOptions
): Promise<void> {
  await publish(NatsSubjects.build.started(projectId), {
    type: 'started',
    projectId,
    timestamp: Date.now(),
    data: {
      job,
      options,
      userId,
    },
  });
}

export async function updateBuildProgress(
  projectId: string,
  jobId: string,
  progress: number,
  message?: string
): Promise<void> {
  await publish(NatsSubjects.build.progress(projectId), {
    type: 'progress',
    projectId,
    timestamp: Date.now(),
    data: {
      jobId,
      progress: Math.max(0, Math.min(100, progress)),
      message,
    },
  });
}

export async function completeBuild(
  projectId: string,
  jobId: string,
  outputPath: string,
  artifacts?: Array<{ name: string; path: string; size: number }>
): Promise<void> {
  await publish(NatsSubjects.build.completed(projectId), {
    type: 'completed',
    projectId,
    timestamp: Date.now(),
    data: {
      jobId,
      outputPath,
      artifacts,
    },
  });
}

export async function failBuild(
  projectId: string,
  jobId: string,
  error: string,
  logs?: string[]
): Promise<void> {
  await publish(NatsSubjects.build.failed(projectId), {
    type: 'failed',
    projectId,
    timestamp: Date.now(),
    data: {
      jobId,
      error,
      logs,
    },
  });
}

export function getBuildPlatforms(): Array<{ id: string; name: string; icon: string }> {
  return [
    { id: 'windows', name: 'Windows', icon: 'monitor' },
    { id: 'macos', name: 'macOS', icon: 'apple' },
    { id: 'linux', name: 'Linux', icon: 'box' },
    { id: 'android', name: 'Android', icon: 'smartphone' },
    { id: 'ios', name: 'iOS', icon: 'smartphone' },
    { id: 'webgl', name: 'WebGL', icon: 'globe' },
    { id: 'ps5', name: 'PlayStation 5', icon: 'gamepad-2' },
    { id: 'xbox', name: 'Xbox Series X', icon: 'gamepad-2' },
    { id: 'switch', name: 'Nintendo Switch', icon: 'gamepad-2' },
  ];
}

export function getBuildTypes(): Array<{ id: string; name: string; description: string }> {
  return [
    {
      id: 'development',
      name: 'Development',
      description: 'Fast iteration with debug symbols and logging',
    },
    {
      id: 'staging',
      name: 'Staging',
      description: 'Pre-production testing with some optimizations',
    },
    {
      id: 'production',
      name: 'Production',
      description: 'Fully optimized release build',
    },
  ];
}

export function getDefaultBuildOptions(buildType: string): BuildOptions {
  const defaults: Record<string, BuildOptions> = {
    development: {
      clean: false,
      verbose: true,
      parallelJobs: 4,
      optimization: 'none',
      compressionFormat: 'none',
      includeDebugSymbols: true,
    },
    staging: {
      clean: true,
      verbose: false,
      parallelJobs: 8,
      optimization: 'basic',
      compressionFormat: 'lz4',
      includeDebugSymbols: true,
    },
    production: {
      clean: true,
      verbose: false,
      parallelJobs: 8,
      optimization: 'full',
      compressionFormat: 'gzip',
      includeDebugSymbols: false,
    },
  };

  return defaults[buildType] || defaults.development;
}

export function estimateBuildTime(
  platform: string,
  buildType: string,
  projectSize: number
): number {
  const baseTime: Record<string, number> = {
    windows: 300,
    macos: 360,
    linux: 280,
    android: 420,
    ios: 480,
    webgl: 240,
    ps5: 600,
    xbox: 600,
    switch: 540,
  };

  const typeMultiplier: Record<string, number> = {
    development: 0.6,
    staging: 1.0,
    production: 1.4,
  };

  const base = baseTime[platform] || 300;
  const multiplier = typeMultiplier[buildType] || 1.0;
  const sizeMultiplier = Math.max(0.5, Math.min(3.0, projectSize / 1000));

  return Math.round(base * multiplier * sizeMultiplier);
}
