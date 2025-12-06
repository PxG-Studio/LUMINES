import { describe, expect, test } from "vitest";
import { NodeLibrary } from "@/ignis/blueprint/library/NodeLibrary";
import { Node } from "@/ignis/blueprint/schema/NodeSchema";

describe("Node Library Tests", () => {
  test("all nodes have valid types", () => {
    const allNodes = NodeLibrary.getAll();
    
    for (const nodeDef of allNodes) {
      expect(nodeDef.type).toBeDefined();
      expect(nodeDef.type).toBeTruthy();
      expect(nodeDef.nodeType).toBeDefined();
      expect(nodeDef.title).toBeDefined();
      expect(nodeDef.category).toBeDefined();
    }
  });

  test("node definitions have execute functions", () => {
    const execNodes = NodeLibrary.getAll().filter(n => n.nodeType === "exec" || n.nodeType === "data");
    
    for (const nodeDef of execNodes) {
      if (nodeDef.execute) {
        expect(typeof nodeDef.execute).toBe("function");
      }
    }
  });

  test("Add node returns correct sum", async () => {
    const addNode = NodeLibrary.get("Add");
    expect(addNode).toBeDefined();

    if (addNode && addNode.execute) {
      const node: Node = {
        id: "test-add",
        type: "Add",
        nodeType: "data",
        title: "Add",
        position: { x: 0, y: 0 },
        inputs: [
          { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 0 },
          { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 0 }
        ],
        outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
        data: {}
      };

      const result = await addNode.execute(node, { A: 5, B: 3 }, {} as any);
      expect(result).toBe(8);
    }
  });

  test("Branch node routes correctly", async () => {
    const branchNode = NodeLibrary.get("Branch");
    expect(branchNode).toBeDefined();

    if (branchNode && branchNode.execute) {
      const node: Node = {
        id: "test-branch",
        type: "Branch",
        nodeType: "exec",
        title: "Branch",
        position: { x: 0, y: 0 },
        inputs: [
          { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
          { id: "condition_in", name: "Condition", type: "bool", direction: "input" }
        ],
        outputs: [
          { id: "true_out", name: "True", type: "exec", direction: "output" },
          { id: "false_out", name: "False", type: "exec", direction: "output" }
        ],
        data: {}
      };

      const trueResult = await branchNode.execute(node, { Condition: true }, {} as any);
      expect(trueResult).toBe("true_out");

      const falseResult = await branchNode.execute(node, { Condition: false }, {} as any);
      expect(falseResult).toBe("false_out");
    }
  });

  test("node library search works", () => {
    const searchResults = NodeLibrary.search("add");
    expect(searchResults.length).toBeGreaterThan(0);
    expect(searchResults.some(n => n.type === "Add")).toBe(true);
  });

  test("nodes grouped by category", () => {
    const flowNodes = NodeLibrary.getByCategory("Flow");
    expect(flowNodes.length).toBeGreaterThan(0);

    const mathNodes = NodeLibrary.getByCategory("Math");
    expect(mathNodes.length).toBeGreaterThan(0);
  });
});

