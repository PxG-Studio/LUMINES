/**
 * Viewport Camera Controls
 * Orbit, zoom, and pan controls for scene viewport
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

/**
 * Viewport Camera
 * Controls camera orbit, zoom, and pan
 */
export class ViewportCamera {
  private static isInitialized = false;
  private static isOrbiting = false;
  private static lastMouse: { x: number; y: number } | null = null;
  private static isPanning = false;

  /**
   * Initialize camera controls
   */
  static init(): void {
    if (this.isInitialized) return;

    // Wheel zoom
    window.addEventListener("wheel", this.handleWheel, { passive: false });

    // Middle mouse orbit
    window.addEventListener("mousedown", this.handleMouseDown);
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

    // Right mouse pan
    window.addEventListener("contextmenu", (e) => e.preventDefault());

    this.isInitialized = true;
  }

  /**
   * Handle wheel zoom
   */
  private static handleWheel = (e: WheelEvent) => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is over canvas
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      e.preventDefault();

      const delta = e.deltaY * 0.01;
      const normalizedX = x / rect.width;
      const normalizedY = 1 - y / rect.height;

      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send("camera/zoom", {
          delta,
          centerX: normalizedX,
          centerY: normalizedY
        });
      }
    }
  };

  /**
   * Handle mouse down
   */
  private static handleMouseDown = (e: MouseEvent) => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if mouse is over canvas
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      if (e.button === 1) {
        // Middle mouse - orbit
        e.preventDefault();
        this.isOrbiting = true;
        this.lastMouse = { x: e.clientX, y: e.clientY };
      } else if (e.button === 2) {
        // Right mouse - pan
        e.preventDefault();
        this.isPanning = true;
        this.lastMouse = { x: e.clientX, y: e.clientY };
      }
    }
  };

  /**
   * Handle mouse move
   */
  private static handleMouseMove = (e: MouseEvent) => {
    if (!this.lastMouse) return;

    if (this.isOrbiting) {
      const dx = e.clientX - this.lastMouse.x;
      const dy = e.clientY - this.lastMouse.y;

      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send("camera/orbit", {
          dx: dx * 0.2,
          dy: dy * 0.2
        });
      }

      this.lastMouse = { x: e.clientX, y: e.clientY };
    } else if (this.isPanning) {
      const dx = (e.clientX - this.lastMouse.x) * 0.01;
      const dy = (this.lastMouse.y - e.clientY) * 0.01; // Flip Y

      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send("camera/pan", {
          dx,
          dy
        });
      }

      this.lastMouse = { x: e.clientX, y: e.clientY };
    }
  };

  /**
   * Handle mouse up
   */
  private static handleMouseUp = (e: MouseEvent) => {
    if (e.button === 1) {
      this.isOrbiting = false;
      this.lastMouse = null;
    } else if (e.button === 2) {
      this.isPanning = false;
      this.lastMouse = null;
    }
  };

  /**
   * Reset camera
   */
  static reset(): void {
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("camera/reset", {});
    }
  }

  /**
   * Focus camera on object
   */
  static focus(objectId: string): void {
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("camera/focus", { id: objectId });
    }
  }

  /**
   * Cleanup
   */
  static cleanup(): void {
    window.removeEventListener("wheel", this.handleWheel);
    window.removeEventListener("mousedown", this.handleMouseDown);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
    this.isInitialized = false;
  }
}

