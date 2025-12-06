/**
 * LUNA Shader Assistant
 * AI-assisted shader graph suggestions and auto-optimization
 */

import { ShaderGraph } from "../shader/ShaderGraphTypes";
import { NodeDefinitions } from "../shader/nodes/NodeDefinitions";
import { useEditorState } from "@/state/editorState";

export interface ShaderSuggestion {
  type: string;
  severity: "info" | "warning" | "error";
  message: string;
  suggestion: string;
  nodeType?: string;
  nodeId?: string;
}

/**
 * LUNA Shader Assistant
 * Analyzes shader graphs and provides suggestions
 */
export class LunaShaderAssistant {
  /**
   * Analyze graph and suggest improvements
   */
  static suggest(graph: ShaderGraph): ShaderSuggestion[] {
    const suggestions: ShaderSuggestion[] = [];

    // Check for missing UV node
    if (!graph.nodes.find((n) => n.type === "uv")) {
      suggestions.push({
        type: "missing_uv",
        severity: "warning",
        message: "No UV node found",
        suggestion: "Add a UV node as input to texture sampling",
        nodeType: "uv"
      });
    }

    // Check for missing texture sample
    if (!graph.nodes.find((n) => n.type === "tex")) {
      suggestions.push({
        type: "missing_texture",
        severity: "info",
        message: "No texture sampling node found",
        suggestion: "Add a Texture Sample node to output color from texture"
      });
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    graph.edges.forEach((edge) => {
      connectedNodeIds.add(edge.from.node);
      connectedNodeIds.add(edge.to.node);
    });
    if (graph.outputNode) {
      connectedNodeIds.add(graph.outputNode);
    }

    graph.nodes.forEach((node) => {
      if (!connectedNodeIds.has(node.id) && node.type !== "uv" && node.type !== "color") {
        suggestions.push({
          type: "disconnected_node",
          severity: "warning",
          message: `Node "${node.type}" is not connected`,
          suggestion: "Connect this node to the graph or remove it",
          nodeId: node.id
        });
      }
    });

    // Check for missing output node
    if (!graph.outputNode) {
      suggestions.push({
        type: "no_output",
        severity: "error",
        message: "No output node specified",
        suggestion: "Select a node as the shader output"
      });
    } else {
      const outputNode = graph.nodes.find((n) => n.id === graph.outputNode);
      if (outputNode && outputNode.type !== "tex" && outputNode.type !== "color") {
        suggestions.push({
          type: "output_type",
          severity: "info",
          message: `Output node is of type "${outputNode.type}"`,
          suggestion: "Consider using a Color or Texture Sample node as output for best results",
          nodeId: graph.outputNode
        });
      }
    }

    // Check for potential performance issues
    const mathNodes = graph.nodes.filter((n) =>
      ["add", "sub", "mul", "div", "sin", "cos"].includes(n.type)
    );
    if (mathNodes.length > 20) {
      suggestions.push({
        type: "performance",
        severity: "warning",
        message: "Many math operations detected",
        suggestion: "Consider optimizing the shader graph to reduce complexity"
      });
    }

    return suggestions;
  }

  /**
   * Auto-generate missing nodes
   */
  static autoGenerateMissingNodes(graph: ShaderGraph): { nodes: any[]; edges: any[] } {
    const suggestions = this.suggest(graph);
    const newNodes: any[] = [];
    const newEdges: any[] = [];

    // Generate UV node if missing
    const uvSuggestion = suggestions.find((s) => s.type === "missing_uv");
    if (uvSuggestion) {
      const uvNode = {
        id: `uv_${Date.now()}`,
        type: "uv",
        position: { x: 100, y: 200 },
        data: {}
      };
      newNodes.push(uvNode);

      // Connect to first texture node
      const texNode = graph.nodes.find((n) => n.type === "tex");
      if (texNode) {
        newEdges.push({
          id: `edge_${Date.now()}`,
          from: { node: uvNode.id, port: "uv" },
          to: { node: texNode.id, port: "uv" }
        });
      }
    }

    // Generate texture sample if missing and we have UV
    const texSuggestion = suggestions.find((s) => s.type === "missing_texture");
    if (texSuggestion) {
      const texNode = {
        id: `tex_${Date.now()}`,
        type: "tex",
        position: { x: 400, y: 200 },
        data: { textureName: "_MainTex" }
      };
      newNodes.push(texNode);

      // Connect UV to texture
      const uvNode = graph.nodes.find((n) => n.type === "uv") || newNodes.find((n) => n.type === "uv");
      if (uvNode) {
        newEdges.push({
          id: `edge_${Date.now() + 1}`,
          from: { node: uvNode.id, port: "uv" },
          to: { node: texNode.id, port: "uv" }
        });
      }

      // Set as output if no output exists
      if (!graph.outputNode) {
        // Note: This would need to be set separately
      }
    }

    return { nodes: newNodes, edges: newEdges };
  }

  /**
   * Optimize graph
   */
  static optimize(graph: ShaderGraph): ShaderGraph {
    // Remove disconnected nodes (except input nodes)
    const inputNodeTypes = ["uv", "color", "vec2", "vec3", "float", "time"];
    const connectedNodeIds = new Set<string>();
    
    graph.edges.forEach((edge) => {
      connectedNodeIds.add(edge.from.node);
      connectedNodeIds.add(edge.to.node);
    });
    if (graph.outputNode) {
      connectedNodeIds.add(graph.outputNode);
    }

    const optimizedNodes = graph.nodes.filter(
      (node) => connectedNodeIds.has(node.id) || inputNodeTypes.includes(node.type)
    );

    return {
      ...graph,
      nodes: optimizedNodes
    };
  }
}

