import { publish } from '../messaging/client';
import { NatsSubjects } from '../messaging/subjects';
import type { UnityAssetMetadata, UnityImportSettings } from './types';
import { inferAssetTypeFromPath, parseUnityMetaFile, extractGUIDsFromFile } from './parser';

export async function importUnityAsset(
  projectId: string,
  assetPath: string,
  content: Buffer | string,
  metaContent?: string
): Promise<string> {
  const assetId = crypto.randomUUID();

  const metadata: Partial<UnityAssetMetadata> = {
    path: assetPath,
    type: inferAssetTypeFromPath(assetPath),
  };

  if (metaContent) {
    const parsedMeta = parseUnityMetaFile(metaContent);
    Object.assign(metadata, parsedMeta);
  }

  await publish(NatsSubjects.asset.created(projectId), {
    type: 'created',
    projectId,
    timestamp: Date.now(),
    data: {
      assetId,
      path: assetPath,
      metadata,
    },
  });

  return assetId;
}

export async function generateUnityMetaFile(
  assetPath: string,
  assetType: string
): Promise<string> {
  const guid = crypto.randomUUID().replace(/-/g, '');

  let importer = 'DefaultImporter';
  switch (assetType) {
    case 'Texture':
      importer = 'TextureImporter';
      break;
    case 'Model':
      importer = 'ModelImporter';
      break;
    case 'Audio':
      importer = 'AudioImporter';
      break;
    case 'Script':
      importer = 'MonoImporter';
      break;
    case 'Shader':
      importer = 'ShaderImporter';
      break;
  }

  return `fileFormatVersion: 2
guid: ${guid}
${importer}:
  externalObjects: {}
  userData:
  assetBundleName:
  assetBundleVariant:
`;
}

export async function applyImportSettings(
  assetId: string,
  settings: Partial<UnityImportSettings>
): Promise<void> {
  await publish(`slate.unity.asset.import.${assetId}`, {
    type: 'importSettings',
    assetId,
    timestamp: Date.now(),
    data: settings,
  });
}

export async function refreshUnityAsset(projectId: string, assetPath: string): Promise<void> {
  await publish(`slate.unity.asset.refresh`, {
    type: 'refresh',
    projectId,
    timestamp: Date.now(),
    data: { assetPath },
  });
}

export async function reimportUnityAsset(projectId: string, assetPath: string): Promise<void> {
  await publish(`slate.unity.asset.reimport`, {
    type: 'reimport',
    projectId,
    timestamp: Date.now(),
    data: { assetPath },
  });
}

export async function deleteUnityAsset(
  projectId: string,
  assetPath: string,
  deleteMetaFile = true
): Promise<void> {
  await publish(NatsSubjects.asset.deleted(projectId), {
    type: 'deleted',
    projectId,
    timestamp: Date.now(),
    data: { assetPath, deleteMetaFile },
  });
}

export async function moveUnityAsset(
  projectId: string,
  oldPath: string,
  newPath: string
): Promise<void> {
  await publish(NatsSubjects.asset.updated(projectId), {
    type: 'moved',
    projectId,
    timestamp: Date.now(),
    data: { oldPath, newPath },
  });
}

export function extractAssetDependencies(fileContent: string): string[] {
  return extractGUIDsFromFile(fileContent);
}

export function getDefaultTextureImportSettings(): UnityImportSettings['textures'] {
  return {
    textureType: 'Default',
    textureShape: '2D',
    sRGBTexture: true,
    alphaSource: 'FromInput',
    alphaIsTransparency: false,
    npotScale: 'ToNearest',
    readable: false,
    mipmaps: true,
    maxTextureSize: 2048,
    compressionQuality: 50,
    textureCompression: 'Compressed',
  };
}

export function getDefaultModelImportSettings(): UnityImportSettings['models'] {
  return {
    fileScale: 1.0,
    meshCompression: 'Off',
    importBlendShapes: true,
    importVisibility: true,
    importCameras: true,
    importLights: true,
    swapUVChannels: false,
    generateSecondaryUV: false,
    normalImportMode: 'Import',
    normalCalculationMode: 'Unweighted',
    tangentImportMode: 'Calculate',
    importMaterials: true,
    materialLocation: 'External',
    importAnimation: true,
    animationType: 'Generic',
    optimizeGameObjects: false,
  };
}

export function getDefaultAudioImportSettings(): UnityImportSettings['audio'] {
  return {
    forceToMono: false,
    normalize: true,
    preloadAudioData: true,
    loadInBackground: false,
    ambisonic: false,
    sampleRateSetting: 'PreserveSampleRate',
    compressionFormat: 'Vorbis',
    quality: 0.5,
  };
}

export async function createAssetBundle(
  projectId: string,
  bundleName: string,
  assetPaths: string[],
  variant?: string
): Promise<void> {
  await publish(`slate.unity.assetbundle.create`, {
    type: 'createBundle',
    projectId,
    timestamp: Date.now(),
    data: {
      bundleName,
      assetPaths,
      variant,
    },
  });
}

export async function buildAssetBundles(
  projectId: string,
  outputPath: string,
  target: string,
  options?: {
    forceRebuild?: boolean;
    strictMode?: boolean;
    dryRun?: boolean;
  }
): Promise<void> {
  await publish(`slate.unity.assetbundle.build`, {
    type: 'buildBundles',
    projectId,
    timestamp: Date.now(),
    data: {
      outputPath,
      target,
      options,
    },
  });
}

export interface UnityAssetSearchQuery {
  type?: string;
  name?: string;
  label?: string;
  path?: string;
  guid?: string;
}

export async function searchUnityAssets(
  projectId: string,
  query: UnityAssetSearchQuery
): Promise<UnityAssetMetadata[]> {
  return [];
}

export function validateAssetPath(path: string): boolean {
  if (!path.startsWith('Assets/') && !path.startsWith('Packages/')) {
    return false;
  }

  const invalidChars = /[<>:"|?*]/;
  if (invalidChars.test(path)) {
    return false;
  }

  return true;
}

export function sanitizeAssetName(name: string): string {
  return name
    .replace(/[<>:"|?*]/g, '_')
    .replace(/\s+/g, '_')
    .replace(/_{2,}/g, '_')
    .trim();
}
