/**
 * Multiplayer Transport Layer
 * WebRTC (peer-to-peer) + WebSocket (fallback/relay)
 * Handles message routing between multiple WISSIL clients
 */

import { create } from "zustand";
import { WSPMessage, WSPMessageType, createWSPMessage } from "./WSP";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

interface Peer {
  id: string;
  connection: RTCPeerConnection | WebSocket;
  type: "webrtc" | "websocket";
  send: (data: string) => void;
  close: () => void;
}

interface TransportState {
  peers: Record<string, Peer>;
  socket: WebSocket | null;
  isConnected: boolean;
  connectionType: "webrtc" | "websocket" | "none";
  sessionId: string | null;
  localId: string;

  // Actions
  initWebSocket: (url: string) => void;
  addPeer: (id: string, peer: Peer) => void;
  removePeer: (id: string) => void;
  sendToAll: (message: WSPMessage) => void;
  sendToPeer: (peerId: string, message: WSPMessage) => void;
  broadcast: (type: WSPMessageType, payload: any) => void;
  disconnect: () => void;
}

/**
 * Multiplayer Transport Store
 */
export const useTransport = create<TransportState>((set, get) => ({
  peers: {},
  socket: null,
  isConnected: false,
  connectionType: "none",
  sessionId: null,
  localId: typeof window !== "undefined" ? localStorage.getItem("wissil-client-id") || `client-${Date.now()}` : `client-${Date.now()}`,

  initWebSocket: (url: string) => {
    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("[Transport] WebSocket connected");
        set({ isConnected: true, connectionType: "websocket" });

        // Send join message
        get().broadcast("peer/join", { clientId: get().localId });

        // Forward Unity messages to all peers
        setupUnityMessageForwarding();
      };

      ws.onmessage = (ev) => {
        try {
          const message: WSPMessage = JSON.parse(ev.data);
          handleIncomingMessage(message);
        } catch (err) {
          console.error("[Transport] Error parsing message:", err);
        }
      };

      ws.onerror = (err) => {
        console.error("[Transport] WebSocket error:", err);
        set({ isConnected: false });
      };

      ws.onclose = () => {
        console.log("[Transport] WebSocket disconnected");
        set({ isConnected: false, connectionType: "none" });
      };

      set({ socket: ws });
    } catch (err: any) {
      console.error("[Transport] Failed to initialize WebSocket:", err);
    }
  },

  addPeer: (id: string, peer: Peer) => {
    set((state) => ({
      peers: { ...state.peers, [id]: peer },
      connectionType: peer.type
    }));

    // Send join message
    get().broadcast("peer/join", { clientId: get().localId });
  },

  removePeer: (id: string) => {
    set((state) => {
      const peers = { ...state.peers };
      delete peers[id];
      return { peers };
    });

    // Send leave message
    get().broadcast("peer/leave", { clientId: id });
  },

  sendToAll: (message: WSPMessage) => {
    const state = get();

    // Add origin if not present
    if (!message.origin) {
      message.origin = state.localId;
    }
    if (!message.timestamp) {
      message.timestamp = Date.now();
    }

    const payload = JSON.stringify(message);

    // Send via WebSocket
    if (state.socket && state.socket.readyState === WebSocket.OPEN) {
      state.socket.send(payload);
    }

    // Send via WebRTC peers
    for (const peer of Object.values(state.peers)) {
      try {
        peer.send(payload);
      } catch (err) {
        console.error(`[Transport] Error sending to peer ${peer.id}:`, err);
      }
    }
  },

  sendToPeer: (peerId: string, message: WSPMessage) => {
    const state = get();
    const peer = state.peers[peerId];

    if (!peer) {
      console.warn(`[Transport] Peer not found: ${peerId}`);
      return;
    }

    try {
      const payload = JSON.stringify(message);
      peer.send(payload);
    } catch (err) {
      console.error(`[Transport] Error sending to peer ${peerId}:`, err);
    }
  },

  broadcast: (type: WSPMessageType, payload: any) => {
    const message = createWSPMessage(type, payload);
    get().sendToAll(message);
  },

  disconnect: () => {
    const state = get();

    // Close WebSocket
    if (state.socket) {
      state.socket.close();
    }

    // Close all peer connections
    for (const peer of Object.values(state.peers)) {
      try {
        peer.close();
      } catch (err) {
        console.error(`[Transport] Error closing peer ${peer.id}:`, err);
      }
    }

    set({
      peers: {},
      socket: null,
      isConnected: false,
      connectionType: "none"
    });
  }
}));

/**
 * Handle incoming messages from peers
 */
function handleIncomingMessage(message: WSPMessage): void {
  // Dispatch custom event for other systems to listen
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("wissil-mp", {
        detail: message
      })
    );
  }

  // Forward Unity-specific messages to Unity
  if (message.type.startsWith("sync/") || message.type.startsWith("event/")) {
    UnityMessagingBus.send(message.type, message.payload);
  }
}

/**
 * Set up Unity message forwarding
 * When Unity sends messages, forward to all peers
 */
function setupUnityMessageForwarding(): void {
  // Listen to Unity messages and broadcast to peers
  UnityMessagingBus.on("*", (payload, message) => {
    const transport = useTransport.getState();
    
    if (transport.isConnected && message.type) {
      // Broadcast Unity events to all peers
      transport.broadcast("event/capture" as any, {
        unityEvent: message.type,
        payload,
        timestamp: Date.now()
      });
    }
  });
}

/**
 * Initialize WebRTC peer connection (advanced - can be implemented later)
 */
export async function createWebRTCPeer(
  peerId: string,
  offer?: RTCSessionDescriptionInit
): Promise<RTCPeerConnection> {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
  });

  const dataChannel = pc.createDataChannel("wissil", {
    ordered: true
  });

  dataChannel.onopen = () => {
    console.log(`[Transport] WebRTC data channel open with ${peerId}`);
  };

  dataChannel.onmessage = (ev) => {
    try {
      const message: WSPMessage = JSON.parse(ev.data);
      handleIncomingMessage(message);
    } catch (err) {
      console.error("[Transport] Error parsing WebRTC message:", err);
    }
  };

  useTransport.getState().addPeer(peerId, {
    id: peerId,
    connection: pc,
    type: "webrtc",
    send: (data: string) => {
      if (dataChannel.readyState === "open") {
        dataChannel.send(data);
      }
    },
    close: () => {
      dataChannel.close();
      pc.close();
    }
  });

  return pc;
}

