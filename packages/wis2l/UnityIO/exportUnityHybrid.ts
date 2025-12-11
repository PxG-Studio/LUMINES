/**
 * Unity Hybrid Bundle Export
 * Combines Unity Assets + Scenes + WebGL Build + Metadata into a single bundle
 */

import JSZip from "jszip";
import { compileUnityProject } from "./compileUnityProject";
import { exportUnityBuild } from "./exportUnityBuild";
import { exportUnityScenes } from "./exportUnityScenes";
import { extractUnityAssets } from "./exportAssets";
import { createExportManifest } from "./manifest";
import { useEditorState } from "@/state/editorState";

/**
 * Export Unity Hybrid Bundle
 * Creates a complete Unity package with assets, scenes, WebGL build, and metadata
 */
export async function exportUnityHybrid(
  projectName: string = "UnityHybridExport",
  filename: string = "UnityHybrid.unitybundle.zip"
): Promise<void> {
  const pushMessage = useEditorState.getState().pushMessage;

  try {
    pushMessage(`[Unity] Preparing hybrid bundle export: ${projectName}...`);

    // 1. Compile Unity project (assets, scenes, scripts, ProjectSettings, etc.)
    const { files: projectFiles, manifest: projectManifest } = compileUnityProject(projectName);
    
    pushMessage(`[Unity] Compiled ${Object.keys(projectFiles).length} Unity project files`);

    // 2. Extract assets separately (for stats)
    const assets = extractUnityAssets();
    pushMessage(`[Unity] Extracted ${Object.keys(assets).length} asset files`);

    // 3. Create ZIP
    const zip = new JSZip();

    // Add Unity project files (includes Assets/, ProjectSettings/, Packages/)
    for (const [path, content] of Object.entries(projectFiles)) {
      zip.file(path, content);
    }

    // 4. Fetch WebGL build files if available
    const webglFiles = await fetchWebGLBuildFiles();
    if (Object.keys(webglFiles).length > 0) {
      pushMessage(`[Unity] Including ${Object.keys(webglFiles).length} WebGL build files`);
      
      // Add WebGL build files under WebGLBuild/ folder
      for (const [path, content] of Object.entries(webglFiles)) {
        zip.file(`WebGLBuild/${path}`, content);
      }
    } else {
      pushMessage(`[Unity] No WebGL build found - creating asset-only bundle`);
    }

    // 5. Create enhanced manifest for hybrid bundle
    const hybridManifest = createExportManifest({
      project: projectName,
      version: projectManifest.version,
      unity: projectManifest.unity,
      contains: webglFiles.length > 0 
        ? [...projectManifest.contains, "webgl"]
        : projectManifest.contains,
      description: `Hybrid Unity bundle exported from WISSIL. Contains assets, scenes, ${webglFiles.length > 0 ? 'and WebGL build' : 'ready for build'}.`
    });

    // 6. Add WISSIL metadata folder with manifest
    zip.file("WISSIL/Metadata/manifest.json", JSON.stringify(hybridManifest, null, 2));

    // 7. Generate and download ZIP
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

    const totalFiles = Object.keys(projectFiles).length + Object.keys(webglFiles).length;
    pushMessage(
      `[Unity] Hybrid bundle exported successfully: ${filename} (${totalFiles} files total)`
    );
  } catch (err: any) {
    const setRuntimeError = useEditorState.getState().setRuntimeError;
    setRuntimeError(`Unity hybrid export failed: ${err?.message || String(err)}`);
    pushMessage(`❌ [Unity] Hybrid export failed: ${err?.message || String(err)}`);
    throw err;
  }
}

/**
 * Fetch WebGL build files from storage
 * In production, would fetch from /UnityBuild/ directory
 */
async function fetchWebGLBuildFiles(): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  // In browser-only mode, read from localStorage
  // In production, fetch from server /UnityBuild/ directory
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
    console.warn("Failed to read WebGL build files:", err);
  }

  // Note: In production with server, you would:
  // const manifest = await fetch('/UnityBuild/manifest.json').then(r => r.json());
  // for (const file of manifest.files) {
  //   const content = await fetch(`/UnityBuild/${file.path}`).then(r => r.text());
  //   files[file.path] = content;
  // }

  return files;
}

