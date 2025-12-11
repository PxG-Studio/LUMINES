import { Pool, PoolConfig, QueryResult, PoolClient, QueryResultRow } from 'pg';

let primaryPool: Pool | null = null;
let replicaPool: Pool | null = null;

export function getPrimaryPool(): Pool {
  if (!primaryPool) {
    const config: PoolConfig = {
      host: import.meta.env.VITE_DB_HOST || '192.168.86.27',
      port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
      database: import.meta.env.VITE_DB_NAME || 'wissil_db',
      user: import.meta.env.VITE_DB_USER || 'slate_user',
      password: import.meta.env.VITE_DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: import.meta.env.VITE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

    if (!config.password) {
      throw new Error(
        'Missing database password. Please set VITE_DB_PASSWORD in .env file.'
      );
    }

    primaryPool = new Pool(config);

    primaryPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  return primaryPool;
}

export function getReplicaPool(): Pool | null {
  const replicaHost = import.meta.env.VITE_DB_REPLICA_HOST;

  if (!replicaHost) {
    return null;
  }

  if (!replicaPool) {
    const config: PoolConfig = {
      host: replicaHost || '192.168.86.28',
      port: parseInt(import.meta.env.VITE_DB_REPLICA_PORT || '5432'),
      database: import.meta.env.VITE_DB_NAME || 'wissil_db',
      user: import.meta.env.VITE_DB_REPLICA_USER || 'slate_user',
      password: import.meta.env.VITE_DB_REPLICA_PASSWORD,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: import.meta.env.VITE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

    if (!config.password) {
      console.warn('Replica database password not set, replica will not be used');
      return null;
    }

    replicaPool = new Pool(config);

    replicaPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL replica client', err);
    });
  }

  return replicaPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
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
    throw error;
  }
}

export async function queryReplica<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const replica = getReplicaPool();

  if (replica) {
    try {
      return await replica.query<T>(text, params);
    } catch (error) {
      console.warn('Replica query failed, falling back to primary:', error);
      return query<T>(text, params);
    }
  }

  return query<T>(text, params);
}

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

export const db = {
  query,
  queryReplica,
  transaction,
  getPrimaryPool,
  getReplicaPool,
};

export async function closeConnections(): Promise<void> {
  if (primaryPool) {
    await primaryPool.end();
    primaryPool = null;
  }

  if (replicaPool) {
    await replicaPool.end();
    replicaPool = null;
  }
}

export { primaryPool, replicaPool };
