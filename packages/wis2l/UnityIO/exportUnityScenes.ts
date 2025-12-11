/**
 * Unity Scene and Asset Export
 * Exports Unity scenes and assets from virtual filesystem to ZIP
 */

import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { zipFromObject } from "@/wis2l/ProjectIO/zipUtils";
import { useEditorState } from "@/state/editorState";

/**
 * Export Unity scenes and assets to ZIP
 */
export async function exportUnityScenes(
  filename: string = "UnityScenes.unityscene.zip"
): Promise<void> {
  const pushMessage = useEditorState.getState().pushMessage;

  try {
    pushMessage(`[Unity] Preparing Unity scenes/assets export...`);

    const fsSnapshot = useWissilFS.getState().getSnapshot();
    const out: Record<string, string> = {};

    /**
     * Walk filesystem and extract Assets/ folder content
     */
    function walk(folder: any, prefix = ""): void {
      for (const key in folder.children) {
        const node = folder.children[key];
        const path = prefix ? `${prefix}/${key}` : key;

        if (node.type === "folder") {
          walk(node, path);
        } else if (node.type === "file" && path.startsWith("Assets/")) {
          out[path] = node.content;
        }

        // Also export ProjectSettings if present
        if (node.type === "file" && path.startsWith("ProjectSettings/")) {
          out[path] = node.content;
        }

        // Export Packages manifest if present
        if (node.type === "file" && path === "Packages/manifest.json") {
          out[path] = node.content;
        }
      }
    }

    walk(fsSnapshot);

    if (Object.keys(out).length === 0) {
      throw new Error("No Unity asset files found in filesystem. Create or import assets first.");
    }

    // Create ZIP
    const blob = await zipFromObject(out);

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const sceneCount = Object.keys(out).filter((f) => f.endsWith(".unity")).length;
    const scriptCount = Object.keys(out).filter((f) => f.endsWith(".cs") || f.endsWith(".js")).length;

    pushMessage(
      `[Unity] Assets exported: ${filename} (${sceneCount} scenes, ${scriptCount} scripts, ${Object.keys(out).length} total files)`
    );
  } catch (err: any) {
    const setRuntimeError = useEditorState.getState().setRuntimeError;
    setRuntimeError(`Unity scenes export failed: ${err?.message || String(err)}`);
    pushMessage(`❌ [Unity] Export failed: ${err?.message || String(err)}`);
    throw err;
  }
}

