/**
 * UnityRuntime API
 * Full scene control API for Unity WebGL
 * Similar to Bolt.new's LiveReload sandbox control
 */

import { UnityMessagingBus } from "./UnityMessagingBus";

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface CardStats {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  name?: string;
  description?: string;
  [key: string]: any;
}

/**
 * UnityRuntime API - Control Unity scene from WISSIL
 * Provides full parity with Bolt.new's sandbox control API
 */
export const UnityRuntime = {
  /**
   * Move GameObject to position
   */
  move: (id: string, position: Vector3): boolean => {
    return UnityMessagingBus.send("move", { id, position });
  },

  /**
   * Rotate GameObject
   */
  rotate: (id: string, rotation: Vector3): boolean => {
    return UnityMessagingBus.send("rotate", { id, rotation });
  },

  /**
   * Scale GameObject
   */
  scale: (id: string, scale: Vector3): boolean => {
    return UnityMessagingBus.send("scale", { id, scale });
  },

  /**
   * Set card statistics (for CardFront games)
   */
  setCardStats: (id: string, stats: CardStats): boolean => {
    return UnityMessagingBus.send("setCardStats", { id, stats });
  },

  /**
   * Set HUD value (e.g., health bar, score, turn indicator)
   */
  setHudValue: (key: string, value: any): boolean => {
    return UnityMessagingBus.send("setHudValue", { key, value });
  },

  /**
   * Spawn prefab at position
   */
  spawn: (prefab: string, position?: Vector3, rotation?: Vector3): boolean => {
    return UnityMessagingBus.send("spawn", { prefab, position, rotation });
  },

  /**
   * Destroy GameObject by ID
   */
  destroy: (id: string): boolean => {
    return UnityMessagingBus.send("destroy", { id });
  },

  /**
   * Enable/disable GameObject
   */
  setActive: (id: string, active: boolean): boolean => {
    return UnityMessagingBus.send("setActive", { id, active });
  },

  /**
   * Set component property value
   */
  setProperty: (id: string, component: string, property: string, value: any): boolean => {
    return UnityMessagingBus.send("setProperty", { id, component, property, value });
  },

  /**
   * Call method on component
   */
  callMethod: (id: string, component: string, method: string, args?: any[]): boolean => {
    return UnityMessagingBus.send("callMethod", { id, component, method, args: args || [] });
  },

  /**
   * Play animation
   */
  playAnimation: (id: string, animationName: string, normalizedTime?: number): boolean => {
    return UnityMessagingBus.send("playAnimation", { id, animationName, normalizedTime });
  },

  /**
   * Stop animation
   */
  stopAnimation: (id: string, animationName?: string): boolean => {
    return UnityMessagingBus.send("stopAnimation", { id, animationName });
  },

  /**
   * Set material property
   */
  setMaterialProperty: (id: string, property: string, value: any): boolean => {
    return UnityMessagingBus.send("setMaterialProperty", { id, property, value });
  },

  /**
   * Set texture
   */
  setTexture: (id: string, textureName: string, texturePath: string): boolean => {
    return UnityMessagingBus.send("setTexture", { id, textureName, texturePath });
  },

  /**
   * Set UI text
   */
  setUIText: (id: string, text: string): boolean => {
    return UnityMessagingBus.send("setUIText", { id, text });
  },

  /**
   * Set UI image sprite
   */
  setUIImage: (id: string, imagePath: string): boolean => {
    return UnityMessagingBus.send("setUIImage", { id, imagePath });
  },

  /**
   * Get GameObject position (returns via callback/event)
   */
  getPosition: (id: string): boolean => {
    return UnityMessagingBus.send("getPosition", { id });
  },

  /**
   * Find GameObject by name
   */
  find: (name: string): boolean => {
    return UnityMessagingBus.send("find", { name });
  }
};

