import { connect, NatsConnection, StringCodec, Subscription } from 'nats.ws';

let natsClient: NatsConnection | null = null;
let connectionPromise: Promise<NatsConnection> | null = null;

export async function getNatsClient(): Promise<NatsConnection> {
  if (natsClient && !natsClient.isClosed()) {
    return natsClient;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const natsUrl = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_NATS_URL) ||
                  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_NATS_URL) ||
                  'ws://192.168.86.27:4222';

  if (!natsUrl.startsWith('ws://') && !natsUrl.startsWith('wss://')) {
    console.warn('NATS URL should use ws:// or wss:// for browser WebSocket connection');
  }

  connectionPromise = connect({
    servers: natsUrl,
    maxReconnectAttempts: -1,
    reconnectTimeWait: 1000,
    waitOnFirstConnect: true,
  })
    .then((nc) => {
      natsClient = nc;
      connectionPromise = null;

      console.log('NATS connected to', natsUrl);

      (async () => {
        for await (const status of nc.status()) {
          console.log('NATS status:', status.type, status.data);
        }
      })();

      nc.closed().then((err) => {
        if (err) {
          console.error('NATS connection closed with error:', err);
        } else {
          console.log('NATS connection closed');
        }
        natsClient = null;
      });

      return nc;
    })
    .catch((err) => {
      console.error('NATS connection failed:', err);
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}

export async function closeNatsConnection(): Promise<void> {
  if (natsClient && !natsClient.isClosed()) {
    await natsClient.drain();
    natsClient = null;
  }
}

export function isNatsConnected(): boolean {
  return natsClient !== null && !natsClient.isClosed();
}

export const codec = StringCodec();

export async function publish(subject: string, data: any): Promise<void> {
  try {
    const nc = await getNatsClient();
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    nc.publish(subject, codec.encode(payload));
  } catch (error) {
    console.error('NATS publish error:', error);
    throw error;
  }
}

export async function subscribe(
  subject: string,
  callback: (data: any) => void
): Promise<Subscription> {
  try {
    const nc = await getNatsClient();
    const sub = nc.subscribe(subject);

    (async () => {
      for await (const msg of sub) {
        try {
          const payload = codec.decode(msg.data);
          const data = JSON.parse(payload);
          callback(data);
        } catch (error) {
          console.error('NATS message parse error:', error);
        }
      }
    })();

    return sub;
  } catch (error) {
    console.error('NATS subscribe error:', error);
    throw error;
  }
}

export async function request(subject: string, data: any, timeout = 5000): Promise<any> {
  try {
    const nc = await getNatsClient();
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    const msg = await nc.request(subject, codec.encode(payload), { timeout });
    const response = codec.decode(msg.data);
    return JSON.parse(response);
  } catch (error) {
    console.error('NATS request error:', error);
    throw error;
  }
}
