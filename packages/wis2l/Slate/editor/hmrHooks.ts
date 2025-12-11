/**
 * HMR (Hot Module Reload) Hooks
 * Triggers automatic rebuild and runtime reload after file changes
 */

import { IgnitionController } from "@/wis2l/runtime/projects/ignitionController";

let timeout: NodeJS.Timeout | null = null;

/**
 * Trigger HMR - debounced rebuild after file changes
 * Simple debounce to avoid hammering esbuild
 */
export function triggerHMR(): void {
  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    // Get entry file from editor state or use default
    const entry = "src/main.ts";
    IgnitionController.run(entry);
    timeout = null;
  }, 350); // 350ms debounce - similar to Vite HMR
}

/**
 * Clear any pending HMR
 */
export function clearHMR(): void {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
}

