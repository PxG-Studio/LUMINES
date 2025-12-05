# SPARK on SLATE Infrastructure (NO Supabase)

Complete setup guide for SPARK using your own infrastructure at 192.168.86.x

**NO SUPABASE - Direct PostgreSQL, NATS, Redis, Unity MCP**

---

## Infrastructure Topology

```
SPARK (Next.js) → NATS (192.168.86.27:4222)
                ↓
    NATS Consumer (192.168.86.114/115)
                ↓
    PostgreSQL Primary (192.168.86.27:5432) ← Writes
    PostgreSQL Replica (192.168.86.28:5432) ← Reads
                ↓
    Flink/Storm/Airflow (192.168.86.114)
                ↓
    Redis (192.168.86.27:6379) ← Caching
                ↓
    Unity MCP (localhost:8080) ← Engine bridge
```

---

## Step 1: PostgreSQL Schema Setup

Run on primary (192.168.86.27):

```bash
# Connect to PostgreSQL
psql -h 192.168.86.27 -U slate_user -d wissil_db

# Or run from file
psql -h 192.168.86.27 -U slate_user -d wissil_db -f spark/database/schema.sql
```

Verify tables created:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'spark_%'
ORDER BY table_name;
```

Expected output:
```
spark_build_jobs
spark_errors_daily
spark_events
spark_events_2025_12
spark_events_2026_01
spark_events_daily
spark_function_calls
spark_generated_scripts
spark_previews
spark_sessions
spark_telemetry
spark_usage
spark_usage_daily
```

---

## Step 2: Unity MCP Setup

Clone and run unity-mcp:

```bash
# Clone repo
git clone https://github.com/CoplayDev/unity-mcp.git
cd unity-mcp

# Install dependencies
npm install

# Configure
cat > .env << EOF
PORT=8080
UNITY_PROJECT_PATH=/path/to/your/unity/project
MCP_TOKEN=your-secret-token-here
EOF

# Start server (HTTP mode)
npm run start:http

# Verify
curl http://localhost:8080/health
```

---

## Step 3: Environment Variables

**File:** `spark/.env.local`

```bash
# PostgreSQL (SLATE Infrastructure)
SLATE_DB_HOST=192.168.86.27
SLATE_DB_REPLICA_HOST=192.168.86.28
SLATE_DB_PORT=5432
SLATE_DB_NAME=wissil_db
SLATE_DB_USER=slate_user
SLATE_DB_PASSWORD=your-password-here

# NATS
NATS_URL=nats://192.168.86.27:4222
NEXT_PUBLIC_NATS_URL=ws://192.168.86.27:4222

# Redis (optional - for caching)
REDIS_HOST=192.168.86.27
REDIS_PORT=6379

# Unity MCP
UNITY_MCP_URL=http://localhost:8080/mcp
UNITY_MCP_TOKEN=your-secret-token-here

# OpenAI Real-Time API
OPENAI_REALTIME_API_KEY=sk-proj-your-key-here

# SPARK Configuration
SPARK_SONNET_MODE=hybrid
NODE_ENV=production

# Analytics (optional)
SLATE_ANALYTICS_URL=http://192.168.86.114/api/analytics
```

---

## Step 4: Install Dependencies

```bash
cd spark

# Install Node packages
npm install pg nats zod @openai/realtime

# Verify
npm list pg nats zod
```

---

## Step 5: Deploy NATS Consumer Service

On 192.168.86.114 or 192.168.86.115:

```bash
# Create service directory
mkdir -p /opt/spark-consumer
cd /opt/spark-consumer

# Copy files
cp spark/services/nats-consumer.ts .
cp spark/lib/database/postgres-client.ts ./lib/database/

# Install dependencies
npm install nats pg zod

# Create systemd service
cat > /etc/systemd/system/spark-nats-consumer.service << EOF
[Unit]
Description=SPARK NATS Consumer
After=network.target

[Service]
Type=simple
User=spark
WorkingDirectory=/opt/spark-consumer
Environment="NATS_URL=nats://192.168.86.27:4222"
Environment="SLATE_DB_HOST=192.168.86.27"
Environment="SLATE_DB_PASSWORD=your-password-here"
ExecStart=/usr/bin/node nats-consumer.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
systemctl enable spark-nats-consumer
systemctl start spark-nats-consumer

# Check logs
journalctl -u spark-nats-consumer -f
```

---

## Step 6: Airflow DAG Setup

On 192.168.86.114 (where Airflow runs):

```bash
# Copy DAG
cp spark/dags/spark_rollups.py /opt/airflow/dags/

# Configure connection in Airflow UI
# Connection ID: spark_pg_primary
# Type: Postgres
# Host: 192.168.86.27
# Schema: wissil_db
# Login: slate_user
# Password: your-password-here

# Trigger DAG manually
airflow dags trigger spark_partitions_and_rollups

