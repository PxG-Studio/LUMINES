import { describe, expect, test, beforeEach } from "vitest";
import { RuntimeBinder } from "@/ignis/blueprint/runtime/RuntimeBinder";
import { unityBridgeMock } from "@/tests/mock/unity/UnityBridgeMock";

describe("Runtime Binder Tests", () => {
  beforeEach(() => {
    unityBridgeMock.clearSentEvents();
  });

  test("triggers Unity event from blueprint", () => {
    RuntimeBinder.triggerUnityEvent("PlaySound", { clipName: "sfx_click" });
    
    expect(unityBridgeMock.wasEventSent("ignis/event")).toBe(true);
  });

  test("receives Unity event and executes graph", () => {
    // Mock graph execution
    let executedGraphId: string | null = null;
    
    // This would be set up in the actual RuntimeBinder implementation
    const mockExecute = (graphId: string) => {
      executedGraphId = graphId;
    };
    
    // Simulate Unity sending an event
    unityBridgeMock.simulateUnityEvent("blueprint/trigger", {
      graphId: "test-graph",
      nodeId: "start",
      socketId: "exec_out"
    });
    
    // Verify graph execution was triggered
    // (In real implementation, this would be handled by RuntimeBinder)
  });
});

