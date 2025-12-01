import { describe, expect, test, beforeEach } from "vitest";
import { useBPGraphStore } from "@/ignis/blueprint/store/BPGraphStore";

describe("Blueprint Graph Store Tests", () => {
  beforeEach(() => {
    // Reset store state before each test
    useBPGraphStore.setState({
      graphs: {},
      activeGraphId: null,
      selectedNodes: [],
      connectingSocket: null,
    });
  });

  test("create graph", () => {
    const store = useBPGraphStore.getState();
    const graphId = store.createGraph("TestGraph");
    
    expect(graphId).toBeDefined();
    expect(store.activeGraphId).toBe(graphId);
    expect(store.graphs[graphId]).toBeDefined();
    expect(store.graphs[graphId].name).toBe("TestGraph");
  });

  test("add node to graph", () => {
    const store = useBPGraphStore.getState();
    const graphId = store.createGraph("TestGraph");
    
    const node = store.addNode("Print", { x: 100, y: 100 }, { message: "Hello" });
    
    expect(node).toBeDefined();
    expect(node?.type).toBe("Print");
    expect(node?.position).toEqual({ x: 100, y: 100 });
    
    const graph = store.getGraph(graphId);
    expect(graph?.nodes[node!.id]).toBeDefined();
  });

  test("remove node removes connections", () => {
    const store = useBPGraphStore.getState();
    const graphId = store.createGraph("TestGraph");
    
    const node1 = store.addNode("Print", { x: 0, y: 0 });
    const node2 = store.addNode("Print", { x: 200, y: 0 });
    
    if (node1 && node2) {
      store.addConnection(
        node1.id,
        node1.outputs[0]?.id || "",
        node2.id,
        node2.inputs[0]?.id || ""
      );
      
      const graphBefore = store.getGraph(graphId);
      const connectionCountBefore = Object.keys(graphBefore?.connections || {}).length;
      expect(connectionCountBefore).toBeGreaterThan(0);
      
      store.removeNode(node1.id);
      
      const graphAfter = store.getGraph(graphId);
      const connectionCountAfter = Object.keys(graphAfter?.connections || {}).length;
      expect(connectionCountAfter).toBe(0);
    }
  });

  test("update node position", () => {
    const store = useBPGraphStore.getState();
    store.createGraph("TestGraph");
    
    const node = store.addNode("Print", { x: 0, y: 0 });
    
    if (node) {
      store.updateNodePosition(node.id, 150, 200);
      
      const graph = store.getActiveGraph();
      expect(graph?.nodes[node.id].position).toEqual({ x: 150, y: 200 });
    }
  });

  test("select node", () => {
    const store = useBPGraphStore.getState();
    store.createGraph("TestGraph");
    
    const node = store.addNode("Print", { x: 0, y: 0 });
    
    if (node) {
      store.selectNode(node.id);
      expect(store.selectedNodes).toContain(node.id);
      expect(store.selectedNodes.length).toBe(1);
    }
  });

  test("multi-select nodes", () => {
    const store = useBPGraphStore.getState();
    store.createGraph("TestGraph");
    
    const node1 = store.addNode("Print", { x: 0, y: 0 });
    const node2 = store.addNode("Print", { x: 100, y: 100 });
    
    if (node1 && node2) {
      store.selectNode(node1.id);
      store.selectNode(node2.id, true); // multi-select
      
      expect(store.selectedNodes.length).toBe(2);
      expect(store.selectedNodes).toContain(node1.id);
      expect(store.selectedNodes).toContain(node2.id);
    }
  });
});

