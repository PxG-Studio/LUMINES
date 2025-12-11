import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let primaryPool = null;
let replicaPool = null;

function getPrimaryPool() {
  if (!primaryPool) {
    const config = {
      host: process.env.VITE_DB_HOST || '192.168.86.27',
      port: parseInt(process.env.VITE_DB_PORT || '5432'),
      database: process.env.VITE_DB_NAME || 'wissil_db',
      user: process.env.VITE_DB_USER || 'slate_user',
      password: process.env.VITE_DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.VITE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

    if (!config.password) {
      throw new Error('Missing database password. Please set VITE_DB_PASSWORD in .env file.');
    }

    primaryPool = new Pool(config);

    primaryPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }

  return primaryPool;
}

function getReplicaPool() {
  const replicaHost = process.env.VITE_DB_REPLICA_HOST;

  if (!replicaHost) {
    return null;
  }

  if (!replicaPool) {
    const config = {
      host: replicaHost,
      port: parseInt(process.env.VITE_DB_REPLICA_PORT || '5432'),
      database: process.env.VITE_DB_NAME || 'wissil_db',
      user: process.env.VITE_DB_REPLICA_USER || 'slate_user',
      password: process.env.VITE_DB_REPLICA_PASSWORD,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: process.env.VITE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
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

app.post('/api/query', async (req, res) => {
  const { text, params, useReplica } = req.body;
  const pool = useReplica ? getReplicaPool() || getPrimaryPool() : getPrimaryPool();
  const start = Date.now();

  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`Slow query (${duration}ms):`, text.substring(0, 100));
    }

    res.json({
      rows: result.rows,
      rowCount: result.rowCount,
      duration,
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transaction', async (req, res) => {
  const { queries } = req.body;
  const pool = getPrimaryPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const results = [];
    for (const { text, params } of queries) {
      const result = await client.query(text, params);
      results.push({
        rows: result.rows,
        rowCount: result.rowCount,
      });
    }

    await client.query('COMMIT');
    res.json({ results });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Database API server running on port ${PORT}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server and database connections');
  if (primaryPool) await primaryPool.end();
  if (replicaPool) await replicaPool.end();
  process.exit(0);
});
