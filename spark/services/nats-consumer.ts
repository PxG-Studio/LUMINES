/**
 * SPARK NATS Consumer Service
 *
 * Consumes spark.* subjects from NATS (192.168.86.27:4222)
 * Validates with zod schemas
 * Writes to PostgreSQL (192.168.86.27 primary, 192.168.86.28 replica)
 *
 * Deploy on: 192.168.86.114 or 192.168.86.115
 */

import { connect, StringCodec, NatsConnection } from "nats";
import { z } from "zod";
import { query } from "../lib/database/postgres-client";

const sc = StringCodec();

// Zod schemas for validation
const baseEvent = {
  sessionId: z.string().min(1),
  timestamp: z.number().optional(),
  userId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
};

const eventSchema = z.object({
  ...baseEvent,
  type: z.string().min(1),
  payload: z.any(),
});

const functionCallSchema = z.object({
  ...baseEvent,
  callId: z.string().min(1),
  name: z.string().min(1),
  durationMs: z.number().int().nonnegative().optional(),
  status: z.enum(["success", "failed"]),
  error: z.string().optional(),
  args: z.any().optional(),
  output: z.any().optional(),
});

const telemetrySchema = z.object({
  ...baseEvent,
  kind: z.string().min(1),
  data: z.record(z.any()),
});

const usageSchema = z.object({
  ...baseEvent,
  model: z.string().min(1),
  tokensPrompt: z.number().int().nonnegative().default(0),
  tokensCompletion: z.number().int().nonnegative().default(0),
  costEstimate: z.number().nonnegative().default(0),
});

const previewSchema = z.object({
  ...baseEvent,
  engine: z.enum(["unity", "godot", "pico8", "gamemaker", "rpgmaker", "construct", "renpy"]),
  status: z.enum(["idle", "loading", "ready", "error"]),
  frameRef: z.string().optional(),
  meta: z.record(z.any()).optional(),
});

// Statistics
let processed = 0;
let errors = 0;
let lastLog = Date.now();

/**
 * Main consumer loop
 */
async function main() {
  const natsUrl = process.env.NATS_URL || "nats://192.168.86.27:4222";

  console.log(`[NATS Consumer] Connecting to ${natsUrl}...`);

  const nc = await connect({
    servers: natsUrl,
    maxReconnectAttempts: -1,
    reconnectTimeWait: 1000,
  });

  console.log("[NATS Consumer] Connected. Subscribing to spark.>...");

  const sub = nc.subscribe("spark.>");

  // Process messages
  for await (const msg of sub) {
    try {
      const data = JSON.parse(sc.decode(msg.data));
      const subject = msg.subject;

      await routeMessage(subject, data);
      processed++;

      // Log stats every 10 seconds
      const now = Date.now();
      if (now - lastLog > 10000) {
        console.log(`[NATS Consumer] Processed: ${processed}, Errors: ${errors}`);
        lastLog = now;
      }
    } catch (error) {
      errors++;
      console.error("[NATS Consumer] Message error:", error, "subject:", msg.subject);

      // Dead-letter queue (optional)
      try {
        await nc.publish("spark.dlq", msg.data);
      } catch (dlqError) {
        console.error("[NATS Consumer] DLQ publish failed:", dlqError);
      }
    }
  }
}

/**
 * Route message by subject
 */
async function routeMessage(subject: string, data: any): Promise<void> {
  if (subject.startsWith("spark.function_call")) {
    const parsed = functionCallSchema.parse(data);
    await upsertFunctionCall(parsed);
  } else if (subject.startsWith("spark.telemetry.batch")) {
    const events = z.array(telemetrySchema).parse(data.events || []);
    await insertTelemetryBatch(events);
  } else if (subject.startsWith("spark.telemetry")) {
    const parsed = telemetrySchema.parse(data);
    await insertTelemetry(parsed);
  } else if (subject.startsWith("spark.usage")) {
    const parsed = usageSchema.parse(data);
    await insertUsage(parsed);
  } else if (subject.startsWith("spark.preview")) {
    const parsed = previewSchema.parse(data);
    await insertPreview(parsed);
  } else {
    // Generic event
    const parsed = eventSchema.parse(data);
    await insertEvent(parsed);
  }
}

