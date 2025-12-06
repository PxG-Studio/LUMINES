/**
 * Blueprint Interpreter
 * Lightweight runtime interpreter for executing graphs
 */

import { BlueprintGraph, Node, Connection, ExecutionContext } from "../schema/NodeSchema";
import { NodeLibrary } from "../library/NodeLibrary";

/**
 * Blueprint Interpreter
 * Executes blueprint graphs at runtime
 */
export class BPInterpreter {
  private graph: BlueprintGraph;
  private context: ExecutionContext;
  private executing: Set<string> = new Set();

  constructor(graph: BlueprintGraph, context?: Partial<ExecutionContext>) {
    this.graph = graph;
    this.context = {
      variables: context?.variables || {},
      graph: this.graph,
      executeNode: this.executeNode.bind(this),
      sendToUnity: context?.sendToUnity,
      ...context
    };
  }

  /**
   * Execute entry point
   */
  execute(entryPoint?: string): void {
    const entryNodeId = entryPoint || this.graph.entryPoint;
    if (!entryNodeId) {
      console.warn("[BPInterpreter] No entry point specified");
      return;
    }

    this.executeNode(entryNodeId);
  }

  /**
   * Execute a specific node
   */
  private executeNode(nodeId: string, inputs?: Record<string, any>): any {
    if (this.executing.has(nodeId)) {
      console.warn(`[BPInterpreter] Circular dependency detected: ${nodeId}`);
      return;
    }

    this.executing.add(nodeId);

    try {
      const node = this.graph.nodes.find((n) => n.id === nodeId);
      if (!node) {
        throw new Error(`Node not found: ${nodeId}`);
      }

      const nodeDef = NodeLibrary.get(node.type);
      if (!nodeDef) {
        throw new Error(`Node definition not found: ${node.type}`);
      }

      // Resolve input values
      const resolvedInputs = this.resolveInputs(node, inputs);

      // Execute node
      if (nodeDef.execute) {
        const result = nodeDef.execute(node, resolvedInputs, this.context);

        // Handle execution flow
        if (node.nodeType === "exec") {
          const outputSocketId = result; // Exec nodes return output socket ID
          if (outputSocketId && typeof outputSocketId === "string") {
            this.followExecOutput(node, outputSocketId);
          }
        }

        this.executing.delete(nodeId);
        return result;
      }

      this.executing.delete(nodeId);
      return resolvedInputs;
    } catch (error: any) {
      this.executing.delete(nodeId);
      console.error(`[BPInterpreter] Error executing node ${nodeId}:`, error);
      throw error;
    }
  }

  /**
   * Resolve input values for a node
   */
  private resolveInputs(node: Node, providedInputs?: Record<string, any>): Record<string, any> {
    const inputs: Record<string, any> = {};

    for (const inputSocket of node.inputs) {
      if (providedInputs && inputSocket.id in providedInputs) {
        inputs[inputSocket.name] = providedInputs[inputSocket.id];
        continue;
      }

      // Find connection to this input
      const connection = this.graph.connections.find(
        (c) => c.toNodeId === node.id && c.toSocketId === inputSocket.id
      );

      if (connection) {
        // Resolve from connected node
        const fromNode = this.graph.nodes.find((n) => n.id === connection.fromNodeId);
        if (fromNode) {
          const outputSocket = fromNode.outputs.find((s) => s.id === connection.fromSocketId);
          if (outputSocket) {
            // Recursively resolve
            const fromResult = this.executeNode(connection.fromNodeId);
            inputs[inputSocket.name] = fromResult;
          }
        }
      } else if (inputSocket.defaultValue !== undefined) {
        // Use default value
        inputs[inputSocket.name] = inputSocket.defaultValue;
      } else if (inputSocket.required) {
        console.warn(`[BPInterpreter] Required input ${inputSocket.name} not provided for node ${node.id}`);
      }
    }

    return inputs;
  }

  /**
   * Follow execution output
   */
  private followExecOutput(node: Node, outputSocketId: string): void {
    const outputSocket = node.outputs.find((s) => s.id === outputSocketId);
    if (!outputSocket) return;

    // Find connections from this output
    const connections = this.graph.connections.filter(
      (c) => c.fromNodeId === node.id && c.fromSocketId === outputSocketId
    );

    for (const connection of connections) {
      // Execute connected node
      const toNode = this.graph.nodes.find((n) => n.id === connection.toNodeId);
      if (toNode && toNode.nodeType === "exec") {
        this.executeNode(connection.toNodeId);
      }
    }
  }

  /**
   * Get variable value
   */
  getVariable(name: string): any {
    return this.context.variables[name];
  }

  /**
   * Set variable value
   */
  setVariable(name: string, value: any): void {
    this.context.variables[name] = value;
  }
}

