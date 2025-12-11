/**
 * Snapping System
 * Grid, angle, and increment snapping for transforms
 */

export interface SnappingConfig {
  grid: number;
  angle: number;
  scale: number;
  enabled: boolean;
}

/**
 * Snapping System
 * Provides snapping functionality for transforms
 */
export class Snapping {
  private static config: SnappingConfig = {
    grid: 0.25,
    angle: 15,
    scale: 0.25,
    enabled: true
  };

  /**
   * Set snapping configuration
   */
  static setConfig(config: Partial<SnappingConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get snapping configuration
   */
  static getConfig(): SnappingConfig {
    return { ...this.config };
  }

  /**
   * Enable/disable snapping
   */
  static setEnabled(enabled: boolean): void {
    this.config.enabled = enabled;
  }

  /**
   * Snap vector to grid
   */
  static snapVector(v: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    if (!this.config.enabled || this.config.grid <= 0) {
      return v;
    }

    return {
      x: Math.round(v.x / this.config.grid) * this.config.grid,
      y: Math.round(v.y / this.config.grid) * this.config.grid,
      z: Math.round(v.z / this.config.grid) * this.config.grid
    };
  }

  /**
   * Snap rotation to angle increments
   */
  static snapAngle(angle: number): number {
    if (!this.config.enabled || this.config.angle <= 0) {
      return angle;
    }

    return Math.round(angle / this.config.angle) * this.config.angle;
  }

  /**
   * Snap rotation vector
   */
  static snapRotation(rot: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    if (!this.config.enabled || this.config.angle <= 0) {
      return rot;
    }

    return {
      x: this.snapAngle(rot.x),
      y: this.snapAngle(rot.y),
      z: this.snapAngle(rot.z)
    };
  }

  /**
   * Snap scale to increments
   */
  static snapScale(scale: number): number {
    if (!this.config.enabled || this.config.scale <= 0) {
      return scale;
    }

    return Math.round(scale / this.config.scale) * this.config.scale;
  }

  /**
   * Snap scale vector
   */
  static snapScaleVector(scale: { x: number; y: number; z: number }): { x: number; y: number; z: number } {
    if (!this.config.enabled || this.config.scale <= 0) {
      return scale;
    }

    return {
      x: this.snapScale(scale.x),
      y: this.snapScale(scale.y),
      z: this.snapScale(scale.z)
    };
  }
}

