/**
 * ScriptableObject Live Patch System
 * Patches Unity ScriptableObjects at runtime
 * Updates: Card archetypes, Tile definitions, Camera settings, UI skins, Enemy AI, Item definitions
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";
import { useWissilFS } from "../fs/wissilFs";

export interface SOPatchData {
  name: string;
  json: string | object;
  path?: string;
}

/**
 * ScriptableObject Patcher
 * Provides live patching for Unity ScriptableObjects
 */
export const SOPatch = {
  /**
   * Patch a ScriptableObject by name
   */
  patch(name: string, data: object | string): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn(`[SOPatch] Unity not connected, cannot patch: ${name}`);
      return;
    }

    try {
      const json = typeof data === "string" ? data : JSON.stringify(data);

      UnityMessagingBus.send("patchSO", {
        name,
        json,
        timestamp: Date.now()
      });

      console.log(`[SOPatch] Patched ScriptableObject: ${name}`);
    } catch (err: any) {
      console.error(`[SOPatch] Error patching ${name}:`, err);
      UnityMessagingBus.send("patchSO", {
        name,
        error: err?.message || String(err),
        timestamp: Date.now()
      });
    }
  },

  /**
   * Patch multiple ScriptableObjects at once
   */
  patchMultiple(patches: SOPatchData[]): void {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[SOPatch] Unity not connected, cannot patch ScriptableObjects");
      return;
    }

    for (const patch of patches) {
      this.patch(patch.name, patch.json);
    }
  },

  /**
   * Patch from WISSIL FS file
   */
  patchFromFile(soName: string, filePath: string): void {
    const fs = useWissilFS.getState();
    const content = fs.readFile(filePath);

    if (content === null) {
      console.warn(`[SOPatch] File not found: ${filePath}`);
      return;
    }

    this.patch(soName, content);
  },

  /**
   * Create or update Card Archetype ScriptableObject
   */
  patchCardArchetype(name: string, archetype: {
    top: number;
    bottom: number;
    left: number;
    right: number;
    name: string;
    description?: string;
    [key: string]: any;
  }): void {
    this.patch(name, {
      type: "CardArchetype",
      ...archetype
    });
  },

  /**
   * Create or update Tile Definition ScriptableObject
   */
  patchTileDefinition(name: string, definition: {
    type: string;
    value: number;
    properties?: Record<string, any>;
  }): void {
    this.patch(name, {
      type: "TileDefinition",
      ...definition
    });
  },

  /**
   * Create or update UI Skin ScriptableObject
   */
  patchUISkin(name: string, skin: {
    colors: Record<string, string>;
    fonts?: Record<string, string>;
    sprites?: Record<string, string>;
    [key: string]: any;
  }): void {
    this.patch(name, {
      type: "UISkin",
      ...skin
    });
  }
};

