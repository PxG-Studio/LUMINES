# Staging Deployment Guide
## Complete Guide for Deploying to Staging Environment

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ **READY FOR USE**

---

## Overview

This guide covers the complete process of deploying LUMINES/WIS2L to the staging environment, including pre-deployment validation, deployment execution, verification, and smoke testing.

---

## Prerequisites

### Required Components

- [x] Production environment configured
- [x] Monitoring infrastructure deployed
- [x] Database accessible
- [x] Redis accessible
- [x] NATS accessible
- [x] Docker/Docker Compose or Kubernetes cluster

### Required Scripts

- `scripts/deploy-staging.sh` - Main staging deployment script
- `scripts/verify-deployment.sh` - Deployment verification
- `scripts/final-validation.sh` - Pre-deployment validation
- `scripts/verify-monitoring.sh` - Monitoring verification

---

## Quick Start

### 1. Pre-Deployment Validation

```bash
# Run final validation
./scripts/final-validation.sh
```

### 2. Deploy to Staging

```bash
# Deploy with staging configuration
./scripts/deploy-staging.sh
```

### 3. Verify Deployment

```bash
# Verify deployment health
./scripts/verify-deployment.sh
```

### 4. Run Smoke Tests

```bash
# Run smoke tests
BASE_URL=http://localhost:3000 npm run test:e2e -- tests/e2e/smoke.spec.ts
```

---

## Detailed Deployment Process

### Step 1: Pre-Deployment Validation

**Purpose:** Ensure all prerequisites are met before deployment.

**Actions:**
1. Run final validation script
2. Check environment variables
3. Verify database connectivity
4. Verify Redis connectivity
5. Verify NATS connectivity

**Script:**
```bash
./scripts/final-validation.sh
```

**Expected Output:**
- ✅ All critical checks passed
- ⚠️  Warnings (if any) documented
- ❌ Errors (if any) must be fixed

---

### Step 2: Deploy to Staging

**Purpose:** Deploy application to staging environment.

**Actions:**
1. Build application
2. Run tests
3. Deploy with Docker Compose or Kubernetes
4. Wait for services to be ready

**Script:**
```bash
./scripts/deploy-staging.sh
```

**Environment Variables:**
```bash
export NODE_ENV=staging
export DATABASE_URL=postgresql://user:password@host:5432/lumines_staging
export REDIS_URL=redis://host:6379/0
export NATS_URL=nats://host:4222
export STAGING_URL=http://localhost:3000
```

---

### Step 3: Deployment Verification

**Purpose:** Verify that deployment was successful.

**Actions:**
1. Check health endpoint
2. Check database connection
3. Check metrics endpoint
4. Verify response times

**Script:**
```bash
./scripts/verify-deployment.sh
```

**Manual Verification:**
```bash
# Health check
curl http://localhost:3000/api/health

# Database health
curl http://localhost:3000/api/health/db

# Metrics
curl http://localhost:3000/api/metrics
```

---

### Step 4: Smoke Tests

**Purpose:** Quick validation of critical functionality.

**Tests:**
- Health endpoint responding
- Database health endpoint
- Metrics endpoint
- Home page serving
- API base responding
- Authentication endpoints
- Response time < 1s

**Script:**
```bash
BASE_URL=http://localhost:3000 npm run test:e2e -- tests/e2e/smoke.spec.ts
```

**Expected Results:**
- All smoke tests passing
- Response times acceptable
- No critical errors

---

### Step 5: Monitoring Verification

**Purpose:** Verify monitoring infrastructure is working.

**Actions:**
1. Check Prometheus scraping
2. Check Grafana dashboards
3. Check Alertmanager status

**Script:**
```bash
./scripts/verify-monitoring.sh
```

**Manual Verification:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Alertmanager: http://localhost:9093

---

## Smoke Test Suite

### Test Coverage

The smoke test suite (`tests/e2e/smoke.spec.ts`) includes:

1. **Health Endpoint**
   - Verifies `/api/health` returns 200
   - Checks response structure

2. **Database Health**
   - Verifies `/api/health/db` returns 200
   - Checks database connectivity

3. **Metrics Endpoint**
   - Verifies `/api/metrics` returns Prometheus format
   - Checks metrics are being collected

4. **Home Page**
   - Verifies home page loads
   - Checks page title

5. **API Base**
   - Verifies API base responds
   - Checks no 500 errors

6. **Authentication**
   - Verifies auth endpoints exist
   - Checks proper error handling

7. **Response Time**
   - Verifies response time < 1s
   - Checks performance

---

## Troubleshooting

### Deployment Fails

**Symptoms:**
- Build fails
- Services don't start
- Health checks fail

**Solutions:**
1. Check logs: `docker-compose logs lumines-web`
2. Verify environment variables
3. Check database connectivity
4. Review error messages

### Smoke Tests Fail

**Symptoms:**
- Health endpoint returns 500
- Tests timeout
- Response times too high

**Solutions:**
1. Check service logs
2. Verify database connection
3. Check resource usage
4. Review test output

### Monitoring Not Working

**Symptoms:**
- Prometheus not scraping
- Grafana dashboards empty
- Alerts not firing

**Solutions:**
1. Check monitoring services: `docker-compose ps`
2. Verify Prometheus targets: http://localhost:9090/targets
3. Check Grafana data sources
4. Review Alertmanager configuration

---

## Rollback Procedure

If deployment fails or issues are discovered:

### Quick Rollback

```bash
# Stop current deployment
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Redeploy
./scripts/deploy-staging.sh
```

### Database Rollback

```bash
# Restore from backup
./scripts/test-backup-restore.sh
```

---

## Post-Deployment Checklist

- [ ] Health endpoint responding
- [ ] Database connection verified
- [ ] Redis connection verified
- [ ] NATS connection verified
- [ ] Smoke tests passing
- [ ] Monitoring active
- [ ] Logs accessible
- [ ] No critical errors
- [ ] Response times acceptable
- [ ] Team notified

---

## Next Steps

After successful staging deployment:

1. **Run Full E2E Tests**
   ```bash
   npm run test:e2e
   ```

2. **Performance Testing**
   ```bash
   ./tests/performance/benchmark.sh
   ```

3. **Load Testing**
   ```bash
   k6 run tests/performance/load-test.js
   ```

4. **Prepare for Production**
   - Review staging results
   - Update production runbook
   - Schedule production deployment

---

## Support

For issues or questions:
- Review: `docs/PRODUCTION_RUNBOOK.md`
- Check: `docs/MONITORING_SETUP.md`
- Contact: DevOps team

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ **READY FOR USE**

