/**
 * SPARK Real-Time Validation Schemas (Production)
 *
 * All events, function calls, and state updates MUST validate through these schemas
 * Prevents malformed payloads, injection attacks, and data corruption
 */

import { z } from "zod";

// Session configuration schema
export const SessionConfigSchema = z.object({
  apiKey: z.string().min(20, "API key too short"),
  model: z.enum(["gpt-4.1-realtime-preview", "gpt-4o-realtime-preview"]).default("gpt-4o-realtime-preview"),
  sonnetMode: z.enum(["creative", "deterministic", "hybrid"]).default("hybrid"),
  enableTelemetry: z.boolean().default(true),
  userId: z.string().uuid("Invalid user ID").optional(),
  sessionTimeout: z.number().min(60000).max(3600000).default(600000), // 1-60 min
  maxTokens: z.number().min(100).max(100000).default(4000),
});

export type SessionConfig = z.infer<typeof SessionConfigSchema>;

// Function call schemas (per engine)
export const UnityScriptArgsSchema = z.object({
  prompt: z.string().min(10).max(10000),
  className: z.string().regex(/^[A-Z][a-zA-Z0-9_]*$/, "Invalid C# class name"),
  namespace: z.string().regex(/^[A-Za-z][A-Za-z0-9_.]*$/, "Invalid namespace").optional(),
  baseClass: z.string().default("MonoBehaviour"),
  includeComments: z.boolean().default(true),
});

export const GodotSceneArgsSchema = z.object({
  prompt: z.string().min(10).max(10000),
  sceneName: z.string().regex(/^[A-Za-z][A-Za-z0-9_]*$/, "Invalid scene name"),
  sceneType: z.enum(["Node2D", "Node3D", "Control"]).default("Node2D"),
  includeScript: z.boolean().default(true),
});

export const PICO8CartArgsSchema = z.object({
  prompt: z.string().min(10).max(10000),
  cartName: z.string().regex(/^[a-z0-9_]+$/, "Invalid cart name"),
  includeMusic: z.boolean().default(false),
  includeSprites: z.boolean().default(true),
});

export const AssetIngestArgsSchema = z.object({
  assetUrl: z.string().url("Invalid asset URL"),
  assetType: z.enum(["model", "texture", "audio", "sprite", "prefab"]),
  targetEngine: z.enum(["unity", "godot", "pico8", "unreal"]),
  decompose: z.boolean().default(true),
});

export const CodePatchArgsSchema = z.object({
  filePath: z.string().min(1).max(500),
  patchType: z.enum(["insert", "replace", "delete", "append"]),
  lineNumber: z.number().int().min(1).optional(),
  oldContent: z.string().optional(),
  newContent: z.string().max(50000),
  validate: z.boolean().default(true),
});

// Function call wrapper
export const FunctionCallSchema = z.object({
  name: z.string().min(1).max(100),
  call_id: z.string().uuid("Invalid call ID"),
  arguments: z.record(z.any()), // Validated per function
  timestamp: z.number().int().positive(),
});

export type FunctionCall = z.infer<typeof FunctionCallSchema>;

// State schemas
export const FileStateSchema = z.object({
  path: z.string().min(1).max(500),
  content: z.string().max(1000000), // 1MB limit
  version: z.number().int().min(0),
  lastModified: z.number().int().positive(),
  hash: z.string().length(64).optional(), // SHA-256
});

export const IDEStateSchema = z.object({
  openFiles: z.record(FileStateSchema),
  activeFile: z.string().nullable(),
  cursorPos: z.object({
    line: z.number().int().min(0),
    col: z.number().int().min(0),
  }),
  version: z.number().int().min(0),
});

export const PreviewStateSchema = z.object({
  unity: z.object({
    status: z.enum(["idle", "loading", "ready", "error"]),
    frame: z.any().nullable(),
    frameVersion: z.number().int().min(0).default(0),
  }),
  godot: z.object({
    status: z.enum(["idle", "loading", "ready", "error"]),
    frame: z.any().nullable(),
    frameVersion: z.number().int().min(0).default(0),
  }),
  pico8: z.object({
    status: z.enum(["idle", "loading", "ready", "error"]),
    frame: z.any().nullable(),
    frameVersion: z.number().int().min(0).default(0),
  }),
});

// Delta schemas
export const DeltaSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("delta"),
    patch: z.record(z.any()),
    version: z.number().int().min(0),
    timestamp: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("function_call"),
    functionName: z.string(),
    functionArgs: z.record(z.any()),
    callId: z.string().uuid(),
    timestamp: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("file_output"),
    fileId: z.string(),
    filePath: z.string(),
    fileSize: z.number().int().positive(),
    timestamp: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("context_update"),
    context: z.record(z.any()),
    timestamp: z.number().int().positive(),
  }),
]);

export type Delta = z.infer<typeof DeltaSchema>;

// Telemetry event schema
export const TelemetryEventSchema = z.object({
  type: z.string().min(1).max(100),
  sessionId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  timestamp: z.number().int().positive(),
  data: z.record(z.any()).optional(),
  metadata: z.object({
    environment: z.enum(["development", "staging", "production"]).optional(),
    version: z.string().optional(),
    userAgent: z.string().optional(),
  }).optional(),
});

export type TelemetryEvent = z.infer<typeof TelemetryEventSchema>;

// Rate limit schema
export const RateLimitSchema = z.object({
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
  endpoint: z.string(),
  limit: z.number().int().positive(),
  window: z.number().int().positive(), // milliseconds
  current: z.number().int().min(0),
  resetAt: z.number().int().positive(),
});

export type RateLimit = z.infer<typeof RateLimitSchema>;

// Validation helpers
export function validateFunctionArgs(name: string, args: unknown): z.infer<any> {
  const schemaMap: Record<string, z.ZodSchema> = {
    generateUnityScript: UnityScriptArgsSchema,
    generateGodotScene: GodotSceneArgsSchema,
    generatePICO8Cart: PICO8CartArgsSchema,
    ingestAsset: AssetIngestArgsSchema,
    applyCodePatch: CodePatchArgsSchema,
  };

  const schema = schemaMap[name];
  if (!schema) {
    throw new Error(`No validation schema for function: ${name}`);
  }

  return schema.parse(args);
}

// PII scrubbing for telemetry
export function scrubPII(data: Record<string, any>): Record<string, any> {
  const scrubbed = { ...data };
  const piiKeys = ["email", "password", "token", "apiKey", "secret", "phone", "ssn", "creditCard"];

  for (const key in scrubbed) {
    if (piiKeys.some(pii => key.toLowerCase().includes(pii.toLowerCase()))) {
      scrubbed[key] = "[REDACTED]";
    }

    if (typeof scrubbed[key] === "object" && scrubbed[key] !== null) {
      scrubbed[key] = scrubPII(scrubbed[key]);
    }
  }

  return scrubbed;
}
