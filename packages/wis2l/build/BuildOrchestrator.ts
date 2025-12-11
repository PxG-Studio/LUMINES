/**
 * Build Orchestrator
 * The heart of the incremental build system
 * Combines fingerprint graph, asset rebuild, IL2CPP patching, loader caching
 */

import { FingerprintEngine, getBuildType, BuildDiff } from "./FingerprintEngine";
import { AssetBundleOrchestrator } from "./AssetBundleOrchestrator";
import { IL2CPPPatchLayer } from "./IL2CPPPatchLayer";
import { CacheManager } from "./CacheManager";
import { WebGLTemplateLoader } from "./WebGLTemplateLoader";
import { useWissilFS } from "../runtime/fs/wissilFs";
import { useEditorState } from "@/state/editorState";

export interface BuildResult {
  success: boolean;
  type: "full" | "asset" | "code" | "patch" | "noop";
  duration: number;
  changed: BuildDiff[];
  bundles?: string[];
  patches?: number;
  error?: string;
  message?: string;
}

let lastBuildTime = 0;
const BUILD_COOLDOWN_MS = 1000; // Minimum 1 second between builds

/**
 * Run incremental build
 * Analyzes changes and performs minimal rebuild
 */
export async function runIncrementalBuild(): Promise<BuildResult> {
  const startTime = Date.now();
  const pushMessage = useEditorState.getState().pushMessage;

  // Cooldown check
  const now = Date.now();
  if (now - lastBuildTime < BUILD_COOLDOWN_MS) {
    return {
      success: true,
      type: "noop",
      duration: 0,
      changed: [],
      message: "Build cooldown active"
    };
  }
  lastBuildTime = now;

  try {
    pushMessage("[Build] Analyzing changes...");

    // 1. Build fingerprint graph
    const fs = useWissilFS.getState();
    const snapshot = fs.getSnapshot();
    const newGraph = FingerprintEngine.graph(snapshot);

    // 2. Calculate diff
    const diffs = FingerprintEngine.diff(newGraph);

    if (diffs.length === 0) {
      pushMessage("[Build] No changes detected");
      return {
        success: true,
        type: "noop",
        duration: Date.now() - startTime,
        changed: [],
        message: "No changes detected"
      };
    }

    pushMessage(`[Build] Found ${diffs.length} changed files`);

    // 3. Determine build type
    const buildType = getBuildType(diffs);
    pushMessage(`[Build] Build type: ${buildType}`);

    // 4. Execute appropriate build strategy
    switch (buildType) {
      case "noop":
        return {
          success: true,
          type: "noop",
          duration: Date.now() - startTime,
          changed: diffs,
          message: "No rebuild needed"
        };

      case "patch":
        // Try IL2CPP patching first
        if (IL2CPPPatchLayer.canPatch(diffs)) {
          pushMessage("[Build] Applying IL2CPP patches...");
          const patchResult = await IL2CPPPatchLayer.applyPatches(diffs);

          return {
            success: patchResult.errors === 0,
            type: "patch",
            duration: Date.now() - startTime,
            changed: diffs,
            patches: patchResult.patched,
            message: `Applied ${patchResult.patched} patches`
          };
        }
        // Fall through to full build if patching not possible

      case "asset":
        // Rebuild only asset bundles
        pushMessage("[Build] Rebuilding asset bundles...");
        const bundleResult = await AssetBundleOrchestrator.rebuildChangedBundles(diffs);

        // Update cache manifest
        const manifest = CacheManager.loadManifest() || {
          version: "1.0.0",
          timestamp: Date.now(),
          fingerprints: newGraph,
          buildType: "asset",
          artifacts: bundleResult.bundles || []
        };

        manifest.fingerprints = newGraph;
        manifest.buildType = "asset";
        manifest.timestamp = Date.now();
        CacheManager.saveManifest(manifest);

        return {
          success: bundleResult.success,
          type: "asset",
          duration: Date.now() - startTime,
          changed: diffs,
          bundles: bundleResult.bundles,
          error: bundleResult.error,
          message: bundleResult.success
            ? `Rebuilt ${bundleResult.bundles.length} asset bundles`
            : bundleResult.error
        };

      case "full":
        // Full rebuild required
        pushMessage("[Build] Full rebuild required...");
        // In production, this would trigger Unity CLI build
        // For now, we'll simulate it

        return {
          success: true,
          type: "full",
          duration: Date.now() - startTime,
          changed: diffs,
          message: "Full rebuild triggered (simulated)"
        };

      default:
        return {
          success: false,
          type: "full",
          duration: Date.now() - startTime,
          changed: diffs,
          error: "Unknown build type"
        };
    }
  } catch (err: any) {
    const duration = Date.now() - startTime;
    const error = err?.message || String(err);
    pushMessage(`❌ [Build] Build failed: ${error}`);

    return {
      success: false,
      type: "full",
      duration,
      changed: [],
      error
    };
  }
}

/**
 * Force full rebuild (clears cache)
 */
export async function runFullBuild(): Promise<BuildResult> {
  const pushMessage = useEditorState.getState().pushMessage;

  pushMessage("[Build] Clearing cache and running full rebuild...");

  // Clear cache
  CacheManager.clearCache();
  FingerprintEngine.reset();

  // Run incremental build (will detect all changes)
  return runIncrementalBuild();
}

/**
 * Check if rebuild is needed
 */
export function needsRebuild(): boolean {
  const fs = useWissilFS.getState();
  const snapshot = fs.getSnapshot();
  const newGraph = FingerprintEngine.graph(snapshot);
  const diffs = FingerprintEngine.diff(newGraph);

  return diffs.length > 0;
}

/**
 * Get build statistics
 */
export function getBuildStats(): {
  lastBuildType: string | null;
  cacheSize: number;
  cachedArtifacts: number;
} {
  const manifest = CacheManager.loadManifest();
  const cacheSize = CacheManager.getCacheSize();

  return {
    lastBuildType: manifest?.buildType || null,
    cacheSize,
    cachedArtifacts: manifest?.artifacts?.length || 0
  };
}

