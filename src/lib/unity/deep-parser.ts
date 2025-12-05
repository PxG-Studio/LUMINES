import { parseUnityYAML, extractGUIDsFromFile } from './parser';

export interface UnityComponent {
  type: string;
  guid?: string;
  fileID?: number;
  properties: Record<string, any>;
}

export interface UnityGameObject {
  name: string;
  tag?: string;
  layer?: number;
  isActive: boolean;
  components: UnityComponent[];
  children: string[];
  guid?: string;
  fileID?: number;
}

export interface UnityPrefab {
  name: string;
  rootObject: UnityGameObject;
  modifications: Array<{
    target: { fileID: number; guid: string };
    propertyPath: string;
    value: any;
  }>;
  dependencies: string[];
}

export interface UnityMaterial {
  name: string;
  shader: {
    name: string;
    guid?: string;
  };
  properties: Record<string, {
    type: 'color' | 'float' | 'texture' | 'vector';
    value: any;
  }>;
  textures: Array<{
    name: string;
    guid: string;
  }>;
  keywords: string[];
  renderQueue: number;
}

export interface UnityScene {
  name: string;
  guid: string;
  gameObjects: UnityGameObject[];
  lightingSettings?: {
    skyboxMaterial?: string;
    ambientMode?: string;
    ambientColor?: [number, number, number, number];
  };
  renderSettings?: {
    fog: boolean;
    fogColor?: [number, number, number, number];
    fogMode?: string;
  };
}

export function parseUnityPrefab(yamlContent: string): UnityPrefab | null {
  try {
    const lines = yamlContent.split('\n');
    const objects: Map<number, any> = new Map();
    const dependencies = extractGUIDsFromFile(yamlContent);

    let currentObject: any = null;
    let currentFileID: number | null = null;

    for (const line of lines) {
      const objectMatch = line.match(/--- !u!(\d+) &(\d+)/);
      if (objectMatch) {
        if (currentObject && currentFileID !== null) {
          objects.set(currentFileID, currentObject);
        }

        const classID = parseInt(objectMatch[1]);
        currentFileID = parseInt(objectMatch[2]);
        currentObject = {
          classID,
          fileID: currentFileID,
          data: {},
        };
        continue;
      }

      if (currentObject && line.trim() && !line.startsWith('%') && !line.startsWith('#')) {
        const keyMatch = line.match(/^\s*(\w+):\s*(.*)$/);
        if (keyMatch) {
          const key = keyMatch[1];
          const value = keyMatch[2].trim();
          currentObject.data[key] = parseYAMLValue(value);
        }
      }
    }

    if (currentObject && currentFileID !== null) {
      objects.set(currentFileID, currentObject);
    }

    const rootGameObject = findRootGameObject(objects);
    if (!rootGameObject) {
      return null;
    }

    const gameObject = parseGameObject(rootGameObject, objects);

    return {
      name: gameObject.name,
      rootObject: gameObject,
      modifications: [],
      dependencies,
    };
  } catch (error) {
    console.error('Failed to parse prefab:', error);
    return null;
  }
}

export function parseUnityMaterial(yamlContent: string): UnityMaterial | null {
  try {
    const parsed = parseUnityYAML(yamlContent);
    const material = parsed.Material || {};

    const shader = material.m_Shader || {};
    const properties = material.m_SavedProperties || {};
    const texEnvs = properties.m_TexEnvs || {};
    const floats = properties.m_Floats || {};
    const colors = properties.m_Colors || {};

    const textures: Array<{ name: string; guid: string }> = [];
    for (const [name, texData] of Object.entries(texEnvs)) {
      const tex = texData as any;
      if (tex.m_Texture && tex.m_Texture.guid) {
        textures.push({
          name,
          guid: tex.m_Texture.guid,
        });
      }
    }

    const materialProperties: Record<string, any> = {};

    for (const [name, value] of Object.entries(floats)) {
      materialProperties[name] = {
        type: 'float',
        value,
      };
    }

    for (const [name, value] of Object.entries(colors)) {
      materialProperties[name] = {
        type: 'color',
        value,
      };
    }

    return {
      name: material.m_Name || 'Unnamed Material',
      shader: {
        name: shader.m_Name || 'Unknown',
        guid: shader.guid,
      },
      properties: materialProperties,
      textures,
      keywords: material.m_ShaderKeywords?.split(' ') || [],
      renderQueue: material.m_CustomRenderQueue || 2000,
    };
  } catch (error) {
    console.error('Failed to parse material:', error);
    return null;
  }
}

export function parseUnityScene(yamlContent: string): UnityScene | null {
  try {
    const lines = yamlContent.split('\n');
    const objects: Map<number, any> = new Map();
    const dependencies = extractGUIDsFromFile(yamlContent);

    let currentObject: any = null;
    let currentFileID: number | null = null;

    for (const line of lines) {
      const objectMatch = line.match(/--- !u!(\d+) &(\d+)/);
      if (objectMatch) {
        if (currentObject && currentFileID !== null) {
          objects.set(currentFileID, currentObject);
        }

        const classID = parseInt(objectMatch[1]);
        currentFileID = parseInt(objectMatch[2]);
        currentObject = {
          classID,
          fileID: currentFileID,
          data: {},
        };
        continue;
      }

      if (currentObject && line.trim() && !line.startsWith('%') && !line.startsWith('#')) {
        const keyMatch = line.match(/^\s*(\w+):\s*(.*)$/);
        if (keyMatch) {
          const key = keyMatch[1];
          const value = keyMatch[2].trim();
          currentObject.data[key] = parseYAMLValue(value);
        }
      }
    }

    if (currentObject && currentFileID !== null) {
      objects.set(currentFileID, currentObject);
    }

    const gameObjects: UnityGameObject[] = [];
    for (const [fileID, obj] of objects.entries()) {
      if (obj.classID === 1) {
        gameObjects.push(parseGameObject(obj, objects));
      }
    }

    return {
      name: 'Scene',
      guid: dependencies[0] || '',
      gameObjects,
      lightingSettings: {},
      renderSettings: {},
    };
  } catch (error) {
    console.error('Failed to parse scene:', error);
    return null;
  }
}

