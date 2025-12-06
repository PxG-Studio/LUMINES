/**
 * Unity YAML Utilities
 * Additional utilities for working with Unity YAML structures
 */

import { parseUnityYAML, extractGameObjects, extractTransforms } from "./yamlParser";

/**
 * Parse a Unity scene file and extract hierarchy
 */
export function parseUnityScene(content: string) {
  const docs = parseUnityYAML(content);
  const gameObjects = extractGameObjects(docs);
  const transforms = extractTransforms(docs);

  // Build hierarchy from transforms
  const hierarchy: Array<{
    id: string | number;
    name: string;
    active: boolean;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
    children?: any[];
  }> = [];

  for (const go of gameObjects) {
    const transform = transforms[go.id];
    const hierarchyItem: any = {
      id: go.id,
      name: go.name,
      active: go.active
    };

    if (transform) {
      if (transform.m_LocalPosition) {
        hierarchyItem.position = [
          transform.m_LocalPosition.x || 0,
          transform.m_LocalPosition.y || 0,
          transform.m_LocalPosition.z || 0
        ];
      }
      if (transform.m_LocalRotation) {
        hierarchyItem.rotation = [
          transform.m_LocalRotation.x || 0,
          transform.m_LocalRotation.y || 0,
          transform.m_LocalRotation.z || 0,
          transform.m_LocalRotation.w || 1
        ];
      }
      if (transform.m_LocalScale) {
        hierarchyItem.scale = [
          transform.m_LocalScale.x || 1,
          transform.m_LocalScale.y || 1,
          transform.m_LocalScale.z || 1
        ];
      }
    }

    hierarchy.push(hierarchyItem);
  }

  return {
    gameObjects,
    transforms,
    hierarchy
  };
}

/**
 * Parse Unity material file
 */
export function parseUnityMaterial(content: string) {
  const docs = parseUnityYAML(content);
  
  const material = docs.find((d) => d.Material);
  if (!material) return null;

  return {
    name: material.Material?.m_Name || "Unnamed Material",
    shader: material.Material?.m_Shader?.guid || null,
    properties: material.Material?.m_SavedProperties || {}
  };
}

/**
 * Parse Unity prefab file
 */
export function parseUnityPrefab(content: string) {
  const docs = parseUnityYAML(content);
  const gameObjects = extractGameObjects(docs);
  const transforms = extractTransforms(docs);

  return {
    gameObjects,
    transforms,
    components: docs.filter((d) => !d.GameObject && !d.Transform)
  };
}

