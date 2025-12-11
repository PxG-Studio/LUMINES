import { useState, useCallback } from 'react';
import { ParsedUnityAsset, AssetType } from './types';

export const useUnityAssetParser = () => {
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectAssetType = (fileName: string): AssetType => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'prefab':
        return 'Prefab';
      case 'mat':
      case 'material':
        return 'Material';
      case 'cs':
      case 'shader':
        return 'Script';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'tga':
      case 'psd':
        return 'Texture';
      case 'fbx':
      case 'obj':
      case 'blend':
      case 'mesh':
        return 'Mesh';
      default:
        return 'Unknown';
    }
  };

  const parseAsset = useCallback(async (file: File): Promise<ParsedUnityAsset> => {
    setParsing(true);
    setError(null);

    try {
      const type = detectAssetType(file.name);
      const id = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      let contents: string | undefined;
      let previewUrl: string | undefined;

      if (type === 'Script') {
        contents = await file.text();
      } else if (type === 'Texture') {
        previewUrl = URL.createObjectURL(file);
      }

      const dependencies = generateMockDependencies(type);
      const children = generateMockChildren(type, file.name);

      const asset: ParsedUnityAsset = {
        id,
        name: file.name,
        type,
        size: file.size,
        dependencies,
        contents,
        previewUrl,
        metadata: {
          guid: generateGUID(),
          fileId: Math.floor(Math.random() * 1000000),
          imported: new Date().toISOString(),
          path: `Assets/${file.name}`,
        },
        children,
      };

      setParsing(false);
      return asset;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to parse asset';
      setError(message);
      setParsing(false);
      throw new Error(message);
    }
  }, []);

  const parseMultipleAssets = useCallback(
    async (files: File[]): Promise<ParsedUnityAsset[]> => {
      const results: ParsedUnityAsset[] = [];
      for (const file of files) {
        try {
          const parsed = await parseAsset(file);
          results.push(parsed);
        } catch (err) {
          console.error(`Failed to parse ${file.name}:`, err);
        }
      }
      return results;
    },
    [parseAsset]
  );

  return {
    parseAsset,
    parseMultipleAssets,
    parsing,
    error,
  };
};

function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateMockDependencies(type: AssetType): string[] {
  switch (type) {
    case 'Prefab':
      return ['UnityEngine.CoreModule', 'UnityEngine.PhysicsModule', 'Material_Main'];
    case 'Material':
      return ['Shader_Standard', 'Texture_Albedo', 'Texture_Normal'];
    case 'Script':
      return ['UnityEngine', 'System', 'UnityEngine.UI'];
    case 'Mesh':
      return ['Material_Default'];
    default:
      return [];
  }
}

function generateMockChildren(type: AssetType, parentName: string): ParsedUnityAsset[] | undefined {
  if (type === 'Prefab') {
    return [
      {
        id: `child-${Date.now()}-1`,
        name: `${parentName.replace('.prefab', '')}_Mesh`,
        type: 'Mesh',
        size: 2048,
        dependencies: [],
        metadata: { transform: { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] } },
      },
      {
        id: `child-${Date.now()}-2`,
        name: `${parentName.replace('.prefab', '')}_Collider`,
        type: 'Unknown',
        size: 512,
        dependencies: [],
        metadata: { type: 'BoxCollider' },
      },
    ];
  }
  return undefined;
}
