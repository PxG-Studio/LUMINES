/**
 * Shader Graph Compiler
 * Converts visual graph → GLSL/HLSL code
 */

import { ShaderGraph, ShaderNode } from "./ShaderGraphTypes";
import { NodeDefinitions, getNodeDefinition } from "./nodes/NodeDefinitions";

/**
 * Shader Graph Compiler
 * Compiles shader graph to GLSL/HLSL code
 */
export class ShaderGraphCompiler {
  /**
   * Compile graph to GLSL code
   */
  static compile(graph: ShaderGraph): string {
    if (!graph.outputNode) {
      throw new Error("No output node specified");
    }

    const nodeMap = new Map<string, ShaderNode>();
    graph.nodes.forEach((node) => {
      nodeMap.set(node.id, node);
    });

    // Build edge map: toNode:toPort -> fromNode:fromPort
    const edgeMap = new Map<string, { node: string; port: string }>();
    graph.edges.forEach((edge) => {
      const key = `${edge.to.node}:${edge.to.port}`;
      edgeMap.set(key, edge.from);
    });

    // Track visited nodes to detect cycles
    const visited = new Set<string>();
    const compiledNodes = new Map<string, string>();

    /**
     * Emit code for a node
     */
    const emitNode = (nodeId: string): string => {
      if (compiledNodes.has(nodeId)) {
        return compiledNodes.get(nodeId)!;
      }

      if (visited.has(nodeId)) {
        throw new Error(`Circular dependency detected at node ${nodeId}`);
      }

      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (!node) {
        throw new Error(`Node ${nodeId} not found`);
      }

      const def = getNodeDefinition(node.type);
      if (!def) {
        throw new Error(`Unknown node type: ${node.type}`);
      }

      // Collect inputs
      const inputs: Record<string, any> = {};
      def.inputs.forEach((port) => {
        const key = `${nodeId}:${port}`;
        const link = edgeMap.get(key);
        if (link) {
          // Input comes from another node
          inputs[port] = emitNode(link.node);
        } else {
          // Input comes from node data
          inputs[port] = node.data[port];
        }
      });

      // Generate code for this node
      const code = def.code(inputs, node.data);
      compiledNodes.set(nodeId, code);
      visited.delete(nodeId);

      return code;
    };

    // Emit output node
    const outputCode = emitNode(graph.outputNode);

    // Wrap in function
    return outputCode;
  }

  /**
   * Compile to full shader function
   */
  static compileFunction(graph: ShaderGraph, functionName: string = "shaderMain"): string {
    const code = this.compile(graph);
    return `
vec4 ${functionName}(v2f i) {
  return ${code};
}
    `.trim();
  }

  /**
   * Compile to fragment shader code
   */
  static compileFragment(graph: ShaderGraph): string {
    const functionCode = this.compileFunction(graph);
    return `
${functionCode}
    `.trim();
  }
}

