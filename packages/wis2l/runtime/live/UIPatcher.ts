/**
 * UI Live Patch System
 * Updates UI elements (sprites, text, fonts, layout) without code reload
 * Enables CardFront HUD hot-reloads and dynamic UI updates
 */

import { UnityMessagingBus } from "../unityBridge/UnityMessagingBus";

/**
 * UI Patcher
 * Provides live UI updates for Unity UI elements
 */
export const UIPatcher = {
  /**
   * Patch sprite/image on UI element
   */
  patchSprite: (path: string, content: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[UIPatcher] Unity not connected");
      return;
    }

    try {
      // Convert content to base64
      let base64: string;

      if (content.startsWith("data:image")) {
        const match = content.match(/data:image\/[^;]+;base64,(.+)/);
        base64 = match ? match[1] : content;
      } else if (content.match(/^[A-Za-z0-9+/=]+$/)) {
        base64 = content;
      } else {
        base64 = btoa(unescape(encodeURIComponent(content)));
      }

      // Extract object name from path (e.g., "UI/TurnIndicator.png" -> "TurnIndicator")
      const objectName = path
        .split("/")
        .pop()
        ?.replace(/\.(png|jpg|jpeg|gif|webp)$/i, "") || "UISprite";

      UnityMessagingBus.send("uiPatchSprite", {
        path,
        objectName,
        base64,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(`[UIPatcher] Error patching sprite ${path}:`, err);
    }
  },

  /**
   * Set text on UI Text component
   */
  setText: (objectName: string, text: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[UIPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("uiSetText", {
      objectName,
      text,
      timestamp: Date.now()
    });
  },

  /**
   * Set image sprite on UI Image component
   */
  setImage: (objectName: string, spritePath: string, content: string): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[UIPatcher] Unity not connected");
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

      UnityMessagingBus.send("uiSetImage", {
        objectName,
        spritePath,
        base64,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(`[UIPatcher] Error setting image on ${objectName}:`, err);
    }
  },

  /**
   * Set UI color
   */
  setColor: (objectName: string, r: number, g: number, b: number, a: number = 1): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[UIPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("uiSetColor", {
      objectName,
      r,
      g,
      b,
      a,
      timestamp: Date.now()
    });
  },

  /**
   * Update card stats display (CardFront-specific)
   */
  updateCardStats: (cardName: string, stats: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    name?: string;
  }): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[UIPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("uiUpdateCardStats", {
      cardName,
      stats,
      timestamp: Date.now()
    });
  },

  /**
   * Update HUD value (health, score, turn indicator, etc.)
   */
  updateHUD: (hudKey: string, value: any): void => {
    if (!UnityMessagingBus.isConnected()) {
      console.warn("[UIPatcher] Unity not connected");
      return;
    }

    UnityMessagingBus.send("uiUpdateHUD", {
      hudKey,
      value,
      timestamp: Date.now()
    });
  }
};

