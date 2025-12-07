# SPARK Real-Time Setup Guide (Production)

Complete step-by-step guide to deploy the production-ready real-time architecture.

---

## Prerequisites

- Node.js 18+ installed
- Supabase project created
- OpenAI account with Real-Time API access
- NATS server running (for telemetry)

---

## Step 1: Install Dependencies

```bash
cd spark

# Install required packages
npm install zod @openai/realtime @supabase/supabase-js nats.ws

# Verify installation
npm list zod @openai/realtime
```

---

## Step 2: Configure Environment Variables

Create `spark/.env.local`:

```bash
# OpenAI Real-Time API
OPENAI_REALTIME_API_KEY=sk-proj-your-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# SLATE Infrastructure (optional - for telemetry)
SLATE_NATS_URL=ws://192.168.86.27:4222
SLATE_ANALYTICS_URL=http://192.168.86.114/api/analytics

# SPARK Configuration
SPARK_SONNET_MODE=hybrid
NODE_ENV=production
```

---

## Step 3: Run Database Migrations

```bash
# Using Supabase CLI
supabase migration up

# Or manually via Supabase dashboard:
# 1. Go to SQL Editor
# 2. Copy contents of supabase/migrations/20251205_spark_realtime_tables.sql
# 3. Execute
```

Verify tables created:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'spark_%';
```

Expected output:
```
spark_user_profiles
spark_sessions
spark_rate_limits
spark_token_usage
spark_requests
spark_deltas
spark_generated_scripts
spark_files
spark_unity_prefabs
spark_unity_materials
spark_build_jobs
```

---

## Step 4: Create User Profile (First User)

```sql
-- Run this for each new user (or automate in your auth flow)
INSERT INTO spark_user_profiles (user_id, tier, permissions, quotas)
VALUES (
  'user-uuid-here', -- Replace with actual user UUID from auth.users
  'free',
  ARRAY['spark:read', 'spark:generate'],
  '{"monthlyTokens": 100000, "dailyRequests": 100, "concurrentSessions": 1}'::jsonb
)
ON CONFLICT (user_id) DO NOTHING;
```

---

## Step 5: Test Basic Connection

Create `spark/test-connection.ts`:

```typescript
import { SparkRealtimeSessionProduction } from "./lib/realtime/SparkRealtimeSession.production";
import { createClient } from "@supabase/supabase-js";

async function testConnection() {
  // Create Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Sign in (or use existing session)
  const { data: { session } } = await supabase.auth.signInWithPassword({
    email: "test@example.com",
    password: "your-password",
  });

  if (!session) {
    throw new Error("Authentication failed");
  }

  // Create SPARK session
  const sparkSession = new SparkRealtimeSessionProduction({
    apiKey: process.env.OPENAI_REALTIME_API_KEY!,
    token: session.access_token,
    model: "gpt-4o-realtime-preview",
    sonnetMode: "hybrid",
  });

  // Connect
  console.log("Connecting to SPARK real-time...");
  await sparkSession.connect();
  console.log("✅ Connected!");

  // Test input
  console.log("Sending test input...");
  await sparkSession.sendUserInput("Create a simple Unity player controller");

  // Wait for response
  await new Promise(resolve => setTimeout(resolve, 5000));

  // Check health
  const health = await sparkSession.getHealthStatus();
  console.log("Health:", health);

  // Disconnect
  await sparkSession.disconnect();
  console.log("✅ Test complete!");
}

testConnection().catch(console.error);
```

Run test:
```bash
npx tsx spark/test-connection.ts
```

Expected output:
```
Connecting to SPARK real-time...
✅ Connected!
Sending test input...
[SPARK] Function called: generateUnityScript
Health: { healthy: true, circuitState: "closed" }
✅ Test complete!
```

---

## Step 6: Integrate with UI

### Example: React Component

```typescript
"use client";

import { useState, useEffect } from "react";
import { SparkRealtimeSessionProduction } from "@/lib/realtime/SparkRealtimeSession.production";
import { createClient } from "@supabase/supabase-js";

export function SparkRealtimeUI() {
  const [session, setSession] = useState<SparkRealtimeSessionProduction | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function init() {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: { session: authSession } } = await supabase.auth.getSession();

      if (!authSession) {
        console.error("Not authenticated");
        return;
      }

      const sparkSession = new SparkRealtimeSessionProduction({
        apiKey: process.env.OPENAI_REALTIME_API_KEY!,
        token: authSession.access_token,
      });

      await sparkSession.connect();
      setSession(sparkSession);
      setIsConnected(true);
    }

    init();

    return () => {
      session?.disconnect();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session || !input.trim()) return;

    await session.sendUserInput(input);
    setInput("");
  }

  return (
    <div>
      <div>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Create a Unity script..."
        />
        <button type="submit">Generate</button>
      </form>
    </div>
  );
}
```

---

## Step 7: Monitor and Debug

### Check Session Status

```sql
-- Active sessions
SELECT session_id, user_id, tier, created_at
FROM spark_sessions
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;
```

### Check Rate Limits

```sql
-- User rate limits
SELECT user_id, endpoint, current, limit, reset_at
FROM spark_rate_limits
WHERE user_id = 'user-uuid-here';
```

### Check Token Usage

```sql
-- Monthly token usage
SELECT
  user_id,
  SUM(tokens_used) as total_tokens,
  COUNT(*) as request_count
