/**
 * Unity YAML Parser
 * Parses Unity YAML files (scenes, prefabs, materials, etc.)
 */

import * as YAML from "yaml";

export interface UnityYAMLDocument {
  [key: string]: any;
}

/**
 * Parse Unity YAML content
 * Unity uses YAML with custom tags and multiple documents separated by ---
 */
export function parseUnityYAML(content: string): UnityYAMLDocument[] {
  if (!content || !content.trim()) {
    return [];
  }

  try {
    // Unity YAML files have:
    // - Header: %YAML 1.1
    // - Tag declaration: %TAG !u! tag:unity3d.com,2011:
    // - Multiple documents separated by ---
    
    // Split by document separator (---)
    const docSections = content
      .split(/^---/gm)
      .map((doc) => doc.trim())
      .filter((doc) => doc.length > 0);

    const documents: UnityYAMLDocument[] = [];

    for (const section of docSections) {
      try {
        // Parse each document section
        // YAML parser will handle Unity tags automatically
        const parsed = YAML.parse(section, {
          // Keep Unity tags as-is for now
          customTags: []
        });

        if (parsed && typeof parsed === "object") {
          documents.push(parsed);
        }
      } catch (err) {
        console.warn("Failed to parse Unity YAML document section:", err);
        // Continue with other documents
      }
    }

    return documents;
  } catch (err) {
    console.error("Unity YAML parse error:", err);
    return [];
  }
}

/**
 * Extract GameObject from Unity YAML documents
 */
export function extractGameObjects(docs: UnityYAMLDocument[]): Array<{
  id: string | number;
  name: string;
  active: boolean;
  components?: any[];
  transform?: any;
}> {
  const objects: Array<{
    id: string | number;
    name: string;
    active: boolean;
    components?: any[];
    transform?: any;
  }> = [];

  for (const doc of docs) {
    if (doc.GameObject) {
      const go = doc.GameObject;
      const id = doc.GameObject?.m_Component?.[0]?.component?.fileID || 
                 doc.GameObject?.m_Component?.[0]?.fileID ||
                 "unknown";

      objects.push({
        id,
        name: go.m_Name || "Unnamed",
        active: go.m_Active !== 0,
        components: go.m_Component || []
      });
    }
  }

  return objects;
}

/**
 * Extract Transform components
 */
export function extractTransforms(docs: UnityYAMLDocument[]): Record<string | number, any> {
  const transforms: Record<string | number, any> = {};

  for (const doc of docs) {
    if (doc.Transform) {
      const transform = doc.Transform;
      const fileID = transform.m_GameObject?.fileID || transform.m_Component?.fileID || "unknown";
      transforms[fileID] = transform;
    }
  }

  return transforms;
}

/**
 * Extract components by type
 */
export function extractComponents(docs: UnityYAMLDocument[], componentType: string): any[] {
  const components: any[] = [];

  for (const doc of docs) {
    if (doc[componentType]) {
      components.push(doc[componentType]);
    }
  }

  return components;
}

