/**
 * Unity MCP Adapter for SparkBridge
 *
 * Registers Unity handlers that route to unity-mcp server
 * Publishes events to NATS for real-time UI updates
 */

import { SparkBridge } from "../realtime/SparkBridge";
import {
  unityGenerateScript,
  unityApplyPatch,
  unityRenderPreview,
  unityIngestAsset,
  unityDeconstructAsset,
  unityRunBuild,
  unityGetBuildStatus,
} from "./unityMcpClient";
import { publish } from "../../../src/lib/messaging/client";
import { query } from "../database/postgres-client";

/**
 * Register Unity handlers on SparkBridge
 */
export function registerUnityHandlers(bridge: SparkBridge, sessionId: string) {
  /**
   * Generate Unity C# script
   */
  bridge.register("generateUnityScript", async (args) => {
    if (!args?.code || !args?.name) {
      throw new Error("Missing code or name");
    }

    // Call Unity MCP
    const result = await unityGenerateScript({
      name: args.name,
      code: args.code,
      path: args.path,
    });

    // Store in PostgreSQL
    await query(
      `INSERT INTO spark_generated_scripts (session_id, script_name, script_content, prompt, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [sessionId, args.name, args.code, args.prompt || ""]
    );

    // Publish event
    await publish(`spark.runtime.unity.script_generated.${sessionId}`, {
      type: "script_generated",
      sessionId,
      scriptName: args.name,
      path: result.path,
      timestamp: Date.now(),
    });

    return result;
  });

  /**
   * Apply code patch
   */
  bridge.register("applyCodePatch", async (args) => {
    if (!args?.path || !args?.patch) {
      throw new Error("Missing path or patch");
    }

    const result = await unityApplyPatch({
      path: args.path,
      patch: args.patch,
    });

    // Publish event
    await publish(`spark.runtime.unity.patch_applied.${sessionId}`, {
      type: "patch_applied",
      sessionId,
      path: args.path,
      timestamp: Date.now(),
    });

    return result;
  });

  /**
   * Render preview
   */
  bridge.register("renderPreview", async (args) => {
    // Publish progress
    await publish(`spark.preview.unity.started.${sessionId}`, {
      type: "preview_started",
      sessionId,
      timestamp: Date.now(),
    });

    const result = await unityRenderPreview({
      scenePath: args.scenePath,
      gameObject: args.gameObject,
      width: args.width,
      height: args.height,
    });

    // Store preview
    await query(
      `INSERT INTO spark_previews (session_id, engine, status, frame_ref, ts)
       VALUES ($1, 'unity', 'ready', $2, NOW())`,
      [sessionId, result.frameRef]
    );

    // Publish frame
    await publish(`spark.preview.unity.frame.${sessionId}`, {
      type: "preview_frame",
      sessionId,
      frameRef: result.frameRef,
      format: result.format,
      timestamp: Date.now(),
    });

    return result;
  });

  /**
   * Ingest asset
   */
  bridge.register("ingestAsset", async (args) => {
    if (!args?.path) {
      throw new Error("Missing path");
    }

    const result = await unityIngestAsset({ path: args.path });

    // Publish event
    await publish(`spark.runtime.unity.asset_ingested.${sessionId}`, {
      type: "asset_ingested",
      sessionId,
      path: args.path,
      assetType: result.assetType,
      timestamp: Date.now(),
    });

    return result;
  });

  /**
   * Deconstruct asset
   */
  bridge.register("deconstructAsset", async (args) => {
    if (!args?.path) {
      throw new Error("Missing path");
    }

    const result = await unityDeconstructAsset({ path: args.path });

    // Publish event
    await publish(`spark.runtime.unity.asset_deconstructed.${sessionId}`, {
      type: "asset_deconstructed",
      sessionId,
      path: args.path,
      componentCount: result.components.length,
      timestamp: Date.now(),
    });

    return result;
  });

  /**
   * Run build
   */
  bridge.register("runBuild", async (args) => {
    if (!args?.target) {
      throw new Error("Missing target");
    }

    const result = await unityRunBuild({
      target: args.target,
      development: args.development,
    });

    // Store build job
    await query(
      `INSERT INTO spark_build_jobs (id, session_id, build_target, status, created_at)
       VALUES ($1, $2, $3, $4, NOW())`,
      [result.jobId, sessionId, args.target, result.status]
    );

    // Publish event
    await publish(`spark.build.unity.started.${sessionId}`, {
      type: "build_started",
      sessionId,
      jobId: result.jobId,
      target: args.target,
      timestamp: Date.now(),
    });

    // Start polling build status (async)
    pollBuildStatus(result.jobId, sessionId).catch((error) => {
      console.error("Build status polling error:", error);
    });

    return result;
  });

  /**
   * Get build status
   */
  bridge.register("getBuildStatus", async (args) => {
    if (!args?.jobId) {
      throw new Error("Missing jobId");
    }

    return unityGetBuildStatus(args.jobId);
  });
}

/**
 * Poll build status and publish events
 */
async function pollBuildStatus(jobId: string, sessionId: string): Promise<void> {
  const maxAttempts = 600; // 5 minutes at 500ms interval
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const status = await unityGetBuildStatus(jobId);

      // Update database
      await query(
        `UPDATE spark_build_jobs
         SET status = $1, updated_at = NOW()
         WHERE id = $2`,
        [status.status, jobId]
      );

      // Publish progress
      await publish(`spark.build.unity.progress.${sessionId}`, {
        type: "build_progress",
        sessionId,
        jobId,
        status: status.status,
        progress: status.progress,
        timestamp: Date.now(),
      });

      // Check if complete
      if (status.status === "completed") {
        await publish(`spark.build.unity.completed.${sessionId}`, {
          type: "build_completed",
          sessionId,
          jobId,
          outputPath: status.outputPath,
          timestamp: Date.now(),
        });
        return;
      }

      if (status.status === "failed") {
        await publish(`spark.build.unity.failed.${sessionId}`, {
          type: "build_failed",
          sessionId,
          jobId,
          error: status.error,
          timestamp: Date.now(),
        });
        return;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, 500));
      attempts++;
    } catch (error) {
      console.error("Build status poll error:", error);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Timeout
  await publish(`spark.build.unity.timeout.${sessionId}`, {
    type: "build_timeout",
    sessionId,
    jobId,
    timestamp: Date.now(),
  });
}