/**
 * Upsert function call (idempotent by session_id + call_id)
 */
async function upsertFunctionCall(data: z.infer<typeof functionCallSchema>): Promise<void> {
  await query(
    `INSERT INTO spark_function_calls (session_id, call_id, name, ts, duration_ms, status, error, args, output)
     VALUES ($1, $2, $3, to_timestamp($4 / 1000.0), $5, $6, $7, $8, $9)
     ON CONFLICT (session_id, call_id) DO UPDATE
       SET duration_ms = EXCLUDED.duration_ms,
           status = EXCLUDED.status,
           error = EXCLUDED.error,
           output = EXCLUDED.output`,
    [
      data.sessionId,
      data.callId,
      data.name,
      data.timestamp || Date.now(),
      data.durationMs || null,
      data.status,
      data.error || null,
      JSON.stringify(data.args || {}),
      JSON.stringify(data.output || {}),
    ]
  );
}

/**
 * Insert telemetry event
 */
async function insertTelemetry(data: z.infer<typeof telemetrySchema>): Promise<void> {
  await query(
    `INSERT INTO spark_telemetry (session_id, kind, ts, data)
     VALUES ($1, $2, to_timestamp($3 / 1000.0), $4)`,
    [
      data.sessionId,
      data.kind,
      data.timestamp || Date.now(),
      JSON.stringify(data.data),
    ]
  );
}

/**
 * Insert telemetry batch
 */
async function insertTelemetryBatch(events: z.infer<typeof telemetrySchema>[]): Promise<void> {
  if (events.length === 0) return;

  const values = events.map((e, i) => {
    const offset = i * 4;
    return `($${offset + 1}, $${offset + 2}, to_timestamp($${offset + 3} / 1000.0), $${offset + 4})`;
  }).join(", ");

  const params = events.flatMap(e => [
    e.sessionId,
    e.kind,
    e.timestamp || Date.now(),
    JSON.stringify(e.data),
  ]);

  await query(
    `INSERT INTO spark_telemetry (session_id, kind, ts, data) VALUES ${values}`,
    params
  );
}

/**
 * Insert usage event
 */
async function insertUsage(data: z.infer<typeof usageSchema>): Promise<void> {
  await query(
    `INSERT INTO spark_usage (session_id, ts, model, tokens_prompt, tokens_completion, cost_estimate)
     VALUES ($1, to_timestamp($2 / 1000.0), $3, $4, $5, $6)`,
    [
      data.sessionId,
      data.timestamp || Date.now(),
      data.model,
      data.tokensPrompt,
      data.tokensCompletion,
      data.costEstimate,
    ]
  );
}

/**
 * Insert preview event
 */
async function insertPreview(data: z.infer<typeof previewSchema>): Promise<void> {
  await query(
    `INSERT INTO spark_previews (session_id, engine, ts, status, frame_ref, meta)
     VALUES ($1, $2, to_timestamp($3 / 1000.0), $4, $5, $6)`,
    [
      data.sessionId,
      data.engine,
      data.timestamp || Date.now(),
      data.status,
      data.frameRef || null,
      JSON.stringify(data.meta || {}),
    ]
  );
}

/**
 * Insert generic event
 */
async function insertEvent(data: z.infer<typeof eventSchema>): Promise<void> {
  await query(
    `INSERT INTO spark_events (session_id, type, ts, user_id, project_id, payload)
     VALUES ($1, $2, to_timestamp($3 / 1000.0), $4, $5, $6)`,
    [
      data.sessionId,
      data.type,
      data.timestamp || Date.now(),
      data.userId || null,
      data.projectId || null,
      JSON.stringify(data.payload),
    ]
  );
}

// Run
main().catch((error) => {
  console.error("[NATS Consumer] Fatal error:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[NATS Consumer] Shutting down...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[NATS Consumer] Shutting down...");
  process.exit(0);
});
