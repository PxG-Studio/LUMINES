# SPARK Deployment Runbook

**Version:** 1.0  
**Last Updated:** December 7, 2024

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deployment Procedures](#deployment-procedures)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Rollback Procedures](#rollback-procedures)
6. [Troubleshooting](#troubleshooting)
7. [Monitoring & Alerts](#monitoring--alerts)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No linter errors (`npm run lint:eslint`)
- [ ] TypeScript compilation successful (`npm run typecheck`)
- [ ] Build successful (`npm run build`)
- [ ] Security scan passed (`npm audit`)

### Configuration
- [ ] Environment variables configured
- [ ] API keys set (Anthropic/OpenAI)
- [ ] Database connection tested
- [ ] Redis connection tested (if used)
- [ ] NATS connection tested (if used)

### Documentation
- [ ] Changelog updated
- [ ] API documentation updated
- [ ] Deployment notes reviewed

---

## Environment Setup

### Required Environment Variables

```bash
# AI Provider API Keys (at least one required)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-proj-...

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# API Authentication (optional for MVP)
SPARK_MASTER_API_KEY=your-master-key
SPARK_API_KEYS=user-{userId}-{hash1},user-{userId}-{hash2}

# Database (if using)
DATABASE_URL=postgresql://...

# Redis (if using)
REDIS_URL=redis://...

# NATS (optional for MVP)
NEXT_PUBLIC_NATS_WS_URL=ws://...

# Monitoring (optional)
SENTRY_DSN=https://...
ERROR_TRACKING_URL=https://...
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Staging
```bash
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.example.com
```

#### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://production.example.com
```

---

## Deployment Procedures

### Automated Deployment (CI/CD)

SPARK uses GitHub Actions for automated deployment:

1. **Push to `develop` branch**
   - Triggers staging deployment
   - Runs tests and security scans
   - Deploys to staging environment

2. **Push to `main` branch**
   - Triggers production deployment
   - Runs full test suite
   - Deploys to production environment

### Manual Deployment

#### Step 1: Build Application
```bash
# Install dependencies
npm ci

# Run tests
npm test

# Build application
npm run build
```

#### Step 2: Deploy to Server

**Vercel:**
```bash
vercel --prod
```

**Docker:**
```bash
docker build -t spark:latest .
docker run -p 3000:3000 --env-file .env.production spark:latest
```

**Kubernetes:**
```bash
kubectl apply -f k8s/spark-deployment.yaml
kubectl rollout status deployment/spark
```

#### Step 3: Verify Deployment
```bash
# Check health endpoint
curl https://your-domain.com/api/spark/health

# Check metrics endpoint
curl https://your-domain.com/api/metrics
```

---

## Post-Deployment Verification

### Health Checks

1. **Basic Health**
   ```bash
   curl https://your-domain.com/api/spark/health
   ```
   Expected: `{"status":"healthy",...}`

2. **Circuit Breaker Status**
   - Check health endpoint for circuit breaker states
   - Should be `closed` for both Claude and OpenAI

3. **Metrics Availability**
   ```bash
   curl https://your-domain.com/api/metrics
   ```
   Expected: Prometheus format metrics

### Functional Tests

1. **Generate Script**
   ```bash
   curl -X POST https://your-domain.com/api/spark/generate \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your-key" \
     -d '{"prompt":"Create a Unity player controller"}'
   ```

2. **Export Script**
   ```bash
   curl -X POST https://your-domain.com/api/export \
     -H "Content-Type: application/json" \
     -H "X-API-Key: your-key" \
     -d '{"code":"...","scriptName":"PlayerController"}'
   ```

### Performance Checks

1. **Response Times**
   - Generation: < 15 seconds
   - Export: < 2 seconds
   - Health check: < 100ms

2. **Error Rates**
   - Check metrics endpoint for error rates
   - Should be < 1% for successful deployment

---

## Rollback Procedures

### Quick Rollback (Last Deployment)

**Vercel:**
```bash
vercel rollback
```

**Docker:**
```bash
docker tag spark:previous spark:latest
docker-compose up -d
```

**Kubernetes:**
```bash
kubectl rollout undo deployment/spark
```

### Full Rollback (Previous Version)

1. **Revert Code**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Redeploy**
   - Follow deployment procedures
   - Verify rollback successful

### Database Rollback

If database migrations were applied:
```bash
# Rollback last migration
npm run migrate:rollback

# Or rollback to specific version
npm run migrate:rollback -- --to=20240101000000
```

---

## Troubleshooting

### Common Issues

#### 1. Health Check Failing

**Symptoms:**
- Health endpoint returns 503
- Circuit breakers open

**Solutions:**
1. Check API keys are configured
2. Verify external services (Claude/OpenAI) are accessible
3. Check circuit breaker status in health endpoint
4. Review error logs

#### 2. High Error Rates

**Symptoms:**
- Metrics show high error rates
- Users reporting failures

**Solutions:**
1. Check error tracker for recent errors
2. Review circuit breaker states
3. Verify API key quotas
4. Check rate limiting status

#### 3. Slow Response Times

**Symptoms:**
- Generation taking > 30 seconds
- High p95 latency in metrics

**Solutions:**
1. Check cache hit rates
2. Verify AI provider status
3. Review connection pool usage
4. Check for resource constraints

#### 4. Rate Limiting Issues

**Symptoms:**
- Users getting 429 errors
- Rate limit headers show 0 remaining

**Solutions:**
1. Check rate limit configuration
2. Verify per-user limits are appropriate
3. Review rate limit reset times
4. Consider increasing limits if needed

### Debug Commands

```bash
# Check application logs
docker logs spark-container

# Check metrics
curl https://your-domain.com/api/metrics | grep spark_

# Check error statistics
curl https://your-domain.com/api/spark/health | jq '.checks.errorTracking'

# Test API key authentication
curl -H "X-API-Key: your-key" https://your-domain.com/api/spark/health
```

---

## Monitoring & Alerts

### Key Metrics to Monitor

1. **Request Rates**
   - `spark_generation_total`
   - `api_export_total`
   - `api_generate_total`

2. **Error Rates**
   - `errors_total` by severity
   - Error rate percentage

3. **Performance**
   - `spark_generation_duration_ms` (p50, p95, p99)
   - `api_export_duration_ms`
   - Cache hit rates

4. **Circuit Breakers**
   - Circuit breaker states (closed/open/half-open)
   - Failure counts

### Alert Thresholds

- **Critical:** Error rate > 10%
- **Warning:** Error rate > 5%
- **Critical:** Circuit breaker open for > 5 minutes
- **Warning:** P95 latency > 10 seconds
- **Warning:** Cache hit rate < 50%

### Alert Channels

- Email: devops@example.com
- Slack: #spark-alerts
- PagerDuty: SPARK service

---

## Emergency Procedures

### Service Outage

1. **Immediate Actions**
   - Check health endpoint
   - Review error logs
   - Check external service status (Claude/OpenAI)

2. **If AI Provider Down**
   - Circuit breaker should open automatically
   - Consider switching providers
   - Notify users of degraded service

3. **If Application Down**
   - Rollback to previous version
   - Check resource constraints
   - Review recent deployments

### Security Incident

1. **If API Key Compromised**
   - Rotate API keys immediately
   - Revoke compromised keys
   - Review access logs

2. **If Data Breach Suspected**
   - Isolate affected systems
   - Review audit logs
   - Notify security team

---

## Maintenance Windows

### Scheduled Maintenance

- **Weekly:** Review metrics and error logs
- **Monthly:** Security updates and dependency updates
- **Quarterly:** Performance optimization review

### Maintenance Procedure

1. Announce maintenance window
2. Put application in maintenance mode
3. Perform updates
4. Run verification tests
5. Resume normal operations
6. Monitor for issues

---

## Support Contacts

- **DevOps:** devops@example.com
- **On-Call:** +1-XXX-XXX-XXXX
- **Slack:** #spark-support

---

**Last Updated:** December 7, 2024  
**Next Review:** January 7, 2025

