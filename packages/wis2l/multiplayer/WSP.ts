/**
 * WISSIL Sync Protocol (WSP)
 * Protocol definitions for multiplayer sync messages
 * All messages follow the WSP format for consistent routing
 */

export type WSPMessageType =
  | "sync/state"
  | "sync/object"
  | "sync/snapshot"
  | "event/capture"
  | "event/score"
  | "event/cardPlayed"
  | "event/turnChange"
  | "input/cursor"
  | "input/select"
  | "input/hover"
  | "debug/breakpoint"
  | "debug/log"
  | "timeline/frame"
  | "timeline/start"
  | "timeline/stop"
  | "peer/join"
  | "peer/leave"
  | "peer/ping";

export interface WSPMessage {
  type: WSPMessageType;
  origin: string; // client-id
  timestamp: number;
  payload: any;
  sessionId?: string;
}

export const WSP = {
  // State sync
  SYNC_STATE: "sync/state" as const,
  SYNC_OBJECT: "sync/object" as const,
  SYNC_SNAPSHOT: "sync/snapshot" as const,

  // Game events
  EVENT_CAPTURE: "event/capture" as const,
  EVENT_SCORE: "event/score" as const,
  EVENT_CARD_PLAYED: "event/cardPlayed" as const,
  EVENT_TURN_CHANGE: "event/turnChange" as const,

  // Input sync
  INPUT_CURSOR: "input/cursor" as const,
  INPUT_SELECT: "input/select" as const,
  INPUT_HOVER: "input/hover" as const,

  // Debug events
  DEBUG_BREAKPOINT: "debug/breakpoint" as const,
  DEBUG_LOG: "debug/log" as const,

  // Timeline
  TIMELINE_FRAME: "timeline/frame" as const,
  TIMELINE_START: "timeline/start" as const,
  TIMELINE_STOP: "timeline/stop" as const,

  // Peer management
  PEER_JOIN: "peer/join" as const,
  PEER_LEAVE: "peer/leave" as const,
  PEER_PING: "peer/ping" as const
};

/**
 * Create a WSP message
 */
export function createWSPMessage(
  type: WSPMessageType,
  payload: any,
  origin?: string
): WSPMessage {
  return {
    type,
    origin: origin || getClientId(),
    timestamp: Date.now(),
    payload
  };
}

/**
 * Get or create client ID
 */
let clientId: string | null = null;

function getClientId(): string {
  if (!clientId) {
    // Generate or retrieve from storage
    clientId = localStorage.getItem("wissil-client-id") || generateClientId();
    localStorage.setItem("wissil-client-id", clientId);
  }
  return clientId;
}

function generateClientId(): string {
  return `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Set client ID (for testing or manual override)
 */
export function setClientId(id: string): void {
  clientId = id;
  localStorage.setItem("wissil-client-id", id);
}

