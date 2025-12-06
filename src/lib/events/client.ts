/**
 * NATS Event Bus Client
 * NATS connection using @nats.io/nats.js with JetStream support
 */

import { connect, NatsConnection, StringCodec, JSONCodec, JetStreamClient } from 'nats';
import { natsConfig, getNatsUrl } from '../config/nats';
import type { EventBus } from './types';

// NATS connection singleton pattern for Next.js
const globalForNats = globalThis as unknown as {
  nc: NatsConnection | undefined;
  js: JetStreamClient | undefined;
};

let nc: NatsConnection | undefined;
let js: JetStreamClient | undefined;

// Codecs
const stringCodec = StringCodec();
const jsonCodec = JSONCodec();

/**
 * Initialize NATS connection
 */
export async function initializeNats(): Promise<{
  connection: NatsConnection;
  jetstream: JetStreamClient;
}> {
  if (globalForNats.nc && globalForNats.js) {
    return {
      connection: globalForNats.nc,
      jetstream: globalForNats.js,
    };
  }

  try {
    // Parse connection URL
    const url = getNatsUrl();
    const urlObj = new URL(url);

    // Build connection options
    const servers = [url]; // Can be array for cluster
    const options: any = {
      servers,
      reconnect: natsConfig.reconnect,
      maxReconnectAttempts: natsConfig.maxReconnectAttempts,
      reconnectTimeWait: natsConfig.reconnectTimeWait,
    };

    // Add authentication if provided
    if (natsConfig.user && natsConfig.password) {
      options.user = natsConfig.user;
      options.pass = natsConfig.password;
    }

    // Connect to NATS
    nc = await connect(options);

    // Create JetStream client
    js = nc.jetstream();

    // Handle connection events
    nc.closed().then(() => {
      console.log('⚠️  NATS connection closed');
    });

    // Store in global for Next.js hot-reload
    if (process.env.NODE_ENV !== 'production') {
      globalForNats.nc = nc;
      globalForNats.js = js;
    }

    console.log('✅ NATS connected');
    return { connection: nc, jetstream: js };
  } catch (error) {
    console.error('❌ NATS connection failed:', error);
    throw error;
  }
}

/**
 * Get NATS connection (lazy initialization)
 */
async function getConnection(): Promise<{ nc: NatsConnection; js: JetStreamClient }> {
  if (nc && js) {
    return { nc, js };
  }

  if (globalForNats.nc && globalForNats.js) {
    nc = globalForNats.nc;
    js = globalForNats.js;
    return { nc, js };
  }

  return await initializeNats();
}

// Event bus implementation
export const eventBus: EventBus = {
  publish: async (subject: string, data: any): Promise<void> => {
    try {
      const { js: jetstream } = await getConnection();
      const payload = jsonCodec.encode(data);
      await jetstream.publish(subject, payload);
    } catch (error) {
      console.error(`NATS publish error for subject ${subject}:`, error);
      throw error;
    }
  },

  subscribe: async (subject: string, handler: (data: any) => void): Promise<void> => {
    try {
      const { nc: connection } = await getConnection();
      const subscription = connection.subscribe(subject);

      // Process messages asynchronously
      (async () => {
        for await (const msg of subscription) {
          try {
            const data = jsonCodec.decode(msg.data);
            handler(data);
          } catch (error) {
            console.error(`Error processing NATS message on ${subject}:`, error);
          }
        }
      })();
    } catch (error) {
      console.error(`NATS subscribe error for subject ${subject}:`, error);
      throw error;
    }
  },

  close: async (): Promise<void> => {
    try {
      if (nc) {
        await nc.close();
        nc = undefined;
        js = undefined;
      }
    } catch (error) {
      console.error('NATS close error:', error);
    }
  },
};

/**
 * Health check for NATS connection
 */
export async function checkNatsHealth(): Promise<boolean> {
  try {
    const { nc: connection } = await getConnection();
    // Check if connection is still open
    return !connection.isClosed();
  } catch (error) {
    console.error('NATS health check failed:', error);
    return false;
  }
}

// Export NATS types for advanced usage
export { NatsConnection, JetStreamClient } from 'nats';
