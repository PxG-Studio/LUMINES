/**
 * Type stub for @openai/realtime package (not yet released)
 * This allows the code to compile while waiting for the actual SDK
 */

declare module "@openai/realtime" {
  export interface RealtimeClientConfig {
    apiKey: string;
    model?: string;
    debug?: boolean;
  }

  export class RealtimeClient {
    constructor(config: RealtimeClientConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    on(event: string, handler: (data: any) => void): void;
    sendUserMessage(message: { text: string; reasoning?: string }): Promise<void>;
    sendEvent(event: { type: string; value: any }): Promise<void>;
  }
}
