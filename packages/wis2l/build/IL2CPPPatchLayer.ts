/**
 * IL2CPP Patch Layer (Experimental)
 * Method injection system to avoid full IL2CPP rebuilds
 * Uses Phase G BehaviorOverride system
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { BehaviorOverride } from "../runtime/hotreload/BehaviorOverride";
import { BuildDiff } from "./FingerprintEngine";
import { useEditorState } from "@/state/editorState";

export interface IL2CPPPatch {
  methodName: string;
  filePath: string;
  patchType: "override" | "inject" | "replace";
  timestamp: number;
}

/**
 * IL2CPP Patch Layer
 * Provides method patching to avoid full IL2CPP rebuilds
 */
export const IL2CPPPatchLayer = {
  /**
   * Apply method patch for changed C# files
   */
  async applyPatches(diffs: BuildDiff[]): Promise<{ patched: number; errors: number }> {
    const pushMessage = useEditorState.getState().pushMessage;

    // Filter to only C# code changes
    const codeDiffs = diffs.filter((d) => d.type === "code" && d.path.endsWith(".cs"));

    if (codeDiffs.length === 0) {
      return { patched: 0, errors: 0 };
    }

    pushMessage(`[Build] Applying IL2CPP patches for ${codeDiffs.length} changed scripts...`);

    let patched = 0;
    let errors = 0;

    for (const diff of codeDiffs) {
      try {
        // Read the changed file
        const fs = require("@/wis2l/runtime/fs/wissilFs").useWissilFS.getState();
        const content = fs.readFile(diff.path);

        if (!content) {
          errors++;
          continue;
        }

        // Extract method names from C# file (simple regex-based extraction)
        const methodNames = extractMethodNames(content);

        // Register overrides for each method
        for (const methodName of methodNames) {
          // Create a handler that will be called by Unity
          BehaviorOverride.register(methodName, (args) => {
            // In a real implementation, this would execute the patched method logic
            // For now, we just log that the override was called
            pushMessage(`[IL2CPP Patch] Method ${methodName} called with override`);
            return null; // Fall back to C# implementation
          });

          // Notify Unity about the patch
          if (UnityMessagingBus.isConnected()) {
            UnityMessagingBus.send("patch/method", {
              methodName,
              filePath: diff.path,
              patchType: "override",
              timestamp: Date.now()
            });
          }

          patched++;
        }
      } catch (err: any) {
        console.error(`[IL2CPP Patch] Error patching ${diff.path}:`, err);
        errors++;
      }
    }

    pushMessage(`[Build] Applied ${patched} method patches (${errors} errors)`);

    return { patched, errors };
  },

  /**
   * Check if IL2CPP patch is possible
   */
  canPatch(diffs: BuildDiff[]): boolean {
    // Can patch if:
    // 1. Only code changes (no scene changes)
    // 2. Unity is connected
    // 3. BehaviorOverride system is available

    const hasCodeChanges = diffs.some((d) => d.type === "code");
    const hasSceneChanges = diffs.some((d) => d.type === "scene");

    return hasCodeChanges && !hasSceneChanges && UnityMessagingBus.isConnected();
  }
};

/**
 * Extract method names from C# source (simple regex-based)
 * In production, would use a proper C# parser
 */
function extractMethodNames(csContent: string): string[] {
  const methodNames: string[] = [];

  // Simple regex to find method declarations
  // Matches: public/private/protected returnType MethodName(...)
  const methodRegex = /(?:public|private|protected|internal)\s+\w+\s+(\w+)\s*\(/g;
  let match;

  while ((match = methodRegex.exec(csContent)) !== null) {
    const methodName = match[2];
    if (methodName && !methodNames.includes(methodName)) {
      methodNames.push(methodName);
    }
  }

  return methodNames;
}

