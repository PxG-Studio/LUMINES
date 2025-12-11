/**
 * Runtime Binder
 * Ignition WebGL messaging hooks
 */

import { BlueprintGraph } from "../schema/NodeSchema";
import { BPInterpreter, ExecutionContext } from "./BPInterpreter";
import { UnityMessagingBus } from "../../../wissil/runtime/unityBridge/UnityMessagingBus";

/**
 * Runtime Binder
 * Binds blueprint graphs to Unity WebGL runtime
 */
export class RuntimeBinder {
  private interpreter: BPInterpreter | null = null;
  private context: ExecutionContext;

  constructor() {
    this.context = {
      variables: {},
      graph: {} as BlueprintGraph,
      executeNode: () => {},
      sendToUnity: (message: string, payload: any) => {
        if (UnityMessagingBus.isConnected()) {
          UnityMessagingBus.send("blueprint/trigger", { message, payload });
        }
      }
    };
  }

  /**
   * Bind graph to runtime
   */
  bind(graph: BlueprintGraph): void {
    this.context.graph = graph;
    this.interpreter = new BPInterpreter(graph, {
      ...this.context,
      sendToUnity: this.context.sendToUnity
    });
  }

  /**
   * Trigger blueprint execution
   */
  trigger(entryPoint?: string): void {
    if (!this.interpreter) {
      console.warn("[RuntimeBinder] No graph bound");
      return;
    }

    this.interpreter.execute(entryPoint);
  }

  /**
   * Handle Unity events
   */
  onUnityEvent(eventType: string, payload: any): void {
    // Map Unity events to blueprint execution
    const eventNodes = this.context.graph.nodes.filter(
      (n) => n.type === eventType || n.data.eventType === eventType
    );

    for (const node of eventNodes) {
      if (this.interpreter) {
        (this.interpreter as any).executeNode(node.id, payload);
      }
    }
  }

  /**
   * Set variable value from Unity
   */
  setVariable(name: string, value: any): void {
    if (this.interpreter) {
      this.interpreter.setVariable(name, value);
    }
  }

  /**
   * Get variable value for Unity
   */
  getVariable(name: string): any {
    if (this.interpreter) {
      return this.interpreter.getVariable(name);
    }
    return undefined;
  }

  /**
   * Initialize Unity event listeners
   */
  initialize(): () => void {
    // Listen for Unity messages
    const unsubscribe = UnityMessagingBus.on("blueprint/event", (payload: any) => {
      this.onUnityEvent(payload.type, payload.data);
    });

    // Send ready signal
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("blueprint/ready", {});
    }

    return unsubscribe;
  }
}

