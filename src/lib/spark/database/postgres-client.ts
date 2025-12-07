/**
 * PostgreSQL Client for SPARK (Production)
 *
 * Connects to SLATE infrastructure:
 * - Primary: 192.168.86.27:5432 (writes)
 * - Replica: 192.168.86.28:5432 (reads)
 *
 * NO SUPABASE - Direct PostgreSQL only
 */

import { Pool, PoolClient, QueryResult } from "pg";

// Primary pool (writes)
const primaryPool = new Pool({
  host: process.env.SLATE_DB_HOST || "192.168.86.27",
  port: parseInt(process.env.SLATE_DB_PORT || "5432"),
  database: process.env.SLATE_DB_NAME || "wissil_db",
  user: process.env.SLATE_DB_USER || "slate_user",
  password: process.env.SLATE_DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Replica pool (reads)
const replicaPool = new Pool({
  host: process.env.SLATE_DB_REPLICA_HOST || "192.168.86.28",
  port: parseInt(process.env.SLATE_DB_PORT || "5432"),
  database: process.env.SLATE_DB_NAME || "wissil_db",
  user: process.env.SLATE_DB_USER || "slate_user",
  password: process.env.SLATE_DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Error handling
primaryPool.on("error", (err) => {
  console.error("Postgres primary pool error:", err);
});

replicaPool.on("error", (err) => {
  console.error("Postgres replica pool error:", err);
});

/**
 * Execute query on primary (for writes)
 */
export async function query(
  text: string,
  params?: any[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await primaryPool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
    }
    return result;
  } catch (error) {
    console.error("Query error:", error, { text, params });
    throw error;
  }
}

/**
 * Execute query on replica (for reads)
 */
export async function queryRead(
  text: string,
  params?: any[]
): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await replicaPool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow read query (${duration}ms):`, text.substring(0, 100));
    }
    return result;
  } catch (error) {
    console.error("Read query error:", error, { text, params });
    // Fallback to primary if replica fails
    console.warn("Falling back to primary for read");
    return primaryPool.query(text, params);
  }
}

/**
 * Get a client for transactions
 */
export async function getClient(): Promise<PoolClient> {
  return primaryPool.connect();
}

/**
 * Execute in transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await getClient();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{
  primary: boolean;
  replica: boolean;
}> {
  const checks = await Promise.allSettled([
    primaryPool.query("SELECT 1"),
    replicaPool.query("SELECT 1"),
  ]);

  return {
    primary: checks[0].status === "fulfilled",
    replica: checks[1].status === "fulfilled",
  };
}

/**
 * Cleanup on shutdown
 */
export async function close(): Promise<void> {
  await Promise.all([primaryPool.end(), replicaPool.end()]);
}

// Cleanup on process exit
if (typeof process !== "undefined") {
  process.on("SIGTERM", () => close());
  process.on("SIGINT", () => close());
}
