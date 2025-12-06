/**
 * Ignition Controller
 * Main runtime controller that wires Build → Execute → Logs/Errors → Preview
 * This is the official execution loop for WISSIL IDE
 */

import { wissilBuild } from "../build/wissilBuild";
import { executeBundle, resetSandbox } from "../run/sandboxManager";
import { useEditorState } from "@/state/editorState";
import { useWissilFS } from "../fs/wissilFs";
import { UnityBridge } from "@/wissil/IgnisWebGL/unityBridge";

export class IgnitionController {
  /**
   * Run: Build → Execute
   * Builds the entry file and executes it in the sandbox
   */
  static async run(entry: string = "src/main.ts"): Promise<void> {
    const state = useEditorState.getState();
    
    state.setBuildStatus("running");
    state.setRuntimeError(null);
    state.runtimeMessages = []; // Clear logs
    
    state.pushMessage(`[Ignition] Starting build for ${entry}...`);

    try {
      const result = await wissilBuild(entry);

      if (!result.success || !result.bundle || result.bundle.trim() === "") {
        state.setBuildStatus("error");
        state.setRuntimeError(result.error || "Build produced an empty bundle.");
        return;
      }

      state.setBuildStatus("idle");
      state.pushMessage(`[Ignition] Build successful, executing...`);
      
      executeBundle(result.bundle);
    } catch (err: any) {
      state.setBuildStatus("error");
      state.setRuntimeError(err?.message || String(err));
      state.pushMessage(`[Ignition] Build failed: ${err?.message || String(err)}`);
    }
  }

  /**
   * Restart: Reset Sandbox → Build → Execute
   * Resets the sandbox for a clean state, then builds and executes
   */
  static async restart(entry: string = "src/main.ts"): Promise<void> {
    const state = useEditorState.getState();

    state.setBuildStatus("running");
    state.setRuntimeError(null);
    state.runtimeMessages = []; // Clear logs
    
    state.pushMessage(`[Ignition] Restarting runtime...`);

    // Destroy Unity instance
    UnityBridge.destroy();

    // Reset sandbox first
    resetSandbox();
    
    // Small delay to ensure sandbox reset completes
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const result = await wissilBuild(entry);

      if (!result.success || !result.bundle || result.bundle.trim() === "") {
        state.setBuildStatus("error");
        state.setRuntimeError(result.error || "Restart build error.");
        return;
      }

      state.setBuildStatus("idle");
      state.pushMessage(`[Ignition] Restart complete, executing...`);
      
      executeBundle(result.bundle);
    } catch (err: any) {
      state.setBuildStatus("error");
      state.setRuntimeError(err?.message || String(err));
      state.pushMessage(`[Ignition] Restart failed: ${err?.message || String(err)}`);
    }
  }

  /**
   * Stop: Destroy Sandbox + Reset State
   * Stops execution and clears runtime state
   */
  static stop(): void {
    const state = useEditorState.getState();
    
    state.setBuildStatus("idle");
    state.setRuntimeError(null);
    state.runtimeMessages = [];
    state.pushMessage(`[Ignition] Runtime stopped`);

    // Destroy Unity instance
    UnityBridge.destroy();

    resetSandbox();
  }

  /**
   * Clear logs only (keep execution running)
   */
  static clearLogs(): void {
    const state = useEditorState.getState();
    state.runtimeMessages = [];
  }
}

