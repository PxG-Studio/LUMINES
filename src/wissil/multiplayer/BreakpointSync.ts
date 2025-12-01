/**
 * Breakpoint Sync System
 * Syncs breakpoints across all connected clients
 * Unity → WISSIL broadcast → all clients pause
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTransport } from "./Transport";
import { WSP, createWSPMessage, WSPMessage } from "./WSP";
import { useEditorState } from "@/state/editorState";

export interface BreakpointEvent {
  file: string;
  line: number;
  object?: string;
  condition?: string;
  stackTrace?: string;
  timestamp: number;
}

/**
 * Breakpoint Sync Manager
 * Handles syncing breakpoints across multiplayer clients
 */
export const BreakpointSync = {
  /**
   * Broadcast breakpoint hit
   */
  broadcastBreakpoint(breakpoint: BreakpointEvent): void {
    const transport = useTransport.getState();
    if (!transport.isConnected) return;

    const message = createWSPMessage(WSP.DEBUG_BREAKPOINT, breakpoint);
    transport.sendToAll(message);
  },

  /**
   * Handle incoming breakpoint from peer
   */
  handleIncomingBreakpoint(breakpoint: BreakpointEvent): void {
    // Update editor state to show breakpoint overlay
    const editorState = useEditorState.getState();
    
    editorState.setRuntimeError(
      `BREAKPOINT HIT\nFile: ${breakpoint.file}\nLine: ${breakpoint.line}${breakpoint.object ? `\nObject: ${breakpoint.object}` : ""}`
    );

    // Open file in editor
    if (breakpoint.file) {
      const fs = require("@/wissil/runtime/fs/wissilFs").useWissilFS.getState();
      if (fs.exists(breakpoint.file)) {
        const openFile = require("@/wissil/Slate/editor/openFile").openFile;
        openFile(breakpoint.file);
      }
    }

    // Dispatch event for UI components
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("wissil-breakpoint", {
          detail: breakpoint
        })
      );
    }
  },

  /**
   * Initialize breakpoint sync listeners
   */
  initialize(): () => void {
    // Listen for Unity breakpoint events
    UnityMessagingBus.on("breakpoint", (payload) => {
      BreakpointSync.broadcastBreakpoint({
        file: payload.file || "unknown",
        line: payload.line || 0,
        object: payload.object,
        condition: payload.condition,
        stackTrace: payload.stackTrace,
        timestamp: Date.now()
      });
    });

    // Listen for incoming multiplayer messages
    const messageHandler = (e: CustomEvent<WSPMessage>) => {
      const message = e.detail;

      if (message.type === WSP.DEBUG_BREAKPOINT) {
        BreakpointSync.handleIncomingBreakpoint(message.payload);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("wissil-mp", messageHandler as EventListener);

      return () => {
        window.removeEventListener("wissil-mp", messageHandler as EventListener);
      };
    }

    return () => {};
  }
};

