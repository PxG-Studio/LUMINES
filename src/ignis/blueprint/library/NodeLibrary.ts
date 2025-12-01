/**
 * Node Library
 * Registry of built-in blueprint nodes
 */

import { NodeDefinition, Socket, Node, ExecutionContext } from "../schema/NodeSchema";

/**
 * Node Library
 * Collection of available node definitions
 */
export class NodeLibrary {
  private static definitions: Map<string, NodeDefinition> = new Map();

  /**
   * Register a node definition
   */
  static register(definition: NodeDefinition): void {
    this.definitions.set(definition.type, definition);
  }

  /**
   * Get node definition by type
   */
  static get(type: string): NodeDefinition | undefined {
    return this.definitions.get(type);
  }

  /**
   * Get all node definitions
   */
  static getAll(): NodeDefinition[] {
    return Array.from(this.definitions.values());
  }

  /**
   * Get nodes by category
   */
  static getByCategory(category: string): NodeDefinition[] {
    return Array.from(this.definitions.values()).filter((def) => def.category === category);
  }

  /**
   * Search nodes
   */
  static search(query: string): NodeDefinition[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.definitions.values()).filter(
      (def) =>
        def.title.toLowerCase().includes(lowerQuery) ||
        def.description?.toLowerCase().includes(lowerQuery) ||
        def.type.toLowerCase().includes(lowerQuery) ||
        def.category.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * Initialize built-in nodes
 */
function initializeBuiltInNodes(): void {
  // Flow Control
  NodeLibrary.register({
    type: "Branch",
    nodeType: "exec",
    title: "Branch",
    description: "Conditional execution based on boolean value",
    category: "Flow",
    color: "#4A90E2",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Condition", type: "bool", direction: "input", required: true }
    ],
    outputs: [
      { name: "True", type: "exec", direction: "output" },
      { name: "False", type: "exec", direction: "output" }
    ],
    create: (data) => ({
      id: "",
      type: "Branch",
      nodeType: "exec",
      title: "Branch",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "condition_in", name: "Condition", type: "bool", direction: "input", required: true }
      ],
      outputs: [
        { id: "true_out", name: "True", type: "exec", direction: "output" },
        { id: "false_out", name: "False", type: "exec", direction: "output" }
      ],
      data: data || {}
    }),
    execute: (node, inputs) => {
      return inputs.Condition ? "true_out" : "false_out";
    }
  });

  NodeLibrary.register({
    type: "Delay",
    nodeType: "exec",
    title: "Delay",
    description: "Wait for specified seconds",
    category: "Flow",
    color: "#4A90E2",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Duration", type: "float", direction: "input", defaultValue: 1.0, required: true }
    ],
    outputs: [{ name: "Completed", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Delay",
      nodeType: "exec",
      title: "Delay",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "duration_in", name: "Duration", type: "float", direction: "input", defaultValue: 1.0, required: true }
      ],
      outputs: [{ id: "completed_out", name: "Completed", type: "exec", direction: "output" }],
      data: { duration: data?.duration || 1.0 }
    })
  });

  // Math
  NodeLibrary.register({
    type: "Add",
    nodeType: "data",
    title: "Add",
    description: "Add two numbers",
    category: "Math",
    color: "#7B68EE",
    inputs: [
      { name: "A", type: "float", direction: "input", defaultValue: 0, required: true },
      { name: "B", type: "float", direction: "input", defaultValue: 0, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Add",
      nodeType: "data",
      title: "Add",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 0, required: true },
        { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 0, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      return (inputs.A || 0) + (inputs.B || 0);
    }
  });

  NodeLibrary.register({
    type: "Multiply",
    nodeType: "data",
    title: "Multiply",
    description: "Multiply two numbers",
    category: "Math",
    color: "#7B68EE",
    inputs: [
      { name: "A", type: "float", direction: "input", defaultValue: 1, required: true },
      { name: "B", type: "float", direction: "input", defaultValue: 1, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Multiply",
      nodeType: "data",
      title: "Multiply",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 1, required: true },
        { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 1, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      return (inputs.A || 0) * (inputs.B || 0);
    }
  });

  // Debug
  NodeLibrary.register({
    type: "Print",
    nodeType: "exec",
    title: "Print",
    description: "Print message to console",
    category: "Debug",
    color: "#FF6B6B",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Message", type: "string", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Print",
      nodeType: "exec",
      title: "Print",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "message_in", name: "Message", type: "string", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: { message: data?.message || "" }
    }),
    execute: (node, inputs) => {
      console.log("[Blueprint]", inputs.Message || node.data.message);
      return "exec_out";
    }
  });

  // Unity API Nodes
  NodeLibrary.register({
    type: "GetPosition",
    nodeType: "data",
    title: "Get Position",
    description: "Get GameObject position",
    category: "Unity",
    color: "#50C878",
    inputs: [
      { name: "Object", type: "object", direction: "input", required: true }
    ],
    outputs: [{ name: "Position", type: "vector3", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "GetPosition",
      nodeType: "data",
      title: "Get Position",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "object_in", name: "Object", type: "object", direction: "input", required: true }
      ],
      outputs: [{ id: "position_out", name: "Position", type: "vector3", direction: "output" }],
      data: {}
    })
  });

  NodeLibrary.register({
    type: "SetPosition",
    nodeType: "exec",
    title: "Set Position",
    description: "Set GameObject position",
    category: "Unity",
    color: "#50C878",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Object", type: "object", direction: "input", required: true },
      { name: "Position", type: "vector3", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "SetPosition",
      nodeType: "exec",
      title: "Set Position",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "object_in", name: "Object", type: "object", direction: "input", required: true },
        { id: "position_in", name: "Position", type: "vector3", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  NodeLibrary.register({
    type: "PlaySound",
    nodeType: "exec",
    title: "Play Sound",
    description: "Play audio clip",
    category: "Unity",
    color: "#50C878",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Sound", type: "object", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "PlaySound",
      nodeType: "exec",
      title: "Play Sound",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "sound_in", name: "Sound", type: "object", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  // Event Nodes
  NodeLibrary.register({
    type: "Start",
    nodeType: "event",
    title: "Start",
    description: "Called when script starts",
    category: "Events",
    color: "#FFD700",
    inputs: [],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Start",
      nodeType: "event",
      title: "Start",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  // Constants
  NodeLibrary.register({
    type: "FloatConstant",
    nodeType: "data",
    title: "Float",
    description: "Float constant value",
    category: "Constants",
    color: "#9B59B6",
    inputs: [],
    outputs: [{ name: "Value", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "FloatConstant",
      nodeType: "data",
      title: "Float",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [{ id: "value_out", name: "Value", type: "float", direction: "output" }],
      data: { value: data?.value || 0 }
    }),
    execute: (node) => {
      return node.data.value || 0;
    }
  });

  NodeLibrary.register({
    type: "StringConstant",
    nodeType: "data",
    title: "String",
    description: "String constant value",
    category: "Constants",
    color: "#9B59B6",
    inputs: [],
    outputs: [{ name: "Value", type: "string", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "StringConstant",
      nodeType: "data",
      title: "String",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [{ id: "value_out", name: "Value", type: "string", direction: "output" }],
      data: { value: data?.value || "" }
    }),
    execute: (node) => {
      return node.data.value || "";
    }
  });
}

// Initialize built-in nodes
initializeBuiltInNodes();

// Import and register expanded nodes
import { registerExpandedNodes } from "./ExpandedNodeLibrary";
registerExpandedNodes();

