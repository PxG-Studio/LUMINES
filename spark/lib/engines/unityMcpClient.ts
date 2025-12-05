/**
 * Unity MCP Client (HTTP Transport with Circuit Breaker)
 *
 * Connects to unity-mcp server running alongside Unity Editor
 * Repo: https://github.com/CoplayDev/unity-mcp
 *
 * Security: Endpoint MUST be auth-protected; never expose raw on LAN
 */

import { unityMcpClient } from "../services/serviceClient";
import {
  zUnityGenerateScript,
  zUnityApplyPatch,
  zUnityRenderPreview,
  zUnityIngestAsset,
  zUnityDeconstructAsset,
  zUnityRunBuild,
  zUnityGetBuildStatus,
} from "./unitySchemas";

/**
 * Generate or update Unity C# script
 */
export async function unityGenerateScript(args: {
  name: string;
  code: string;
  path?: string;
}): Promise<{ success: boolean; path: string }> {
  const validated = zUnityGenerateScript.parse(args);

  const targetPath = validated.path || `Assets/Scripts/${validated.name}.cs`;

  return unityMcpClient.call("/tools/create_or_update_file", {
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
  const validated = zUnityApplyPatch.parse(args);

  return unityMcpClient.call("/tools/apply_patch", {
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
  const validated = zUnityRenderPreview.parse(args);

  return unityMcpClient.call("/tools/render_scene_capture", {
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
  const validated = zUnityIngestAsset.parse(args);

  return unityMcpClient.call("/tools/read_asset", {
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
  const validated = zUnityDeconstructAsset.parse(args);

  return unityMcpClient.call("/tools/deconstruct_asset", {
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
  const validated = zUnityRunBuild.parse(args);

  return unityMcpClient.call("/tools/run_build", {
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
  const validated = zUnityGetBuildStatus.parse({ jobId });
  return unityMcpClient.call("/tools/get_build_status", { jobId: validated.jobId });
}

/**
 * Health check Unity MCP connection
 */
export async function unityHealthCheck(): Promise<boolean> {
  try {
    await unityMcpClient.call("/health", {});
    return true;
  } catch (error) {
    console.error("Unity MCP health check failed:", error);
    return false;
  }
}
