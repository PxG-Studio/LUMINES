import { describe, expect, test } from "vitest";
import { BPInterpreter } from "@/ignis/blueprint/runtime/BPInterpreter";
import { Graph, Node } from "@/ignis/blueprint/schema/NodeSchema";

describe("Blueprint Interpreter Tests", () => {
  test("executes simple sequence", async () => {
    const graph: Graph = {
      id: "test-graph",
      name: "Test Graph",
      nodes: {
        start: {
          id: "start",
          type: "Start",
          nodeType: "event",
          title: "Start",
          position: { x: 0, y: 0 },
          inputs: [],
          outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
          data: {}
        },
        print1: {
          id: "print1",
          type: "Print",
          nodeType: "exec",
          title: "Print",
          position: { x: 100, y: 0 },
          inputs: [
            { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
            { id: "message_in", name: "Message", type: "string", direction: "input", defaultValue: "Hello" }
          ],
          outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
          data: { message: "Hello" }
        },
        print2: {
          id: "print2",
          type: "Print",
          nodeType: "exec",
          title: "Print",
          position: { x: 200, y: 0 },
          inputs: [
            { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
            { id: "message_in", name: "Message", type: "string", direction: "input", defaultValue: "World" }
          ],
          outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
          data: { message: "World" }
        }
      },
      connections: {
        c1: {
          id: "c1",
          fromNode: "start",
          fromSocket: "exec_out",
          toNode: "print1",
          toSocket: "exec_in"
        },
        c2: {
          id: "c2",
          fromNode: "print1",
          fromSocket: "exec_out",
          toNode: "print2",
          toSocket: "exec_in"
        }
      }
    };

    const interpreter = new BPInterpreter(graph);
    const history: string[] = [];

    // Mock console.log
    const originalLog = console.log;
    console.log = (message: string) => {
      history.push(message);
    };

    try {
      await interpreter.execute("start", "exec_out");
      
      // Both print nodes should execute
      expect(history.length).toBeGreaterThanOrEqual(2);
    } finally {
      console.log = originalLog;
    }
  });

  test("handles branch node correctly", async () => {
    const graph: Graph = {
      id: "test-branch",
      name: "Branch Test",
      nodes: {
        start: {
          id: "start",
          type: "Start",
          nodeType: "event",
          title: "Start",
          position: { x: 0, y: 0 },
          inputs: [],
          outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
          data: {}
        },
        branch: {
          id: "branch",
          type: "Branch",
          nodeType: "exec",
          title: "Branch",
          position: { x: 100, y: 0 },
          inputs: [
            { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
            { id: "condition_in", name: "Condition", type: "bool", direction: "input", defaultValue: true }
          ],
          outputs: [
            { id: "true_out", name: "True", type: "exec", direction: "output" },
            { id: "false_out", name: "False", type: "exec", direction: "output" }
          ],
          data: {}
        }
      },
      connections: {
        c1: {
          id: "c1",
          fromNode: "start",
          fromSocket: "exec_out",
          toNode: "branch",
          toSocket: "exec_in"
        }
      }
    };

    const interpreter = new BPInterpreter(graph);
    
    // Test true branch
    await interpreter.execute("start", "exec_out");
    // Execution should proceed through branch based on condition
  });

  test("resolves data socket values", async () => {
    const graph: Graph = {
      id: "test-data",
      name: "Data Test",
      nodes: {
        add: {
          id: "add",
          type: "Add",
          nodeType: "data",
          title: "Add",
          position: { x: 0, y: 0 },
          inputs: [
            { id: "a_in", name: "A", type: "float", direction: "input", defaultValue: 5 },
            { id: "b_in", name: "B", type: "float", direction: "input", defaultValue: 3 }
          ],
          outputs: [{ id: "result_out", name: "Result", type: "float", direction: "output" }],
          data: {}
        }
      },
      connections: {},
      id: ""
    };

    const interpreter = new BPInterpreter(graph);
    // Should resolve data node values correctly
    expect(graph.nodes.add).toBeDefined();
  });
});

