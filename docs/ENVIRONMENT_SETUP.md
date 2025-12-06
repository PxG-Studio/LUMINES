# Environment Setup Guide

**Complete guide for setting up LUMINES/WIS2L development environment**

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/PxG-Studio/LUMINES.git
cd LUMINES
```

### 2. Copy Environment Template

```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

### 3. Configure Environment Variables

Edit `.env` file with your configuration. See `.env.example` for all available variables.

**Minimum required:**
```env
DATABASE_URL=postgresql://user:password@192.168.86.27:5432/lumines
REDIS_URL=redis://192.168.86.27:6379/0
NATS_URL=nats://192.168.86.27:4222
NOCTURNA_JWT_SECRET=your-secret-key-here
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Create and run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 6. Start Development Server

```bash
npm run dev
```

---

## Using Docker Compose

### Start All Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- NATS on ports 4222, 8222, 6222
- LUMINES web app on port 3000

### Environment Variables for Docker

Docker Compose automatically sets:
- `DATABASE_URL=postgresql://lumines:lumines@postgres:5432/lumines_dev`
- `REDIS_URL=redis://redis:6379/0`
- `NATS_URL=nats://nats:4222`

### Run Migrations in Docker

```bash
# Access web container
docker-compose exec lumines-web sh

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed
```

---

## Environment Variables Reference

### Application

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | No | `development` | Node environment |
| `NEXT_PUBLIC_APP_URL` | No | - | Public application URL |
| `NEXT_PUBLIC_API_BASE` | No | - | API base URL |
| `NEXT_PUBLIC_LUMENFORGE_DOMAIN` | No | `lumenforge.io` | Public domain |
| `NEXT_PUBLIC_NOCTURNA_ID_URL` | No | - | nocturnaID.org URL |

### Database

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes* | - | Full database connection URL |
| `DATABASE_HOST` | Yes* | `192.168.86.27` | Database host |
| `DATABASE_PORT` | No | `5432` | Database port |
| `DATABASE_NAME` | No | `lumines` | Database name |
| `DATABASE_USER` | Yes* | - | Database user |
| `DATABASE_PASSWORD` | Yes* | - | Database password |

*Either `DATABASE_URL` or `DATABASE_HOST` + `DATABASE_USER` + `DATABASE_PASSWORD` required

### Redis

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | No | - | Full Redis connection URL |
| `REDIS_HOST` | No | `192.168.86.27` | Redis host |
| `REDIS_PORT` | No | `6379` | Redis port |
| `REDIS_PASSWORD` | No | - | Redis password |
| `REDIS_DB` | No | `0` | Redis database number |
| `REDIS_TTL` | No | `3600` | Default TTL in seconds |

### NATS

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NATS_URL` | No | - | Full NATS connection URL |
| `NATS_HOST` | No | `192.168.86.27` | NATS host |
| `NATS_PORT` | No | `4222` | NATS port |
| `NATS_CLUSTER` | No | `lumines-cluster` | NATS cluster name |
| `NATS_USER` | No | - | NATS username |
| `NATS_PASSWORD` | No | - | NATS password |

### Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NOCTURNA_JWT_SECRET` | Yes | - | JWT secret key |
| `NOCTURNA_JWT_AUDIENCE` | No | `lumines.nocturna.network` | JWT audience |
| `NOCTURNA_JWT_ISSUER` | No | `lumines.nocturna.network` | JWT issuer |
| `NOCTURNA_JWKS_URL` | No | - | JWKS endpoint URL |

### AI Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SPARK_AI_ENDPOINT` | No | - | AI API endpoint |
| `SPARK_AI_API_KEY` | No | - | AI API key |
| `SPARK_ANTHROPIC_API_KEY` | No | - | Anthropic API key |

### Rate Limiting

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RATE_LIMIT_FREE` | No | `10` | Free tier requests/minute |
| `RATE_LIMIT_PRO` | No | `100` | Pro tier requests/minute |
| `RATE_LIMIT_ENTERPRISE` | No | `1000` | Enterprise tier requests/minute |

### Kubernetes

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `K8S_NAMESPACE` | No | `wis2l` | Kubernetes namespace |
| `K8S_CONTROL_NODE_IP` | No | `192.168.86.114` | Control node IP |
| `K8S_COMPUTE_NODE_IP` | No | `192.168.86.115` | Compute node IP |

### Container Registry

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REGISTRY_HOST` | No | `192.168.86.27` | Registry host |
| `REGISTRY_PORT` | No | `5000` | Registry port |
| `REGISTRY_USER` | No | - | Registry username |
| `REGISTRY_PASSWORD` | No | - | Registry password |

### Logging

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LOG_LEVEL` | No | `info` | Log level (debug, info, warn, error) |

### Monitoring (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SENTRY_DSN` | No | - | Sentry DSN for error tracking |
| `SENTRY_ENVIRONMENT` | No | `development` | Sentry environment |
| `PROMETHEUS_ENABLED` | No | `true` | Enable Prometheus metrics |
| `PROMETHEUS_PORT` | No | `9090` | Prometheus port |

### CI/CD (Optional)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CHROMATIC_PROJECT_TOKEN` | No | - | Chromatic project token |
| `PERCY_TOKEN` | No | - | Percy token |
| `VERCEL_TOKEN` | No | - | Vercel deployment token |

---

## Validation

### Check Environment Configuration

```bash
# Validate environment (runs on app startup)
npm run dev
```

The application will validate environment variables on startup and show errors if required variables are missing.

### Production Validation

```bash
# Validate production environment
node -e "require('./src/lib/config/validate-production').validateAndLogProductionEnvironment()"
```

Or use the shell script:

```bash
bash scripts/validate-production.sh
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
psql -h 192.168.86.27 -U lumines -d lumines

# Check Prisma
npx prisma db execute --stdin <<< "SELECT 1"
```

### Redis Connection Issues

```bash
# Test connection
redis-cli -h 192.168.86.27 -p 6379 PING
```

### NATS Connection Issues

```bash
# Test connection
telnet 192.168.86.27 4222
```

### Missing Environment Variables

The app will show clear error messages for missing required variables on startup.

---

**Last Updated:** December 2024

