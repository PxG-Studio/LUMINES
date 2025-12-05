/**
 * Unity MCP Client (HTTP Transport)
 *
 * Connects to unity-mcp server running alongside Unity Editor
 * Repo: https://github.com/CoplayDev/unity-mcp
 *
 * Security: Endpoint MUST be auth-protected; never expose raw on LAN
 */

import { z } from "zod";

const UNITY_MCP_URL = process.env.UNITY_MCP_URL || "http://localhost:8080/mcp";
const UNITY_MCP_TOKEN = process.env.UNITY_MCP_TOKEN || "";

// Request timeout (30s for long Unity operations)
const TIMEOUT_MS = 30000;

// Validation schemas
const UnityGenerateScriptArgsSchema = z.object({
  name: z.string().min(1).max(200),
  code: z.string().min(1).max(500000), // 500KB max
  path: z.string().max(500).optional(),
});

const UnityApplyPatchArgsSchema = z.object({
  path: z.string().min(1).max(500),
  patch: z.string().min(1).max(100000), // 100KB max
});

const UnityRenderPreviewArgsSchema = z.object({
  scenePath: z.string().max(500).optional(),
  gameObject: z.string().max(200).optional(),
  width: z.number().int().min(320).max(1920).default(800),
  height: z.number().int().min(240).max(1080).default(600),
});

const UnityIngestAssetArgsSchema = z.object({
  path: z.string().min(1).max(500),
});

const UnityRunBuildArgsSchema = z.object({
  target: z.enum(["WebGL", "Windows", "Mac", "Linux", "Android", "iOS"]),
  development: z.boolean().default(false),
});

/**
 * Call Unity MCP HTTP endpoint
 */
async function callUnityMcp(path: string, body: any): Promise<any> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (UNITY_MCP_TOKEN) {
      headers["Authorization"] = `Bearer ${UNITY_MCP_TOKEN}`;
    }

    const res = await fetch(`${UNITY_MCP_URL}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Unity MCP error ${res.status}: ${text}`);
    }

    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Unity MCP timeout after ${TIMEOUT_MS}ms`);
    }
    throw error;
  }
}

/**
 * Generate or update Unity C# script
 */
export async function unityGenerateScript(args: {
  name: string;
  code: string;
  path?: string;
}): Promise<{ success: boolean; path: string }> {
  const validated = UnityGenerateScriptArgsSchema.parse(args);

  const targetPath = validated.path || `Assets/Scripts/${validated.name}.cs`;

  return callUnityMcp("/tools/create_or_update_file", {
    path: targetPath,
    content: validated.code,
  });
}

/**
 * Apply code patch to existing file
 */
export async function unityApplyPatch(args: {
  path: string;
  patch: string;
}): Promise<{ success: boolean; newContent: string }> {
  const validated = UnityApplyPatchArgsSchema.parse(args);

  return callUnityMcp("/tools/apply_patch", {
    path: validated.path,
    patch: validated.patch,
  });
}

/**
 * Render scene preview
 * Returns frame as data URL or signed URL
 */
export async function unityRenderPreview(args: {
  scenePath?: string;
  gameObject?: string;
  width?: number;
  height?: number;
}): Promise<{
  success: boolean;
  frameRef: string;
  format: "data-url" | "url";
}> {
  const validated = UnityRenderPreviewArgsSchema.parse(args);

  return callUnityMcp("/tools/render_scene_capture", {
    scenePath: validated.scenePath,
    gameObject: validated.gameObject,
    width: validated.width,
    height: validated.height,
  });
}

/**
 * Ingest asset (read metadata/content)
 */
export async function unityIngestAsset(args: {
  path: string;
}): Promise<{
  success: boolean;
  assetType: string;
  metadata: Record<string, any>;
  content?: any;
}> {
  const validated = UnityIngestAssetArgsSchema.parse(args);

  return callUnityMcp("/tools/read_asset", {
    path: validated.path,
  });
}

/**
 * Deconstruct asset (break down into components)
 */
export async function unityDeconstructAsset(args: {
  path: string;
}): Promise<{
  success: boolean;
  components: Array<{
    type: string;
    properties: Record<string, any>;
  }>;
  uas: Record<string, any>;
}> {
  const validated = UnityIngestAssetArgsSchema.parse(args);

  return callUnityMcp("/tools/deconstruct_asset", {
    path: validated.path,
  });
}

/**
 * Run Unity build (async - returns job ID)
 */
export async function unityRunBuild(args: {
  target: string;
  development?: boolean;
}): Promise<{
  success: boolean;
  jobId: string;
  status: "queued" | "building";
}> {
  const validated = UnityRunBuildArgsSchema.parse(args);

  return callUnityMcp("/tools/run_build", {
    target: validated.target,
    development: validated.development,
  });
}

/**
 * Check build status
 */
export async function unityGetBuildStatus(jobId: string): Promise<{
  status: "queued" | "building" | "completed" | "failed";
  progress?: number;
  error?: string;
  outputPath?: string;
}> {
  return callUnityMcp("/tools/get_build_status", { jobId });
}

/**
 * Health check Unity MCP connection
 */
export async function unityHealthCheck(): Promise<boolean> {
  try {
    await callUnityMcp("/health", {});
    return true;
  } catch (error) {
    console.error("Unity MCP health check failed:", error);
    return false;
  }
}
