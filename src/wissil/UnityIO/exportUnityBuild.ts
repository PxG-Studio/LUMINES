/**
 * Unity WebGL Build Export
 * Exports Unity WebGL build files to a ZIP
 */

import JSZip from "jszip";
import { useEditorState } from "@/state/editorState";

/**
 * Fetch all files from Unity build directory
 * In browser mode, reads from localStorage or IndexedDB
 * In production, would fetch from server /UnityBuild/ directory
 */
async function fetchAllUnityBuildFiles(): Promise<Record<string, Blob | string>> {
  const files: Record<string, Blob | string> = {};

  // In browser-only mode, read from localStorage
  // In production with server, would fetch from /UnityBuild/ directory
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("unity-build-")) {
        const path = key.replace("unity-build-", "");
        const content = localStorage.getItem(key);
        if (content) {
          files[path] = content;
        }
      }
    }
  } catch (err) {
    console.warn("Failed to read Unity build files from storage:", err);
  }

  // Note: In production, you would fetch from the server like:
  // const response = await fetch('/UnityBuild/manifest.json');
  // const manifest = await response.json();
  // for (const file of manifest.files) {
  //   const fileResponse = await fetch(`/UnityBuild/${file.path}`);
  //   files[file.path] = await fileResponse.blob();
  // }

  return files;
}

/**
 * Export Unity WebGL build to ZIP
 */
export async function exportUnityBuild(
  filename: string = "UnityWebGL.unitybuild.zip"
): Promise<void> {
  const pushMessage = useEditorState.getState().pushMessage;

  try {
    pushMessage(`[Unity] Preparing Unity WebGL build export...`);

    // Fetch all build files
    const files = await fetchAllUnityBuildFiles();

    if (Object.keys(files).length === 0) {
      throw new Error("No Unity WebGL build files found. Import a build first or check /UnityBuild/ directory.");
    }

    // Create ZIP
    const zip = new JSZip();

    for (const [path, content] of Object.entries(files)) {
      if (typeof content === "string") {
        zip.file(path, content);
      } else {
        zip.file(path, content);
      }
    }

    // Generate ZIP blob
    const blob = await zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    pushMessage(`[Unity] Build exported successfully: ${filename} (${Object.keys(files).length} files)`);
  } catch (err: any) {
    const setRuntimeError = useEditorState.getState().setRuntimeError;
    setRuntimeError(`Unity build export failed: ${err?.message || String(err)}`);
    pushMessage(`❌ [Unity] Export failed: ${err?.message || String(err)}`);
    throw err;
  }
}

