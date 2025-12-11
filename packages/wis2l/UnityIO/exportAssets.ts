/**
 * Unity Asset Export Engine
 * Extracts Unity-compatible assets from WISSIL virtual FS
 */

import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";

export interface UnityAssetStats {
  scenes: number;
  scripts: number;
  textures: number;
  materials: number;
  prefabs: number;
  shaders: number;
  total: number;
}

/**
 * Extract Unity assets from virtual filesystem
 * Returns all asset files organized under Assets/Resources/
 */
export function extractUnityAssets(): Record<string, string> {
  const fsSnapshot = useWissilFS.getState().getSnapshot();
  const out: Record<string, string> = {};

  /**
   * Walk filesystem and extract Unity-compatible assets
   */
  function walk(folder: any, prefix = ""): void {
    for (const key in folder.children) {
      const node = folder.children[key];
      const path = prefix ? `${prefix}/${key}` : key;

      if (node.type === "folder") {
        walk(node, path);
      } else if (node.type === "file") {
        // Check if file is a Unity asset type
        if (
          path.endsWith(".png") ||
          path.endsWith(".jpg") ||
          path.endsWith(".jpeg") ||
          path.endsWith(".mat") ||
          path.endsWith(".shader") ||
          path.endsWith(".prefab") ||
          path.endsWith(".unity") ||
          path.endsWith(".cs") ||
          path.endsWith(".js") ||
          path.endsWith(".ttf") ||
          path.endsWith(".otf") ||
          path.endsWith(".fbx") ||
          path.endsWith(".obj") ||
          path.endsWith(".asset")
        ) {
          // If already under Assets/, use as-is; otherwise move to Assets/Resources/
          if (path.startsWith("Assets/")) {
            out[path] = node.content;
          } else {
            out[`Assets/Resources/${path}`] = node.content;
          }
        }

        // Also include ProjectSettings and Packages
        if (path.startsWith("ProjectSettings/") || path.startsWith("Packages/")) {
          out[path] = node.content;
        }
      }
    }
  }

  walk(fsSnapshot);

  return out;
}

/**
 * Get statistics about extracted Unity assets
 */
export function getUnityAssetStats(assets: Record<string, string>): UnityAssetStats {
  const stats: UnityAssetStats = {
    scenes: 0,
    scripts: 0,
    textures: 0,
    materials: 0,
    prefabs: 0,
    shaders: 0,
    total: Object.keys(assets).length
  };

  for (const path of Object.keys(assets)) {
    if (path.endsWith(".unity")) stats.scenes++;
    else if (path.endsWith(".cs") || path.endsWith(".js")) stats.scripts++;
    else if (path.match(/\.(png|jpg|jpeg)$/i)) stats.textures++;
    else if (path.endsWith(".mat")) stats.materials++;
    else if (path.endsWith(".prefab")) stats.prefabs++;
    else if (path.endsWith(".shader")) stats.shaders++;
  }

  return stats;
}

/**
 * Filter assets by type
 */
export function filterAssetsByType(
  assets: Record<string, string>,
  type: "scenes" | "scripts" | "textures" | "materials" | "prefabs" | "shaders"
): Record<string, string> {
  const filtered: Record<string, string> = {};

  const extensions: Record<string, string[]> = {
    scenes: [".unity"],
    scripts: [".cs", ".js"],
    textures: [".png", ".jpg", ".jpeg"],
    materials: [".mat"],
    prefabs: [".prefab"],
    shaders: [".shader"]
  };

  const validExts = extensions[type] || [];

  for (const [path, content] of Object.entries(assets)) {
    const ext = path.substring(path.lastIndexOf("."));
    if (validExts.includes(ext)) {
      filtered[path] = content;
    }
  }

  return filtered;
}

