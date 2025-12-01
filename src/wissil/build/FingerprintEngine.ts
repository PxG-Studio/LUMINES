/**
 * Build Fingerprint Engine
 * Calculates content hashes and dependency graphs for incremental rebuilds
 * Similar to StackBlitz + Vite dependency graph hashing
 */

import { useWissilFS } from "../runtime/fs/wissilFs";

export interface FingerprintGraph {
  [path: string]: string; // path -> hash
}

export interface BuildDiff {
  path: string;
  changed: boolean;
  type: "asset" | "code" | "config" | "scene" | "other";
  oldHash?: string;
  newHash?: string;
}

/**
 * Calculate SHA-256 hash of content
 * Uses Web Crypto API for browser compatibility
 */
export async function calculateHash(content: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    // Fallback for Node.js or environments without Web Crypto
    // In browser, we'll use Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Browser Web Crypto API
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Synchronous hash calculation (simpler, less secure but faster)
 * Uses a simple hash function for quick fingerprinting
 */
export function calculateHashSync(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

/**
 * Build fingerprint graph from filesystem snapshot
 */
export function buildFingerprintGraph(snapshot: any): FingerprintGraph {
  const graph: FingerprintGraph = {};

  function walk(node: any, prefix: string = ""): void {
    if (!node || !node.children) return;

    for (const [name, child] of Object.entries(node.children)) {
      const path = prefix ? `${prefix}/${name}` : name;

      if (child.type === "folder") {
        walk(child, path);
      } else if (child.type === "file") {
        const content = child.content || "";
        graph[path] = calculateHashSync(content);
      }
    }
  }

  walk(snapshot);
  return graph;
}

/**
 * Calculate diff between two fingerprint graphs
 */
export function diffFingerprints(
  oldGraph: FingerprintGraph,
  newGraph: FingerprintGraph
): BuildDiff[] {
  const diffs: BuildDiff[] = [];

  // Find changed and new files
  for (const path in newGraph) {
    const oldHash = oldGraph[path];
    const newHash = newGraph[path];

    if (!oldHash || oldHash !== newHash) {
      diffs.push({
        path,
        changed: true,
        type: getFileType(path),
        oldHash,
        newHash
      });
    }
  }

  // Find deleted files
  for (const path in oldGraph) {
    if (!newGraph[path]) {
      diffs.push({
        path,
        changed: true,
        type: getFileType(path),
        oldHash: oldGraph[path],
        newHash: undefined
      });
    }
  }

  return diffs;
}

/**
 * Determine file type from path
 */
function getFileType(path: string): BuildDiff["type"] {
  if (path.endsWith(".cs") || path.endsWith(".js") || path.endsWith(".ts")) {
    return "code";
  }
  if (
    path.endsWith(".png") ||
    path.endsWith(".jpg") ||
    path.endsWith(".jpeg") ||
    path.endsWith(".gif") ||
    path.endsWith(".prefab") ||
    path.endsWith(".mat") ||
    path.endsWith(".shader")
  ) {
    return "asset";
  }
  if (path.endsWith(".unity")) {
    return "scene";
  }
  if (path.endsWith(".json") || path.endsWith(".yaml") || path.endsWith(".yml")) {
    return "config";
  }
  return "other";
}

/**
 * Get build type from diff list
 * Determines what kind of rebuild is needed
 */
export function getBuildType(diffs: BuildDiff[]): "full" | "asset" | "code" | "patch" | "noop" {
  if (diffs.length === 0) {
    return "noop";
  }

  const hasCodeChanges = diffs.some((d) => d.type === "code");
  const hasAssetChanges = diffs.some((d) => d.type === "asset");
  const hasSceneChanges = diffs.some((d) => d.type === "scene");

  // Scene changes require full rebuild
  if (hasSceneChanges) {
    return "full";
  }

  // Code changes can use patch layer (Phase G) or full rebuild
  if (hasCodeChanges && !hasAssetChanges) {
    return "patch"; // Try patch first
  }

  // Asset-only changes
  if (hasAssetChanges && !hasCodeChanges) {
    return "asset";
  }

  // Mixed changes
  if (hasCodeChanges && hasAssetChanges) {
    return "full";
  }

  // Config changes are usually hot-reloadable
  if (diffs.every((d) => d.type === "config")) {
    return "patch";
  }

  return "full";
}

/**
 * Fingerprint Engine Class
 * Main interface for fingerprint operations
 */
export class FingerprintEngine {
  private static lastGraph: FingerprintGraph = {};

  /**
   * Calculate hash of content
   */
  static calculate(content: string): string {
    return calculateHashSync(content);
  }

  /**
   * Build fingerprint graph from filesystem
   */
  static graph(snapshot?: any): FingerprintGraph {
    if (!snapshot) {
      const fs = useWissilFS.getState();
      snapshot = fs.getSnapshot();
    }
    return buildFingerprintGraph(snapshot);
  }

  /**
   * Calculate diff between current and last graph
   */
  static diff(newGraph?: FingerprintGraph): BuildDiff[] {
    const currentGraph = newGraph || this.graph();
    const diffs = diffFingerprints(this.lastGraph, currentGraph);
    this.lastGraph = { ...currentGraph };
    return diffs;
  }

  /**
   * Reset fingerprint graph
   */
  static reset(): void {
    this.lastGraph = {};
  }

  /**
   * Get last graph
   */
  static getLastGraph(): FingerprintGraph {
    return { ...this.lastGraph };
  }
}

