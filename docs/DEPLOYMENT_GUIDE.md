# WIS2L Deployment Guide

**Complete guide for deploying LUMINES/WIS2L to production**

---

## Prerequisites

- Docker and Docker Compose installed
- Kubernetes cluster (for production)
- PostgreSQL database (192.168.86.27:5432)
- Redis instance (192.168.86.27:6379)
- NATS server (192.168.86.27:4222)
- nocturnaID.org account and JWT credentials

---

## Local Development Setup

### 1. Clone Repository

```bash
git clone https://github.com/PxG-Studio/LUMINES.git
cd LUMINES
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

**Required variables:**
- `DATABASE_URL` or `DATABASE_HOST`, `DATABASE_USER`, `DATABASE_PASSWORD`
- `REDIS_URL` or `REDIS_HOST`
- `NOCTURNA_JWT_SECRET`

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 5. Start Services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (5432)
- Redis (6379)
- NATS (4222)
- LUMINES Web App (3000)

### 6. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:3000`

---

## Docker Deployment

### 1. Build Docker Image

```bash
docker build -t lumines:latest .
```

### 2. Run Container

```bash
docker run -d \
  --name lumines \
  -p 3000:3000 \
  --env-file .env \
  lumines:latest
```

### 3. Health Check

```bash
curl http://localhost:3000/api/health
```

---

## Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl apply -f infrastructure/k8s/production/manifests/namespace.yaml
```

### 2. Create Secrets

```bash
# Generate secrets using script
./scripts/generate-secrets.sh

# Apply secrets
kubectl apply -f infrastructure/k8s/production/manifests/secrets.yaml
```

### 3. Apply ConfigMap

```bash
kubectl apply -f infrastructure/k8s/production/manifests/configmap.yaml
```

### 4. Deploy Services

```bash
# Deploy all services
kubectl apply -k infrastructure/k8s/production/manifests/

# Or deploy individually
kubectl apply -f infrastructure/k8s/production/manifests/landing-deployment.yaml
kubectl apply -f infrastructure/k8s/production/manifests/slate-deployment.yaml
# ... etc
```

### 5. Apply Ingress

```bash
kubectl apply -f infrastructure/k8s/production/manifests/ingress.yaml
```

### 6. Verify Deployment

```bash
# Check pods
kubectl get pods -n wis2l

# Check services
kubectl get svc -n wis2l

# Check ingress
kubectl get ingress -n wis2l

# View logs
kubectl logs -f deployment/landing -n wis2l
```

---

## Database Migrations

### Create Migration

```bash
npm run db:migrate
```

### Apply Migrations in Production

```bash
# Using Prisma CLI
npx prisma migrate deploy

# Or using Kubernetes job
kubectl create job migrate-db --from=cronjob/migrate-db -n wis2l
```

### Rollback Migration

```bash
# Manual rollback (use with caution)
npx prisma migrate resolve --rolled-back <migration_name>
```

---

## Environment Variables

See `.env.example` for all available environment variables.

### Critical Production Variables

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
REDIS_URL=redis://host:6379/0
NATS_URL=nats://host:4222
NOCTURNA_JWT_SECRET=<secure-random-string>
NOCTURNA_JWT_AUDIENCE=lumines.nocturna.network
NOCTURNA_JWKS_URL=https://nocturnaID.org/.well-known/jwks.json
```

---

## Health Checks

### Application Health

```bash
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "services": {
    "database": { "status": "healthy" },
    "redis": { "status": "healthy" },
    "nats": { "status": "healthy" }
  }
}
```

### Kubernetes Probes

The application provides:
- **Liveness Probe:** `GET /api/health` (fails if app is unhealthy)
- **Readiness Probe:** `GET /api/health` (fails if dependencies are down)

---

## Monitoring

### Metrics Endpoint

```bash
GET /api/metrics
```

Returns Prometheus-compatible metrics.

### Performance Metrics

```bash
GET /api/performance
```

Requires authentication. Returns performance statistics.

---

## Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin <<< "SELECT 1"

# Check Prisma client
npx prisma generate
```

### Redis Connection Issues

```bash
# Test Redis connection
redis-cli -h 192.168.86.27 -p 6379 PING
```

### NATS Connection Issues

```bash
# Test NATS connection
telnet 192.168.86.27 4222
```

### Container Logs

```bash
# Docker
docker logs lumines

# Kubernetes
kubectl logs -f deployment/landing -n wis2l
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Set secure `NOCTURNA_JWT_SECRET`
- [ ] Enable SSL/TLS for database connections
- [ ] Configure firewall rules
- [ ] Set up secrets management (Kubernetes Secrets)
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure headers
- [ ] Enable authentication on all endpoints
- [ ] Review and update security policies

---

## Backup & Recovery

### Database Backup

```bash
# Create backup
pg_dump -h 192.168.86.27 -U lumines lumines > backup.sql

# Restore backup
psql -h 192.168.86.27 -U lumines lumines < backup.sql
```

### Redis Backup

```bash
# Create backup
redis-cli -h 192.168.86.27 SAVE

# Copy dump.rdb from Redis data directory
```

---

## Scaling

### Horizontal Pod Autoscaling

HPA is configured for all services:
- LANDING: 2-10 replicas
- SLATE: 2-10 replicas
- SPARK: 2-10 replicas
- IGNIS: 2-10 replicas
- WAYPOINT: 2-10 replicas

```bash
# Check HPA status
kubectl get hpa -n wis2l

# Manually scale
kubectl scale deployment landing --replicas=5 -n wis2l
```

---

## CI/CD

### GitHub Actions

The repository includes comprehensive CI/CD workflows:

- **Build & Test:** `build-and-deploy.yml`
- **Quality Assurance:** `qa-unified.yml`
- **Visual Regression:** `chromatic.yml`, `percy.yml`
- **E2E Testing:** `e2e.yml`
- **Release:** `release.yml`

### Deployment Process

1. Push to `main` branch
2. CI runs tests and builds
3. Docker image is built and pushed to registry
4. Kubernetes deployment is updated
5. Health checks verify deployment

---

## Support

For issues or questions:
- **Documentation:** `docs/API_DOCUMENTATION.md`
- **Architecture:** `HELIOS_LUMINERA_COMPREHENSIVE_ARCHITECTURE.md`
- **Kubernetes:** `infrastructure/k8s/production/README.md`

---

**Last Updated:** December 2024

