/**
 * C# Code Generator
 * Converts blueprint graphs to Unity C# scripts
 */

import { BlueprintGraph, Node } from "../schema/NodeSchema";
import { NodeLibrary } from "../library/NodeLibrary";

/**
 * C# Code Generator
 * Generates Unity C# scripts from blueprint graphs
 */
export class CSharpGenerator {
  /**
   * Generate C# code from blueprint graph
   */
  static generate(graph: BlueprintGraph, className: string = "GeneratedBlueprint"): string {
    const lines: string[] = [];

    // Header
    lines.push("using UnityEngine;");
    lines.push("using System.Collections;");
    lines.push("");
    lines.push("public class " + className + " : MonoBehaviour");
    lines.push("{");

    // Variables
    if (graph.variables.length > 0) {
      lines.push("    // Variables");
      for (const variable of graph.variables) {
        const typeName = this.getCSharpType(variable.type);
        const defaultValue = variable.defaultValue !== undefined
          ? ` = ${this.formatCSharpValue(variable.defaultValue, variable.type)}`
          : "";
        lines.push(`    private ${typeName} ${variable.name}${defaultValue};`);
      }
      lines.push("");
    }

    // Start method (entry point)
    const startNode = graph.nodes.find((n) => n.type === "Start");
    if (startNode) {
      lines.push("    void Start()");
      lines.push("    {");
      const startCode = this.generateNodeCode(graph, startNode, 2);
      lines.push(...startCode);
      lines.push("    }");
      lines.push("");
    }

    // Helper methods for each node
    lines.push("    // Helper methods");
    for (const node of graph.nodes) {
      if (node.type === "Start") continue; // Already handled
      const nodeCode = this.generateNodeMethod(graph, node);
      if (nodeCode.length > 0) {
        lines.push(...nodeCode);
        lines.push("");
      }
    }

    lines.push("}");
    return lines.join("\n");
  }

  /**
   * Generate code for a specific node
   */
  private static generateNodeCode(
    graph: BlueprintGraph,
    node: Node,
    indent: number
  ): string[] {
    const lines: string[] = [];
    const indentStr = " ".repeat(indent);

    const nodeDef = NodeLibrary.get(node.type);
    if (!nodeDef) {
      lines.push(`${indentStr}// Node ${node.type} not implemented`);
      return lines;
    }

    switch (node.type) {
      case "Print":
        const message = node.data.message || "\"Hello World\"";
        lines.push(`${indentStr}Debug.Log(${message});`);
        break;

      case "Branch":
        lines.push(`${indentStr}if (${this.getInputValue(graph, node, "Condition")})`);
        lines.push(`${indentStr}{`);
        lines.push(`${indentStr}    // True branch`);
        lines.push(`${indentStr}}`);
        lines.push(`${indentStr}else`);
        lines.push(`${indentStr}{`);
        lines.push(`${indentStr}    // False branch`);
        lines.push(`${indentStr}}`);
        break;

      case "Add":
        const a = this.getInputValue(graph, node, "A");
        const b = this.getInputValue(graph, node, "B");
        lines.push(`${indentStr}float result = ${a} + ${b};`);
        break;

      default:
        lines.push(`${indentStr}// ${node.type} node`);
        break;
    }

    return lines;
  }

  /**
   * Generate method for a node
   */
  private static generateNodeMethod(graph: BlueprintGraph, node: Node): string[] {
    // Simplified - would generate proper methods
    return [];
  }

  /**
   * Get input value for code generation
   */
  private static getInputValue(
    graph: BlueprintGraph,
    node: Node,
    inputName: string
  ): string {
    const inputSocket = node.inputs.find((s) => s.name === inputName);
    if (!inputSocket) return "0";

    // Check for connection
    const connection = graph.connections.find(
      (c) => c.toNodeId === node.id && c.toSocketId === inputSocket.id
    );

    if (connection) {
      // Would resolve connected node value
      return "/* connected value */";
    }

    // Use default or constant
    if (inputSocket.defaultValue !== undefined) {
      return this.formatCSharpValue(inputSocket.defaultValue, inputSocket.type);
    }

    return this.getDefaultValue(inputSocket.type);
  }

  /**
   * Get C# type name
   */
  private static getCSharpType(socketType: string): string {
    const typeMap: Record<string, string> = {
      bool: "bool",
      int: "int",
      float: "float",
      string: "string",
      vector3: "Vector3",
      object: "GameObject",
      exec: "void",
      any: "object"
    };
    return typeMap[socketType] || "object";
  }

  /**
   * Format value for C# code
   */
  private static formatCSharpValue(value: any, type: string): string {
    if (type === "string") {
      return `"${String(value).replace(/"/g, '\\"')}"`;
    }
    if (type === "bool") {
      return value ? "true" : "false";
    }
    if (type === "vector3" && typeof value === "object") {
      return `new Vector3(${value.x || 0}f, ${value.y || 0}f, ${value.z || 0}f)`;
    }
    if (type === "float") {
      return `${value}f`;
    }
    return String(value);
  }

  /**
   * Get default value for type
   */
  private static getDefaultValue(type: string): string {
    const defaults: Record<string, string> = {
      bool: "false",
      int: "0",
      float: "0f",
      string: '""',
      vector3: "Vector3.zero",
      object: "null"
    };
    return defaults[type] || "null";
  }
}

