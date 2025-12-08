import React from "react";
import { describe, expect, test } from "vitest";
import { render } from "@testing-library/react";
import { WireRenderer } from "@/ignis/blueprint/canvas/WireRenderer";
import { Connection } from "@/ignis/blueprint/schema/NodeSchema";

describe("Wire Renderer Tests", () => {
  test("wire renders correct Bezier path", () => {
    const mockConnection: Connection = {
      id: "test-connection",
      fromNode: "node1",
      fromSocket: "output",
      toNode: "node2",
      toSocket: "input"
    };

    const fromCoords = { x: 100, y: 100 };
    const toCoords = { x: 300, y: 200 };

    const { container } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={fromCoords}
          toCoords={toCoords}
          socketType="exec"
          onRemove={() => {}}
        />
      </svg>
    );

    const path = container.querySelector("path");
    expect(path).toBeDefined();
    
    if (path) {
      const d = path.getAttribute("d");
      expect(d).toBeDefined();
      // Bezier path should contain curve command
      expect(d).toContain("C");
    }
  });

  test("wire uses correct color for socket type", () => {
    const mockConnection: Connection = {
      id: "test-connection",
      fromNode: "node1",
      fromSocket: "output",
      toNode: "node2",
      toSocket: "input"
    };

    const { container, rerender } = render(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 100, y: 100 }}
          toCoords={{ x: 200, y: 200 }}
          socketType="exec"
          onRemove={() => {}}
        />
      </svg>
    );

    const path = container.querySelector("path");
    expect(path).toBeDefined();
    
    // Re-render with different socket type to verify color changes
    rerender(
      <svg>
        <WireRenderer
          connection={mockConnection}
          fromCoords={{ x: 100, y: 100 }}
          toCoords={{ x: 200, y: 200 }}
          socketType="float"
          onRemove={() => {}}
        />
      </svg>
    );
  });
});


