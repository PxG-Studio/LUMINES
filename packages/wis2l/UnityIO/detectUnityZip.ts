/**
 * Unity ZIP Classifier
 * Detects the type of Unity ZIP file based on its contents
 */

export type UnityZipType =
  | "unity-webgl-build"
  | "unity-scenes"
  | "unity-hybrid"
  | "unknown";

/**
 * Detect the type of Unity ZIP based on file structure
 */
export function detectUnityZip(files: string[]): UnityZipType {
  // Check for WebGL build files
  const hasBuild = files.some((f) => 
    f.startsWith("Build/") || 
    f.includes("build.loader.js") ||
    f.includes("build.framework.js") ||
    f.includes("build.wasm")
  );

  // Check for Unity scene files
  const hasScenes = files.some((f) => 
    f.startsWith("Assets/Scenes/") ||
    f.endsWith(".unity") ||
    f.includes("/Scenes/")
  );

  // Check for Unity asset folders
  const hasAssets = files.some((f) => 
    f.startsWith("Assets/") &&
    (f.endsWith(".prefab") ||
     f.endsWith(".mat") ||
     f.endsWith(".cs") ||
     f.endsWith(".shader") ||
     f.endsWith(".meta"))
  );

  // Check for hybrid bundle manifest
  const hasManifest = files.includes("Metadata/manifest.json") ||
                      files.includes("manifest.json");

  // Check for WebGLBuild folder (hybrid indicator)
  const hasWebGLBuildFolder = files.some((f) => f.startsWith("WebGLBuild/"));

  // Classification logic
  if (hasBuild && !hasAssets && !hasScenes) {
    return "unity-webgl-build";
  }

  if ((hasScenes || hasAssets) && !hasBuild) {
    return "unity-scenes";
  }

  if (hasBuild && (hasAssets || hasScenes || hasWebGLBuildFolder || hasManifest)) {
    return "unity-hybrid";
  }

  return "unknown";
}

/**
 * Check if a ZIP file appears to be Unity-related
 */
export function isUnityZip(files: string[]): boolean {
  return detectUnityZip(files) !== "unknown";
}

