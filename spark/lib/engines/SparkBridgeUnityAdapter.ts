/**
 * Unity MCP Adapter for SparkBridge (Performance Optimized)
 *
 * Registers Unity handlers that route to unity-mcp server
 * Publishes events to NATS for real-time UI updates
 * Includes metrics, caching, and batched NATS publishes
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
import { publishEvent } from "../messaging/publisher";
import { query } from "../database/postgres-client";
import { getTimer, getCounter } from "../metrics/metrics";
import { previewCache } from "../cache/previewCache";

/**
 * Register Unity handlers on SparkBridge
 */
export function registerUnityHandlers(bridge: SparkBridge, sessionId: string) {
  /**
   * Generate Unity C# script
   */
  bridge.register("generateUnityScript", async (args) => {
    const timer = getTimer("unity.generate_script");
    const counter = getCounter("unity.generate_script.requests");
    timer.start();
    counter.inc();

    if (!args?.code || !args?.name) {
      throw new Error("Missing code or name");
    }

    try {
      await publishEvent({
        subject: `spark.runtime.unity.started.${sessionId}`,
        payload: {
          type: "generate_unity_script.started",
          sessionId,
          timestamp: Date.now(),
          name: args.name,
        },
      });

      const result = await unityGenerateScript({
        name: args.name,
        code: args.code,
        path: args.path,
      });

      await query(
        `INSERT INTO spark_generated_scripts (session_id, script_name, script_content, prompt, created_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [sessionId, args.name, args.code, args.prompt || ""]
      );

      await publishEvent({
        subject: `spark.runtime.unity.completed.${sessionId}`,
        payload: {
          type: "generate_unity_script.completed",
          sessionId,
          scriptName: args.name,
          path: result.path,
          timestamp: Date.now(),
        },
      });

      timer.stop();
      return result;
    } catch (err) {
      await publishEvent({
        subject: `spark.runtime.unity.failed.${sessionId}`,
        payload: {
          type: "generate_unity_script.failed",
          sessionId,
          error: String(err),
          timestamp: Date.now(),
        },
      });
      timer.stop();
      throw err;
    }
  });

  /**
   * Apply code patch
   */
  bridge.register("applyCodePatch", async (args) => {
    const timer = getTimer("unity.apply_patch");
    const counter = getCounter("unity.apply_patch.requests");
    timer.start();
    counter.inc();

    if (!args?.path || !args?.patch) {
      throw new Error("Missing path or patch");
    }

    try {
      const result = await unityApplyPatch({
        path: args.path,
        patch: args.patch,
      });

      await publishEvent({
        subject: `spark.runtime.unity.patch_applied.${sessionId}`,
        payload: {
          type: "patch_applied",
          sessionId,
          path: args.path,
          timestamp: Date.now(),
        },
      });

      timer.stop();
      return result;
    } catch (err) {
      await publishEvent({
        subject: `spark.runtime.unity.failed.${sessionId}`,
        payload: {
          type: "apply_patch.failed",
          sessionId,
          error: String(err),
          timestamp: Date.now(),
        },
      });
      timer.stop();
      throw err;
    }
  });

  /**
   * Render preview
   */
  bridge.register("renderPreview", async (args) => {
    const timer = getTimer("unity.render_preview");
    const counter = getCounter("unity.render_preview.requests");
    timer.start();
    counter.inc();

    const cacheKey = `${args.scenePath || ""}_${args.gameObject || ""}`;
    const cached = previewCache.get(cacheKey);
    if (cached) {
      timer.stop();
      getCounter("unity.render_preview.cache_hits").inc();
      return { frameRef: cached, format: "url" };
    }

    try {
      await publishEvent({
        subject: `spark.preview.unity.started.${sessionId}`,
        payload: {
          type: "preview.started",
          sessionId,
          timestamp: Date.now(),
        },
      });

      const result = await unityRenderPreview({
        scenePath: args.scenePath,
        gameObject: args.gameObject,
        width: args.width,
        height: args.height,
      });

      await query(
        `INSERT INTO spark_previews (session_id, engine, status, frame_ref, ts)
         VALUES ($1, 'unity', 'ready', $2, NOW())`,
        [sessionId, result.frameRef]
      );

      previewCache.set(cacheKey, result.frameRef);

      await publishEvent({
        subject: `spark.preview.unity.frame.${sessionId}`,
        payload: {
          type: "preview.frame",
          sessionId,
          frameRef: result.frameRef,
          format: result.format,
          timestamp: Date.now(),
        },
      });

      await publishEvent({
        subject: `spark.preview.unity.completed.${sessionId}`,
        payload: {
          type: "preview.completed",
          sessionId,
          timestamp: Date.now(),
        },
      });

      timer.stop();
      return result;
    } catch (err) {
      await publishEvent({
        subject: `spark.preview.unity.failed.${sessionId}`,
        payload: {
          type: "preview.failed",
          sessionId,
          error: String(err),
          timestamp: Date.now(),
        },
      });
      timer.stop();
      throw err;
    }
  });

  /**
   * Ingest asset
   */
  bridge.register("ingestAsset", async (args) => {
    const timer = getTimer("unity.ingest_asset");
    const counter = getCounter("unity.ingest_asset.requests");
    timer.start();
    counter.inc();

    if (!args?.path) {
      throw new Error("Missing path");
    }

    try {
      const result = await unityIngestAsset({ path: args.path });

      await publishEvent({
        subject: `spark.runtime.unity.asset_ingested.${sessionId}`,
        payload: {
          type: "asset_ingested",
          sessionId,
          path: args.path,
          assetType: result.assetType,
          timestamp: Date.now(),
        },
      });

      timer.stop();
      return result;
    } catch (err) {
      await publishEvent({
        subject: `spark.runtime.unity.failed.${sessionId}`,
        payload: {
          type: "ingest_asset.failed",
          sessionId,
          error: String(err),
          timestamp: Date.now(),
        },
      });
      timer.stop();
      throw err;
    }
  });

  /**
   * Deconstruct asset
   */
  bridge.register("deconstructAsset", async (args) => {
    const timer = getTimer("unity.deconstruct_asset");
    const counter = getCounter("unity.deconstruct_asset.requests");
    timer.start();
    counter.inc();

    if (!args?.path) {
      throw new Error("Missing path");
    }

    try {
      const result = await unityDeconstructAsset({ path: args.path });

      await publishEvent({
        subject: `spark.runtime.unity.asset_deconstructed.${sessionId}`,
        payload: {
          type: "asset_deconstructed",
          sessionId,
          path: args.path,
          componentCount: result.components.length,
          timestamp: Date.now(),
        },
      });

      timer.stop();
      return result;
    } catch (err) {
      await publishEvent({
        subject: `spark.runtime.unity.failed.${sessionId}`,
        payload: {
          type: "deconstruct_asset.failed",
          sessionId,
          error: String(err),
          timestamp: Date.now(),
        },
      });
      timer.stop();
      throw err;
    }
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

    await publishEvent({
      subject: `spark.build.unity.started.${sessionId}`,
      payload: {
        type: "build_started",
        sessionId,
        jobId: result.jobId,
        target: args.target,
        timestamp: Date.now(),
      },
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

      await publishEvent({
        subject: `spark.build.unity.progress.${sessionId}`,
        payload: {
          type: "build_progress",
          sessionId,
          jobId,
          status: status.status,
          progress: status.progress,
          timestamp: Date.now(),
        },
      });

      if (status.status === "completed") {
        await publishEvent({
          subject: `spark.build.unity.completed.${sessionId}`,
          payload: {
            type: "build_completed",
            sessionId,
            jobId,
            outputPath: status.outputPath,
            timestamp: Date.now(),
          },
        });
        return;
      }

      if (status.status === "failed") {
        await publishEvent({
          subject: `spark.build.unity.failed.${sessionId}`,
          payload: {
            type: "build_failed",
            sessionId,
            jobId,
            error: status.error,
            timestamp: Date.now(),
          },
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

  await publishEvent({
    subject: `spark.build.unity.timeout.${sessionId}`,
    payload: {
      type: "build_timeout",
      sessionId,
      jobId,
      timestamp: Date.now(),
    },
  });
}
