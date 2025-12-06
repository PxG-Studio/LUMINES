import { Pool, PoolConfig, QueryResult, PoolClient, QueryResultRow } from 'pg';

let primaryPool: Pool | null = null;

/**
 * Get PostgreSQL connection pool (singleton)
 * Connects to SLATE's PostgreSQL database at 192.168.86.27
 */
export function getPrimaryPool(): Pool {
  if (!primaryPool) {
    const config: PoolConfig = {
      host: process.env.DB_HOST || '192.168.86.27',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'wissil_db',
      user: process.env.DB_USER || 'slate_user',
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

    if (!config.password) {
      throw new Error(
        'Missing database password. Please set DB_PASSWORD in .env.local'
      );
    }

    primaryPool = new Pool(config);

    primaryPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  return primaryPool;
}

/**
 * Execute a query against the database
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPrimaryPool();
  const start = Date.now();

  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
    }

    return result;
  } catch (error) {
    console.error('Database query error:', error);
    console.error('Query:', text.substring(0, 200));
    console.error('Params:', params);
    throw error;
  }
}

/**
 * Execute multiple queries in a transaction
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPrimaryPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close all database connections (for cleanup/testing)
 */
export async function closeConnections(): Promise<void> {
  if (primaryPool) {
    await primaryPool.end();
    primaryPool = null;
  }
}
