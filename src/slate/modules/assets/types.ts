export type AssetType = 'Prefab' | 'Material' | 'Script' | 'Texture' | 'Mesh' | 'Unknown';

export interface ParsedUnityAsset {
  id: string;
  name: string;
  type: AssetType;
  size: number;
  dependencies: string[];
  contents?: string;
  previewUrl?: string;
  metadata?: Record<string, unknown>;
  children?: ParsedUnityAsset[];
}

export interface AssetMetadata {
  guid: string;
  fileId: number;
  type: AssetType;
  name: string;
  components?: ComponentMetadata[];
  materials?: string[];
  meshes?: string[];
}

export interface ComponentMetadata {
  type: string;
  properties: Record<string, unknown>;
}

export interface ReconstructedAsset {
  originalId: string;
  name: string;
  type: AssetType;
  modifiedProperties: Record<string, unknown>;
  exportFormat: 'json' | 'unitypackage';
  data: Blob;
}
