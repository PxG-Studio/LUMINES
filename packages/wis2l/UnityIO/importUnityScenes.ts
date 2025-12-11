/**
 * Unity Scene and Asset Import
 * Imports Unity scenes, scripts, and assets into the virtual filesystem
 */

import { unzipToObject } from "@/wis2l/ProjectIO/zipUtils";
import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { regenerateTree } from "@/wis2l/Slate/components/FileTreeState";
import { useEditorState } from "@/state/editorState";

/**
 * Import Unity scenes and assets from ZIP
 * Loads Assets/ folder content into virtual FS for browsing and editing
 */
export async function importUnityScenesZip(
  blob: Blob,
  options: {
    clearExisting?: boolean;
  } = {}
): Promise<void> {
  const { clearExisting = false } = options;
  const fs = useWissilFS.getState();
  const pushMessage = useEditorState.getState().pushMessage;

  try {
    pushMessage(`[Unity] Starting Unity scenes/assets import...`);

    // Extract files from ZIP
    const files = await unzipToObject(blob);
    const fileKeys = Object.keys(files);

    if (fileKeys.length === 0) {
      throw new Error("ZIP file is empty or contains no valid files");
    }

    // Filter Unity asset files
    const assetFiles: Record<string, string> = {};
    let sceneCount = 0;
    let scriptCount = 0;
    let otherAssetCount = 0;

    for (const path of fileKeys) {
      // Only import files from Assets/ folder
      if (path.startsWith("Assets/")) {
        assetFiles[path] = files[path];
        
        // Count file types
        if (path.endsWith(".unity")) {
          sceneCount++;
        } else if (path.endsWith(".cs") || path.endsWith(".js")) {
          scriptCount++;
        } else {
          otherAssetCount++;
        }
      }

      // Also import ProjectSettings if present (optional)
      if (path.startsWith("ProjectSettings/") && path.endsWith(".asset")) {
        assetFiles[path] = files[path];
      }

      // Import Packages manifest if present
      if (path === "Packages/manifest.json") {
        assetFiles[path] = files[path];
      }
    }

    if (Object.keys(assetFiles).length === 0) {
      throw new Error("No Unity asset files found in ZIP (expected Assets/ folder)");
    }

    // Clear existing Assets/ folder if requested
    if (clearExisting) {
      // Remove existing Assets/ folder
      try {
        fs.deleteFolder("Assets");
      } catch {
        // Folder may not exist, that's fine
      }
    }

    // Write all asset files to virtual FS
    for (const [path, content] of Object.entries(assetFiles)) {
      try {
        fs.writeFile(path, content);
      } catch (err) {
        console.warn(`Failed to import Unity asset ${path}:`, err);
      }
    }

    // Regenerate FileTree to show new assets
    regenerateTree();

    pushMessage(
      `[Unity] Assets imported: ${sceneCount} scenes, ${scriptCount} scripts, ${otherAssetCount} other assets`
    );
    pushMessage(`[Unity] Total files: ${Object.keys(assetFiles).length}`);

  } catch (err: any) {
    const setRuntimeError = useEditorState.getState().setRuntimeError;
    setRuntimeError(`Unity scenes import failed: ${err?.message || String(err)}`);
    pushMessage(`❌ [Unity] Import failed: ${err?.message || String(err)}`);
    throw err;
  }
}

/**
 * Get statistics about imported Unity assets
 */
export function getUnityAssetStats(): {
  scenes: number;
  scripts: number;
  prefabs: number;
  materials: number;
  textures: number;
} {
  const fs = useWissilFS.getState();
  const snapshot = fs.getSnapshot();

  const stats = {
    scenes: 0,
    scripts: 0,
    prefabs: 0,
    materials: 0,
    textures: 0
  };

  function walk(node: any) {
    if (node.type === "folder") {
      for (const child of Object.values(node.children || {})) {
        walk(child);
      }
    } else if (node.type === "file") {
      const path = ""; // We'd need to track path here
      // This is a simplified version - in practice, you'd track the full path
    }
  }

  // Simplified - would need full path tracking for accurate stats
  return stats;
}

