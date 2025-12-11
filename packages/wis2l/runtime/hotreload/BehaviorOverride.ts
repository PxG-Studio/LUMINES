/**
 * Behavior Override Layer
 * JS → Unity delegation system for runtime method overrides
 * Allows C# methods to be overridden by JavaScript logic at runtime
 * Similar to Bolt.new eval patches, Godot GDScript hot override, Unity Udon
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";
import { UnityRuntime } from "../unityBridge/UnityRuntime";

export type OverrideHandler = (args: any) => any;

type OverrideHandlers = Record<string, OverrideHandler>;

let overrideHandlers: OverrideHandlers = {};

/**
 * Behavior Override System
 * Provides runtime method override capability for Unity C# scripts
 */
export const BehaviorOverride = {
  /**
   * Register a method override handler
   * When Unity calls this method, it will use the JS handler instead
   */
  register(methodName: string, handler: OverrideHandler): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn(`[BehaviorOverride] Unity not connected, cannot register override: ${methodName}`);
      return;
    }

    // Store handler locally
    overrideHandlers[methodName] = handler;

    // Notify Unity that this method has an override
    UnityMessagingBus.send("registerOverride", {
      methodName,
      timestamp: Date.now()
    });

    console.log(`[BehaviorOverride] Registered override for: ${methodName}`);
  },

  /**
   * Unregister a method override
   */
  unregister(methodName: string): void {
    delete overrideHandlers[methodName];

    UnityMessagingBus.send("unregisterOverride", {
      methodName,
      timestamp: Date.now()
    });

    console.log(`[BehaviorOverride] Unregistered override for: ${methodName}`);
  },

  /**
   * Check if a method has an override
   */
  hasOverride(methodName: string): boolean {
    return methodName in overrideHandlers;
  },

  /**
   * Get override handler (called by Unity bridge)
   */
  getHandler(methodName: string): OverrideHandler | null {
    return overrideHandlers[methodName] || null;
  },

  /**
   * Call override handler (internal use)
   */
  call(methodName: string, args: any): any {
    const handler = overrideHandlers[methodName];
    if (!handler) {
      return null; // No override, fall back to C#
    }

    try {
      return handler(args);
    } catch (err: any) {
      console.error(`[BehaviorOverride] Error in override handler for ${methodName}:`, err);
      return null; // Error in override, fall back to C#
    }
  },

  /**
   * Clear all overrides
   */
  clear(): void {
    overrideHandlers = {};
    UnityMessagingBus.send("clearOverrides", { timestamp: Date.now() });
    console.log("[BehaviorOverride] Cleared all overrides");
  },

  /**
   * List all registered overrides
   */
  list(): string[] {
    return Object.keys(overrideHandlers);
  }
};

/**
 * Set up global function for Unity to call
 * Unity will call window.BehaviorOverride.call(methodName, jsonArgs)
 */
if (typeof window !== "undefined") {
  (window as any).BehaviorOverride = {
    call: (methodName: string, jsonArgs: string) => {
      try {
        const args = jsonArgs ? JSON.parse(jsonArgs) : {};
        const result = BehaviorOverride.call(methodName, args);
        return result ? JSON.stringify(result) : null;
      } catch (err: any) {
        console.error(`[BehaviorOverride] Error parsing args for ${methodName}:`, err);
        return null;
      }
    },
    hasOverride: (methodName: string) => BehaviorOverride.hasOverride(methodName)
  };
}

