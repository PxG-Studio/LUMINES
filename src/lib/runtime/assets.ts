import { publish } from '../messaging/client';

export type AssetProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AssetProcessingJob {
  id: string;
  assetId: string;
  projectId: string;
  type: 'texture' | 'model' | 'audio' | 'video' | 'document';
  operations: AssetOperation[];
  status: AssetProcessingStatus;
  progress: number;
  startedAt?: number;
  completedAt?: number;
  error?: string;
}

export interface AssetOperation {
  type: string;
  params: Record<string, any>;
}

export interface TextureProcessingOptions {
  resize?: { width?: number; height?: number };
  format?: 'png' | 'jpg' | 'webp' | 'dds' | 'ktx2';
  compression?: 'none' | 'bc7' | 'astc' | 'etc2';
  generateMipmaps?: boolean;
  quality?: number;
}

export interface ModelProcessingOptions {
  format?: 'gltf' | 'glb' | 'fbx' | 'obj';
  scale?: number;
  optimize?: boolean;
  generateLODs?: boolean;
  lodLevels?: number[];
  bakeLighting?: boolean;
}

export interface AudioProcessingOptions {
  format?: 'mp3' | 'ogg' | 'wav';
  bitrate?: number;
  sampleRate?: number;
  channels?: 1 | 2;
  normalize?: boolean;
}

export async function processTexture(
  assetId: string,
  projectId: string,
  options: TextureProcessingOptions
): Promise<string> {
  const jobId = crypto.randomUUID();

  await publish(`slate.asset.process.texture`, {
    jobId,
    assetId,
    projectId,
    type: 'texture',
    options,
    timestamp: Date.now(),
  });

  return jobId;
}

export async function processModel(
  assetId: string,
  projectId: string,
  options: ModelProcessingOptions
): Promise<string> {
  const jobId = crypto.randomUUID();

  await publish(`slate.asset.process.model`, {
    jobId,
    assetId,
    projectId,
    type: 'model',
    options,
    timestamp: Date.now(),
  });

  return jobId;
}

export async function processAudio(
  assetId: string,
  projectId: string,
  options: AudioProcessingOptions
): Promise<string> {
  const jobId = crypto.randomUUID();

  await publish(`slate.asset.process.audio`, {
    jobId,
    assetId,
    projectId,
    type: 'audio',
    options,
    timestamp: Date.now(),
  });

  return jobId;
}

export async function batchProcessAssets(
  assets: Array<{
    assetId: string;
    type: 'texture' | 'model' | 'audio';
    options: any;
  }>,
  projectId: string
): Promise<string[]> {
  const jobIds: string[] = [];

  for (const asset of assets) {
    let jobId: string;

    switch (asset.type) {
      case 'texture':
        jobId = await processTexture(asset.assetId, projectId, asset.options);
        break;
      case 'model':
        jobId = await processModel(asset.assetId, projectId, asset.options);
        break;
      case 'audio':
        jobId = await processAudio(asset.assetId, projectId, asset.options);
        break;
      default:
        continue;
    }

    jobIds.push(jobId);
  }

  return jobIds;
}

export function getDefaultTextureOptions(): TextureProcessingOptions {
  return {
    format: 'webp',
    compression: 'bc7',
    generateMipmaps: true,
    quality: 90,
  };
}

export function getDefaultModelOptions(): ModelProcessingOptions {
  return {
    format: 'glb',
    scale: 1.0,
    optimize: true,
    generateLODs: true,
    lodLevels: [0.75, 0.5, 0.25],
  };
}

export function getDefaultAudioOptions(): AudioProcessingOptions {
  return {
    format: 'ogg',
    bitrate: 192,
    sampleRate: 48000,
    channels: 2,
    normalize: true,
  };
}

export function estimateProcessingTime(
  assetType: string,
  fileSize: number,
  operations: number
): number {
  const baseTime: Record<string, number> = {
    texture: 5,
    model: 15,
    audio: 3,
    video: 60,
    document: 2,
  };

  const base = baseTime[assetType] || 10;
  const sizeMultiplier = Math.max(0.5, Math.min(5.0, fileSize / (1024 * 1024)));
  const operationMultiplier = 1 + operations * 0.3;

  return Math.round(base * sizeMultiplier * operationMultiplier);
}

export function getSupportedFormats(assetType: string): string[] {
  const formats: Record<string, string[]> = {
    texture: ['png', 'jpg', 'jpeg', 'tga', 'bmp', 'psd', 'dds', 'exr', 'hdr'],
    model: ['fbx', 'obj', 'gltf', 'glb', 'blend', 'dae', '3ds', 'max'],
    audio: ['wav', 'mp3', 'ogg', 'flac', 'aiff', 'm4a'],
    video: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
    document: ['pdf', 'txt', 'md', 'json', 'xml', 'yaml'],
  };

  return formats[assetType] || [];
}

export function getOutputFormats(assetType: string): string[] {
  const formats: Record<string, string[]> = {
    texture: ['png', 'jpg', 'webp', 'dds', 'ktx2'],
    model: ['gltf', 'glb', 'fbx', 'obj'],
    audio: ['mp3', 'ogg', 'wav'],
    video: ['mp4', 'webm'],
    document: ['pdf', 'txt', 'json'],
  };

  return formats[assetType] || [];
}
