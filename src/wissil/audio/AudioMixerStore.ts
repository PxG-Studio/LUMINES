/**
 * Audio Mixer Store
 * Zustand database for Unity audio mixer state
 */

import { create } from "zustand";
import { AudioGroupSnapshot, MixerPreset, SpatialAudioSettings } from "./AudioTypes";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

interface AudioMixerStoreState {
  groups: Record<string, AudioGroupSnapshot>;
  selected: string | null;
  spatial: SpatialAudioSettings | null;
  presets: Record<string, MixerPreset>;

  // Actions
  registerGroups: (groups: AudioGroupSnapshot[]) => void;
  updateGroup: (id: string, updates: Partial<AudioGroupSnapshot>) => void;
  select: (id: string | null) => void;
  setSpatial: (settings: SpatialAudioSettings) => void;
  savePreset: (name: string, preset: MixerPreset) => void;
  loadPreset: (name: string) => void;
  clear: () => void;
  getGroup: (id: string) => AudioGroupSnapshot | undefined;
}

/**
 * Audio Mixer Store
 * Global state for Unity audio mixer
 */
export const useAudioMixerStore = create<AudioMixerStoreState>((set, get) => ({
  groups: {},
  selected: null,
  spatial: null,
  presets: {},

  registerGroups: (groupList: AudioGroupSnapshot[]) => {
    set((state) => {
      const groups: Record<string, AudioGroupSnapshot> = {};
      groupList.forEach((group) => {
        groups[group.id] = {
          ...state.groups[group.id], // Preserve existing state
          ...group
        };
      });
      return { groups };
    });
  },

  updateGroup: (id: string, updates: Partial<AudioGroupSnapshot>) => {
    set((state) => {
      const group = state.groups[id];
      if (!group) return state;

      return {
        groups: {
          ...state.groups,
          [id]: {
            ...group,
            ...updates
          }
        }
      };
    });
  },

  select: (id: string | null) => {
    set({ selected: id });
  },

  setSpatial: (settings: SpatialAudioSettings) => {
    set({ spatial: settings });
  },

  savePreset: (name: string, preset: MixerPreset) => {
    set((state) => ({
      presets: {
        ...state.presets,
        [name]: preset
      }
    }));
  },

  loadPreset: (name: string) => {
    const preset = get().presets[name];
    if (!preset) return;

    set({
      groups: preset.groups,
      spatial: preset.spatial || null
    });
  },

  clear: () => {
    set({
      groups: {},
      selected: null,
      spatial: null
    });
  },

  getGroup: (id: string) => {
    return get().groups[id];
  }
}));

/**
 * Initialize Audio Sync
 * Listens for Unity audio mixer updates
 */
export function initializeAudioSync(): () => void {
  // Listen for Unity audio mixer snapshots
  UnityMessagingBus.on("audio/snapshot", (payload: any) => {
    try {
      const groups = Array.isArray(payload) ? payload : payload.groups || [];
      const audioGroups: AudioGroupSnapshot[] = groups.map((g: any) => ({
        id: String(g.id || g.groupId),
        name: g.name || "Unnamed Group",
        volume: g.volume !== undefined ? g.volume : 0,
        pitch: g.pitch !== undefined ? g.pitch : 1,
        effects: g.effects || [],
        sends: g.sends || []
      }));

      useAudioMixerStore.getState().registerGroups(audioGroups);
    } catch (err: any) {
      console.error("[AudioSync] Error processing audio snapshot:", err);
    }
  });

  // Listen for spatial audio settings
  UnityMessagingBus.on("audio/spatial", (payload: any) => {
    try {
      const spatial: SpatialAudioSettings = {
        minDistance: payload.minDistance || 1,
        maxDistance: payload.maxDistance || 500,
        spread: payload.spread || 0,
        dopplerLevel: payload.dopplerLevel || 1,
        rolloffMode: payload.rolloffMode || "Logarithmic",
        spatialBlend: payload.spatialBlend !== undefined ? payload.spatialBlend : 1
      };
      useAudioMixerStore.getState().setSpatial(spatial);
    } catch (err: any) {
      console.error("[AudioSync] Error processing spatial settings:", err);
    }
  });

  return () => {};
}

