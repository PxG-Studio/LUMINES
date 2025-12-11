/**
 * Input Sync System
 * Syncs cursor position, selection, and hover events across all clients
 * Bolt.new Liveshare parity - Figma-style ghost cursors
 */

import { useTransport } from "./Transport";
import { WSP, createWSPMessage, WSPMessage } from "./WSP";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

export interface CursorPosition {
  x: number;
  y: number;
  clientId: string;
  timestamp: number;
}

export interface SelectionEvent {
  objectId: string | null;
  clientId: string;
  timestamp: number;
}

export interface HoverEvent {
  objectId: string | null;
  clientId: string;
  timestamp: number;
}

let inputSyncEnabled = false;
let lastCursorBroadcast = 0;
const CURSOR_THROTTLE_MS = 50; // Broadcast cursor max once per 50ms

/**
 * Input Sync Manager
 * Handles syncing user input (cursor, selection, hover) across multiplayer clients
 */
export const InputSync = {
  /**
   * Enable input sync
   */
  enable(): void {
    if (inputSyncEnabled) return;
    inputSyncEnabled = true;

    // Listen for mouse movement
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClick);
    }

    console.log("[InputSync] Enabled");
  },

  /**
   * Disable input sync
   */
  disable(): void {
    if (!inputSyncEnabled) return;
    inputSyncEnabled = false;

    if (typeof window !== "undefined") {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    }

    console.log("[InputSync] Disabled");
  },

  /**
   * Broadcast cursor position
   */
  broadcastCursor(x: number, y: number): void {
    const transport = useTransport.getState();
    if (!transport.isConnected || !inputSyncEnabled) return;

    // Throttle cursor updates
    const now = Date.now();
    if (now - lastCursorBroadcast < CURSOR_THROTTLE_MS) {
      return;
    }
    lastCursorBroadcast = now;

    const message = createWSPMessage(WSP.INPUT_CURSOR, {
      x,
      y,
      clientId: transport.localId,
      timestamp: now
    });

    transport.sendToAll(message);
  },

  /**
   * Broadcast selection event
   */
  broadcastSelection(objectId: string | null): void {
    const transport = useTransport.getState();
    if (!transport.isConnected) return;

    const message = createWSPMessage(WSP.INPUT_SELECT, {
      objectId,
      clientId: transport.localId,
      timestamp: Date.now()
    });

    transport.sendToAll(message);

    // Also send to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncSelection", {
        objectId,
        clientId: transport.localId
      });
    }
  },

  /**
   * Broadcast hover event
   */
  broadcastHover(objectId: string | null): void {
    const transport = useTransport.getState();
    if (!transport.isConnected) return;

    const message = createWSPMessage(WSP.INPUT_HOVER, {
      objectId,
      clientId: transport.localId,
      timestamp: Date.now()
    });

    transport.sendToAll(message);

    // Also send to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncHover", {
        objectId,
        clientId: transport.localId
      });
    }
  },

  /**
   * Handle incoming cursor from peer
   */
  handleIncomingCursor(cursor: CursorPosition): void {
    // Dispatch event for UI components to handle
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("wissil-cursor", {
          detail: cursor
        })
      );
    }
  },

  /**
   * Handle incoming selection from peer
   */
  handleIncomingSelection(selection: SelectionEvent): void {
    // Forward to Unity for highlighting
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("highlightObject", {
        objectId: selection.objectId,
        clientId: selection.clientId
      });
    }

    // Dispatch event for UI
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("wissil-selection", {
          detail: selection
        })
      );
    }
  },

  /**
   * Handle incoming hover from peer
   */
  handleIncomingHover(hover: HoverEvent): void {
    // Forward to Unity for hover effects
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("hoverObject", {
        objectId: hover.objectId,
        clientId: hover.clientId
      });
    }
  },

  /**
   * Initialize input sync listeners
   */
  initialize(): () => void {
    // Listen for incoming multiplayer messages
    const messageHandler = (e: CustomEvent<WSPMessage>) => {
      const message = e.detail;

      switch (message.type) {
        case WSP.INPUT_CURSOR:
          InputSync.handleIncomingCursor(message.payload);
          break;
        case WSP.INPUT_SELECT:
          InputSync.handleIncomingSelection(message.payload);
          break;
        case WSP.INPUT_HOVER:
          InputSync.handleIncomingHover(message.payload);
          break;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("wissil-mp", messageHandler as EventListener);

      // Auto-enable input sync
      InputSync.enable();

      return () => {
        InputSync.disable();
        window.removeEventListener("wissil-mp", messageHandler as EventListener);
      };
    }

    return () => {
      InputSync.disable();
    };
  }
};

/**
 * Mouse move handler
 */
function handleMouseMove(e: MouseEvent): void {
  InputSync.broadcastCursor(e.clientX, e.clientY);
}

/**
 * Click handler (for selection sync)
 */
function handleClick(e: MouseEvent): void {
  // Selection will be handled by Unity when user clicks on objects
  // This is just for tracking clicks
}

