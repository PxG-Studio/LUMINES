/**
 * Audio Types
 * Core types for Unity audio mixer system
 */

export interface AudioGroupSnapshot {
  id: string;
  name: string;
  volume: number; // dB
  pitch: number;
  effects?: AudioEffect[];
  sends?: AudioSend[];
}

export interface AudioEffect {
  type: "Reverb" | "LowPass" | "HighPass" | "Echo" | "Distortion" | "Chorus" | "Compressor";
  enabled: boolean;
  parameters: Record<string, number>;
}

export interface AudioSend {
  targetGroup: string;
  level: number; // 0-1
}

export interface SpatialAudioSettings {
  minDistance: number;
  maxDistance: number;
  spread: number;
  dopplerLevel: number;
  rolloffMode: "Linear" | "Logarithmic" | "Custom";
  spatialBlend: number; // 0 (2D) to 1 (3D)
}

export interface MixerPreset {
  name: string;
  groups: Record<string, AudioGroupSnapshot>;
  effects: Record<string, AudioEffect[]>;
  spatial: SpatialAudioSettings | null;
  timestamp: number;
}

