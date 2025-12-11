/**
 * Scene Graph Diffing
 * Efficient partial sync - only sync changed nodes
 */

import { SceneNode } from "./SceneGraphStore";

export interface SceneDiff {
  added: SceneNode[];
  updated: SceneNode[];
  removed: string[];
}

/**
 * Diff scene graph
 * Compares old and new scene graphs and returns changes
 */
export function diffScene(
  oldNodes: Record<string, SceneNode>,
  newNodes: Record<string, SceneNode>
): SceneDiff {
  const added: SceneNode[] = [];
  const updated: SceneNode[] = [];
  const removed: string[] = [];

  // Find added and updated nodes
  for (const id in newNodes) {
    const newNode = newNodes[id];
    const oldNode = oldNodes[id];

    if (!oldNode) {
      added.push(newNode);
    } else {
      // Check if node changed
      if (hasNodeChanged(oldNode, newNode)) {
        updated.push(newNode);
      }
    }
  }

  // Find removed nodes
  for (const id in oldNodes) {
    if (!newNodes[id]) {
      removed.push(id);
    }
  }

  return { added, updated, removed };
}

/**
 * Check if node has changed
 */
function hasNodeChanged(oldNode: SceneNode, newNode: SceneNode): boolean {
  // Compare key properties
  if (
    oldNode.name !== newNode.name ||
    oldNode.parent !== newNode.parent ||
    oldNode.active !== newNode.active
  ) {
    return true;
  }

  // Compare position
  if (
    !vectorsEqual(oldNode.position, newNode.position)
  ) {
    return true;
  }

  // Compare rotation
  if (
    !vectorsEqual(oldNode.rotation, newNode.rotation)
  ) {
    return true;
  }

  // Compare scale
  if (
    !vectorsEqual(oldNode.scale, newNode.scale)
  ) {
    return true;
  }

  // Compare components
  if (
    JSON.stringify(oldNode.components) !== JSON.stringify(newNode.components)
  ) {
    return true;
  }

  return false;
}

/**
 * Check if two vectors are equal (with tolerance)
 */
function vectorsEqual(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
  tolerance: number = 0.001
): boolean {
  return (
    Math.abs(a.x - b.x) < tolerance &&
    Math.abs(a.y - b.y) < tolerance &&
    Math.abs(a.z - b.z) < tolerance
  );
}

/**
 * Apply diff to scene graph store
 */
export function applyDiff(
  diff: SceneDiff,
  updateNodes: (nodes: SceneNode[]) => void
): void {
  // Apply added and updated nodes
  const nodesToUpdate = [...diff.added, ...diff.updated];
  if (nodesToUpdate.length > 0) {
    updateNodes(nodesToUpdate);
  }

  // Handle removed nodes (would need store method to remove nodes)
  // For now, removed nodes are handled by full update
}

