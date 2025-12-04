import type {
  UnityProject,
  UnityProjectSettings,
  UnityScene,
  UnityPackage,
  UnityAssetMetadata,
  UnityAssetType,
} from './types';

export function parseUnityProjectVersion(versionText: string): string {
  const match = versionText.match(/m_EditorVersion:\s*(.+)/);
  return match ? match[1].trim() : 'Unknown';
}

export function parseUnityPackageManifest(manifestJson: string): UnityPackage[] {
  try {
    const manifest = JSON.parse(manifestJson);
    const packages: UnityPackage[] = [];

    if (manifest.dependencies) {
      for (const [name, version] of Object.entries(manifest.dependencies)) {
        packages.push({
          name,
          version: version as string,
          displayName: name,
        });
      }
    }

    return packages;
  } catch (error) {
    console.error('Failed to parse package manifest:', error);
    return [];
  }
}

export function parseUnitySceneList(editorBuildSettings: string): UnityScene[] {
  const scenes: UnityScene[] = [];
  const scenePattern = /path:\s*(.+\.unity)/g;
  const guidPattern = /guid:\s*([a-f0-9]+)/g;

  const paths = [...editorBuildSettings.matchAll(scenePattern)];
  const guids = [...editorBuildSettings.matchAll(guidPattern)];

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i][1].trim();
    const guid = guids[i] ? guids[i][1] : '';
    const name = path.split('/').pop()?.replace('.unity', '') || '';

    scenes.push({
      guid,
      path,
      name,
      buildIndex: i,
      enabled: true,
    });
  }

  return scenes;
}

export function parseUnityMetaFile(metaContent: string): Partial<UnityAssetMetadata> {
  const metadata: Partial<UnityAssetMetadata> = {};

  const guidMatch = metaContent.match(/guid:\s*([a-f0-9]+)/);
  if (guidMatch) {
    metadata.guid = guidMatch[1];
  }

  const versionMatch = metaContent.match(/fileFormatVersion:\s*(\d+)/);
  if (versionMatch) {
    metadata.fileFormatVersion = parseInt(versionMatch[1]);
  }

  const importerMatch = metaContent.match(/(\w+Importer):/);
  if (importerMatch) {
    metadata.importer = importerMatch[1];
  }

  const bundleMatch = metaContent.match(/assetBundleName:\s*(.+)/);
  if (bundleMatch) {
    metadata.assetBundleName = bundleMatch[1].trim();
  }

  const variantMatch = metaContent.match(/assetBundleVariant:\s*(.+)/);
  if (variantMatch) {
    metadata.assetBundleVariant = variantMatch[1].trim();
  }

  return metadata;
}

export function inferAssetTypeFromPath(path: string): UnityAssetType {
  const ext = path.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'prefab':
      return 'Prefab';
    case 'unity':
      return 'Scene';
    case 'asset':
      return 'ScriptableObject';
    case 'mat':
      return 'Material';
    case 'shader':
    case 'cginc':
    case 'hlsl':
      return 'Shader';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'tga':
    case 'psd':
    case 'exr':
    case 'hdr':
      return 'Texture';
    case 'fbx':
    case 'obj':
    case 'blend':
    case 'dae':
    case '3ds':
      return 'Model';
    case 'wav':
    case 'mp3':
    case 'ogg':
    case 'aiff':
      return 'Audio';
    case 'anim':
      return 'Animation';
    case 'controller':
      return 'AnimatorController';
    case 'cs':
    case 'js':
    case 'boo':
      return 'Script';
    case 'ttf':
    case 'otf':
      return 'Font';
    case 'mp4':
    case 'mov':
    case 'avi':
      return 'Video';
    case 'compute':
      return 'Compute';
    case 'renderTexture':
      return 'RenderTexture';
    default:
      return 'Unknown';
  }
}

export function parseUnityGUID(guid: string): string {
  return guid.replace(/-/g, '').toLowerCase();
}

export function formatUnityGUID(guid: string): string {
  if (guid.length !== 32) return guid;

  return `${guid.slice(0, 8)}-${guid.slice(8, 12)}-${guid.slice(12, 16)}-${guid.slice(16, 20)}-${guid.slice(20)}`;
}

export function parseProjectSettings(projectSettingsYaml: string): Partial<UnityProjectSettings> {
  const settings: Partial<UnityProjectSettings> = {};

  const companyMatch = projectSettingsYaml.match(/companyName:\s*(.+)/);
  if (companyMatch) {
    settings.companyName = companyMatch[1].trim();
  }

  const productMatch = projectSettingsYaml.match(/productName:\s*(.+)/);
  if (productMatch) {
    settings.productName = productMatch[1].trim();
  }

  return settings;
}

export function parseUnityYAML(yamlContent: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlContent.split('\n');
  let currentKey = '';
  let currentValue: any = null;
  let indentLevel = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('%')) {
      continue;
    }

    const indent = line.search(/\S/);
    const colonIndex = line.indexOf(':');

    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (indent === 0 || indent <= indentLevel) {
        currentKey = key;
        if (value) {
          result[key] = parseYAMLValue(value);
        } else {
          result[key] = {};
          currentValue = result[key];
        }
        indentLevel = indent;
      } else if (currentValue && typeof currentValue === 'object') {
        if (value) {
          currentValue[key] = parseYAMLValue(value);
        } else {
          currentValue[key] = {};
        }
      }
    }
  }

  return result;
}

function parseYAMLValue(value: string): any {
  value = value.trim();

  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;

  const num = Number(value);
  if (!isNaN(num)) return num;

  if (value.startsWith('{') && value.endsWith('}')) {
    return parseYAMLObject(value);
  }

  if (value.startsWith('[') && value.endsWith(']')) {
    return parseYAMLArray(value);
  }

  return value.replace(/^["']|["']$/g, '');
}

function parseYAMLObject(value: string): Record<string, any> {
  const content = value.slice(1, -1).trim();
  const pairs = content.split(',');
  const obj: Record<string, any> = {};

  for (const pair of pairs) {
    const [key, val] = pair.split(':').map((s) => s.trim());
    if (key && val) {
      obj[key] = parseYAMLValue(val);
    }
  }

  return obj;
}

function parseYAMLArray(value: string): any[] {
  const content = value.slice(1, -1).trim();
  const items = content.split(',');
  return items.map((item) => parseYAMLValue(item.trim()));
}

export function extractGUIDsFromFile(content: string): string[] {
  const guidPattern = /guid:\s*([a-f0-9]+)/gi;
  const matches = [...content.matchAll(guidPattern)];
  return matches.map((match) => match[1]);
}

export function isUnityProjectPath(path: string): boolean {
  return (
    path.includes('Assets/') ||
    path.includes('ProjectSettings/') ||
    path.includes('Packages/')
  );
}

export function normalizeUnityPath(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

export function getRelativeAssetPath(fullPath: string): string {
  const assetsIndex = fullPath.indexOf('Assets/');
  if (assetsIndex >= 0) {
    return fullPath.slice(assetsIndex);
  }

  const packagesIndex = fullPath.indexOf('Packages/');
  if (packagesIndex >= 0) {
    return fullPath.slice(packagesIndex);
  }

  return fullPath;
}
