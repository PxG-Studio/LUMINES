import { publish, request } from '../messaging/client';
import { createProject, updateProject, getProject } from '../database/operations/projects';
import { createAsset, listAssets } from '../database/operations/assets';
import { createFile, listFiles } from '../database/operations/files';
import { parseUnityProjectVersion, parseUnityPackageManifest, parseUnitySceneList, parseProjectSettings, inferAssetTypeFromPath, parseUnityMetaFile } from './parser';
import type { UnityProject, UnityScene, UnityPackage } from './types';

export interface UnitySyncOptions {
  syncAssets?: boolean;
  syncScenes?: boolean;
  syncPackages?: boolean;
  syncSettings?: boolean;
  deep?: boolean;
}

export interface UnitySyncResult {
  success: boolean;
  projectId: string;
  stats: {
    filesProcessed: number;
    assetsProcessed: number;
    scenesFound: number;
    packagesFound: number;
    errors: number;
  };
  errors: string[];
}

export interface UnityProjectStructure {
  version: string;
  scenes: UnityScene[];
  packages: UnityPackage[];
  assets: Array<{
    path: string;
    guid: string;
    type: string;
  }>;
  settings: {
    companyName: string;
    productName: string;
  };
}

export async function scanUnityProject(
  projectPath: string,
  userId: string
): Promise<UnityProjectStructure> {
  try {
    const response = await request(
      'slate.unity.project.scan',
      { projectPath, userId },
      60000
    );

    return response as UnityProjectStructure;
  } catch (error) {
    console.error('Failed to scan Unity project:', error);
    throw error;
  }
}

export async function syncUnityProject(
  projectPath: string,
  userId: string,
  options: UnitySyncOptions = {}
): Promise<UnitySyncResult> {
  const {
    syncAssets = true,
    syncScenes = true,
    syncPackages = true,
    syncSettings = true,
    deep = false,
  } = options;

  const result: UnitySyncResult = {
    success: false,
    projectId: '',
    stats: {
      filesProcessed: 0,
      assetsProcessed: 0,
      scenesFound: 0,
      packagesFound: 0,
      errors: 0,
    },
    errors: [],
  };

  try {
    await publish('slate.unity.sync.started', {
      type: 'syncStarted',
      userId,
      timestamp: Date.now(),
      data: { projectPath, options },
    });

    const structure = await scanUnityProject(projectPath, userId);

    const projectName = projectPath.split('/').pop() || 'Unity Project';

    const project = await createProject({
      name: projectName,
      description: `Unity ${structure.version} Project`,
      type: 'unity',
      user_id: userId,
      metadata: {
        unityVersion: structure.version,
        companyName: structure.settings.companyName,
        productName: structure.settings.productName,
        syncedAt: new Date().toISOString(),
      },
    });

    result.projectId = project.id;

    if (syncScenes) {
      for (const scene of structure.scenes) {
        try {
          await createFile(
            project.id,
            scene.path,
            'scene',
            {
              guid: scene.guid,
              buildIndex: scene.buildIndex,
            }
          );
          result.stats.scenesFound++;
          result.stats.filesProcessed++;
        } catch (error) {
          result.stats.errors++;
          result.errors.push(`Failed to sync scene ${scene.path}: ${error}`);
        }
      }
    }

    if (syncAssets && structure.assets) {
      for (const asset of structure.assets) {
        try {
          await createFile(
            project.id,
            asset.path,
            asset.type,
            {
              guid: asset.guid,
            }
          );
          result.stats.assetsProcessed++;
          result.stats.filesProcessed++;
        } catch (error) {
          result.stats.errors++;
          result.errors.push(`Failed to sync asset ${asset.path}: ${error}`);
        }
      }
    }

    if (syncPackages) {
      await updateProject(project.id, {
        metadata: {
          ...project.metadata,
          packages: structure.packages,
        },
      });
      result.stats.packagesFound = structure.packages.length;
    }

    await publish('slate.unity.sync.completed', {
      type: 'syncCompleted',
      userId,
      timestamp: Date.now(),
      data: { projectId: project.id, stats: result.stats },
    });

    result.success = true;
    return result;
  } catch (error) {
    result.errors.push(`Sync failed: ${error}`);

    await publish('slate.unity.sync.failed', {
      type: 'syncFailed',
      userId,
      timestamp: Date.now(),
      data: { error: error instanceof Error ? error.message : 'Unknown error' },
    });

    throw error;
  }
}

