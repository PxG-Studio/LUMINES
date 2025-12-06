/**
 * Expanded Node Library
 * Additional nodes to bring total to 30+ nodes
 */

import { NodeLibrary } from "./NodeLibrary";
import { NodeDefinition } from "../schema/NodeSchema";

/**
 * Register expanded node set (adds to existing nodes)
 */
export function registerExpandedNodes(): void {
  // Sequence Node
  NodeLibrary.register({
    type: "Sequence",
    nodeType: "exec",
    title: "Sequence",
    description: "Execute multiple outputs in sequence",
    category: "Flow",
    color: "#4A90E2",
    inputs: [{ name: "Exec", type: "exec", direction: "input" }],
    outputs: [
      { name: "Then 0", type: "exec", direction: "output" },
      { name: "Then 1", type: "exec", direction: "output" },
      { name: "Then 2", type: "exec", direction: "output" }
    ],
    create: (data) => ({
      id: "",
      type: "Sequence",
      nodeType: "exec",
      title: "Sequence",
      position: { x: 0, y: 0 },
      inputs: [{ id: "exec_in", name: "Exec", type: "exec", direction: "input" }],
      outputs: [
        { id: "then0_out", name: "Then 0", type: "exec", direction: "output" },
        { id: "then1_out", name: "Then 1", type: "exec", direction: "output" },
        { id: "then2_out", name: "Then 2", type: "exec", direction: "output" }
      ],
      data: {}
    })
  });

  // Math: Subtract
  NodeLibrary.register({
    type: "Subtract",
    nodeType: "data",
    title: "Subtract",
    description: "Subtract two numbers",
    category: "Math",
    color: "#7B68EE",
    inputs: [
      { name: "A", type: "float", direction: "input", defaultValue: 0, required: true },
      { name: "B", type: "float", direction: "input", defaultValue: 0, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Subtract",
      nodeType: "data",
      title: "Subtract",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 0, required: true },
        { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 0, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      return (inputs.A || 0) - (inputs.B || 0);
    }
  });

  // Math: Divide
  NodeLibrary.register({
    type: "Divide",
    nodeType: "data",
    title: "Divide",
    description: "Divide two numbers",
    category: "Math",
    color: "#7B68EE",
    inputs: [
      { name: "A", type: "float", direction: "input", defaultValue: 1, required: true },
      { name: "B", type: "float", direction: "input", defaultValue: 1, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Divide",
      nodeType: "data",
      title: "Divide",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 1, required: true },
        { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 1, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      const b = inputs.B || 1;
      return b !== 0 ? (inputs.A || 0) / b : 0;
    }
  });

  // Variables: Set Variable
  NodeLibrary.register({
    type: "SetVariable",
    nodeType: "exec",
    title: "Set Variable",
    description: "Set a variable value",
    category: "Variables",
    color: "#3498DB",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Name", type: "string", direction: "input", required: true },
      { name: "Value", type: "any", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "SetVariable",
      nodeType: "exec",
      title: "Set Variable",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "name_in", name: "Name", type: "string", direction: "input", required: true },
        { id: "value_in", name: "Value", type: "any", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: { variableName: data?.variableName || "" }
    })
  });

  // Variables: Get Variable
  NodeLibrary.register({
    type: "GetVariable",
    nodeType: "data",
    title: "Get Variable",
    description: "Get a variable value",
    category: "Variables",
    color: "#3498DB",
    inputs: [{ name: "Name", type: "string", direction: "input", required: true }],
    outputs: [{ name: "Value", type: "any", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "GetVariable",
      nodeType: "data",
      title: "Get Variable",
      position: { x: 0, y: 0 },
      inputs: [{ id: "name_in", name: "Name", type: "string", direction: "input", required: true }],
      outputs: [{ id: "value_out", name: "Value", type: "any", direction: "output" }],
      data: { variableName: data?.variableName || "" }
    })
  });

  // Unity: Spawn Prefab
  NodeLibrary.register({
    type: "SpawnPrefab",
    nodeType: "exec",
    title: "Spawn Prefab",
    description: "Instantiate a prefab at position",
    category: "Unity",
    color: "#50C878",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Prefab", type: "object", direction: "input", required: true },
      { name: "Position", type: "vector3", direction: "input" }
    ],
    outputs: [
      { name: "Exec", type: "exec", direction: "output" },
      { name: "Spawned", type: "object", direction: "output" }
    ],
    create: (data) => ({
      id: "",
      type: "SpawnPrefab",
      nodeType: "exec",
      title: "Spawn Prefab",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "prefab_in", name: "Prefab", type: "object", direction: "input", required: true },
        { id: "position_in", name: "Position", type: "vector3", direction: "input" }
      ],
      outputs: [
        { id: "exec_out", name: "Exec", type: "exec", direction: "output" },
        { id: "spawned_out", name: "Spawned", type: "object", direction: "output" }
      ],
      data: {}
    })
  });

  // Unity: Destroy Object
  NodeLibrary.register({
    type: "DestroyObject",
    nodeType: "exec",
    title: "Destroy",
    description: "Destroy a GameObject",
    category: "Unity",
    color: "#50C878",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Object", type: "object", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "DestroyObject",
      nodeType: "exec",
      title: "Destroy",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "object_in", name: "Object", type: "object", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  // Events: On Update
  NodeLibrary.register({
    type: "OnUpdate",
    nodeType: "event",
    title: "On Update",
    description: "Called every frame",
    category: "Events",
    color: "#FFD700",
    inputs: [],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "OnUpdate",
      nodeType: "event",
      title: "On Update",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  // Events: On Trigger Enter
  NodeLibrary.register({
    type: "OnTriggerEnter",
    nodeType: "event",
    title: "On Trigger Enter",
    description: "Called when trigger is entered",
    category: "Events",
    color: "#FFD700",
    inputs: [],
    outputs: [
      { name: "Exec", type: "exec", direction: "output" },
      { name: "Other", type: "object", direction: "output" }
    ],
    create: (data) => ({
      id: "",
      type: "OnTriggerEnter",
      nodeType: "event",
      title: "On Trigger Enter",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [
        { id: "exec_out", name: "Exec", type: "exec", direction: "output" },
        { id: "other_out", name: "Other", type: "object", direction: "output" }
      ],
      data: {}
    })
  });

  // Logic: Random Range
  NodeLibrary.register({
    type: "RandomRange",
    nodeType: "data",
    title: "Random Range",
    description: "Generate random number between min and max",
    category: "Logic",
    color: "#E74C3C",
    inputs: [
      { name: "Min", type: "float", direction: "input", defaultValue: 0, required: true },
      { name: "Max", type: "float", direction: "input", defaultValue: 1, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "RandomRange",
      nodeType: "data",
      title: "Random Range",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "min_in", name: "Min", type: "float", direction: "input", defaultValue: 0, required: true },
        { id: "max_in", name: "Max", type: "float", direction: "input", defaultValue: 1, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      const min = inputs.Min || 0;
      const max = inputs.Max || 1;
      return Math.random() * (max - min) + min;
    }
  });

  // Logic: Clamp
  NodeLibrary.register({
    type: "Clamp",
    nodeType: "data",
    title: "Clamp",
    description: "Clamp value between min and max",
    category: "Logic",
    color: "#E74C3C",
    inputs: [
      { name: "Value", type: "float", direction: "input", required: true },
      { name: "Min", type: "float", direction: "input", defaultValue: 0, required: true },
      { name: "Max", type: "float", direction: "input", defaultValue: 1, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Clamp",
      nodeType: "data",
      title: "Clamp",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "value_in", name: "Value", type: "float", direction: "input", required: true },
        { id: "min_in", name: "Min", type: "float", direction: "input", defaultValue: 0, required: true },
        { id: "max_in", name: "Max", type: "float", direction: "input", defaultValue: 1, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      const value = inputs.Value || 0;
      const min = inputs.Min || 0;
      const max = inputs.Max || 1;
      return Math.max(min, Math.min(max, value));
    }
  });

  // Logic: Lerp
  NodeLibrary.register({
    type: "Lerp",
    nodeType: "data",
    title: "Lerp",
    description: "Linear interpolation between two values",
    category: "Logic",
    color: "#E74C3C",
    inputs: [
      { name: "A", type: "float", direction: "input", defaultValue: 0, required: true },
      { name: "B", type: "float", direction: "input", defaultValue: 1, required: true },
      { name: "T", type: "float", direction: "input", defaultValue: 0.5, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Lerp",
      nodeType: "data",
      title: "Lerp",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 0, required: true },
        { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 1, required: true },
        { id: "t_in", name: "T", type: "float", direction: "input", defaultValue: 0.5, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      const a = inputs.A || 0;
      const b = inputs.B || 1;
      const t = inputs.T || 0.5;
      return a + (b - a) * t;
    }
  });

  // UI: Set Text
  NodeLibrary.register({
    type: "SetText",
    nodeType: "exec",
    title: "Set UI Text",
    description: "Set text on UI element",
    category: "UI",
    color: "#16A085",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Target", type: "object", direction: "input", required: true },
      { name: "Text", type: "string", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "SetText",
      nodeType: "exec",
      title: "Set UI Text",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "target_in", name: "Target", type: "object", direction: "input", required: true },
        { id: "text_in", name: "Text", type: "string", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  // UI: Show UI
  NodeLibrary.register({
    type: "ShowUI",
    nodeType: "exec",
    title: "Show UI",
    description: "Show UI element",
    category: "UI",
    color: "#16A085",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Target", type: "object", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "ShowUI",
      nodeType: "exec",
      title: "Show UI",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "target_in", name: "Target", type: "object", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  // UI: Hide UI
  NodeLibrary.register({
    type: "HideUI",
    nodeType: "exec",
    title: "Hide UI",
    description: "Hide UI element",
    category: "UI",
    color: "#16A085",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Target", type: "object", direction: "input", required: true }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "HideUI",
      nodeType: "exec",
      title: "Hide UI",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "target_in", name: "Target", type: "object", direction: "input", required: true }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: {}
    })
  });

  // Constants: Bool Constant
  NodeLibrary.register({
    type: "BoolConstant",
    nodeType: "data",
    title: "Bool",
    description: "Boolean constant value",
    category: "Constants",
    color: "#9B59B6",
    inputs: [],
    outputs: [{ name: "Value", type: "bool", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "BoolConstant",
      nodeType: "data",
      title: "Bool",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [{ id: "value_out", name: "Value", type: "bool", direction: "output" }],
      data: { value: data?.value || false }
    }),
    execute: (node) => {
      return node.data.value || false;
    }
  });

  // Constants: Vector3 Constant
  NodeLibrary.register({
    type: "Vector3Constant",
    nodeType: "data",
    title: "Vector3",
    description: "Vector3 constant value",
    category: "Constants",
    color: "#9B59B6",
    inputs: [],
    outputs: [{ name: "Value", type: "vector3", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Vector3Constant",
      nodeType: "data",
      title: "Vector3",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [{ id: "value_out", name: "Value", type: "vector3", direction: "output" }],
      data: {
        value: data?.value || { x: 0, y: 0, z: 0 }
      }
    }),
    execute: (node) => {
      return node.data.value || { x: 0, y: 0, z: 0 };
    }
  });

  // Additional Math nodes
  NodeLibrary.register({
    type: "Modulo",
    nodeType: "data",
    title: "Modulo",
    description: "Calculate remainder after division",
    category: "Math",
    color: "#7B68EE",
    inputs: [
      { name: "A", type: "float", direction: "input", defaultValue: 1, required: true },
      { name: "B", type: "float", direction: "input", defaultValue: 1, required: true }
    ],
    outputs: [{ name: "Result", type: "float", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Modulo",
      nodeType: "data",
      title: "Modulo",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 1, required: true },
        { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 1, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      const a = inputs.A || 0;
      const b = inputs.B || 1;
      return b !== 0 ? a % b : 0;
    }
  });

  // Logic: Compare
  NodeLibrary.register({
    type: "Compare",
    nodeType: "data",
    title: "Compare",
    description: "Compare two values (greater than, less than, equal)",
    category: "Logic",
    color: "#E74C3C",
    inputs: [
      { name: "A", type: "float", direction: "input", required: true },
      { name: "B", type: "float", direction: "input", required: true },
      { name: "Operation", type: "string", direction: "input", defaultValue: "Equal", required: true }
    ],
    outputs: [{ name: "Result", type: "bool", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "Compare",
      nodeType: "data",
      title: "Compare",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "float", direction: "input", required: true },
        { id: "b_in", name: "B", type: "float", direction: "input", required: true },
        { id: "op_in", name: "Operation", type: "string", direction: "input", defaultValue: "Equal", required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "bool", direction: "output" }],
      data: { operation: data?.operation || "Equal" }
    }),
    execute: (node, inputs) => {
      const a = inputs.A || 0;
      const b = inputs.B || 0;
      const op = inputs.Operation || node.data.operation || "Equal";
      
      switch (op) {
        case "Equal": return a === b;
        case "NotEqual": return a !== b;
        case "Greater": return a > b;
        case "GreaterEqual": return a >= b;
        case "Less": return a < b;
        case "LessEqual": return a <= b;
        default: return a === b;
      }
    }
  });

  // Unity: Get Component
  NodeLibrary.register({
    type: "GetComponent",
    nodeType: "data",
    title: "Get Component",
    description: "Get component from GameObject",
    category: "Unity",
    color: "#50C878",
    inputs: [
      { name: "Object", type: "object", direction: "input", required: true },
      { name: "Component Type", type: "string", direction: "input", required: true }
    ],
    outputs: [{ name: "Component", type: "object", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "GetComponent",
      nodeType: "data",
      title: "Get Component",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "object_in", name: "Object", type: "object", direction: "input", required: true },
        { id: "type_in", name: "Component Type", type: "string", direction: "input", required: true }
      ],
      outputs: [{ id: "component_out", name: "Component", type: "object", direction: "output" }],
      data: { componentType: data?.componentType || "" }
    })
  });

  // Unity: Send Message
  NodeLibrary.register({
    type: "SendMessage",
    nodeType: "exec",
    title: "Send Message",
    description: "Send message to GameObject",
    category: "Unity",
    color: "#50C878",
    inputs: [
      { name: "Exec", type: "exec", direction: "input" },
      { name: "Target", type: "object", direction: "input", required: true },
      { name: "Method", type: "string", direction: "input", required: true },
      { name: "Value", type: "any", direction: "input" }
    ],
    outputs: [{ name: "Exec", type: "exec", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "SendMessage",
      nodeType: "exec",
      title: "Send Message",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "target_in", name: "Target", type: "object", direction: "input", required: true },
        { id: "method_in", name: "Method", type: "string", direction: "input", required: true },
        { id: "value_in", name: "Value", type: "any", direction: "input" }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: { methodName: data?.methodName || "" }
    })
  });

  // Input: Get Key Down
  NodeLibrary.register({
    type: "GetKeyDown",
    nodeType: "data",
    title: "Get Key Down",
    description: "Check if key is pressed this frame",
    category: "Input",
    color: "#9B59B6",
    inputs: [{ name: "Key", type: "string", direction: "input", required: true }],
    outputs: [{ name: "Is Down", type: "bool", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "GetKeyDown",
      nodeType: "data",
      title: "Get Key Down",
      position: { x: 0, y: 0 },
      inputs: [{ id: "key_in", name: "Key", type: "string", direction: "input", required: true }],
      outputs: [{ id: "isdown_out", name: "Is Down", type: "bool", direction: "output" }],
      data: { key: data?.key || "Space" }
    })
  });

  // Vector Math: Vector Add
  NodeLibrary.register({
    type: "VectorAdd",
    nodeType: "data",
    title: "Vector Add",
    description: "Add two Vector3 values",
    category: "Math",
    color: "#7B68EE",
    inputs: [
      { name: "A", type: "vector3", direction: "input", required: true },
      { name: "B", type: "vector3", direction: "input", required: true }
    ],
    outputs: [{ name: "Result", type: "vector3", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "VectorAdd",
      nodeType: "data",
      title: "Vector Add",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "a_in", name: "A", type: "vector3", direction: "input", required: true },
        { id: "b_in", name: "B", type: "vector3", direction: "input", required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "vector3", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      const a = inputs.A || { x: 0, y: 0, z: 0 };
      const b = inputs.B || { x: 0, y: 0, z: 0 };
      return {
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z
      };
    }
  });

  // Vector Math: Vector Multiply (Scale)
  NodeLibrary.register({
    type: "VectorScale",
    nodeType: "data",
    title: "Vector Scale",
    description: "Multiply vector by scalar",
    category: "Math",
    color: "#7B68EE",
    inputs: [
      { name: "Vector", type: "vector3", direction: "input", required: true },
      { name: "Scale", type: "float", direction: "input", defaultValue: 1, required: true }
    ],
    outputs: [{ name: "Result", type: "vector3", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "VectorScale",
      nodeType: "data",
      title: "Vector Scale",
      position: { x: 0, y: 0 },
      inputs: [
        { id: "vector_in", name: "Vector", type: "vector3", direction: "input", required: true },
        { id: "scale_in", name: "Scale", type: "float", direction: "input", defaultValue: 1, required: true }
      ],
      outputs: [{ id: "result_out", name: "Result", type: "vector3", direction: "output" }],
      data: {}
    }),
    execute: (node, inputs) => {
      const vec = inputs.Vector || { x: 0, y: 0, z: 0 };
      const scale = inputs.Scale || 1;
      return {
        x: vec.x * scale,
        y: vec.y * scale,
        z: vec.z * scale
      };
    }
  });

  // Constants: Int Constant
  NodeLibrary.register({
    type: "IntConstant",
    nodeType: "data",
    title: "Int",
    description: "Integer constant value",
    category: "Constants",
    color: "#9B59B6",
    inputs: [],
    outputs: [{ name: "Value", type: "int", direction: "output" }],
    create: (data) => ({
      id: "",
      type: "IntConstant",
      nodeType: "data",
      title: "Int",
      position: { x: 0, y: 0 },
      inputs: [],
      outputs: [{ id: "value_out", name: "Value", type: "int", direction: "output" }],
      data: { value: data?.value || 0 }
    }),
    execute: (node) => {
      return Math.floor(node.data.value || 0);
    }
  });
}

// Register expanded nodes when NodeLibrary is ready
// This is called from NodeLibrary.ts after it's fully initialized

