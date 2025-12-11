/**
 * Gizmo Manipulation Engine
 * Handles drag-based transform manipulation
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTransformStore } from "../scene/TransformStore";
import { Snapping } from "./Snapping";
import { GIZMO_SENSITIVITY, GIZMO_ROTATION_SENSITIVITY, GIZMO_SCALE_SENSITIVITY } from "./constants";

interface DragState {
  isDragging: boolean;
  axis: "x" | "y" | "z" | "center" | null;
  startMouse: { x: number; y: number };
  startTransform: { pos: { x: number; y: number; z: number }; rot: { x: number; y: number; z: number }; scale: { x: number; y: number; z: number } } | null;
}

class GizmoManipulationImpl {
  private dragState: DragState = {
    isDragging: false,
    axis: null,
    startMouse: { x: 0, y: 0 },
    startTransform: null
  };

  /**
   * Start dragging a gizmo handle
   */
  startDrag(axis: "x" | "y" | "z" | "center", mouseX: number, mouseY: number): void {
    const selected = useTransformStore.getState().selected;
    if (!selected) return;

    const transform = useTransformStore.getState().getTransform(selected);
    if (!transform) return;

    this.dragState = {
      isDragging: true,
      axis,
      startMouse: { x: mouseX, y: mouseY },
      startTransform: {
        pos: { ...transform.pos },
        rot: { ...transform.rot },
        scale: { ...transform.scale }
      }
    };

    // Prevent default to avoid text selection
    document.body.style.userSelect = "none";
    document.body.style.cursor = "move";
  }

  /**
   * Handle mouse move during drag
   */
  move(mouseX: number, mouseY: number): void {
    if (!this.dragState.isDragging || !this.dragState.axis || !this.dragState.startTransform) {
      return;
    }

    const selected = useTransformStore.getState().selected;
    if (!selected) return;

    const mode = useTransformStore.getState().gizmoMode;
    const deltaX = (mouseX - this.dragState.startMouse.x) * GIZMO_SENSITIVITY;
    const deltaY = (this.dragState.startMouse.y - mouseY) * GIZMO_SENSITIVITY; // Flip Y

    switch (mode) {
      case "move":
        this.handleMove(selected, this.dragState.axis, deltaX, deltaY);
        break;
      case "rotate":
        this.handleRotate(selected, this.dragState.axis, deltaX, deltaY);
        break;
      case "scale":
        this.handleScale(selected, this.dragState.axis, deltaX, deltaY);
        break;
    }
  }

  /**
   * Handle move manipulation
   */
  private handleMove(selected: string, axis: string, deltaX: number, deltaY: number): void {
    if (!this.dragState.startTransform) return;

    const newPos = { ...this.dragState.startTransform.pos };

    if (axis === "x") {
      newPos.x += deltaX;
    } else if (axis === "y") {
      newPos.y += deltaY;
    } else if (axis === "z") {
      // For Z axis, use mouse Y movement
      newPos.z += deltaY;
    } else if (axis === "center") {
      // Move in camera XY plane
      newPos.x += deltaX;
      newPos.y += deltaY;
    }

    // Apply snapping
    const snappedPos = Snapping.snapVector(newPos);

    // Send to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("transform/move", {
        id: selected,
        position: snappedPos
      });
    }
  }

  /**
   * Handle rotate manipulation
   */
  private handleRotate(selected: string, axis: string, deltaX: number, deltaY: number): void {
    if (!this.dragState.startTransform) return;

    const newRot = { ...this.dragState.startTransform.rot };
    const sensitivity = GIZMO_ROTATION_SENSITIVITY;

    if (axis === "x") {
      newRot.x += deltaY * sensitivity;
    } else if (axis === "y") {
      newRot.y += deltaX * sensitivity;
    } else if (axis === "z") {
      newRot.z += deltaX * sensitivity;
    } else if (axis === "center") {
      // Free rotation
      newRot.y += deltaX * sensitivity;
      newRot.x += deltaY * sensitivity;
    }

    // Apply snapping
    const snappedRot = Snapping.snapRotation(newRot);

    // Send to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("transform/rotate", {
        id: selected,
        rotation: snappedRot
      });
    }
  }

  /**
   * Handle scale manipulation
   */
  private handleScale(selected: string, axis: string, deltaX: number, deltaY: number): void {
    if (!this.dragState.startTransform) return;

    const newScale = { ...this.dragState.startTransform.scale };
    const sensitivity = GIZMO_SCALE_SENSITIVITY;
    const delta = (deltaX + deltaY) / 2;

    if (axis === "x") {
      newScale.x += delta * sensitivity;
    } else if (axis === "y") {
      newScale.y += delta * sensitivity;
    } else if (axis === "z") {
      newScale.z += delta * sensitivity;
    } else if (axis === "center") {
      // Uniform scale
      const uniformDelta = delta * sensitivity;
      newScale.x += uniformDelta;
      newScale.y += uniformDelta;
      newScale.z += uniformDelta;
    }

    // Clamp scale to prevent negative values
    newScale.x = Math.max(0.01, newScale.x);
    newScale.y = Math.max(0.01, newScale.y);
    newScale.z = Math.max(0.01, newScale.z);

    // Apply snapping
    const snappedScale = Snapping.snapScaleVector(newScale);

    // Send to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("transform/scale", {
        id: selected,
        scale: snappedScale
      });
    }
  }

  /**
   * End drag
   */
  end(): void {
    this.dragState = {
      isDragging: false,
      axis: null,
      startMouse: { x: 0, y: 0 },
      startTransform: null
    };

    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }

  /**
   * Get drag state
   */
  getDragState(): DragState {
    return { ...this.dragState };
  }
}

/**
 * Gizmo Manipulation
 * Singleton instance
 */
export const GizmoManipulation = new GizmoManipulationImpl();

// Setup global event listeners
if (typeof window !== "undefined") {
  window.addEventListener("mousemove", (e) => {
    GizmoManipulation.move(e.clientX, e.clientY);
  });

  window.addEventListener("mouseup", () => {
    GizmoManipulation.end();
  });

  window.addEventListener("mouseleave", () => {
    GizmoManipulation.end();
  });
}

