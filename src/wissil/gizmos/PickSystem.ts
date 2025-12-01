/**
 * Pick System
 * Raycast-based object selection in WebGL viewport
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

/**
 * Pick System
 * Handles object selection via raycast
 */
export class PickSystem {
  private static isInitialized = false;

  /**
   * Initialize pick system
   */
  static init(): void {
    if (this.isInitialized) return;

    // Handle click events on Unity canvas
    window.addEventListener("click", this.handleClick);
    window.addEventListener("pointerdown", this.handlePointerDown);

    this.isInitialized = true;
  }

  /**
   * Handle click event
   */
  private static handleClick = (e: MouseEvent) => {
    // Check if clicking on Unity canvas area
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Only pick if clicking within canvas bounds
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      this.pick(x, y);
    }
  };

  /**
   * Handle pointer down event
   */
  private static handlePointerDown = (e: PointerEvent) => {
    // Prevent default to avoid conflicts with gizmo manipulation
    const target = e.target as HTMLElement;
    if (target.tagName === "CANVAS" && e.button === 0) {
      // Left click on canvas
      const canvas = target as HTMLCanvasElement;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Small delay to check if it's a gizmo click
      setTimeout(() => {
        if (!e.defaultPrevented) {
          this.pick(x, y);
        }
      }, 10);
    }
  };

  /**
   * Pick object at screen coordinates
   */
  static pick(screenX: number, screenY: number): void {
    if (!UnityMessagingBus.isConnected()) {
      return;
    }

    // Normalize coordinates (0-1 range)
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const normalizedX = screenX / rect.width;
    const normalizedY = 1 - screenY / rect.height; // Flip Y axis

    UnityMessagingBus.send("scene/pick", {
      x: normalizedX,
      y: normalizedY
    });
  }

  /**
   * Cleanup
   */
  static cleanup(): void {
    window.removeEventListener("click", this.handleClick);
    window.removeEventListener("pointerdown", this.handlePointerDown);
    this.isInitialized = false;
  }
}

