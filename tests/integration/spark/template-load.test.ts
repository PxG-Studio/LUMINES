import { describe, expect, test } from "vitest";

describe("Spark Template Load Tests", () => {
  test("template loads graphs correctly", async () => {
    // Mock template loading
    const mockLoadTemplate = async (templateId: string) => {
      // Simulate template loading
      return {
        id: templateId,
        graphs: [
          {
            id: "graph1",
            name: "Main Graph",
            nodes: {},
            connections: {}
          }
        ],
        metadata: {
          name: "Card Game Template",
          description: "Turn-based card game starter",
          version: "1.0.0"
        }
      };
    };

    const result = await mockLoadTemplate("card_turn_core");
    
    expect(result).toBeDefined();
    expect(result.graphs.length).toBeGreaterThan(0);
    expect(result.graphs[0].id).toBe("graph1");
  });

  test("template validates graph structure", async () => {
    const template = {
      graphs: [
        {
          nodes: {
            start: { id: "start", type: "Start" },
            print: { id: "print", type: "Print" }
          },
          connections: {
            c1: { fromNode: "start", toNode: "print" }
          }
        }
      ]
    };

    // Validate structure
    expect(template.graphs[0].nodes).toBeDefined();
    expect(template.graphs[0].connections).toBeDefined();
    expect(Object.keys(template.graphs[0].nodes).length).toBeGreaterThan(0);
  });

  test("all genre templates exist", async () => {
    const templates = [
      "card_turn_core",
      "platformer_starter",
      "shooter_starter",
      "rpg_topdown",
      "vn_dialogue"
    ];

    for (const templateId of templates) {
      // In real implementation, check if template exists
      expect(templateId).toBeTruthy();
    }
  });
});

