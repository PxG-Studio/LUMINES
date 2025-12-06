/**
 * Enhanced NATS Publisher
 *
 * Batching, DLQ, backpressure, and metrics
 */

import { connect, NatsConnection, StringCodec } from "nats";

const sc = StringCodec();
const NATS_URL = process.env.NATS_URL || "nats://192.168.86.27:4222";
const MAX_QUEUE = 1000;
const BATCH_SIZE = 50;
const BATCH_INTERVAL_MS = 100;
const DLQ_SUBJECT = "spark.dlq";

let ncPromise: Promise<NatsConnection> | null = null;
let queue: Array<{ subject: string; payload: any }> = [];
let batchTimer: NodeJS.Timeout | null = null;
let flushing = false;
let metrics = { published: 0, failed: 0, dlq: 0 };

async function getClient(): Promise<NatsConnection> {
  if (!ncPromise) {
    ncPromise = connect({
      servers: NATS_URL,
      maxReconnectAttempts: -1,
      reconnectTimeWait: 1000,
    });
  }
  return ncPromise;
}

async function publishWithRetry(subject: string, payload: any, retries = 3): Promise<boolean> {
  let attempt = 0;
  while (attempt < retries) {
    try {
      const nc = await getClient();
      const data = sc.encode(JSON.stringify(payload));
      nc.publish(subject, data);
      metrics.published++;
      return true;
    } catch (err) {
      attempt++;
      if (attempt >= retries) {
        metrics.failed++;
        try {
          const nc = await getClient();
          const dlqData = sc.encode(
            JSON.stringify({
              subject,
              payload,
              error: String(err),
              timestamp: Date.now(),
            })
          );
          nc.publish(DLQ_SUBJECT, dlqData);
          metrics.dlq++;
        } catch (dlqErr) {
          console.error("DLQ publish failed:", dlqErr);
        }
        return false;
      }
      await new Promise((resolve) => setTimeout(resolve, 100 * Math.pow(2, attempt)));
    }
  }
  return false;
}

async function flushBatch() {
  if (flushing || queue.length === 0) return;
  flushing = true;
  const batch = queue.splice(0, BATCH_SIZE);
  const promises = batch.map((evt) => publishWithRetry(evt.subject, evt.payload));
  await Promise.allSettled(promises);
  flushing = false;
  if (queue.length > 0) {
    batchTimer = setTimeout(flushBatch, BATCH_INTERVAL_MS);
  } else {
    batchTimer = null;
  }
}

export async function publishEvent(event: { subject: string; payload: any }): Promise<void> {
  if (queue.length >= MAX_QUEUE) {
    queue.shift();
  }
  queue.push(event);
  if (!batchTimer && !flushing) {
    batchTimer = setTimeout(flushBatch, BATCH_INTERVAL_MS);
  }
}

export function getMetrics() {
  return { ...metrics, queueDepth: queue.length };
}
