/**
 * Unity Hybrid Import
 * Handles Unity hybrid bundles containing both scenes/assets and WebGL builds
 */

import { unzipToObject } from "@/wissil/ProjectIO/zipUtils";
import { importUnityScenesZip } from "./importUnityScenes";
import { importUnityBuildZip } from "./importUnityBuild";
import { detectUnityZip } from "./detectUnityZip";
import { createZipFromSubset } from "./importHelpers";
import { parseManifest } from "./manifest";
import { useEditorState } from "@/state/editorState";

/**
 * Import Unity hybrid ZIP bundle
 * Handles bundles containing scenes, assets, and/or WebGL builds
 */
export async function importUnityHybridZip(
  blob: Blob,
  options: {
    autoRun?: boolean;
    clearExisting?: boolean;
  } = {}
): Promise<void> {
  const pushMessage = useEditorState.getState().pushMessage;
  
  try {
    pushMessage(`[Unity] Analyzing Unity bundle...`);

    // Extract all files first to analyze structure
    const files = await unzipToObject(blob);
    const fileKeys = Object.keys(files);

    if (fileKeys.length === 0) {
      throw new Error("ZIP file is empty or contains no valid files");
    }

    // Detect bundle type
    const type = detectUnityZip(fileKeys);

    if (type === "unknown") {
      throw new Error("Unknown Unity ZIP format. Expected Unity WebGL build, scenes, or hybrid bundle.");
    }

    pushMessage(`[Unity] Detected bundle type: ${type}`);

    // Check for manifest
    let manifest = null;
    if (files["Metadata/manifest.json"]) {
      manifest = parseManifest(files["Metadata/manifest.json"]);
      if (manifest) {
        pushMessage(`[Unity] Project: ${manifest.project} v${manifest.version}`);
      }
    }

    // Handle different bundle types
    if (type === "unity-webgl-build") {
      // Pure WebGL build - import directly
      await importUnityBuildZip(blob);
      return;
    }

    if (type === "unity-scenes") {
      // Pure scenes/assets - import directly
      await importUnityScenesZip(blob, options);
      return;
    }

    if (type === "unity-hybrid") {
      // Hybrid bundle - separate and import both
      pushMessage(`[Unity] Processing hybrid bundle (scenes + build)...`);

      // Separate build files
      const buildFiles = fileKeys.filter((f) =>
        f.startsWith("Build/") ||
        f.startsWith("WebGLBuild/") ||
        f.startsWith("StreamingAssets/") ||
        f.includes("build.loader.js") ||
        f.includes("build.framework.js") ||
        f.includes("build.wasm") ||
        f === "index.html"
      );

      // Separate asset/scene files
      const assetFiles = fileKeys.filter((f) =>
        f.startsWith("Assets/") ||
        f.startsWith("ProjectSettings/") ||
        f.startsWith("Packages/")
      );

      // Import scenes/assets first
      if (assetFiles.length > 0) {
        pushMessage(`[Unity] Importing ${assetFiles.length} scene/asset files...`);
        const scenesZipBlob = await createZipFromSubset(files, assetFiles);
        await importUnityScenesZip(scenesZipBlob, options);
      }

      // Import build second
      if (buildFiles.length > 0) {
        pushMessage(`[Unity] Importing ${buildFiles.length} WebGL build files...`);
        const buildZipBlob = await createZipFromSubset(files, buildFiles);
        await importUnityBuildZip(buildZipBlob);
      } else {
        pushMessage(`[Unity] No WebGL build files found in hybrid bundle`);
      }

      // Handle Wissil/ folder if present (docs, examples, etc.)
      const wissilFiles = fileKeys.filter((f) => f.startsWith("Wissil/"));
      if (wissilFiles.length > 0) {
        pushMessage(`[Unity] Found ${wissilFiles.length} WISSIL documentation files`);
        // These could be imported into Waypoint docs or FileTree
      }

      pushMessage(`[Unity] Hybrid bundle import complete!`);
      return;
    }

    throw new Error(`Unsupported Unity bundle type: ${type}`);
  } catch (err: any) {
    const setRuntimeError = useEditorState.getState().setRuntimeError;
    setRuntimeError(`Unity hybrid import failed: ${err?.message || String(err)}`);
    pushMessage(`❌ [Unity] Import failed: ${err?.message || String(err)}`);
    throw err;
  }
}

/**
 * Import Unity ZIP with automatic type detection
 */
export async function importUnityZip(
  blob: Blob,
  options: {
    autoRun?: boolean;
    clearExisting?: boolean;
  } = {}
): Promise<void> {
  const files = await unzipToObject(blob);
  const type = detectUnityZip(Object.keys(files));

  switch (type) {
    case "unity-webgl-build":
      await importUnityBuildZip(blob);
      break;
    case "unity-scenes":
      await importUnityScenesZip(blob, options);
      break;
    case "unity-hybrid":
      await importUnityHybridZip(blob, options);
      break;
    default:
      throw new Error("File does not appear to be a Unity ZIP. Expected .unitybuild.zip, .unityscene.zip, or .unitybundle.zip");
  }
}

