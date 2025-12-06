/**
 * Unity Scene State Replication
 * Syncs Unity scene state (objects, transforms, cards, tiles) across all clients
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTransport } from "./Transport";
import { WSP, createWSPMessage, WSPMessage } from "./WSP";

export interface SceneObject {
  id: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number; w?: number };
  scale?: { x: number; y: number; z: number };
  stats?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
    [key: string]: any;
  };
  type?: string;
  active?: boolean;
}

export interface SceneSnapshot {
  objects: SceneObject[];
  timestamp: number;
  sessionId?: string;
}

/**
 * Scene State Replication Manager
 * Handles syncing Unity scene state across multiplayer clients
 */
export const SceneStateReplication = {
  /**
   * Broadcast scene state snapshot
   */
  broadcastSnapshot(snapshot: SceneSnapshot): void {
    const transport = useTransport.getState();

    if (!transport.isConnected) {
      return;
    }

    const message = createWSPMessage(WSP.SYNC_SNAPSHOT, snapshot);
    transport.sendToAll(message);
  },

  /**
   * Broadcast single object update
   */
  broadcastObject(object: SceneObject): void {
    const transport = useTransport.getState();

    if (!transport.isConnected) {
      return;
    }

    const message = createWSPMessage(WSP.SYNC_OBJECT, {
      object,
      timestamp: Date.now()
    });

    transport.sendToAll(message);
  },

  /**
   * Handle incoming scene state from peer
   */
  handleIncomingSnapshot(snapshot: SceneSnapshot): void {
    // Forward to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncSceneState", {
        objects: snapshot.objects,
        timestamp: snapshot.timestamp
      });
    }
  },

  /**
   * Handle incoming object update from peer
   */
  handleIncomingObject(object: SceneObject): void {
    // Forward to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncObject", {
        object,
        timestamp: Date.now()
      });
    }
  },

  /**
   * Initialize scene state sync listeners
   */
  initialize(): () => void {
    // Listen for Unity scene state updates
    const unsubscribe = UnityMessagingBus.on("sceneStateUpdate", (payload) => {
      SceneStateReplication.broadcastSnapshot({
        objects: payload.objects || [],
        timestamp: Date.now()
      });
    });

    // Listen for Unity object updates
    UnityMessagingBus.on("objectUpdate", (payload) => {
      if (payload.object) {
        SceneStateReplication.broadcastObject(payload.object);
      }
    });

    // Listen for incoming multiplayer messages
    const messageHandler = (e: CustomEvent<WSPMessage>) => {
      const message = e.detail;

      if (message.type === WSP.SYNC_SNAPSHOT) {
        SceneStateReplication.handleIncomingSnapshot(message.payload);
      } else if (message.type === WSP.SYNC_OBJECT) {
        SceneStateReplication.handleIncomingObject(message.payload.object);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("wissil-mp", messageHandler as EventListener);

      return () => {
        unsubscribe();
        window.removeEventListener("wissil-mp", messageHandler as EventListener);
      };
    }

    return unsubscribe;
  }
};