function findRootGameObject(objects: Map<number, any>): any {
  for (const [fileID, obj] of objects.entries()) {
    if (obj.classID === 1) {
      return obj;
    }
  }
  return null;
}

function parseGameObject(obj: any, allObjects: Map<number, any>): UnityGameObject {
  const data = obj.data.GameObject || obj.data;

  const components: UnityComponent[] = [];
  const componentRefs = data.m_Component || [];

  for (const compRef of componentRefs) {
    if (compRef.component && compRef.component.fileID) {
      const componentObj = allObjects.get(compRef.component.fileID);
      if (componentObj) {
        components.push({
          type: getComponentTypeName(componentObj.classID),
          fileID: componentObj.fileID,
          properties: componentObj.data,
        });
      }
    }
  }

  const children: string[] = [];
  const transform = data.m_Transform || data.m_RectTransform;
  if (transform && transform.m_Children) {
    for (const child of transform.m_Children) {
      if (child.fileID) {
        children.push(child.fileID.toString());
      }
    }
  }

  return {
    name: data.m_Name || 'GameObject',
    tag: data.m_TagString,
    layer: data.m_Layer,
    isActive: data.m_IsActive !== false,
    components,
    children,
    fileID: obj.fileID,
  };
}

function getComponentTypeName(classID: number): string {
  const typeMap: Record<number, string> = {
    1: 'GameObject',
    2: 'Component',
    4: 'Transform',
    20: 'Camera',
    21: 'Material',
    23: 'MeshRenderer',
    25: 'Renderer',
    28: 'Texture2D',
    33: 'MeshFilter',
    43: 'Mesh',
    48: 'Shader',
    54: 'Rigidbody',
    61: 'Animation',
    65: 'BoxCollider',
    81: 'AudioListener',
    82: 'AudioSource',
    89: 'CubeMap',
    90: 'Avatar',
    91: 'AnimatorController',
    92: 'GUILayer',
    95: 'Animator',
    96: 'TrailRenderer',
    102: 'TextMesh',
    104: 'RenderTexture',
    108: 'Light',
    111: 'AnimationClip',
    114: 'MonoBehaviour',
    115: 'MonoScript',
    120: 'LineRenderer',
    124: 'Flare',
    128: 'Font',
    129: 'GUIText',
    132: 'GUITexture',
    135: 'SphereCollider',
    136: 'CapsuleCollider',
    137: 'SkinnedMeshRenderer',
    138: 'FixedJoint',
    141: 'AudioClip',
    143: 'CharacterController',
    144: 'CharacterJoint',
    153: 'ConfigurableJoint',
    156: 'TerrainCollider',
    157: 'Terrain',
    198: 'ParticleSystem',
    199: 'ParticleSystemRenderer',
    212: 'SpriteRenderer',
    213: 'Sprite',
    218: 'Terrain',
    222: 'RectTransform',
    223: 'Canvas',
    224: 'CanvasGroup',
    225: 'CanvasRenderer',
  };

  return typeMap[classID] || `Component_${classID}`;
}

function parseYAMLValue(value: string): any {
  value = value.trim();

  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  if (value === '') return null;

  const num = Number(value);
  if (!isNaN(num)) return num;

  if (value.startsWith('{') && value.endsWith('}')) {
    try {
      const content = value.slice(1, -1).trim();
      const pairs = content.split(',');
      const obj: Record<string, any> = {};

      for (const pair of pairs) {
        const [key, val] = pair.split(':').map((s) => s.trim());
        if (key && val !== undefined) {
          obj[key] = parseYAMLValue(val);
        }
      }

      return obj;
    } catch {
      return value;
    }
  }

  return value.replace(/^["']|["']$/g, '');
}

export function extractPrefabDependencies(prefab: UnityPrefab): string[] {
  return prefab.dependencies;
}

export function extractMaterialTextures(material: UnityMaterial): string[] {
  return material.textures.map((tex) => tex.guid);
}

export function findComponentsOfType(
  gameObject: UnityGameObject,
  componentType: string
): UnityComponent[] {
  return gameObject.components.filter((comp) => comp.type === componentType);
}

export function traverseGameObjectHierarchy(
  rootObject: UnityGameObject,
  allObjects: Map<string, UnityGameObject>,
  callback: (obj: UnityGameObject, depth: number) => void,
  depth = 0
): void {
  callback(rootObject, depth);

  for (const childId of rootObject.children) {
    const child = allObjects.get(childId);
    if (child) {
      traverseGameObjectHierarchy(child, allObjects, callback, depth + 1);
    }
  }
}
