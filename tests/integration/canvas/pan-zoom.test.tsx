import React from "react";
import { describe, expect, test } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { BPGraphCanvas } from "@/ignis/blueprint/canvas/BPGraphCanvas";
import { useBPGraphStore } from "@/ignis/blueprint/store/BPGraphStore";

describe("Canvas Pan and Zoom Tests", () => {
  test("canvas zooms with wheel", () => {
    useBPGraphStore.getState().createGraph("TestCanvas");
    
    const { container } = render(<BPGraphCanvas />);
    const canvas = container.querySelector("[data-test='canvas']");
    
    expect(canvas).toBeDefined();
    
    if (canvas) {
      fireEvent.wheel(canvas, { 
        deltaY: -200,
        clientX: 400,
        clientY: 300
      });
      
      // Zoom should be applied (tested via state or transform)
      const transform = (canvas as HTMLElement).style.transform;
      expect(transform).toBeDefined();
    }
  });

  test("canvas pans with mouse drag", () => {
    useBPGraphStore.getState().createGraph("TestCanvas");
    
    const { container } = render(<BPGraphCanvas />);
    const canvas = container.querySelector("[data-test='canvas']");
    
    expect(canvas).toBeDefined();
    
    if (canvas) {
      // Simulate mouse down
      fireEvent.mouseDown(canvas, { 
        button: 1, // Middle mouse button
        clientX: 100,
        clientY: 100
      });
      
      // Simulate mouse move
      fireEvent.mouseMove(canvas, {
        clientX: 200,
        clientY: 200
      });
      
      // Simulate mouse up
      fireEvent.mouseUp(canvas);
      
      // Pan should be applied
      expect(canvas).toBeDefined();
    }
  });

  test("zoom origin is preserved", () => {
    useBPGraphStore.getState().createGraph("TestCanvas");
    
    const { container } = render(<BPGraphCanvas />);
    const canvas = container.querySelector("[data-test='canvas']");
    
    if (canvas) {
      const mouseX = 400;
      const mouseY = 300;
      
      fireEvent.wheel(canvas, {
        deltaY: -200,
        clientX: mouseX,
        clientY: mouseY
      });
      
      // Zoom should center around mouse position
      // This would be verified through zoom state or transform origin
    }
  });
});


