/**
 * Light Store
 * Zustand database for Unity lighting state
 */

import { create } from "zustand";
import { LightSnapshot, AmbientSettings, SkyboxSettings, ShadowSettings, GISettings, ToneMappingSettings } from "./LightTypes";
import { UnityMessagingBus } from "../runtime/unityBridge/UnityMessagingBus";

interface LightStoreState {
  lights: Record<string, LightSnapshot>;
  selected: string | null;
  ambient: AmbientSettings | null;
  skybox: SkyboxSettings | null;
  shadows: ShadowSettings | null;
  gi: GISettings | null;
  toneMapping: ToneMappingSettings | null;

  // Actions
  registerLights: (snaps: LightSnapshot[]) => void;
  updateLight: (id: string, updates: Partial<LightSnapshot>) => void;
  select: (id: string | null) => void;
  setAmbient: (settings: AmbientSettings) => void;
  setSkybox: (settings: SkyboxSettings) => void;
  setShadows: (settings: ShadowSettings) => void;
  setGI: (settings: GISettings) => void;
  setToneMapping: (settings: ToneMappingSettings) => void;
  clear: () => void;
  getLight: (id: string) => LightSnapshot | undefined;
}

/**
 * Light Store
 * Global state for Unity lighting
 */
export const useLightStore = create<LightStoreState>((set, get) => ({
  lights: {},
  selected: null,
  ambient: null,
  skybox: null,
  shadows: null,
  gi: null,
  toneMapping: null,

  registerLights: (snaps: LightSnapshot[]) => {
    set((state) => {
      const lights: Record<string, LightSnapshot> = {};
      snaps.forEach((light) => {
        lights[light.id] = {
          ...state.lights[light.id], // Preserve existing state
          ...light
        };
      });
      return { lights };
    });
  },

  updateLight: (id: string, updates: Partial<LightSnapshot>) => {
    set((state) => {
      const light = state.lights[id];
      if (!light) return state;

      return {
        lights: {
          ...state.lights,
          [id]: {
            ...light,
            ...updates
          }
        }
      };
    });
  },

  select: (id: string | null) => {
    set({ selected: id });
  },

  setAmbient: (settings: AmbientSettings) => {
    set({ ambient: settings });
  },

  setSkybox: (settings: SkyboxSettings) => {
    set({ skybox: settings });
  },

  setShadows: (settings: ShadowSettings) => {
    set({ shadows: settings });
  },

  setGI: (settings: GISettings) => {
    set({ gi: settings });
  },

  setToneMapping: (settings: ToneMappingSettings) => {
    set({ toneMapping: settings });
  },

  clear: () => {
    set({
      lights: {},
      selected: null,
      ambient: null,
      skybox: null,
      shadows: null,
      gi: null,
      toneMapping: null
    });
  },

  getLight: (id: string) => {
    return get().lights[id];
  }
}));

/**
 * Initialize Light Sync
 * Listens for Unity lighting updates
 */
export function initializeLightSync(): () => void {
  // Listen for Unity light snapshots
  UnityMessagingBus.on("lighting/snapshot", (payload: any) => {
    try {
      const lights = Array.isArray(payload) ? payload : payload.lights || [];
      const lightSnapshots: LightSnapshot[] = lights.map((l: any) => ({
        id: String(l.id || l.objectId),
        name: l.name || "Unnamed Light",
        type: l.type || "Directional",
        color: l.color || { r: 1, g: 1, b: 1, a: 1 },
        intensity: l.intensity || 1,
        range: l.range,
        spotAngle: l.spotAngle,
        position: l.position || { x: 0, y: 0, z: 0 },
        rotation: l.rotation || { x: 0, y: 0, z: 0 },
        shadows: l.shadows || "None",
        shadowStrength: l.shadowStrength || 1
      }));

      useLightStore.getState().registerLights(lightSnapshots);
    } catch (err: any) {
      console.error("[LightSync] Error processing light snapshot:", err);
    }
  });

  // Listen for ambient settings
  UnityMessagingBus.on("lighting/ambient", (payload: any) => {
    try {
      const ambient: AmbientSettings = {
        ambientIntensity: payload.ambientIntensity || 1,
        ambientColor: payload.ambientColor || { r: 0.5, g: 0.5, b: 0.5 },
        ambientMode: payload.ambientMode || "Skybox"
      };
      useLightStore.getState().setAmbient(ambient);
    } catch (err: any) {
      console.error("[LightSync] Error processing ambient settings:", err);
    }
  });

  // Listen for skybox settings
  UnityMessagingBus.on("lighting/skybox", (payload: any) => {
    try {
      const skybox: SkyboxSettings = {
        tint: payload.tint || { r: 1, g: 1, b: 1 },
        exposure: payload.exposure || 1,
        rotation: payload.rotation || 0
      };
      useLightStore.getState().setSkybox(skybox);
    } catch (err: any) {
      console.error("[LightSync] Error processing skybox settings:", err);
    }
  });

  // Listen for shadow settings
  UnityMessagingBus.on("lighting/shadows", (payload: any) => {
    try {
      const shadows: ShadowSettings = {
        shadowDistance: payload.shadowDistance || 50,
        shadowResolution: payload.shadowResolution || "High",
        shadowCascades: payload.shadowCascades || 2,
        shadowBias: payload.shadowBias || 0.05,
        shadowNormalBias: payload.shadowNormalBias || 0.4
      };
      useLightStore.getState().setShadows(shadows);
    } catch (err: any) {
      console.error("[LightSync] Error processing shadow settings:", err);
    }
  });

  return () => {};
}

