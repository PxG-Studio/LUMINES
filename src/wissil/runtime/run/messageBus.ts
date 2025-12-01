/**
 * Message Bus
 * Central communication bus between parent (WISSIL IDE) ↔ sandbox (iframe)
 */

export type SandboxMessage =
  | { wissil: true; type: "log"; payload: string }
  | { wissil: true; type: "error"; payload: string }
  | { wissil: true; type: "warn"; payload: string }
  | { wissil: true; type: "runtime-error"; payload: string }
  | { wissil: true; type: "ready"; payload: string };

export type SandboxMessageHandler = (msg: SandboxMessage) => void;

const handlers = new Set<SandboxMessageHandler>();

/**
 * Add a message handler for sandbox messages
 */
export function addSandboxHandler(handler: SandboxMessageHandler): void {
  handlers.add(handler);
}

/**
 * Remove a message handler
 */
export function removeSandboxHandler(handler: SandboxMessageHandler): void {
  handlers.delete(handler);
}

/**
 * Initialize message listener for iframe messages
 * Only runs in browser environment
 */
if (typeof window !== "undefined") {
  window.addEventListener("message", (event) => {
    const data = event.data;
    
    // Only process WISSIL messages
    if (!data || !data.wissil) return;

    // Validate message structure
    if (typeof data.type !== "string" || typeof data.payload !== "string") {
      return;
    }

    // Forward to all handlers
    handlers.forEach((handler) => {
      try {
        handler(data as SandboxMessage);
      } catch (err) {
        console.error("Error in sandbox message handler:", err);
      }
    });
  });
}

/**
 * Clear all handlers (useful for cleanup)
 */
export function clearSandboxHandlers(): void {
  handlers.clear();
}

