/**
 * Material & Shader Live Update
 * Updates material properties in real-time without scene reload
 * Safe subset: colors, floats, texture references, keyword toggles
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";
import { parseUnityYAML } from "@/wissil/UnityBrowser/parsers/yamlParser";

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * Material Injector
 * Provides live material property updates
 */
export const MaterialInjector = {
  /**
   * Set float property on material
   */
  setFloat: (objectName: string, property: string, value: number): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[MaterialInjector] Unity not connected");
      return;
    }

    UnityMessagingBus.send("materialSetFloat", {
      objectName,
      property,
      value,
      timestamp: Date.now()
    });
  },

  /**
   * Set color property on material
   */
  setColor: (objectName: string, property: string, rgba: RGBA): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[MaterialInjector] Unity not connected");
      return;
    }

    UnityMessagingBus.send("materialSetColor", {
      objectName,
      property,
      r: rgba.r,
      g: rgba.g,
      b: rgba.b,
      a: rgba.a !== undefined ? rgba.a : 1.0,
      timestamp: Date.now()
    });
  },

  /**
   * Set vector property on material
   */
  setVector: (objectName: string, property: string, x: number, y: number, z: number, w?: number): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[MaterialInjector] Unity not connected");
      return;
    }

    UnityMessagingBus.send("materialSetVector", {
      objectName,
      property,
      x,
      y,
      z,
      w: w !== undefined ? w : 0,
      timestamp: Date.now()
    });
  },

  /**
   * Set texture property on material
   */
  setTexture: (objectName: string, property: string, texturePath: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[MaterialInjector] Unity not connected");
      return;
    }

    UnityMessagingBus.send("materialSetTexture", {
      objectName,
      property,
      texturePath,
      timestamp: Date.now()
    });
  },

  /**
   * Enable/disable shader keyword
   */
  setKeyword: (objectName: string, keyword: string, enabled: boolean): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[MaterialInjector] Unity not connected");
      return;
    }

    UnityMessagingBus.send("materialSetKeyword", {
      objectName,
      keyword,
      enabled,
      timestamp: Date.now()
    });
  },

  /**
   * Patch material from Unity YAML file
   */
  patchMaterialFromYAML: (path: string, yamlContent: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[MaterialInjector] Unity not connected");
      return;
    }

    try {
      const docs = parseUnityYAML(yamlContent);
      const materialDoc = docs.find((d) => d.Material);

      if (!materialDoc || !materialDoc.Material) {
        console.warn(`[MaterialInjector] No Material found in ${path}`);
        return;
      }

      const material = materialDoc.Material;
      const materialName = material.m_Name || path.split("/").pop()?.replace(/\.mat$/, "") || "Material";

      // Extract properties from saved properties
      const savedProps = material.m_SavedProperties;
      if (savedProps) {
        const props: Record<string, any> = {};

        // Parse color properties
        if (savedProps.m_Colors) {
          for (const [key, value] of Object.entries(savedProps.m_Colors)) {
            if (value && typeof value === "object" && "r" in value) {
              props[key] = {
                type: "color",
                r: value.r || 0,
                g: value.g || 0,
                b: value.b || 0,
                a: value.a !== undefined ? value.a : 1
              };
            }
          }
        }

        // Parse float properties
        if (savedProps.m_Floats) {
          for (const [key, value] of Object.entries(savedProps.m_Floats)) {
            props[key] = {
              type: "float",
              value: typeof value === "number" ? value : parseFloat(String(value)) || 0
            };
          }
        }

        // Send material patch
        UnityMessagingBus.send("patchMaterial", {
          path,
          materialName,
          properties: props,
          timestamp: Date.now()
        });
      }
    } catch (err: any) {
      console.error(`[MaterialInjector] Error parsing material YAML ${path}:`, err);
      UnityMessagingBus.send("assetDiff", {
        path,
        type: "error",
        error: `Material parsing failed: ${err?.message || String(err)}`
      });
    }
  }
};

