/**
 * Autonomous Scene Mutation Engine
 * LUNA modifies transforms, positions, UI placements based on heuristics
 * Auto-fixes scene layout issues
 */

import { UnityRuntime } from "../runtime/unityBridge/UnityRuntime";
import { useSceneGraph, SceneNode } from "../scenegraph/SceneGraphStore";
import { useEditorState } from "@/state/editorState";
import { ComponentPatchEngine } from "../scenegraph/ComponentPatchEngine";

/**
 * Autonomous Scene Mutation Engine
 * Automatically fixes scene layout and positioning issues
 */
export class LunaSceneMutator {
  /**
   * Align UI elements
   */
  static alignUI(): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const nodes = useSceneGraph.getState().nodes;
    let fixed = 0;

    Object.values(nodes).forEach((node) => {
      const name = node.name.toLowerCase();

      if (
        (name.includes("hud") || name.includes("ui") || name.includes("canvas")) &&
        node.position.y < 0
      ) {
        ComponentPatchEngine.setTransform(node.id, "position", {
          x: node.position.x,
          y: 20,
          z: node.position.z
        });

        fixed++;
      }
    });

    if (fixed > 0) {
      pushMessage(`[LUNA Autopilot] 🎨 Aligned ${fixed} UI elements`);
    }
  }

  /**
   * Fix floating objects
   */
  static fixFloatingObjects(): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const nodes = useSceneGraph.getState().nodes;
    let fixed = 0;

    Object.values(nodes).forEach((node) => {
      if (node.position.y > 100 || node.position.y < -100) {
        ComponentPatchEngine.setTransform(node.id, "position", {
          x: node.position.x,
          y: 0,
          z: node.position.z
        });

        fixed++;
      }
    });

    if (fixed > 0) {
      pushMessage(`[LUNA Autopilot] 🔧 Fixed ${fixed} floating objects`);
    }
  }

  /**
   * Fix misaligned cards
   */
  static fixCardAlignment(): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const nodes = useSceneGraph.getState().nodes;
    let fixed = 0;

    Object.values(nodes).forEach((node) => {
      const name = node.name.toLowerCase();

      if (name.includes("card")) {
        // Fix invalid scale
        if (
          node.scale.x < 0.1 ||
          node.scale.y < 0.1 ||
          node.scale.z < 0.1 ||
          node.scale.x > 10 ||
          node.scale.y > 10 ||
          node.scale.z > 10
        ) {
          ComponentPatchEngine.setTransform(node.id, "scale", {
            x: 1,
            y: 1,
            z: 1
          });

          fixed++;
        }
      }
    });

    if (fixed > 0) {
      pushMessage(`[LUNA Autopilot] 🃏 Fixed ${fixed} card scales`);
    }
  }

  /**
   * Recenter camera
   */
  static recenterCamera(): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const nodes = useSceneGraph.getState().nodes;

    const camera = Object.values(nodes).find(
      (node) => node.name.toLowerCase().includes("camera") || node.name.toLowerCase().includes("main")
    );

    if (camera) {
      ComponentPatchEngine.setTransform(camera.id, "position", {
        x: 0,
        y: 5,
        z: -10
      });

      pushMessage(`[LUNA Autopilot] 📹 Recentered camera`);
    }
  }

  /**
   * Fix off-screen objects
   */
  static fixOffScreenObjects(): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const nodes = useSceneGraph.getState().nodes;
    let fixed = 0;

    Object.values(nodes).forEach((node) => {
      // Objects too far from origin
      const distance = Math.sqrt(
        node.position.x ** 2 + node.position.y ** 2 + node.position.z ** 2
      );

      if (distance > 50) {
        // Move to origin
        ComponentPatchEngine.setTransform(node.id, "position", {
          x: 0,
          y: 0,
          z: 0
        });

        fixed++;
      }
    });

    if (fixed > 0) {
      pushMessage(`[LUNA Autopilot] 📐 Fixed ${fixed} off-screen objects`);
    }
  }

  /**
   * Normalize transforms
   */
  static normalizeTransforms(): void {
    const pushMessage = useEditorState.getState().pushMessage;
    const nodes = useSceneGraph.getState().nodes;
    let normalized = 0;

    Object.values(nodes).forEach((node) => {
      let changed = false;
      const newPosition = { ...node.position };
      const newRotation = { ...node.rotation };
      const newScale = { ...node.scale };

      // Normalize rotation to 0-360
      if (newRotation.x < 0 || newRotation.x > 360) {
        newRotation.x = newRotation.x % 360;
        if (newRotation.x < 0) newRotation.x += 360;
        changed = true;
      }

      // Ensure scale is positive and reasonable
      if (newScale.x < 0.01 || newScale.x > 10) {
        newScale.x = 1;
        changed = true;
      }
      if (newScale.y < 0.01 || newScale.y > 10) {
        newScale.y = 1;
        changed = true;
      }
      if (newScale.z < 0.01 || newScale.z > 10) {
        newScale.z = 1;
        changed = true;
      }

      if (changed) {
        ComponentPatchEngine.setTransform(node.id, "rotation", newRotation);
        ComponentPatchEngine.setTransform(node.id, "scale", newScale);
        normalized++;
      }
    });

    if (normalized > 0) {
      pushMessage(`[LUNA Autopilot] 🔄 Normalized ${normalized} transforms`);
    }
  }
}

