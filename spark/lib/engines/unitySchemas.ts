/**
 * Unity MCP Zod Schemas
 *
 * Validation for all Unity operations with strict guardrails
 */

import { z } from "zod";

const pathUnderAssets = z.string().regex(/^Assets\//, "path must be under Assets/");

export const zUnityGenerateScript = z.object({
  name: z.string().min(1).max(100),
  code: z.string().min(1).max(200_000),
  path: pathUnderAssets.optional(),
});

export const zUnityApplyPatch = z.object({
  path: pathUnderAssets,
  patch: z.string().min(1).max(200_000),
});

export const zUnityRenderPreview = z.object({
  scenePath: pathUnderAssets.optional(),
  gameObject: z.string().optional(),
  width: z.number().int().positive().max(4096).optional(),
  height: z.number().int().positive().max(4096).optional(),
});

export const zUnityIngestAsset = z.object({
  path: pathUnderAssets,
});

export const zUnityDeconstructAsset = z.object({
  path: pathUnderAssets,
});

export const zUnityRunBuild = z.object({
  target: z.string().min(1),
  development: z.boolean().optional(),
});

export const zUnityGetBuildStatus = z.object({
  jobId: z.string().uuid(),
});
