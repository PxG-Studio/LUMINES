# SPARK Production-Ready Quickstart Guide

Complete guide to deploying and running SPARK in production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Docker Compose)](#quick-start-docker-compose)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Unity MCP Integration](#unity-mcp-integration)
6. [Production Deployment (Kubernetes)](#production-deployment-kubernetes)
7. [Monitoring and Alerts](#monitoring-and-alerts)
8. [Performance Tuning](#performance-tuning)
9. [Security Hardening](#security-hardening)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js 20+**
- **Docker 24+** and Docker Compose
- **Kubernetes 1.28+** (for production)
- **PostgreSQL 16+**
- **NATS 2.10+**
- **Unity 2022.3+** with [unity-mcp](https://github.com/CoplayDev/unity-mcp) installed

---

## Quick Start (Docker Compose)

### 1. Clone and Setup

```bash
git clone <your-repo>
cd spark
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Unity MCP
UNITY_MCP_URL=http://localhost:8080/mcp
UNITY_MCP_TOKEN=your-secure-token

# Database
POSTGRES_PASSWORD=secure_password_here
DATABASE_URL=postgresql://spark_user:secure_password_here@localhost:5432/spark

# NATS
NATS_URL=nats://localhost:4222
NEXT_PUBLIC_NATS_WS_URL=ws://localhost:4222

# Optional: CV and ASR Services
CV_SERVICE_URL=http://localhost:8081
CV_SERVICE_TOKEN=your-cv-token
ASR_SERVICE_URL=http://localhost:8082
ASR_SERVICE_TOKEN=your-asr-token

# Monitoring (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
PAGERDUTY_INTEGRATION_KEY=your-pagerduty-key
```

### 3. Start Services

```bash
# Start all services (PostgreSQL, NATS, Redis, SPARK UI)
docker-compose up -d

# Check service health
docker-compose ps

# View logs
docker-compose logs -f spark-ui
```

### 4. Initialize Database

```bash
# Run migrations
docker-compose exec postgres-primary psql -U spark_user -d spark -f /docker-entrypoint-initdb.d/schema.sql
docker-compose exec postgres-primary psql -U spark_user -d spark -f /docker-entrypoint-initdb.d/unity_operations.sql
```

### 5. Access SPARK

Open http://localhost:3000/spark in your browser.

---

## Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `UNITY_MCP_URL` | Unity MCP endpoint | `http://localhost:8080/mcp` |
| `UNITY_MCP_TOKEN` | Auth token for Unity MCP | `your-secure-token` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/spark` |
| `NATS_URL` | NATS broker URL (server-side) | `nats://localhost:4222` |
| `NEXT_PUBLIC_NATS_WS_URL` | NATS WebSocket URL (client-side) | `ws://localhost:4222` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `CV_SERVICE_URL` | Computer vision service | `http://localhost:8081` |
| `ASR_SERVICE_URL` | Speech recognition service | `http://localhost:8082` |
| `REDIS_URL` | Redis cache | `redis://localhost:6379` |
| `NODE_ENV` | Environment | `development` |

---

## Database Setup

### PostgreSQL Primary + Replica

SPARK uses a primary-replica setup for read/write separation:

- **Primary (port 5432)**: All writes and critical reads
- **Replica (port 5433)**: Analytics queries, dashboards

### Schema Migrations

All migrations are in `spark/database/`:

1. `schema.sql` - Core tables (users, preferences, history)
2. `unity_operations.sql` - Unity integration tables

### Manual Migration

```bash
psql -U spark_user -d spark -f spark/database/schema.sql
psql -U spark_user -d spark -f spark/database/unity_operations.sql
```

### Backup and Restore

```bash
# Backup
docker-compose exec postgres-primary pg_dump -U spark_user spark > backup.sql

# Restore
docker-compose exec -T postgres-primary psql -U spark_user spark < backup.sql
```

---

## Unity MCP Integration

### 1. Install Unity MCP Server

```bash
# Clone unity-mcp
git clone https://github.com/CoplayDev/unity-mcp.git
cd unity-mcp

# Install dependencies
npm install

# Configure
cp .env.example .env
# Edit .env with your Unity project path
```

### 2. Start Unity MCP

```bash
# Start the MCP server
npm run start

# Verify it's running
curl http://localhost:8080/mcp/health
```

### 3. Configure Unity Editor

1. Open your Unity project
2. Install the Unity MCP package via Package Manager
3. Configure the MCP connection in Unity preferences
4. Verify connection: `Window > SPARK > MCP Status`

### 4. Test Integration

```bash
# Test script generation
curl -X POST http://localhost:8080/mcp/tools/create_or_update_file \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "Assets/Scripts/TestScript.cs",
    "content": "using UnityEngine;\npublic class TestScript : MonoBehaviour {}"
  }'
```

---

## Production Deployment (Kubernetes)

### 1. Configure Secrets

```bash
# Create namespace
kubectl create namespace spark

# Create secrets
kubectl create secret generic spark-secrets \
  --from-literal=UNITY_MCP_TOKEN=your-token \
  --from-literal=POSTGRES_PASSWORD=your-password \
  --from-literal=DATABASE_URL=postgresql://user:pass@postgres:5432/spark \
  -n spark
```

### 2. Deploy Services

```bash
# Apply all manifests
kubectl apply -f k8s/spark-deployment.yaml

# Check deployment status
kubectl get pods -n spark
kubectl get services -n spark
```

### 3. Configure Ingress

Edit `k8s/spark-deployment.yaml` and update the Ingress host:

```yaml
spec:
  tls:
  - hosts:
    - spark.yourdomain.com
    secretName: spark-tls
  rules:
  - host: spark.yourdomain.com
```

Apply with cert-manager for TLS:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
kubectl apply -f k8s/spark-deployment.yaml
```

### 4. Horizontal Scaling

The HPA will automatically scale from 3 to 10 replicas based on CPU/memory:

```bash
# Check HPA status
kubectl get hpa -n spark

# Manual scaling
kubectl scale deployment spark-ui --replicas=5 -n spark
```

---

## Monitoring and Alerts

### Grafana Dashboards

Start Grafana (included in docker-compose):

```bash
docker-compose --profile monitoring up -d grafana
```

Access at http://localhost:3001 (admin/admin)

### Pre-configured Dashboards

1. **Preview Performance**: Cache hit rate, P95 latency
2. **Unity Operations**: Success rate, error spikes
3. **Queue Health**: NATS queue depth, backpressure events
4. **Database Performance**: Query latency, connection pool

Import dashboards from `spark/lib/metrics/dashboards.sql`.

### Alert Configuration

Alerts trigger automatically based on thresholds in `spark/lib/monitoring/alerts.ts`:

- **High P95 Latency** (>5s): Warning
- **High Error Rate** (>10%): Critical
- **Queue Depth** (>800): Warning
- **Build Timeouts** (>20%): Critical

Configure Slack webhooks:

```bash
export SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
```

---

## Performance Tuning

### Preview Cache Optimization

Default: 1000 entries, 5min TTL

```typescript
// spark/lib/cache/previewCache.ts
const previewCache = new LRUCache({
  max: 2000,        // Increase for more memory
  ttl: 10 * 60000,  // 10 minutes
});
```

### NATS Batch Tuning

Default: 50 events, 100ms interval

```typescript
// spark/lib/messaging/publisher.ts
const BATCH_SIZE = 100;        // Increase for higher throughput
const BATCH_INTERVAL_MS = 50;  // Decrease for lower latency
```

### Database Connection Pool

```bash
DATABASE_URL=postgresql://user:pass@host:5432/spark?pool_size=20&pool_timeout=10
```

### Service Client Retries

```typescript
// spark/lib/services/serviceClient.ts
export const unityMcpClient = new ServiceClient({
  maxRetries: 5,      // Increase for unreliable networks
  timeoutMs: 15000,   // Increase for slow operations
});
```

---

## Security Hardening

### 1. TLS Everywhere

- PostgreSQL: Use `sslmode=require` in connection string
- NATS: Configure TLS with certificates
- Ingress: Use cert-manager for automatic TLS

### 2. Rate Limiting

Default limits (per user, per minute):

- `/api/generate`: 20 requests
- `/api/preview`: 30 requests
- `/api/build`: 5 requests
- `/api/export`: 10 requests

Adjust in `spark/lib/auth/middleware.ts`.

### 3. Input Sanitization

All user inputs are sanitized:

```typescript
import { sanitizeInput } from "./lib/auth/middleware";

const cleanPrompt = sanitizeInput(userPrompt);
```

### 4. NATS ACLs

Configure subject-level permissions:

```nats
accounts: {
  SPARK: {
    users: [
      {user: spark, password: secure_password}
    ]
    permissions: {
      publish: ["spark.>"]
      subscribe: ["spark.>"]
    }
  }
}
```

### 5. Database RLS

Row Level Security is enabled on all tables. Policies restrict access to authenticated users.

---

## Troubleshooting

### SPARK UI Won't Start

```bash
# Check logs
docker-compose logs spark-ui

# Common issues:
# 1. Database not ready
docker-compose ps postgres-primary

# 2. NATS not connected
docker-compose logs nats

# 3. Port conflict
lsof -i :3000
```

### Unity MCP Connection Failed

```bash
# Check MCP health
curl http://localhost:8080/mcp/health

# Verify token
echo $UNITY_MCP_TOKEN

# Test from SPARK
curl -X POST http://localhost:3000/api/test-mcp \
  -H "Content-Type: application/json"
```

### Preview Not Loading

```bash
# Check NATS subscriptions
docker-compose exec nats nats sub "spark.preview.>"

# Verify cache
redis-cli
> KEYS preview:*

# Check network
telnet localhost 4222
```

### Database Migration Failed

```bash
# Check current schema
docker-compose exec postgres-primary psql -U spark_user -d spark -c "\dt"

# Rollback
docker-compose exec postgres-primary psql -U spark_user -d spark -c "DROP TABLE spark_operations;"

# Re-apply
docker-compose exec postgres-primary psql -U spark_user -d spark -f /docker-entrypoint-initdb.d/unity_operations.sql
```

### Performance Issues

```bash
# Check metrics
curl http://localhost:3000/api/metrics

# Database query performance
docker-compose exec postgres-primary psql -U spark_user -d spark -c "SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;"

# NATS queue depth
curl http://localhost:8222/varz | jq '.total_connections, .in_msgs, .out_msgs'
```

---

## Support and Resources

- **Documentation**: `/spark/README.md`
- **Unity MCP**: https://github.com/CoplayDev/unity-mcp
- **Issue Tracker**: <your-repo-issues>
- **Community**: <your-discord-or-slack>

---

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Unity MCP connected and tested
- [ ] TLS certificates installed
- [ ] Rate limiting enabled
- [ ] Monitoring dashboards configured
- [ ] Alert webhooks tested (Slack/PagerDuty)
- [ ] Backup strategy in place
- [ ] Load testing completed (100+ concurrent users)
- [ ] Security audit passed
- [ ] Documentation updated

---

**SPARK v1.0.0 - Production Ready**
