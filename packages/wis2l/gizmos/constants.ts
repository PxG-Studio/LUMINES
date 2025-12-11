/**
 * Gizmo Constants
 * Configuration values for gizmo rendering and interaction
 */

export const GIZMO_SIZE = 50; // Screen pixels
export const GIZMO_HANDLE_SIZE = 8; // Screen pixels
export const GIZMO_LINE_WIDTH = 2;
export const GIZMO_COLORS = {
  x: "#ff0000", // Red
  y: "#00ff00", // Green
  z: "#0000ff", // Blue
  selected: "#ffff00", // Yellow
  center: "#ffffff" // White
};

export const GIZMO_SENSITIVITY = 0.01; // Movement sensitivity
export const GIZMO_ROTATION_SENSITIVITY = 0.5; // Rotation sensitivity in degrees
export const GIZMO_SCALE_SENSITIVITY = 0.01; // Scale sensitivity

export const GRID_SIZE = 0.25; // Unity units
export const ANGLE_SNAP = 15; // Degrees
export const SCALE_SNAP = 0.25; // Unity units

