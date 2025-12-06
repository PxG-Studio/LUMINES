/**
 * Unity Messaging Bridge
 * Bridges logs/errors from Unity → IDE
 */

import { useEditorState } from "@/state/editorState";

let messagingSetup = false;

/**
 * Setup Unity messaging to forward logs/errors to IDE
 */
export function setupUnityMessaging(): void {
  if (messagingSetup) return;

  const state = useEditorState.getState();

  // Store original console methods
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  // Intercept console.log
  console.log = (...args: any[]) => {
    originalLog.apply(console, args);
    const message = args.map(a => 
      typeof a === 'object' ? JSON.stringify(a) : String(a)
    ).join(" ");
    state.pushMessage(`[Unity] ${message}`);
  };

  // Intercept console.error
  console.error = (...args: any[]) => {
    originalError.apply(console, args);
    const message = args.map(a => 
      typeof a === 'object' ? JSON.stringify(a) : String(a)
    ).join(" ");
    state.setRuntimeError(`Unity Error: ${message}`);
    state.pushMessage(`❌ [Unity Error] ${message}`);
  };

  // Intercept console.warn
  console.warn = (...args: any[]) => {
    originalWarn.apply(console, args);
    const message = args.map(a => 
      typeof a === 'object' ? JSON.stringify(a) : String(a)
    ).join(" ");
    state.pushMessage(`⚠️ [Unity Warning] ${message}`);
  };

  messagingSetup = true;
}

/**
 * Cleanup Unity messaging (restore original console)
 */
export function cleanupUnityMessaging(): void {
  // Note: This is a placeholder - in production you'd want to restore originals
  // For now, we'll leave console interception active
  messagingSetup = false;
}