FROM spark_token_usage
WHERE created_at >= DATE_TRUNC('month', NOW())
GROUP BY user_id
ORDER BY total_tokens DESC;
```

### Check Function Calls

```sql
-- Recent function calls (from NATS events)
SELECT session_id, endpoint, metadata, created_at
FROM spark_requests
WHERE endpoint LIKE 'function:%'
ORDER BY created_at DESC
LIMIT 100;
```

---

## Step 8: Error Handling

### Common Errors and Solutions

#### Error: "Authentication failed: Invalid token"

**Solution:**
```typescript
// Ensure token is fresh (refresh if needed)
const { data: { session }, error } = await supabase.auth.refreshSession();
if (error) {
  // Re-authenticate user
}
```

#### Error: "Rate limit exceeded"

**Solution:**
```typescript
try {
  await session.sendUserInput(prompt);
} catch (error) {
  if (error.message.includes("Rate limit exceeded")) {
    // Show upgrade prompt or wait
    const resetTime = await getRateLimitResetTime(userId, endpoint);
    alert(`Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)}s`);
  }
}
```

#### Error: "Circuit breaker is OPEN"

**Solution:**
```typescript
// Wait for circuit breaker to reset (60s default)
const health = await session.getHealthStatus();
if (health.circuitState === "open") {
  // Show maintenance message
  // Circuit will auto-reset after resetTimeoutMs (60s)
}
```

#### Error: "Monthly token quota exceeded"

**Solution:**
```typescript
const quotas = await auth.getQuotas(userId);
if (quotas.monthlyTokensUsed >= quotas.monthlyTokensLimit) {
  // Show upgrade prompt
}
```

---

## Step 9: Production Hardening

### Enable Monitoring

```typescript
// Add health check endpoint
// File: spark/app/api/health/route.ts

import { SparkAuth } from "@/lib/realtime/auth";

export async function GET() {
  const auth = new SparkAuth();

  // Check database connection
  const dbHealthy = await checkDatabaseHealth();

  // Check NATS connection
  const natsHealthy = await checkNATSHealth();

  return Response.json({
    status: dbHealthy && natsHealthy ? "healthy" : "unhealthy",
    database: dbHealthy,
    nats: natsHealthy,
    timestamp: Date.now(),
  });
}
```

### Add Logging

```typescript
// Add structured logging
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

// In session:
logger.info({ sessionId, userId }, "Session connected");
logger.error({ error, sessionId }, "Function call failed");
```

### Add Metrics

```typescript
// Track metrics with Prometheus/Grafana
import { Counter, Histogram } from "prom-client";

const sessionConnects = new Counter({
  name: "spark_session_connects_total",
  help: "Total session connections",
});

const functionCallDuration = new Histogram({
  name: "spark_function_call_duration_seconds",
  help: "Function call duration",
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});
```

---

## Step 10: Scale Considerations

### For 1,000+ Users

- [ ] Use Redis for circuit breakers (shared state)
- [ ] Use Redis for rate limiting (real-time sync)
- [ ] Add load balancer
- [ ] Enable Supabase connection pooling
- [ ] Monitor database query performance

### For 10,000+ Users

- [ ] Horizontal scaling (Kubernetes)
- [ ] Read replicas for Supabase
- [ ] CDN for static assets
- [ ] Background job workers (for builds)
- [ ] Real-time monitoring dashboard

---

## Troubleshooting

### Session won't connect

1. Check OpenAI API key is valid
2. Check Supabase credentials
3. Check user profile exists in `spark_user_profiles`
4. Check network connectivity
5. Check rate limits not exceeded

### Function calls failing

1. Check function handler exists
2. Check arguments are valid (zod validation)
3. Check permissions
4. Check circuit breaker state
5. Check logs for specific errors

### State not syncing

1. Check delta version numbers
2. Check Supabase connection
3. Check NATS connection (if using)
4. Check for conflicts in `spark_deltas` table

---

## Next Steps

✅ **Production-ready core** is now complete!

Next priorities:
1. **Build worker** - Execute queued Unity builds
2. **UI integration** - Wire SPARK UI to session
3. **Testing** - Unit, integration, and load tests
4. **Monitoring** - Set up dashboards and alerts
5. **Documentation** - API docs, user guide

---

## Support

- **Documentation:** See `PRODUCTION_READY_REALTIME.md`
- **Issues:** Check logs in Supabase dashboard
- **Performance:** Monitor with health endpoint
- **Security:** Review RLS policies regularly

**System is now production-ready for moderate scale (<1,000 users).**
