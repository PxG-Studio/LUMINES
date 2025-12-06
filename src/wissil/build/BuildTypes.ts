/**
 * Build Types
 * Core types for build and deployment system
 */

export interface BuildOptions {
  target: string;
  profile: string;
  outputPath?: string;
  scenes?: string[];
  options?: Record<string, any>;
}

export interface BuildResult {
  success: boolean;
  outputPath: string;
  buildTime: number;
  size: number;
  version: string;
  target: string;
  profile: string;
  artifacts?: BuildArtifact[];
  error?: string;
}

export interface BuildArtifact {
  name: string;
  path: string;
  size: number;
  type: string;
  url?: string;
}

export interface BuildLog {
  level: "info" | "warning" | "error";
  message: string;
  timestamp: number;
  source?: string;
}

export interface PreflightIssue {
  type: "error" | "warning" | "info";
  message: string;
  fix?: string;
  severity: "low" | "medium" | "high";
}

export interface DeploymentConfig {
  provider: string;
  endpoint?: string;
  bucket?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  [key: string]: any;
}

export interface ReleaseInfo {
  version: string;
  target: string;
  profile: string;
  buildTime: number;
  changelog?: string;
  deployedAt?: number;
  deploymentUrl?: string;
}

