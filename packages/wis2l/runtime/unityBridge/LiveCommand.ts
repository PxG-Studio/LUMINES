/**
 * LiveCommand API
 * Bolt.new-style command interface for Unity runtime
 * Provides run, reload, evaluate, and scene control commands
 */

import { UnityMessagingBus } from "./UnityMessagingBus";

export interface LiveCommandOptions {
  timeout?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * LiveCommand API - Direct commands to Unity runtime
 * Similar to Bolt.new's sandbox.run(), sandbox.reload(), etc.
 */
export const LiveCommand = {
  /**
   * Run/start the Unity scene
   */
  run: (options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("run", {});
    options?.onSuccess?.();
  },

  /**
   * Reload/reset the Unity scene
   */
  reload: (options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("reload", {});
    options?.onSuccess?.();
  },

  /**
   * Stop/pause the Unity scene
   */
  stop: (options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("stop", {});
    options?.onSuccess?.();
  },

  /**
   * Evaluate JavaScript-like command in Unity context
   */
  evaluate: (code: string, options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("evaluate", { code });
    options?.onSuccess?.();
  },

  /**
   * Play animation by ID
   */
  playAnimation: (id: string, options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("playAnimation", { id });
    options?.onSuccess?.();
  },

  /**
   * Set value at path (e.g., "Card[0]/Top")
   */
  setValue: (path: string, value: any, options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("setValue", { path, value });
    options?.onSuccess?.();
  },

  /**
   * Call a method on a GameObject or component
   */
  call: (method: string, args?: any[], options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("call", { method, args: args || [] });
    options?.onSuccess?.();
  },

  /**
   * Set multiple values at once (batch update)
   */
  setValues: (values: Record<string, any>, options?: LiveCommandOptions): void => {
    UnityMessagingBus.send("setValues", { values });
    options?.onSuccess?.();
  }
};

