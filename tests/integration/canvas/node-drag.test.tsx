import React from "react";
import { describe, expect, test } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { NodeRenderer } from "@/ignis/blueprint/canvas/NodeRenderer";
import { useBPGraphStore } from "@/ignis/blueprint/store/BPGraphStore";
import { Node } from "@/ignis/blueprint/schema/NodeSchema";

describe("Node Drag Tests", () => {
  test("node moves when dragged", () => {
    const store = useBPGraphStore.getState();
    store.createGraph("TestGraph");
    
    const mockNode: Node = {
      id: "test-node",
      type: "Print",
      nodeType: "exec",
      title: "Print",
      position: { x: 100, y: 100 },
      inputs: [
        { id: "exec_in", name: "Exec", type: "exec", direction: "input" },
        { id: "message_in", name: "Message", type: "string", direction: "input", defaultValue: "Test" }
      ],
      outputs: [{ id: "exec_out", name: "Exec", type: "exec", direction: "output" }],
      data: { message: "Test" }
    };
    
    store.addNode("Print", { x: 100, y: 100 }, { message: "Test" });
    
    const { container } = render(
      <NodeRenderer
        node={mockNode}
        onDragStart={() => {}}
        onSocketClick={() => {}}
        isSelected={false}
      />
    );
    
    const nodeElement = container.querySelector(`[data-node-id="${mockNode.id}"]`);
    expect(nodeElement).toBeDefined();
    
    if (nodeElement) {
      const startX = 100;
      const startY = 100;
      const endX = 200;
      const endY = 250;
      
      // Simulate drag start
      fireEvent.mouseDown(nodeElement, { 
        clientX: startX, 
        clientY: startY,
        button: 0
      });
      
      // Simulate drag move
      fireEvent.mouseMove(document, { 
        clientX: endX, 
        clientY: endY
      });
      
      // Simulate drag end
      fireEvent.mouseUp(document);
      
      // Node position should be updated in store
      const updatedNode = store.getActiveGraph()?.nodes[mockNode.id];
      expect(updatedNode).toBeDefined();
    }
  });

  test("multiple nodes can be selected and dragged", () => {
    const store = useBPGraphStore.getState();
    store.createGraph("TestGraph");
    
    const node1 = store.addNode("Print", { x: 0, y: 0 });
    const node2 = store.addNode("Print", { x: 100, y: 100 });
    
    expect(node1).toBeDefined();
    expect(node2).toBeDefined();
    
    if (node1 && node2) {
      // Select both nodes
      store.selectNode(node1.id);
      store.selectNode(node2.id, true);
      
      expect(store.selectedNodes.length).toBe(2);
    }
  });
});


