/**
 * Animation Store
 * Zustand database for Unity animation state
 * Stores animation clips, playback state, keyframes
 */

import { create } from "zustand";

export interface AnimationClip {
  clipName: string;
  length: number;
  frameRate: number;
  currentTime: number;
  isPlaying?: boolean;
  loop?: boolean;
  speed?: number;
}

export interface AnimationKeyframe {
  time: number;
  property: string;
  value: any;
  inTangent?: number;
  outTangent?: number;
}

export interface AnimationEvent {
  time: number;
  functionName: string;
  parameters?: any;
}

export interface AnimationSequence {
  id: string;
  name: string;
  clips: string[];
  loop?: boolean;
}

interface AnimationStoreState {
  clips: Record<string, AnimationClip>;
  selectedClip: string | null;
  isPlaying: boolean;
  currentTime: number;
  playbackSpeed: number;
  sequences: Record<string, AnimationSequence>;
  events: Record<string, AnimationEvent[]>; // clipName -> events
  keyframes: Record<string, AnimationKeyframe[]>; // clipName -> keyframes

  // Actions
  setClips: (clips: AnimationClip[]) => void;
  updateClip: (clipName: string, updates: Partial<AnimationClip>) => void;
  selectClip: (clipName: string | null) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setPlaybackSpeed: (speed: number) => void;
  addSequence: (sequence: AnimationSequence) => void;
  addEvent: (clipName: string, event: AnimationEvent) => void;
  setKeyframes: (clipName: string, keyframes: AnimationKeyframe[]) => void;
  clear: () => void;
}

/**
 * Animation Store
 * Global state for Unity animations
 */
export const useAnimationStore = create<AnimationStoreState>((set, get) => ({
  clips: {},
  selectedClip: null,
  isPlaying: false,
  currentTime: 0,
  playbackSpeed: 1.0,
  sequences: {},
  events: {},
  keyframes: {},

  setClips: (clipList: AnimationClip[]) => {
    set((state) => {
      const clips: Record<string, AnimationClip> = {};
      clipList.forEach((clip) => {
        clips[clip.clipName] = {
          ...state.clips[clip.clipName], // Preserve existing state
          ...clip
        };
      });
      return { clips };
    });
  },

  updateClip: (clipName: string, updates: Partial<AnimationClip>) => {
    set((state) => {
      const clip = state.clips[clipName];
      if (!clip) return state;

      return {
        clips: {
          ...state.clips,
          [clipName]: {
            ...clip,
            ...updates
          }
        }
      };
    });
  },

  selectClip: (clipName: string | null) => {
    set({ selectedClip: clipName });
  },

  setPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setCurrentTime: (time: number) => {
    set({ currentTime: time });
  },

  setPlaybackSpeed: (speed: number) => {
    set({ playbackSpeed: speed });
  },

  addSequence: (sequence: AnimationSequence) => {
    set((state) => ({
      sequences: {
        ...state.sequences,
        [sequence.id]: sequence
      }
    }));
  },

  addEvent: (clipName: string, event: AnimationEvent) => {
    set((state) => {
      const existingEvents = state.events[clipName] || [];
      return {
        events: {
          ...state.events,
          [clipName]: [...existingEvents, event]
        }
      };
    });
  },

  setKeyframes: (clipName: string, keyframes: AnimationKeyframe[]) => {
    set((state) => ({
      keyframes: {
        ...state.keyframes,
        [clipName]: keyframes
      }
    }));
  },

  clear: () => {
    set({
      clips: {},
      selectedClip: null,
      isPlaying: false,
      currentTime: 0,
      playbackSpeed: 1.0,
      sequences: {},
      events: {},
      keyframes: {}
    });
  }
}));