# Monitor
airflow dags list
```

---

## Step 7: Test Full Stack

### Test 1: PostgreSQL Connection

```bash
node -e "
const { healthCheck } = require('./spark/lib/database/postgres-client');
healthCheck().then(console.log);
"
# Expected: { primary: true, replica: true }
```

### Test 2: NATS Connection

```bash
node -e "
const nats = require('nats');
nats.connect({ servers: 'nats://192.168.86.27:4222' })
  .then(() => console.log('NATS OK'))
  .catch(console.error);
"
# Expected: NATS OK
```

### Test 3: Unity MCP

```bash
curl -X POST http://localhost:8080/mcp/health \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json"
# Expected: { "status": "ok" }
```

### Test 4: Full SPARK Session

```typescript
// test-session.ts
import { SparkRealtimeSessionProduction } from "./lib/realtime/SparkRealtimeSession.production";

async function test() {
  const session = new SparkRealtimeSessionProduction({
    apiKey: process.env.OPENAI_REALTIME_API_KEY!,
    token: "test-token",
    userId: "test-user-id",
  });

  await session.connect();
  console.log("✅ Session connected");

  await session.sendUserInput("Create a Unity player controller");
  console.log("✅ Input sent");

  await new Promise(resolve => setTimeout(resolve, 5000));

  await session.disconnect();
  console.log("✅ Session disconnected");
}

test().catch(console.error);
```

Run:
```bash
npx tsx test-session.ts
```

---

## Step 8: Monitor and Debug

### Check PostgreSQL Activity

```sql
-- Active sessions
SELECT session_id, user_id, model, started_at
FROM spark_sessions
WHERE ended_at IS NULL
ORDER BY started_at DESC;

-- Recent function calls
SELECT name, status, COUNT(*), AVG(duration_ms)
FROM spark_function_calls
WHERE ts > NOW() - INTERVAL '1 hour'
GROUP BY name, status;

-- Today's usage
SELECT model, SUM(tokens_prompt), SUM(tokens_completion)
FROM spark_usage
WHERE ts >= CURRENT_DATE
GROUP BY model;
```

### Check NATS Consumer

```bash
# View logs
journalctl -u spark-nats-consumer -f

# Check stats
curl http://192.168.86.114:9090/metrics | grep spark
```

### Check Unity MCP

```bash
# Health check
curl http://localhost:8080/health

# View logs (if running as service)
journalctl -u unity-mcp -f
```

---

## Architecture: Data Flow

```
1) User types in SPARK UI
   ↓
2) Next.js → OpenAI Real-Time API (WebSocket)
   ↓
3) Function call: generateUnityScript
   ↓
4) SparkBridge → Unity MCP (HTTP)
   ↓
5) Unity creates/edits script
   ↓
6) Event published to NATS: spark.function_call.{sessionId}
   ↓
7) NATS Consumer validates (zod) → PostgreSQL 27 (write)
   ↓
8) Flink/Storm aggregate → Daily rollups
   ↓
9) UI polls → PostgreSQL 28 (read replica)
   ↓
10) User sees preview/result
```

---

## Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Function call latency | <2s | Unity MCP → SPARK |
| NATS publish latency | <10ms | Local network |
| PostgreSQL write | <50ms | Primary, indexed |
| PostgreSQL read | <30ms | Replica, cached |
| Consumer throughput | >1000 msg/s | Single instance |
| End-to-end latency | <3s | User input → preview |

---

## Scaling Checklist

For 1,000+ concurrent sessions:

- [ ] Add Redis for circuit breaker state (shared across instances)
- [ ] Horizontal NATS consumers (load balance)
- [ ] PostgreSQL connection pooling (PgBouncer)
- [ ] Monitor replication lag (27 → 28)
- [ ] Add read replicas if needed
- [ ] Unity MCP: one instance per Unity project (isolate)
- [ ] Rate limiting per user (Redis-backed)

---

## Security Hardening

- [ ] PostgreSQL: SSL/TLS connections
- [ ] NATS: Subject permissions (only `spark.*`)
- [ ] Unity MCP: Auth token required
- [ ] Network: Firewall rules (only allow 192.168.86.x)
- [ ] Secrets: Use vault/secret manager
- [ ] PII scrubbing: Before NATS publish
- [ ] Content filtering: Validate all payloads (zod)

---

## Troubleshooting

### PostgreSQL connection fails

```bash
# Check connectivity
pg_isready -h 192.168.86.27 -p 5432

# Check user permissions
psql -h 192.168.86.27 -U slate_user -d wissil_db -c "\du"
```

### NATS consumer not receiving messages

```bash
# Check NATS server
nats-server --version

# Subscribe manually
nats sub "spark.>"

# Publish test message
nats pub "spark.test" '{"test": true}'
```

### Unity MCP not responding

```bash
# Check if running
curl http://localhost:8080/health

# Check Unity Editor is open
ps aux | grep Unity

# Check logs
cat /var/log/unity-mcp.log
```

---

## Next Steps

✅ **Infrastructure complete!**

Now:
1. Wire SPARK UI to real-time session
2. Add Flink jobs for metrics aggregation
3. Add Storm jobs for real-time alerts
4. Set up Grafana dashboards (PostgreSQL data source)
5. Add auth (JWT tokens, not Supabase auth)

**System is ready for production deployment on your infrastructure.**
