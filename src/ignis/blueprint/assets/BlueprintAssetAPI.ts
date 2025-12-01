/**
 * Blueprint Asset API
 * Save/load blueprint graphs via WISSIL filesystem
 */

import { BlueprintGraph } from "../schema/NodeSchema";
import { useWissilFS } from "../../../wissil/runtime/fs/wissilFs";

/**
 * Blueprint Asset API
 * Handles saving and loading blueprint graphs
 */
export class BlueprintAssetAPI {
  private static readonly BASE_PATH = "Blueprints/";

  /**
   * Save blueprint graph
   */
  static save(graph: BlueprintGraph): void {
    const fs = useWissilFS.getState();
    const path = `${this.BASE_PATH}${graph.id}.json`;
    const json = JSON.stringify(graph, null, 2);
    fs.writeFile(path, json);
  }

  /**
   * Load blueprint graph
   */
  static load(graphId: string): BlueprintGraph | null {
    const fs = useWissilFS.getState();
    const path = `${this.BASE_PATH}${graphId}.json`;
    const content = fs.readFile(path);

    if (!content) {
      return null;
    }

    try {
      return JSON.parse(content) as BlueprintGraph;
    } catch (error: any) {
      console.error(`[BlueprintAssetAPI] Error loading graph ${graphId}:`, error);
      return null;
    }
  }

  /**
   * List all blueprint graphs
   */
  static list(): string[] {
    const fs = useWissilFS.getState();
    const snapshot = fs.getSnapshot();

    const graphs: string[] = [];

    function walk(node: any, path: string = "") {
      if (node.type === "file" && node.path?.endsWith(".json")) {
        if (node.path.startsWith(this.BASE_PATH)) {
          const graphId = node.path.replace(this.BASE_PATH, "").replace(".json", "");
          graphs.push(graphId);
        }
      }
      if (node.children) {
        Object.values(node.children).forEach((child: any) => {
          walk(child, node.path);
        });
      }
    }

    walk(snapshot);
    return graphs;
  }

  /**
   * Delete blueprint graph
   */
  static delete(graphId: string): void {
    const fs = useWissilFS.getState();
    const path = `${this.BASE_PATH}${graphId}.json`;
    fs.deleteFile(path);
  }

  /**
   * Export blueprint as JSON
   */
  static export(graph: BlueprintGraph): string {
    return JSON.stringify(graph, null, 2);
  }

  /**
   * Import blueprint from JSON
   */
  static import(json: string): BlueprintGraph | null {
    try {
      return JSON.parse(json) as BlueprintGraph;
    } catch (error: any) {
      console.error("[BlueprintAssetAPI] Error importing blueprint:", error);
      return null;
    }
  }
}

