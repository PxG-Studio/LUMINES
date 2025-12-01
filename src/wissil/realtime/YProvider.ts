/**
 * Y.js Provider for Real-time Collaboration
 * 
 * Manages shared state across all IDE subsystems using Y.js and WebRTC
 */

import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

// Create Y.js document
export const doc = new Y.Doc();

// Create WebRTC provider for P2P synchronization
export const provider = new WebrtcProvider("wissil-storybook-ide", doc);

// Shared state maps
export const yGraph = doc.getMap("graph");
export const ySelection = doc.getMap("selection");
export const yInspector = doc.getMap("inspector");
export const yShader = doc.getMap("shaderGraph");
export const yTimeline = doc.getMap("timeline");
export const yLogs = doc.getArray("logs");
export const yCursors = doc.getMap("cursors");
export const yLocks = doc.getMap("locks");
export const yHistory = doc.getArray("history");
export const yAssistantQuestions = doc.getArray("assistantQuestions");
export const yAssistantResponses = doc.getArray("assistantResponses");

// User awareness for presence
export const awareness = provider.awareness;

// Set local user info
awareness.setLocalStateField("user", {
  name: localStorage.getItem("wissil:user:name") || `User ${awareness.clientID}`,
  avatar: localStorage.getItem("wissil:user:avatar") || undefined,
  color: localStorage.getItem("wissil:user:color") || `#${Math.floor(Math.random()*16777215).toString(16)}`
});

// Cleanup function
export function disconnect() {
  provider.destroy();
  doc.destroy();
}