export async function initializeUnityProject(
  projectName: string,
  unityVersion: string,
  userId: string,
  template?: 'empty' | '2d' | '3d' | 'urp' | 'hdrp'
): Promise<{ projectId: string; projectPath: string }> {
  const projectId = crypto.randomUUID();

  await publish('slate.unity.project.create', {
    type: 'createProject',
    userId,
    timestamp: Date.now(),
    data: {
      projectId,
      projectName,
      unityVersion,
      template: template || '3d',
    },
  });

  const project = await createProject({
    name: projectName,
    description: `Unity ${unityVersion} Project`,
    type: 'unity',
    user_id: userId,
    metadata: {
      unityVersion,
      template,
      createdAt: new Date().toISOString(),
    },
  });

  const projectPath = `/var/slate/projects/${project.id}`;

  return { projectId: project.id, projectPath };
}

export async function watchUnityProject(
  projectId: string,
  callback: (event: UnityFileSystemEvent) => void
): Promise<() => void> {
  return () => {};
}

export interface UnityFileSystemEvent {
  type: 'created' | 'modified' | 'deleted' | 'renamed';
  path: string;
  oldPath?: string;
  timestamp: number;
  metadata?: {
    guid?: string;
    fileId?: number;
  };
}

export async function applyUnityProjectChanges(
  projectId: string,
  changes: UnityFileSystemEvent[]
): Promise<void> {
  for (const change of changes) {
    try {
      switch (change.type) {
        case 'created':
          await createFile(
            projectId,
            change.path,
            inferAssetTypeFromPath(change.path),
            change.metadata
          );
          break;

        case 'modified':
          break;

        case 'deleted':
          break;

        case 'renamed':
          if (change.oldPath) {
          }
          break;
      }
    } catch (error) {
      console.error(`Failed to apply change to ${change.path}:`, error);
    }
  }

  await publish('slate.unity.project.changes', {
    type: 'changesApplied',
    projectId,
    timestamp: Date.now(),
    data: { changeCount: changes.length },
  });
}

export async function exportUnityProject(
  projectId: string,
  outputPath: string,
  options?: {
    includeLibrary?: boolean;
    includeTemp?: boolean;
    includePackages?: boolean;
  }
): Promise<void> {
  await publish('slate.unity.project.export', {
    type: 'export',
    projectId,
    timestamp: Date.now(),
    data: { outputPath, options },
  });
}

export async function importUnityProject(
  projectPath: string,
  userId: string
): Promise<string> {
  const syncResult = await syncUnityProject(projectPath, userId, {
    syncAssets: true,
    syncScenes: true,
    syncPackages: true,
    syncSettings: true,
    deep: true,
  });

  if (!syncResult.success) {
    throw new Error('Failed to import Unity project: ' + syncResult.errors.join(', '));
  }

  return syncResult.projectId;
}

export async function validateUnityProject(projectPath: string): Promise<{
  valid: boolean;
  version?: string;
  issues: string[];
}> {
  try {
    const response = await request(
      'slate.unity.project.validate',
      { projectPath },
      10000
    );

    return response as {
      valid: boolean;
      version?: string;
      issues: string[];
    };
  } catch (error) {
    return {
      valid: false,
      issues: [`Validation failed: ${error}`],
    };
  }
}

export async function getUnityProjectMetadata(projectId: string): Promise<UnityProject | null> {
  const project = await getProject(projectId);

  if (!project || project.type !== 'unity') {
    return null;
  }

  const files = await listFiles(projectId);
  const assets = await listAssets(projectId);

  const scenes = files
    .filter(f => f.type === 'scene')
    .map(f => ({
      guid: f.metadata?.guid || '',
      path: f.path,
      name: f.name,
      buildIndex: f.metadata?.buildIndex || 0,
      enabled: true,
    }));

  const packages = project.metadata?.packages || [];

  return {
    id: project.id,
    name: project.name,
    version: '1.0.0',
    unityVersion: project.metadata?.unityVersion || 'Unknown',
    path: `/var/slate/projects/${project.id}`,
    settings: {
      companyName: project.metadata?.companyName || '',
      productName: project.metadata?.productName || project.name,
      playerSettings: {} as any,
      qualitySettings: {} as any,
      graphicsSettings: {} as any,
    },
    scenes,
    packages,
    metadata: project.metadata,
  };
}

export async function cleanUnityProject(projectId: string): Promise<void> {
  await publish('slate.unity.project.clean', {
    type: 'clean',
    projectId,
    timestamp: Date.now(),
  });
}

export async function rebuildUnityLibrary(projectId: string): Promise<void> {
  await publish('slate.unity.project.rebuild', {
    type: 'rebuildLibrary',
    projectId,
    timestamp: Date.now(),
  });
}
