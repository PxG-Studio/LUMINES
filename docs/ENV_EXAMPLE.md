# Environment Variables Example

**Complete reference for LUMINES/WIS2L environment configuration**

> **Note:** This file documents the `.env.example` template. Since `.env.example` is gitignored, this document serves as the reference.

---

## Quick Start

1. Create `.env` file in project root
2. Copy variables from this document
3. Configure values for your environment
4. Never commit `.env` to version control

---

## Complete Environment Variables

```env
# =============================================================================
# Node Environment
# =============================================================================
NODE_ENV=development

# =============================================================================
# Application URLs
# =============================================================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE=http://localhost:3000/api
NEXT_PUBLIC_LUMENFORGE_DOMAIN=lumenforge.io
NEXT_PUBLIC_NOCTURNA_ID_URL=https://id.nocturna.network

# =============================================================================
# Database Configuration
# =============================================================================
# Option 1: Full connection string
DATABASE_URL=postgresql://user:password@192.168.86.27:5432/lumines

# Option 2: Individual components (used if DATABASE_URL not set)
# DATABASE_HOST=192.168.86.27
# DATABASE_PORT=5432
# DATABASE_NAME=lumines
# DATABASE_USER=user
# DATABASE_PASSWORD=password
# DATABASE_POOL_MIN=2
# DATABASE_POOL_MAX=10

# =============================================================================
# Redis Configuration
# =============================================================================
# Option 1: Full connection string
REDIS_URL=redis://192.168.86.27:6379/0

# Option 2: Individual components (used if REDIS_URL not set)
# REDIS_HOST=192.168.86.27
# REDIS_PORT=6379
# REDIS_PASSWORD=
# REDIS_DB=0
# REDIS_TTL=3600

# =============================================================================
# NATS Configuration
# =============================================================================
# Option 1: Full connection string
NATS_URL=nats://192.168.86.27:4222

# Option 2: Individual components (used if NATS_URL not set)
# NATS_HOST=192.168.86.27
# NATS_PORT=4222
# NATS_CLUSTER=lumines-cluster
# NATS_USER=
# NATS_PASSWORD=

# =============================================================================
# Container Registry Configuration
# =============================================================================
# Option 1: Full URL
# REGISTRY_URL=https://192.168.86.27:5000

# Option 2: Individual components
# REGISTRY_HOST=192.168.86.27
# REGISTRY_PORT=5000
# REGISTRY_USER=
# REGISTRY_PASSWORD=

# =============================================================================
# Kubernetes Configuration
# =============================================================================
K8S_NAMESPACE=lumines
K8S_CONTROL_NODE_IP=192.168.86.114
K8S_COMPUTE_NODE_IP=192.168.86.115

# =============================================================================
# Service Ports
# =============================================================================
PORT_LANDING=3000
PORT_SLATE=3001
PORT_IGNITION=3002
PORT_SPARK=3003
PORT_IGNIS=3004
PORT_WAYPOINT=3005

# =============================================================================
# Authentication (REQUIRED FOR PRODUCTION)
# =============================================================================
# ⚠️  CRITICAL: Change this in production!
NOCTURNA_JWT_SECRET=your-jwt-secret-key-change-in-production
NOCTURNA_JWT_AUDIENCE=lumines.nocturna.network
NOCTURNA_JWT_ISSUER=lumines.nocturna.network

# =============================================================================
# AI Configuration (SPARK)
# =============================================================================
# SPARK_AI_ENDPOINT=https://api.deepseek.com
# SPARK_AI_API_KEY=your-api-key-here
# SPARK_ANTHROPIC_API_KEY=your-anthropic-key-here

# =============================================================================
# Rate Limiting
# =============================================================================
RATE_LIMIT_FREE=10
RATE_LIMIT_PRO=100
RATE_LIMIT_ENTERPRISE=1000

# =============================================================================
# Optional: Error Tracking & Monitoring
# =============================================================================
# SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
# LOG_LEVEL=info

# =============================================================================
# Optional: Visual Testing
# =============================================================================
# CHROMATIC_PROJECT_TOKEN=your-chromatic-token
# PERCY_TOKEN=your-percy-token
```

---

## Required Variables for Production

### Critical (Must be set)
- `NODE_ENV=production`
- `DATABASE_URL` or (`DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`)
- `NOCTURNA_JWT_SECRET` (must be changed from default)

### Recommended
- `REDIS_URL` or (`REDIS_HOST`, `REDIS_PORT`)
- `NATS_URL` or (`NATS_HOST`, `NATS_PORT`)
- `SENTRY_DSN` (for error tracking)
- `LOG_LEVEL=info` (for production logging)

---

## Variable Reference

See `docs/ENVIRONMENT_SETUP.md` for detailed documentation on each variable.

---

**Last Updated:** December 6, 2025
