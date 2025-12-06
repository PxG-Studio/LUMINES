/**
 * Build Profiles
 * Dev, Staging, Production configurations
 */

export interface BuildProfile {
  id: string;
  label: string;
  defines: string[];
  debugSymbols: boolean;
  compression: "LZ4" | "LZ4HC" | "None";
  optimization?: "Speed" | "Size" | "None";
  stripEngineCode?: boolean;
  development?: boolean;
}

export const BUILD_PROFILES: Record<string, BuildProfile> = {
  development: {
    id: "development",
    label: "Development",
    defines: ["DEV", "UNITY_EDITOR"],
    debugSymbols: true,
    compression: "LZ4",
    optimization: "None",
    stripEngineCode: false,
    development: true
  },
  staging: {
    id: "staging",
    label: "Staging",
    defines: ["STAGING"],
    debugSymbols: false,
    compression: "LZ4HC",
    optimization: "Size",
    stripEngineCode: false,
    development: false
  },
  production: {
    id: "production",
    label: "Production",
    defines: ["PROD", "RELEASE"],
    debugSymbols: false,
    compression: "None",
    optimization: "Speed",
    stripEngineCode: true,
    development: false
  }
};

export function getBuildProfile(id: string): BuildProfile | undefined {
  return BUILD_PROFILES[id];
}

export function getAllBuildProfiles(): BuildProfile[] {
  return Object.values(BUILD_PROFILES);
}

