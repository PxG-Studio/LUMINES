/**
 * UI Types
 * Core types for Unity UI Canvas Editor
 */

export interface RectSnapshot {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { x: number; y: number };
  anchorMin: { x: number; y: number };
  anchorMax: { x: number; y: number };
  pivot: { x: number; y: number };
  parent?: string;
  children?: string[];
}

export interface LayoutConfig {
  type: "Horizontal" | "Vertical" | "Grid" | "None";
  spacing?: number;
  spacingX?: number;
  spacingY?: number;
  padding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  childAlignment?: string;
  cellSize?: { x: number; y: number };
}

export interface UIStyle {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontFamily?: string;
  image?: string;
  borderWidth?: number;
  borderColor?: string;
}

export interface AnchorPreset {
  name: string;
  anchorMin: { x: number; y: number };
  anchorMax: { x: number; y: number };
  pivot: { x: number; y: number };
  offsetMin?: { x: number; y: number };
  offsetMax?: { x: number; y: number };
}

export interface PreviewResolution {
  width: number;
  height: number;
  name: string;
  aspectRatio: string;
}

