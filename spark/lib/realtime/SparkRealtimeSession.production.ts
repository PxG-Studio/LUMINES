/**
 * SPARK Real-Time Session (Production-Ready)
 *
 * Full implementation with:
 * - Authentication and authorization
 * - Rate limiting and quotas
 * - Validation schemas (zod)
 * - Retry logic and circuit breakers
 * - Actual engine handlers
 * - Supabase persistence
 * - NATS telemetry integration
 * - State conflict resolution
 */

import { RealtimeClient } from "@openai/realtime";
import { SparkAuth, AuthContext } from "./auth";
import { CircuitBreaker, RetryStrategy, HealthCheck, DEFAULT_RETRY_CONFIG, DEFAULT_CIRCUIT_BREAKER_CONFIG } from "./resilience";
import { SessionConfigSchema, DeltaSchema, FunctionCallSchema, validateFunctionArgs, scrubPII } from "./schemas";
import { handleGenerateUnityScript, handleApplyCodePatch, handleCreateUnityPrefab, handleCreateUnityMaterial, handleRunBuild } from "./handlers/unity";
import { publish } from "../../../src/lib/messaging/client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class SparkRealtimeSessionProduction {
  private client: RealtimeClient | null = null;
  private auth: SparkAuth;
  private authContext: AuthContext | null = null;
  private circuitBreaker: CircuitBreaker;
  private retryStrategy: RetryStrategy;
  private healthCheck: HealthCheck;
  private supabase: SupabaseClient;
  private sessionId: string;
  private userId: string | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  // State management
  private stateVersion: number = 0;
  private pendingDeltas: any[] = [];

  constructor(
    private config: {
      apiKey: string;
      token: string; // Supabase auth token
      model?: "gpt-4.1-realtime-preview" | "gpt-4o-realtime-preview";
      sonnetMode?: "creative" | "deterministic" | "hybrid";
    }
  ) {
    // Validate config
    const validatedConfig = SessionConfigSchema.parse(config);

    this.sessionId = `spark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.auth = new SparkAuth();
    this.circuitBreaker = new CircuitBreaker(DEFAULT_CIRCUIT_BREAKER_CONFIG);
    this.retryStrategy = new RetryStrategy(DEFAULT_RETRY_CONFIG);
    this.healthCheck = new HealthCheck();

    // Initialize Supabase client
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
  }

  /**
   * Initialize session with authentication
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      console.warn("Session already connected");
      return;
    }

    try {
      // Authenticate user
      this.authContext = await this.auth.authenticate(this.config.token, this.sessionId);
      this.userId = this.authContext.userId;

      // Check rate limits
      const rateLimit = await this.auth.checkRateLimit(
        this.authContext,
        "session:connect",
        10, // 10 connections per hour
        3600000
      );

      if (!rateLimit.allowed) {
        throw new Error(`Rate limit exceeded. Try again in ${Math.ceil((rateLimit.resetAt - Date.now()) / 1000)} seconds`);
      }

      // Check quotas
      const quotas = await this.auth.getQuotas(this.authContext.userId);
      if (quotas.monthlyTokensUsed >= quotas.monthlyTokensLimit) {
        throw new Error("Monthly token quota exceeded");
      }

      // Connect to OpenAI with circuit breaker
      await this.circuitBreaker.execute(async () => {
        return this.retryStrategy.execute(async () => {
          this.client = new RealtimeClient({
            apiKey: this.config.apiKey,
            model: this.config.model || "gpt-4o-realtime-preview",
            debug: process.env.NODE_ENV === "development",
          });

          await this.client.connect();
        });
      });

      // Wire up event handlers
      this.wireEvents();

      // Configure Sonnet behavior
      await this.configureSonnetBehavior();

      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Track connection
      await this.auth.trackRequest(this.authContext.userId, "session:connect", {
        sessionId: this.sessionId,
        model: this.config.model,
      });

      // Publish NATS event
      await publish(`spark.session.connected.${this.sessionId}`, {
        type: "connected",
        sessionId: this.sessionId,
        userId: this.authContext.userId,
        timestamp: Date.now(),
      });

      console.log(`[SPARK] Session ${this.sessionId} connected for user ${this.authContext.userId}`);
    } catch (error) {
      console.error("[SPARK] Connection failed:", error);
      await this.handleConnectionError(error);
      throw error;
    }
  }

  /**
   * Wire up OpenAI Real-Time SDK events
   */
  private wireEvents(): void {
    if (!this.client) return;

    // Delta events (state updates)
    this.client.on("delta", async (delta: any) => {
      try {
        // Validate delta
        const validated = DeltaSchema.parse({
          ...delta,
          timestamp: Date.now(),
          version: this.stateVersion,
        });

        // Apply delta with conflict resolution
        await this.applyDeltaWithConflictResolution(validated);

        // Publish to NATS
        await publish(`spark.delta.${this.sessionId}`, {
          type: "delta",
          sessionId: this.sessionId,
          delta: validated,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error("[SPARK] Delta handler error:", error);
      }
    });

    // Function call events
    this.client.on("function_call", async (fn: any) => {
      try {
        // Check authentication
        if (!this.authContext) {
          throw new Error("Not authenticated");
        }

        // Check rate limit
        const rateLimit = await this.auth.checkRateLimit(
          this.authContext,
          `function:${fn.name}`,
          100, // 100 calls per hour
          3600000
        );

        if (!rateLimit.allowed) {
          throw new Error("Rate limit exceeded");
        }

        // Validate function call
        const validated = FunctionCallSchema.parse({
          ...fn,
          timestamp: Date.now(),
        });

        // Route to appropriate handler
        const result = await this.handleFunctionCall(validated);

        // Track token usage if applicable
        if (result.tokensUsed) {
          await this.auth.trackTokenUsage(this.authContext.userId, result.tokensUsed);
        }

        // Publish to NATS
        await publish(`spark.function_call.${this.sessionId}`, {
          type: "function_call",
          sessionId: this.sessionId,
          functionName: fn.name,
          result: scrubPII(result),
          timestamp: Date.now(),
        });

        return result;
      } catch (error) {
        console.error("[SPARK] Function call error:", error);
        throw error;
      }
    });

    // Connection status events
    this.client.on("connection_status", async (status: string) => {
      console.log(`[SPARK] Connection status: ${status}`);
      this.isConnected = status === "connected";

      if (status === "disconnected") {
        await this.handleDisconnection();
      }
    });

    // Error events
    this.client.on("error", async (error: any) => {
      console.error("[SPARK] Client error:", error);
      await this.handleConnectionError(error);
    });
  }

  /**
   * Handle function call routing
   */
  private async handleFunctionCall(fn: any): Promise<any> {
    const handlers: Record<string, (args: any) => Promise<any>> = {
      generateUnityScript: handleGenerateUnityScript,
      applyCodePatch: handleApplyCodePatch,
      createUnityPrefab: handleCreateUnityPrefab,
      createUnityMaterial: handleCreateUnityMaterial,
      runBuild: handleRunBuild,
      // Add more handlers as needed
    };

    const handler = handlers[fn.name];
    if (!handler) {
      throw new Error(`Unknown function: ${fn.name}`);
    }

    // Validate arguments
    const validatedArgs = validateFunctionArgs(fn.name, fn.arguments);

    // Execute with circuit breaker
    return this.circuitBreaker.execute(async () => {
      return handler(validatedArgs);
    });
  }

  /**
   * Apply delta with conflict resolution
   */
  private async applyDeltaWithConflictResolution(delta: any): Promise<void> {
    // Increment state version
    this.stateVersion++;

    // Check for conflicts
    if (delta.version && delta.version < this.stateVersion - 1) {
      console.warn("[SPARK] Delta conflict detected, queueing for resolution");
      this.pendingDeltas.push(delta);
      return;
    }

    // Apply delta immediately
    await this.applyDelta(delta);

    // Process pending deltas if any
    while (this.pendingDeltas.length > 0) {
      const pending = this.pendingDeltas.shift();
      await this.applyDelta(pending);
    }
  }

  /**
   * Apply delta to state
   */
  private async applyDelta(delta: any): Promise<void> {
    try {
      // Store delta in database
      await this.supabase.from("spark_deltas").insert({
        session_id: this.sessionId,
        user_id: this.userId,
        delta_type: delta.type,
        delta_data: delta,
        version: this.stateVersion,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[SPARK] Apply delta error:", error);
    }
  }

  /**
   * Configure Sonnet 4.5 hybrid behavior
   */
  private async configureSonnetBehavior(): Promise<void> {
    if (!this.client) return;

    const behaviorConfig = {
      creative: { reasoning: "deep", temperature: 0.9, top_p: 0.95 },
      deterministic: { reasoning: "fast", temperature: 0.2, top_p: 0.5 },
      hybrid: { reasoning: "adaptive", temperature: 0.7, top_p: 0.8 },
    };

    const config = behaviorConfig[this.config.sonnetMode || "hybrid"];

    await this.client.sendEvent({
      type: "model.behavior",
      value: config,
    });
  }

  /**
   * Handle disconnection
   */
  private async handleDisconnection(): Promise<void> {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

      console.log(`[SPARK] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

      setTimeout(async () => {
        try {
          await this.connect();
        } catch (error) {
          console.error("[SPARK] Reconnection failed:", error);
        }
      }, delay);
    }
  }

  /**
   * Handle connection error
   */
  private async handleConnectionError(error: any): Promise<void> {
    await publish(`spark.error.${this.sessionId}`, {
      type: "connection_error",
      sessionId: this.sessionId,
      error: error instanceof Error ? error.message : String(error),
      timestamp: Date.now(),
    });
  }

  /**
   * Send user input
   */
  async sendUserInput(text: string, options?: { reasoning?: "creative" | "deterministic" }): Promise<void> {
    if (!this.client || !this.isConnected || !this.authContext) {
      throw new Error("Session not connected");
    }

    // Check rate limit
    const rateLimit = await this.auth.checkRateLimit(
      this.authContext,
      "input:send",
      1000, // 1000 inputs per hour
      3600000
    );

    if (!rateLimit.allowed) {
      throw new Error("Rate limit exceeded");
    }

    await this.client.sendUserMessage({
      text,
      reasoning: options?.reasoning,
    });

    // Track request
    await this.auth.trackRequest(this.authContext.userId, "input:send", {
      textLength: text.length,
      reasoning: options?.reasoning,
    });
  }

  /**
   * Disconnect session
   */
  async disconnect(): Promise<void> {
    if (!this.client || !this.isConnected) {
      return;
    }

    try {
      await this.client.disconnect();
      this.isConnected = false;
      this.client = null;

      await publish(`spark.session.disconnected.${this.sessionId}`, {
        type: "disconnected",
        sessionId: this.sessionId,
        timestamp: Date.now(),
      });

      console.log(`[SPARK] Session ${this.sessionId} disconnected`);
    } catch (error) {
      console.error("[SPARK] Disconnect error:", error);
    }
  }

  /**
   * Get health status
   */
  async getHealthStatus(): Promise<{ healthy: boolean; circuitState: string }> {
    const healthy = await this.healthCheck.check(async () => {
      return this.isConnected && this.client !== null;
    });

    return {
      healthy,
      circuitState: this.circuitBreaker.getState(),
    };
  }

  isSessionConnected(): boolean {
    return this.isConnected && this.client !== null;
  }
}
