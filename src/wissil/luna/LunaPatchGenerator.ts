/**
 * LUNA Patch Generator
 * Translates "Fix Intent" into actual code/config/asset patches
 * Applies patches using Phase F & G hot-reload layers
 */

import { useWissilFS } from "../runtime/fs/wissilFs";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { patchScriptableObject } from "../runtime/hotreload/SOPatch";
import { BehaviorOverride } from "../runtime/hotreload/BehaviorOverride";
import { RuleFix, PrefabFix, CodeFix } from "./LunaHeuristics";
import { useEditorState } from "@/state/editorState";
import { runIncrementalBuild } from "../build/BuildOrchestrator";

/**
 * LUNA Patch Generator
 * Applies fixes to config, prefabs, and code
 */
export class LunaPatchGenerator {
  /**
   * Apply JSON config patch
   */
  static applyJSONPatch(fix: RuleFix): boolean {
    try {
      const fs = useWissilFS.getState();
      const pushMessage = useEditorState.getState().pushMessage;

      // Read current file
      const currentContent = fs.readFile(fix.file);
      if (!currentContent) {
        // File doesn't exist, create it
        fs.writeFile(fix.file, JSON.stringify(fix.change, null, 2));
        pushMessage(`[LUNA] Created config file: ${fix.file}`);
        return true;
      }

      // Parse and merge
      let current = {};
      try {
        current = JSON.parse(currentContent);
      } catch (err) {
        console.error(`[LUNA] Error parsing ${fix.file}:`, err);
        return false;
      }

      // Deep merge changes
      const updated = deepMerge(current, fix.change);

      // Write back
      fs.writeFile(fix.file, JSON.stringify(updated, null, 2));
      pushMessage(`[LUNA] ✅ Patched config: ${fix.file}`);

      // Trigger hot reload if it's a config file
      if (fix.file.includes("config") || fix.file.includes("rules")) {
        patchScriptableObject("GameConfig", JSON.stringify(updated));
      }

      return true;
    } catch (err: any) {
      console.error(`[LUNA] Error applying JSON patch:`, err);
      useEditorState.getState().pushMessage(`[LUNA] ❌ Failed to patch ${fix.file}: ${err.message}`);
      return false;
    }
  }

  /**
   * Rebuild prefab
   */
  static rebuildPrefab(fix: PrefabFix): boolean {
    try {
      const pushMessage = useEditorState.getState().pushMessage;

      if (fix.type === "rebuild_prefab") {
        // Forward to Unity for prefab mutation
        if (UnityMessagingBus.isConnected()) {
          UnityMessagingBus.send("mutatePrefab", {
            prefabName: fix.prefab,
            path: fix.path
          });
          pushMessage(`[LUNA] ✅ Rebuilding prefab: ${fix.prefab}`);
          return true;
        } else {
          pushMessage(`[LUNA] ⚠️ Unity not connected, cannot rebuild prefab`);
          return false;
        }
      }

      if (fix.type === "refresh_prefab") {
        // Trigger asset refresh
        if (UnityMessagingBus.isConnected()) {
          UnityMessagingBus.send("refreshAsset", {
            path: fix.path
          });
          pushMessage(`[LUNA] ✅ Refreshing asset: ${fix.path}`);
          return true;
        }
      }

      return false;
    } catch (err: any) {
      console.error(`[LUNA] Error rebuilding prefab:`, err);
      useEditorState.getState().pushMessage(`[LUNA] ❌ Failed to rebuild prefab: ${err.message}`);
      return false;
    }
  }

  /**
   * Patch C# method
   */
  static patchCSharp(fix: CodeFix): boolean {
    try {
      const pushMessage = useEditorState.getState().pushMessage;

      if (fix.type === "patch_method" && fix.method && fix.patch) {
        // Register behavior override
        BehaviorOverride.register(fix.method, (args) => {
          // In a real implementation, this would execute the patched logic
          pushMessage(`[LUNA] Executing patched method: ${fix.method}`);
          return null; // Fall back to C# implementation
        });

        // Notify Unity
        if (UnityMessagingBus.isConnected()) {
          UnityMessagingBus.send("patch/method", {
            methodName: fix.method,
            file: fix.file,
            patch: fix.patch
          });
          pushMessage(`[LUNA] ✅ Patched method: ${fix.method}`);
          return true;
        }
      }

      if (fix.type === "add_guard" && fix.method && fix.patch) {
        // Add guard clause via method override
        BehaviorOverride.register(fix.method, (args) => {
          pushMessage(`[LUNA] Guard clause active for: ${fix.method}`);
          // Guard logic would be executed here
          return null;
        });

        if (UnityMessagingBus.isConnected()) {
          UnityMessagingBus.send("patch/guard", {
            methodName: fix.method,
            file: fix.file,
            guard: fix.patch
          });
          pushMessage(`[LUNA] ✅ Added guard clause to: ${fix.method}`);
          return true;
        }
      }

      return false;
    } catch (err: any) {
      console.error(`[LUNA] Error patching C#:`, err);
      useEditorState.getState().pushMessage(`[LUNA] ❌ Failed to patch code: ${err.message}`);
      return false;
    }
  }

  /**
   * Trigger build for compilation fixes
   */
  static triggerBuild(): Promise<boolean> {
    return runIncrementalBuild().then((result) => {
      const pushMessage = useEditorState.getState().pushMessage;
      if (result.success) {
        pushMessage(`[LUNA] ✅ Build completed: ${result.type}`);
        return true;
      } else {
        pushMessage(`[LUNA] ❌ Build failed: ${result.error}`);
        return false;
      }
    });
  }
}

/**
 * Deep merge two objects
 */
function deepMerge(target: any, source: any): any {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }

  return output;
}

function isObject(item: any): boolean {
  return item && typeof item === "object" && !Array.isArray(item);
}

