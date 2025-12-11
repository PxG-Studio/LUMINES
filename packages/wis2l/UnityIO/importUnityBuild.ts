/**
 * Unity WebGL Build Import
 * Imports Unity WebGL build ZIPs and prepares them for Ignis preview
 */

import { unzipToObject } from "@/wis2l/ProjectIO/zipUtils";
import { UnityBridge } from "@/wis2l/IgnisWebGL/unityBridge";
import { useEditorState } from "@/state/editorState";

/**
 * Helper to store files in browser storage (IndexedDB or localStorage)
 * For production, this would sync to a server or use proper file system APIs
 */
async function storeUnityBuildFile(path: string, content: string): Promise<void> {
  // In browser-only mode, we store in localStorage as a fallback
  // For production, this should use IndexedDB or sync to server
  try {
    const key = `unity-build-${path}`;
    localStorage.setItem(key, content);
  } catch (err) {
    console.warn(`Failed to store Unity build file ${path}:`, err);
  }
}

/**
 * Import Unity WebGL build from ZIP
 * Extracts build files and stores them for Ignis to use
 */
export async function importUnityBuildZip(
  blob: Blob,
  buildUrl: string = "/UnityBuild"
): Promise<void> {
  const pushMessage = useEditorState.getState().pushMessage;
  
  try {
    pushMessage(`[Unity] Starting Unity WebGL build import...`);

    // Extract files from ZIP
    const files = await unzipToObject(blob);
    const fileKeys = Object.keys(files);

    if (fileKeys.length === 0) {
      throw new Error("ZIP file is empty or contains no valid files");
    }

    // Filter build-related files
    const buildFiles: Record<string, string> = {};
    
    for (const path of fileKeys) {
      // Accept files from Build/, StreamingAssets/, or root level
      if (
        path.startsWith("Build/") ||
        path.startsWith("StreamingAssets/") ||
        path.startsWith("TemplateData/") ||
        path === "index.html" ||
        path.endsWith(".loader.js") ||
        path.endsWith(".framework.js") ||
        path.endsWith(".wasm") ||
        path.endsWith(".data")
      ) {
        buildFiles[path] = files[path];
      }
    }

    if (Object.keys(buildFiles).length === 0) {
      throw new Error("No Unity WebGL build files found in ZIP");
    }

    // Store build files (in production, this would write to /public/UnityBuild/)
    // For now, we'll use a different approach - storing references
    for (const [path, content] of Object.entries(buildFiles)) {
      await storeUnityBuildFile(path, content);
    }

    // Destroy existing Unity instance
    UnityBridge.destroy();

    pushMessage(`[Unity] WebGL build imported successfully (${Object.keys(buildFiles).length} files)`);
    pushMessage(`[Unity] Build URL: ${buildUrl}`);

    // Note: In a production environment with server-side support,
    // you would copy files to /public/UnityBuild/ directory here.
    // For browser-only mode, UnityBridge will load from the stored references
    // or use a CDN/proxy URL.

  } catch (err: any) {
    const setRuntimeError = useEditorState.getState().setRuntimeError;
    setRuntimeError(`Unity build import failed: ${err?.message || String(err)}`);
    pushMessage(`❌ [Unity] Import failed: ${err?.message || String(err)}`);
    throw err;
  }
}

/**
 * Check if a blob contains a Unity WebGL build
 */
export async function isUnityBuildZip(blob: Blob): Promise<boolean> {
  try {
      const { unzipToObject } = await import("@/wis2l/ProjectIO/zipUtils");
    const { detectUnityZip } = await import("./detectUnityZip");
    
    const files = await unzipToObject(blob);
    const type = detectUnityZip(Object.keys(files));
    
    return type === "unity-webgl-build" || type === "unity-hybrid";
  } catch {
    return false;
  }
}

