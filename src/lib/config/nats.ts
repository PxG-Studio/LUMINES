/**
 * NATS Configuration
 * NATS message bus connection configuration using environment variables
 */

import { env, getNatsUrl } from './environment';

export const natsConfig = {
  url: getNatsUrl(),
  host: env.NATS_HOST,
  port: env.NATS_PORT,
  cluster: env.NATS_CLUSTER,
  user: env.NATS_USER,
  password: env.NATS_PASSWORD,
  // Connection options
  reconnect: true,
  maxReconnectAttempts: 10,
  reconnectTimeWait: 2000,
  // JetStream configuration
  jetstream: {
    maxPending: 1024,
    ackWait: 30000, // 30 seconds
  },
} as const;

