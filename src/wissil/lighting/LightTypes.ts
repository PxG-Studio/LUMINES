/**
 * Lighting Types
 * Core types for Unity lighting system
 */

export interface LightSnapshot {
  id: string;
  name: string;
  type: "Directional" | "Point" | "Spot" | "Area";
  color: { r: number; g: number; b: number; a: number };
  intensity: number;
  range?: number;
  spotAngle?: number;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  shadows: "None" | "Hard" | "Soft";
  shadowStrength: number;
}

export interface AmbientSettings {
  ambientIntensity: number;
  ambientColor: { r: number; g: number; b: number };
  ambientMode: string;
}

export interface SkyboxSettings {
  tint: { r: number; g: number; b: number };
  exposure: number;
  rotation: number;
}

export interface ShadowSettings {
  shadowDistance: number;
  shadowResolution: string;
  shadowCascades: number;
  shadowBias: number;
  shadowNormalBias: number;
}

export interface GISettings {
  realtimeGI: boolean;
  bakedGI: boolean;
}

export interface ToneMappingSettings {
  mode: "ACES" | "Neutral" | "Reinhard" | "None";
  exposure: number;
}

