/**
 * Plugin Manifest Schema
 * 
 * Defines the structure of a WISSIL plugin manifest
 */

export interface WISSILPluginManifest {
  name: string;
  id: string;
  version: string;
  author: string;
  description: string;
  homepage?: string;
  repository?: string;
  license?: string;
  
  permissions: PluginPermission[];
  
  extensionPoints: {
    nodes?: string[];
    shaders?: string[];
    inspectors?: string[];
    panels?: string[];
    templates?: string[];
    ai?: boolean;
    buildHooks?: boolean;
  };
  
  dependencies?: {
    [key: string]: string;
  };
  
  entry?: string;
  remoteEntry?: string;
  
  marketplace?: {
    price: 'free' | 'paid';
    categories: string[];
    rating?: number;
    downloads?: number;
    screenshots?: string[];
  };
}

export type PluginPermission = 
  | 'nodes'
  | 'shader'
  | 'scenegraph'
  | 'prefabs'
  | 'inspector'
  | 'timeline'
  | 'templates'
  | 'ai'
  | 'runtime'
  | 'build'
  | 'storage'
  | 'network';

export interface PluginExtensionPoint {
  id: string;
  type: 'node' | 'shader' | 'inspector' | 'panel' | 'template' | 'ai' | 'buildHook';
  definition: any;
}

export function validateManifest(manifest: any): manifest is WISSILPluginManifest {
  if (!manifest.name || !manifest.id || !manifest.version) {
    throw new Error('Plugin manifest missing required fields: name, id, version');
  }
  
  if (!manifest.author) {
    throw new Error('Plugin manifest missing required field: author');
  }
  
  if (!manifest.description) {
    throw new Error('Plugin manifest missing required field: description');
  }
  
  if (!manifest.permissions || !Array.isArray(manifest.permissions)) {
    throw new Error('Plugin manifest missing required field: permissions (array)');
  }
  
  if (!manifest.extensionPoints || typeof manifest.extensionPoints !== 'object') {
    throw new Error('Plugin manifest missing required field: extensionPoints');
  }
  
  // Validate version format
  if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    throw new Error(`Invalid version format: ${manifest.version}. Expected semver (x.y.z)`);
  }
  
  // Validate ID format
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)*$/.test(manifest.id)) {
    throw new Error(`Invalid plugin ID format: ${manifest.id}. Expected reverse-domain notation (com.example.plugin)`);
  }
  
  return true;
}

