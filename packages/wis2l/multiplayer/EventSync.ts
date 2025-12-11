/**
 * Event Sync System
 * Syncs gameplay events (captures, scoring, UI, card plays) across all clients
 */

import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";
import { useTransport } from "./Transport";
import { WSP, createWSPMessage, WSPMessage } from "./WSP";

export interface CaptureEvent {
  attackerId: string;
  defenderId: string;
  tileIndex?: number;
  side?: string;
  timestamp: number;
}

export interface ScoreEvent {
  playerId: string;
  score: number;
  delta: number;
  reason?: string;
  timestamp: number;
}

export interface CardPlayedEvent {
  cardId: string;
  playerId: string;
  position: { x: number; y: number; z: number };
  timestamp: number;
}

export interface TurnChangeEvent {
  currentPlayer: number;
  totalPlayers: number;
  timestamp: number;
}

/**
 * Event Sync Manager
 * Handles syncing gameplay events across multiplayer clients
 */
export const EventSync = {
  /**
   * Broadcast capture event
   */
  broadcastCapture(event: CaptureEvent): void {
    const transport = useTransport.getState();
    if (!transport.isConnected) return;

    const message = createWSPMessage(WSP.EVENT_CAPTURE, event);
    transport.sendToAll(message);
  },

  /**
   * Broadcast score event
   */
  broadcastScore(event: ScoreEvent): void {
    const transport = useTransport.getState();
    if (!transport.isConnected) return;

    const message = createWSPMessage(WSP.EVENT_SCORE, event);
    transport.sendToAll(message);
  },

  /**
   * Broadcast card played event
   */
  broadcastCardPlayed(event: CardPlayedEvent): void {
    const transport = useTransport.getState();
    if (!transport.isConnected) return;

    const message = createWSPMessage(WSP.EVENT_CARD_PLAYED, event);
    transport.sendToAll(message);
  },

  /**
   * Broadcast turn change event
   */
  broadcastTurnChange(event: TurnChangeEvent): void {
    const transport = useTransport.getState();
    if (!transport.isConnected) return;

    const message = createWSPMessage(WSP.EVENT_TURN_CHANGE, event);
    transport.sendToAll(message);
  },

  /**
   * Handle incoming capture event from peer
   */
  handleIncomingCapture(event: CaptureEvent): void {
    // Forward to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncCapture", {
        attackerId: event.attackerId,
        defenderId: event.defenderId,
        tileIndex: event.tileIndex,
        side: event.side
      });
    }
  },

  /**
   * Handle incoming score event from peer
   */
  handleIncomingScore(event: ScoreEvent): void {
    // Forward to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncScore", {
        playerId: event.playerId,
        score: event.score,
        delta: event.delta
      });
    }
  },

  /**
   * Handle incoming card played event from peer
   */
  handleIncomingCardPlayed(event: CardPlayedEvent): void {
    // Forward to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncCardPlayed", {
        cardId: event.cardId,
        playerId: event.playerId,
        position: event.position
      });
    }
  },

  /**
   * Handle incoming turn change event from peer
   */
  handleIncomingTurnChange(event: TurnChangeEvent): void {
    // Forward to Unity
    if (UnityMessagingBus.isConnected()) {
      UnityMessagingBus.send("syncTurnChange", {
        currentPlayer: event.currentPlayer,
        totalPlayers: event.totalPlayers
      });
    }
  },

  /**
   * Initialize event sync listeners
   */
  initialize(): () => void {
    // Listen for Unity gameplay events
    UnityMessagingBus.on("capture", (payload) => {
      EventSync.broadcastCapture({
        attackerId: payload.attackerId || payload.cardA,
        defenderId: payload.defenderId || payload.cardB,
        tileIndex: payload.tileIndex,
        side: payload.side,
        timestamp: Date.now()
      });
    });

    UnityMessagingBus.on("scoreUpdate", (payload) => {
      EventSync.broadcastScore({
        playerId: payload.playerId || "player1",
        score: payload.score || 0,
        delta: payload.delta || 0,
        reason: payload.reason,
        timestamp: Date.now()
      });
    });

    UnityMessagingBus.on("cardPlayed", (payload) => {
      EventSync.broadcastCardPlayed({
        cardId: payload.cardId,
        playerId: payload.playerId || "player1",
        position: payload.position || { x: 0, y: 0, z: 0 },
        timestamp: Date.now()
      });
    });

    UnityMessagingBus.on("turnChange", (payload) => {
      EventSync.broadcastTurnChange({
        currentPlayer: payload.currentPlayer || 0,
        totalPlayers: payload.totalPlayers || 2,
        timestamp: Date.now()
      });
    });

    // Listen for incoming multiplayer messages
    const messageHandler = (e: CustomEvent<WSPMessage>) => {
      const message = e.detail;

      switch (message.type) {
        case WSP.EVENT_CAPTURE:
          EventSync.handleIncomingCapture(message.payload);
          break;
        case WSP.EVENT_SCORE:
          EventSync.handleIncomingScore(message.payload);
          break;
        case WSP.EVENT_CARD_PLAYED:
          EventSync.handleIncomingCardPlayed(message.payload);
          break;
        case WSP.EVENT_TURN_CHANGE:
          EventSync.handleIncomingTurnChange(message.payload);
          break;
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("wissil-mp", messageHandler as EventListener);

      return () => {
        window.removeEventListener("wissil-mp", messageHandler as EventListener);
      };
    }

    return () => {};
  }
};

