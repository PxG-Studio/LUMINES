/**
 * Texture Injection Pipeline
 * Updates textures on materials without reloading the scene
 * Similar to hot texture reload in WebGL demos
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";

/**
 * Texture Injector
 * Provides live texture patching for Unity WebGL
 */
export const TextureInjector = {
  /**
   * Patch texture from file path and content
   * Content can be base64 or binary string
   */
  patchTexture: (path: string, content: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[TextureInjector] Unity not connected");
      return;
    }

    try {
      // Convert content to base64 if needed
      let base64: string;

      if (content.startsWith("data:image")) {
        // Already a data URL, extract base64
        const match = content.match(/data:image\/[^;]+;base64,(.+)/);
        base64 = match ? match[1] : content;
      } else if (content.match(/^[A-Za-z0-9+/=]+$/)) {
        // Already base64
        base64 = content;
      } else {
        // Binary or other format - convert to base64
        // For browser, we assume UTF-8 encoding for text-based formats
        // For actual binary, would need proper handling
        base64 = btoa(unescape(encodeURIComponent(content)));
      }

      // Extract texture name from path
      const textureName = path.split("/").pop()?.replace(/\.[^.]+$/, "") || "Texture";
      const objectPath = path.replace(/\.(png|jpg|jpeg|gif|webp)$/i, "");

      UnityMessagingBus.send("patchTexture", {
        path,
        textureName,
        objectPath,
        base64,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(`[TextureInjector] Error patching texture ${path}:`, err);
      UnityMessagingBus.send("assetDiff", {
        path,
        type: "error",
        error: `Texture injection failed: ${err?.message || String(err)}`
      });
    }
  },

  /**
   * Patch texture on specific GameObject
   */
  patchTextureOnObject: (objectName: string, texturePath: string, content: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[TextureInjector] Unity not connected");
      return;
    }

    try {
      let base64: string;

      if (content.startsWith("data:image")) {
        const match = content.match(/data:image\/[^;]+;base64,(.+)/);
        base64 = match ? match[1] : content;
      } else if (content.match(/^[A-Za-z0-9+/=]+$/)) {
        base64 = content;
      } else {
        base64 = btoa(unescape(encodeURIComponent(content)));
      }

      UnityMessagingBus.send("patchTexture", {
        objectName,
        texturePath,
        base64,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(`[TextureInjector] Error patching texture on ${objectName}:`, err);
    }
  }
};

