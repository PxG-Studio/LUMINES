/**
 * Node Definitions System
 * All available shader nodes and their properties
 */

import { NodeDefinition } from "../ShaderGraphTypes";

export const NodeDefinitions: Record<string, NodeDefinition> = {
  Color: {
    id: "color",
    label: "Color",
    category: "Input",
    inputs: [],
    outputs: ["rgba"],
    default: { r: 1, g: 1, b: 1, a: 1 },
    code: (inputs, data) => {
      const r = data.r !== undefined ? data.r : 1;
      const g = data.g !== undefined ? data.g : 1;
      const b = data.b !== undefined ? data.b : 1;
      const a = data.a !== undefined ? data.a : 1;
      return `vec4(${r}, ${g}, ${b}, ${a})`;
    }
  },

  Vector2: {
    id: "vec2",
    label: "Vector2",
    category: "Input",
    inputs: [],
    outputs: ["vec2"],
    default: { x: 0, y: 0 },
    code: (inputs, data) => {
      const x = data.x !== undefined ? data.x : 0;
      const y = data.y !== undefined ? data.y : 0;
      return `vec2(${x}, ${y})`;
    }
  },

  Vector3: {
    id: "vec3",
    label: "Vector3",
    category: "Input",
    inputs: [],
    outputs: ["vec3"],
    default: { x: 0, y: 0, z: 0 },
    code: (inputs, data) => {
      const x = data.x !== undefined ? data.x : 0;
      const y = data.y !== undefined ? data.y : 0;
      const z = data.z !== undefined ? data.z : 0;
      return `vec3(${x}, ${y}, ${z})`;
    }
  },

  Float: {
    id: "float",
    label: "Float",
    category: "Input",
    inputs: [],
    outputs: ["float"],
    default: { value: 0 },
    code: (inputs, data) => {
      return String(data.value !== undefined ? data.value : 0);
    }
  },

  UV: {
    id: "uv",
    label: "UV",
    category: "Input",
    inputs: [],
    outputs: ["uv"],
    default: {},
    code: () => `i.uv`
  },

  Time: {
    id: "time",
    label: "Time",
    category: "Input",
    inputs: [],
    outputs: ["float"],
    default: {},
    code: () => `_Time.y`
  },

  Add: {
    id: "add",
    label: "Add",
    category: "Math",
    inputs: ["a", "b"],
    outputs: ["out"],
    default: {},
    code: (inputs) => {
      const a = inputs.a || "0.0";
      const b = inputs.b || "0.0";
      return `(${a} + ${b})`;
    }
  },

  Subtract: {
    id: "sub",
    label: "Subtract",
    category: "Math",
    inputs: ["a", "b"],
    outputs: ["out"],
    default: {},
    code: (inputs) => {
      const a = inputs.a || "0.0";
      const b = inputs.b || "0.0";
      return `(${a} - ${b})`;
    }
  },

  Multiply: {
    id: "mul",
    label: "Multiply",
    category: "Math",
    inputs: ["a", "b"],
    outputs: ["out"],
    default: {},
    code: (inputs) => {
      const a = inputs.a || "1.0";
      const b = inputs.b || "1.0";
      return `(${a} * ${b})`;
    }
  },

  Divide: {
    id: "div",
    label: "Divide",
    category: "Math",
    inputs: ["a", "b"],
    outputs: ["out"],
    default: {},
    code: (inputs) => {
      const a = inputs.a || "1.0";
      const b = inputs.b || "1.0";
      return `(${a} / ${b})`;
    }
  },

  TextureSample: {
    id: "tex",
    label: "Texture Sample",
    category: "Texture",
    inputs: ["uv"],
    outputs: ["rgba"],
    default: { textureName: "_MainTex" },
    code: (inputs, data) => {
      const uv = inputs.uv || "i.uv";
      const texName = data.textureName || "_MainTex";
      return `texture2D(${texName}, ${uv})`;
    }
  },

  Normalize: {
    id: "normalize",
    label: "Normalize",
    category: "Math",
    inputs: ["vec"],
    outputs: ["vec"],
    default: {},
    code: (inputs) => {
      const vec = inputs.vec || "vec3(0, 0, 1)";
      return `normalize(${vec})`;
    }
  },

  Dot: {
    id: "dot",
    label: "Dot Product",
    category: "Math",
    inputs: ["a", "b"],
    outputs: ["float"],
    default: {},
    code: (inputs) => {
      const a = inputs.a || "vec3(0, 0, 1)";
      const b = inputs.b || "vec3(0, 0, 1)";
      return `dot(${a}, ${b})`;
    }
  },

  Lerp: {
    id: "lerp",
    label: "Lerp",
    category: "Math",
    inputs: ["a", "b", "t"],
    outputs: ["out"],
    default: {},
    code: (inputs) => {
      const a = inputs.a || "0.0";
      const b = inputs.b || "1.0";
      const t = inputs.t || "0.5";
      return `mix(${a}, ${b}, ${t})`;
    }
  },

  Sine: {
    id: "sin",
    label: "Sine",
    category: "Math",
    inputs: ["x"],
    outputs: ["float"],
    default: {},
    code: (inputs) => {
      const x = inputs.x || "0.0";
      return `sin(${x})`;
    }
  },

  Cosine: {
    id: "cos",
    label: "Cosine",
    category: "Math",
    inputs: ["x"],
    outputs: ["float"],
    default: {},
    code: (inputs) => {
      const x = inputs.x || "0.0";
      return `cos(${x})`;
    }
  }
};

/**
 * Get node definition by ID
 */
export function getNodeDefinition(id: string): NodeDefinition | undefined {
  return NodeDefinitions[id];
}

/**
 * Get all node definitions by category
 */
export function getNodesByCategory(category: string): NodeDefinition[] {
  return Object.values(NodeDefinitions).filter((node) => node.category === category);
}

/**
 * Get all available categories
 */
export function getCategories(): string[] {
  const categories = new Set<string>();
  Object.values(NodeDefinitions).forEach((node) => {
    if (node.category) {
      categories.add(node.category);
    }
  });
  return Array.from(categories);
}

