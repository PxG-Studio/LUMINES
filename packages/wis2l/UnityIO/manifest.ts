/**
 * Unity Bundle Manifest
 * Metadata for Unity hybrid bundles and templates
 */

export interface UnityManifest {
  project: string;
  version: string;
  unity?: string;
  contains: Array<"webgl" | "scenes" | "scripts" | "assets" | "docs">;
  description?: string;
  author?: string;
  license?: string;
  entry?: string;
  previewUrl?: string;
}

/**
 * Unity Export Manifest (for WISSIL → Unity exports)
 */
export type UnityExportManifest = {
  project: string;
  version: string;
  unity: string; // Target Unity version
  contains: string[];
  generatedAt: string;
  author?: string;
  description?: string;
};

/**
 * Create a default manifest
 */
export function createManifest(overrides: Partial<UnityManifest> = {}): UnityManifest {
  return {
    project: "Untitled Project",
    version: "1.0.0",
    contains: [],
    ...overrides
  };
}

/**
 * Create Unity export manifest
 */
export function createExportManifest(
  opts: Partial<UnityExportManifest> = {}
): UnityExportManifest {
  return {
    project: opts.project ?? "WISSILExport",
    version: opts.version ?? "1.0.0",
    unity: opts.unity ?? "2022.3.x",
    contains: opts.contains ?? ["assets", "scenes"],
    generatedAt: opts.generatedAt ?? new Date().toISOString(),
    author: opts.author ?? "WISSIL",
    description: opts.description
  };
}

/**
 * Parse manifest from JSON string
 */
export function parseManifest(json: string): UnityManifest | null {
  try {
    return JSON.parse(json) as UnityManifest;
  } catch {
    return null;
  }
}

/**
 * Serialize manifest to JSON string
 */
export function serializeManifest(manifest: UnityManifest): string {
  return JSON.stringify(manifest, null, 2);
}

