/**
 * Timeline Recorder + Replay System
 * Records all events for replay, debugging, and test automation
 */

import { create } from "zustand";
import { WSPMessage } from "./WSP";

export interface TimelineFrame {
  id: string;
  type: string;
  timestamp: number;
  payload: any;
  origin?: string;
}

interface TimelineState {
  frames: TimelineFrame[];
  isRecording: boolean;
  isReplaying: boolean;
  replaySpeed: number;
  currentFrame: number;

  // Actions
  addFrame: (frame: Omit<TimelineFrame, "id">) => void;
  startRecording: () => void;
  stopRecording: () => void;
  clearFrames: () => void;
  startReplay: () => void;
  stopReplay: () => void;
  setReplaySpeed: (speed: number) => void;
  seekToFrame: (frameIndex: number) => void;
  exportTimeline: () => string;
  importTimeline: (json: string) => void;
}

/**
 * Timeline Recorder Store
 */
export const useTimeline = create<TimelineState>((set, get) => ({
  frames: [],
  isRecording: false,
  isReplaying: false,
  replaySpeed: 1.0,
  currentFrame: 0,

  addFrame: (frame) => {
    if (!get().isRecording) return;

    const newFrame: TimelineFrame = {
      ...frame,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    set((state) => ({
      frames: [...state.frames, newFrame]
    }));
  },

  startRecording: () => {
    set({ isRecording: true, frames: [] });
    console.log("[Timeline] Recording started");
  },

  stopRecording: () => {
    set({ isRecording: false });
    console.log(`[Timeline] Recording stopped (${get().frames.length} frames)`);
  },

  clearFrames: () => {
    set({ frames: [], currentFrame: 0 });
  },

  startReplay: () => {
    const frames = get().frames;
    if (frames.length === 0) {
      console.warn("[Timeline] No frames to replay");
      return;
    }

    set({ isReplaying: true, currentFrame: 0 });
    replayFrames(frames, 0, get().replaySpeed);
  },

  stopReplay: () => {
    set({ isReplaying: false, currentFrame: 0 });
  },

  setReplaySpeed: (speed: number) => {
    set({ replaySpeed: Math.max(0.1, Math.min(10, speed)) });
  },

  seekToFrame: (frameIndex: number) => {
    const frames = get().frames;
    if (frameIndex < 0 || frameIndex >= frames.length) return;

    set({ currentFrame: frameIndex });
    
    // Apply all frames up to this point
    for (let i = 0; i <= frameIndex; i++) {
      applyFrame(frames[i]);
    }
  },

  exportTimeline: () => {
    const timeline = {
      frames: get().frames,
      exportedAt: new Date().toISOString(),
      version: "1.0"
    };
    return JSON.stringify(timeline, null, 2);
  },

  importTimeline: (json: string) => {
    try {
      const timeline = JSON.parse(json);
      if (timeline.frames && Array.isArray(timeline.frames)) {
        set({ frames: timeline.frames });
        console.log(`[Timeline] Imported ${timeline.frames.length} frames`);
      }
    } catch (err: any) {
      console.error("[Timeline] Error importing timeline:", err);
      throw err;
    }
  }
}));

/**
 * Apply a timeline frame (replay action)
 */
function applyFrame(frame: TimelineFrame): void {
  // Dispatch event for systems to handle
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("wissil-timeline-frame", {
        detail: frame
      })
    );
  }

  // Forward to Unity if it's a Unity-related frame
  if (frame.type.startsWith("sync/") || frame.type.startsWith("event/")) {
    import("../runtime/unityBridge/UnityMessagingBus").then(({ UnityMessagingBus }) => {
      if (UnityMessagingBus.isConnected()) {
        UnityMessagingBus.send(frame.type as any, frame.payload);
      }
    }).catch(() => {
      // UnityMessagingBus not available
    });
  }
}

/**
 * Replay frames with timing
 */
let replayTimeout: any = null;

function replayFrames(frames: TimelineFrame[], startIndex: number, speed: number): void {
  if (startIndex >= frames.length) {
    useTimeline.getState().stopReplay();
    return;
  }

  const frame = frames[startIndex];
  applyFrame(frame);

  useTimeline.setState({ currentFrame: startIndex });

  // Calculate delay to next frame
  const nextFrame = frames[startIndex + 1];
  if (nextFrame) {
    const delay = (nextFrame.timestamp - frame.timestamp) / speed;
    replayTimeout = setTimeout(() => {
      replayFrames(frames, startIndex + 1, speed);
    }, Math.max(0, delay));
  } else {
    useTimeline.getState().stopReplay();
  }
}

/**
 * Initialize timeline recorder
 * Automatically records all multiplayer messages
 */
export function initializeTimelineRecorder(): () => void {
  // Start recording by default
  useTimeline.getState().startRecording();

  // Listen for all multiplayer messages and record them
  const messageHandler = (e: CustomEvent<WSPMessage>) => {
    const message = e.detail;

    useTimeline.getState().addFrame({
      type: message.type,
      timestamp: message.timestamp || Date.now(),
      payload: message.payload,
      origin: message.origin
    });
  };

  if (typeof window !== "undefined") {
    window.addEventListener("wissil-mp", messageHandler as EventListener);

    return () => {
      window.removeEventListener("wissil-mp", messageHandler as EventListener);
      if (replayTimeout) {
        clearTimeout(replayTimeout);
      }
    };
  }

  return () => {
    if (replayTimeout) {
      clearTimeout(replayTimeout);
    }
  };
}

