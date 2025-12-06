/**
 * Shader Graph Mapper
 * Node graph exploration and introspection
 * Simplified shader graph viewer
 */

import { MaterialSnapshot, MaterialParam } from "./MaterialStore";

export interface ShaderNode {
  id: string;
  type: string;
  label: string;
  links: string[];
  position?: { x: number; y: number };
}

export interface ShaderGraph {
  nodes: ShaderNode[];
  connections: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}

/**
 * Shader Graph Mapper
 * Maps material snapshot to simplified node graph
 */
export class ShaderGraphMapper {
  /**
   * Map material snapshot to shader graph
   */
  static map(snapshot: MaterialSnapshot): ShaderGraph {
    const nodes: ShaderNode[] = [];
    const connections: Array<{ from: string; to: string; type: string }> = [];

    // Create nodes from parameters
    snapshot.parameters.forEach((param, index) => {
      const node: ShaderNode = {
        id: param.name,
        type: this.mapParamTypeToNodeType(param.type),
        label: param.name,
        links: [],
        position: {
          x: 100,
          y: 100 + index * 80
        }
      };

      // Add links based on parameter type
      if (param.type === "TexEnv") {
        node.links.push("Sampler2D");
        connections.push({
          from: param.name,
          to: "Fragment",
          type: "texture"
        });
      } else if (param.type === "Color") {
        connections.push({
          from: param.name,
          to: "Fragment",
          type: "color"
        });
      } else if (param.type === "Float" || param.type === "Range") {
        connections.push({
          from: param.name,
          to: "Fragment",
          type: "float"
        });
      } else if (param.type === "Vector") {
        connections.push({
          from: param.name,
          to: "Fragment",
          type: "vector"
        });
      }

      nodes.push(node);
    });

    // Add output node
    nodes.push({
      id: "Fragment",
      type: "output",
      label: "Fragment Output",
      links: [],
      position: {
        x: 500,
        y: 200
      }
    });

    return {
      nodes,
      connections
    };
  }

  /**
   * Map parameter type to node type
   */
  private static mapParamTypeToNodeType(paramType: MaterialParam["type"]): string {
    switch (paramType) {
      case "Float":
      case "Range":
        return "float";
      case "Color":
        return "color";
      case "Vector":
        return "vector4";
      case "TexEnv":
        return "texture2D";
      case "Int":
        return "int";
      default:
        return "unknown";
    }
  }

  /**
   * Get node connections
   */
  static getConnections(graph: ShaderGraph, nodeId: string): Array<{
    from: string;
    to: string;
    type: string;
  }> {
    return graph.connections.filter((c) => c.from === nodeId || c.to === nodeId);
  }

  /**
   * Get input nodes for a node
   */
  static getInputNodes(graph: ShaderGraph, nodeId: string): ShaderNode[] {
    const connections = graph.connections.filter((c) => c.to === nodeId);
    return connections
      .map((c) => graph.nodes.find((n) => n.id === c.from))
      .filter((n): n is ShaderNode => n !== undefined);
  }

  /**
   * Get output nodes for a node
   */
  static getOutputNodes(graph: ShaderGraph, nodeId: string): ShaderNode[] {
    const connections = graph.connections.filter((c) => c.from === nodeId);
    return connections
      .map((c) => graph.nodes.find((n) => n.id === c.to))
      .filter((n): n is ShaderNode => n !== undefined);
  }
}

