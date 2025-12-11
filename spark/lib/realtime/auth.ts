/**
 * SPARK Real-Time Authentication & Rate Limiting (Production)
 *
 * Enforces per-user/session auth, rate limits, and security boundaries
 * Integrates with Supabase auth and PostgreSQL for persistence
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { RateLimitSchema, type RateLimit } from "./schemas";

export interface AuthContext {
  userId: string;
  sessionId: string;
  permissions: string[];
  tier: "free" | "pro" | "enterprise";
  quotas: {
    monthlyTokens: number;
    dailyRequests: number;
    concurrentSessions: number;
  };
}

export class SparkAuth {
  private supabase: SupabaseClient;
  private rateLimits: Map<string, RateLimit> = new Map();

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Authenticate session and get user context
   */
  async authenticate(token: string, sessionId: string): Promise<AuthContext> {
    try {
      // Validate JWT token with Supabase
      const { data: { user }, error } = await this.supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error("Authentication failed: Invalid token");
      }

      // Get user permissions and tier from database
      const { data: profile, error: profileError } = await this.supabase
        .from("spark_user_profiles")
        .select("tier, permissions, quotas")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // Use defaults
      }

      const context: AuthContext = {
        userId: user.id,
        sessionId,
        permissions: profile?.permissions || ["spark:read", "spark:generate"],
        tier: profile?.tier || "free",
        quotas: profile?.quotas || {
          monthlyTokens: 100000,
          dailyRequests: 100,
          concurrentSessions: 1,
        },
      };

      // Store session in database
      await this.storeSession(context);

      return context;
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication failed");
    }
  }

  /**
   * Check if user has permission
   */
  hasPermission(context: AuthContext, permission: string): boolean {
    return context.permissions.includes(permission) || context.permissions.includes("spark:admin");
  }

  /**
   * Check rate limit for endpoint
   */
  async checkRateLimit(
    context: AuthContext,
    endpoint: string,
    limit: number,
    windowMs: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const key = `${context.userId}:${endpoint}`;
    const now = Date.now();

    let rateLimitRecord = this.rateLimits.get(key);

    // Check if window expired
    if (!rateLimitRecord || now > rateLimitRecord.resetAt) {
      rateLimitRecord = {
        userId: context.userId,
        sessionId: context.sessionId,
        endpoint,
        limit,
        window: windowMs,
        current: 0,
        resetAt: now + windowMs,
      };
      this.rateLimits.set(key, rateLimitRecord);
    }

    // Increment counter
    rateLimitRecord.current += 1;

    // Check if over limit
    const allowed = rateLimitRecord.current <= rateLimitRecord.limit;
    const remaining = Math.max(0, rateLimitRecord.limit - rateLimitRecord.current);

    // Persist to database for cross-server rate limiting
    await this.persistRateLimit(rateLimitRecord);

    return {
      allowed,
      remaining,
      resetAt: rateLimitRecord.resetAt,
    };
  }

  /**
   * Get user quotas from database
   */
  async getQuotas(userId: string): Promise<{
    monthlyTokensUsed: number;
    monthlyTokensLimit: number;
    dailyRequestsUsed: number;
    dailyRequestsLimit: number;
  }> {
    try {
      // Get current month's token usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: tokenUsage } = await this.supabase
        .from("spark_token_usage")
        .select("tokens_used")
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString())
        .maybeSingle();

      // Get today's request count
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data: requestCount } = await this.supabase
        .from("spark_requests")
        .select("count")
        .eq("user_id", userId)
        .gte("created_at", startOfDay.toISOString())
        .maybeSingle();

      // Get user limits
      const { data: profile } = await this.supabase
        .from("spark_user_profiles")
        .select("quotas")
        .eq("user_id", userId)
        .maybeSingle();

      const quotas = profile?.quotas || {
        monthlyTokens: 100000,
        dailyRequests: 100,
      };

      return {
        monthlyTokensUsed: tokenUsage?.tokens_used || 0,
        monthlyTokensLimit: quotas.monthlyTokens,
        dailyRequestsUsed: requestCount?.count || 0,
        dailyRequestsLimit: quotas.dailyRequests,
      };
    } catch (error) {
      console.error("Get quotas error:", error);
      return {
        monthlyTokensUsed: 0,
        monthlyTokensLimit: 100000,
        dailyRequestsUsed: 0,
        dailyRequestsLimit: 100,
      };
    }
  }

  /**
   * Track token usage
   */
  async trackTokenUsage(userId: string, tokensUsed: number): Promise<void> {
    try {
      await this.supabase.from("spark_token_usage").insert({
        user_id: userId,
        tokens_used: tokensUsed,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Track token usage error:", error);
    }
  }

  /**
   * Track request
   */
  async trackRequest(userId: string, endpoint: string, metadata?: Record<string, any>): Promise<void> {
    try {
      await this.supabase.from("spark_requests").insert({
        user_id: userId,
        endpoint,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Track request error:", error);
    }
  }

  /**
   * Store session in database
   */
  private async storeSession(context: AuthContext): Promise<void> {
    try {
      await this.supabase.from("spark_sessions").upsert({
        session_id: context.sessionId,
        user_id: context.userId,
        tier: context.tier,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Store session error:", error);
    }
  }

  /**
   * Persist rate limit to database
   */
  private async persistRateLimit(rateLimit: RateLimit): Promise<void> {
    try {
      await this.supabase.from("spark_rate_limits").upsert({
        user_id: rateLimit.userId,
        endpoint: rateLimit.endpoint,
        current: rateLimit.current,
        limit: rateLimit.limit,
        reset_at: new Date(rateLimit.resetAt).toISOString(),
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Persist rate limit error:", error);
    }
  }

  /**
   * Cleanup expired rate limits (run periodically)
   */
  async cleanupRateLimits(): Promise<void> {
    const now = Date.now();
    for (const [key, limit] of this.rateLimits.entries()) {
      if (now > limit.resetAt) {
        this.rateLimits.delete(key);
      }
    }
  }
}

// Singleton instance
export const sparkAuth = new SparkAuth();

// Cleanup expired rate limits every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => sparkAuth.cleanupRateLimits(), 5 * 60 * 1000);
}
