/**
 * Sandbox Manager
 * Creates and manages the iframe sandbox for secure code execution
 */

'use client';

import { addSandboxHandler } from "./messageBus";
import { useEditorState } from "@/state/editorState";

// Singleton iframe
let iframe: HTMLIFrameElement | null = null;
let isReady = false;

/**
 * Create the sandbox iframe
 * Uses strictest sandbox permissions (allow-scripts only)
 */
export function createSandbox(): HTMLIFrameElement {
  if (iframe && iframe.isConnected) {
    return iframe;
  }

  // Clean up existing iframe if disconnected
  if (iframe) {
    iframe.remove();
    iframe = null;
  }

  iframe = document.createElement("iframe");
  iframe.sandbox.add("allow-scripts");
  iframe.src = "/wissil-sandbox.html";
  iframe.style.display = "none";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";

  // Wait for iframe to load before using
  iframe.onload = () => {
    isReady = true;
  };

  document.body.appendChild(iframe);
  return iframe;
}

/**
 * Reset the sandbox (reload for clean state)
 */
export function resetSandbox(): void {
  if (!iframe) return;

  isReady = false;
  
  // Send reset message
  try {
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          wissil: true,
          type: "reset"
        },
        "*"
      );
    }
  } catch (err) {
    console.error("Error resetting sandbox:", err);
  }

  // Remove and recreate
  iframe.remove();
  iframe = null;
  createSandbox();
}

/**
 * Execute a bundle in the sandbox
 */
export function executeBundle(bundle: string): void {
  createSandbox();

  // Wait for iframe to be ready
  const waitForReady = () => {
    if (!iframe || !isReady) {
      setTimeout(waitForReady, 100);
      return;
    }

    try {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          {
            wissil: true,
            type: "execute",
            bundle
          },
          "*"
        );
      }
    } catch (err) {
      console.error("Error executing bundle:", err);
      const { setRuntimeError } = useEditorState.getState();
      setRuntimeError(`Sandbox execution error: ${err}`);
    }
  };

  waitForReady();
}

/**
 * Attach runtime → UI bridge
 * Connects sandbox messages to EditorState
 */
addSandboxHandler((msg) => {
  const { pushMessage, setRuntimeError } = useEditorState.getState();

  switch (msg.type) {
    case "log":
      pushMessage(`[Runtime] ${msg.payload}`);
      break;

    case "warn":
      pushMessage(`⚠️ [Runtime] ${msg.payload}`);
      break;

    case "error":
      setRuntimeError(msg.payload);
      pushMessage(`❌ [Runtime Error] ${msg.payload}`);
      break;

    case "runtime-error":
      setRuntimeError(msg.payload);
      pushMessage(`❌ [Runtime Error] ${msg.payload}`);
      break;

    case "ready":
      if (msg.payload === "Sandbox initialized") {
        pushMessage("✓ Sandbox ready");
      } else {
        pushMessage(`✓ ${msg.payload}`);
      }
      break;
  }
});

