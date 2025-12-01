import { describe, expect, test } from "vitest";
import { CSharpGenerator } from "@/ignis/blueprint/runtime/CSharpGenerator";
import { Graph } from "@/ignis/blueprint/schema/NodeSchema";

describe("C# Generation Tests", () => {
  test("generates valid C# class structure", () => {
    const graph: Graph = {
      id: "test-graph",
      name: "TestGraph",
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
        }
      },
      connections: {},
      name: ""
    };

    const csharpCode = CSharpGenerator.generate(graph, "TestBlueprint");
    
    expect(csharpCode).toContain("public class TestBlueprint");
    expect(csharpCode).toContain("MonoBehaviour");
    expect(csharpCode).toContain("using UnityEngine");
  });

  test("generates Start method from Start node", () => {
    const graph: Graph = {
      id: "test-graph",
      name: "TestGraph",
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
        }
      },
      connections: {},
      name: ""
    };

    const csharpCode = CSharpGenerator.generate(graph, "TestBlueprint");
    
    expect(csharpCode).toContain("void Start()");
  });

  test("generates Update method from OnUpdate node", () => {
    const graph: Graph = {
      id: "test-graph",
      name: "TestGraph",
      nodes: {
        update: {
          id: "update",
          type: "OnUpdate",
          nodeType: "event",
          title: "On Update",
          position: { x: 0, y: 0 },
          inputs: [],
          outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
          data: {}
        }
      },
      connections: {},
      name: ""
    };

    const csharpCode = CSharpGenerator.generate(graph, "TestBlueprint");
    
    expect(csharpCode).toContain("void Update()");
  });

  test("generates math operations correctly", () => {
    const graph: Graph = {
      id: "test-graph",
      name: "TestGraph",
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
      name: ""
    };

    const csharpCode = CSharpGenerator.generate(graph, "MathTest");
    
    // Should generate valid C# math expression
    expect(csharpCode).toMatch(/[\d]+\s*\+\s*[\d]+/);
  });
});

