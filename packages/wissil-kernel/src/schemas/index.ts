/**
 * Schemas
 * 
 * JSON schemas and validation for WISSIL data formats
 */

// Blueprint graph schema
export const BlueprintGraphSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    nodes: { type: "object" },
    connections: { type: "object" }
  },
  required: ["id", "name", "nodes", "connections"]
};

// Template schema
export const TemplateSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    graph: { $ref: "#/definitions/BlueprintGraphSchema" },
    metadata: { type: "object" }
  },
  required: ["id", "name", "graph"]
};

// SceneGraph schema
export const SceneGraphSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    name: { type: "string" },
    children: { type: "array" },
    components: { type: "array" }
  },
  required: ["id", "name"]
};

