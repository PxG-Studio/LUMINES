/**
 * Replay System
 * 
 * Records and replays collaborative editing sessions
 */

import { yHistory } from './YProvider';
import { graphSync } from './GraphSync';
import { selectionSync } from './SelectionSync';
import { inspectorSync } from './InspectorSync';

interface HistoryEntry {
  timestamp: number;
  userId: number;
  action: string;
  payload: any;
}

export class ReplaySystem {
  private isPlaying = false;
  private playbackSpeed = 1.0;
  private currentIndex = 0;
  private playbackTimer: NodeJS.Timeout | null = null;
  private onPlaybackComplete?: () => void;

  startPlayback(speed: number = 1.0, onComplete?: () => void) {
    if (this.isPlaying) {
      this.stopPlayback();
    }

    this.isPlaying = true;
    this.playbackSpeed = speed;
    this.currentIndex = 0;
    this.onPlaybackComplete = onComplete;
    this.playNext();
  }

  stopPlayback() {
    this.isPlaying = false;
    if (this.playbackTimer) {
      clearTimeout(this.playbackTimer);
      this.playbackTimer = null;
    }
  }

  private playNext() {
    if (!this.isPlaying) return;

    const history = this.getHistory();
    if (this.currentIndex >= history.length) {
      this.stopPlayback();
      if (this.onPlaybackComplete) {
        this.onPlaybackComplete();
      }
      return;
    }

    const entry = history[this.currentIndex];
    this.replayAction(entry);
    
    this.currentIndex++;
    
    const nextEntry = history[this.currentIndex];
    if (nextEntry) {
      const delay = Math.max(0, (nextEntry.timestamp - entry.timestamp) / this.playbackSpeed);
      this.playbackTimer = setTimeout(() => this.playNext(), delay);
    } else {
      this.stopPlayback();
      if (this.onPlaybackComplete) {
        this.onPlaybackComplete();
      }
    }
  }

  private replayAction(entry: HistoryEntry) {
    // Replay the action based on type
    switch (entry.action) {
      case 'node:add':
        if (entry.payload.node) {
          graphSync.addNode(entry.payload.node);
        }
        break;
      case 'node:update':
        if (entry.payload.nodeId && entry.payload.updates) {
          graphSync.updateNode(entry.payload.nodeId, entry.payload.updates);
        }
        break;
      case 'node:remove':
        if (entry.payload.nodeId) {
          graphSync.removeNode(entry.payload.nodeId);
        }
        break;
      case 'conn:add':
        if (entry.payload.conn) {
          graphSync.addConnection(entry.payload.conn);
        }
        break;
      case 'conn:remove':
        if (entry.payload.connId) {
          graphSync.removeConnection(entry.payload.connId);
        }
        break;
      case 'selection:change':
        if (entry.payload.objectId) {
          selectionSync.selectObject(entry.payload.objectId);
        }
        break;
      case 'selection:clear':
        selectionSync.clearSelection();
        break;
      case 'inspector:update':
        if (entry.payload.key && entry.payload.value !== undefined) {
          inspectorSync.updateProperty(entry.payload.key, entry.payload.value);
        }
        break;
      // Add more action types as needed
    }
  }

  getHistory(): HistoryEntry[] {
    const history: HistoryEntry[] = [];
    yHistory.forEach((entry) => {
      history.push(entry);
    });
    return history.sort((a, b) => a.timestamp - b.timestamp);
  }

  exportHistory(): string {
    return JSON.stringify(this.getHistory(), null, 2);
  }

  loadHistory(historyJson: string) {
    try {
      const history = JSON.parse(historyJson) as HistoryEntry[];
      // Clear current history and load new one
      const length = yHistory.length;
      yHistory.delete(0, length);
      history.forEach(entry => {
        yHistory.push([entry]);
      });
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  }

  isPlaying(): boolean {
    return this.isPlaying;
  }

  getProgress(): { current: number; total: number } {
    const history = this.getHistory();
    return {
      current: this.currentIndex,
      total: history.length
    };
  }
}

export const replaySystem = new ReplaySystem();

