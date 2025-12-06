# Production Deployment Execution Guide
## Complete Guide for Executing Production Deployment

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ **READY FOR USE**

---

## Overview

This guide covers the complete execution of production deployment for LUMINES/WIS2L, including deployment execution, verification, smoke testing, and continuous monitoring.

---

## Quick Start

### Automated Deployment

```bash
# Execute complete production deployment
./scripts/execute-production-deployment.sh
```

This script automatically:
- Runs pre-deployment preparation
- Executes production deployment
- Verifies deployment
- Runs smoke tests
- Verifies monitoring
- Provides monitoring guidance

---

## Detailed Deployment Process

### Step 1: Pre-Deployment Preparation

**Purpose:** Ensure all prerequisites are met.

**Script:**
```bash
./scripts/prepare-production-deployment.sh
```

**Checklist:**
- [ ] Production readiness review passed
- [ ] Pre-deployment backup created
- [ ] DR procedures verified
- [ ] Environment validated
- [ ] Monitoring verified
- [ ] Team prepared

---

### Step 2: Execute Production Deployment

**Purpose:** Deploy application to production.

**Script:**
```bash
# Automated deployment
./scripts/execute-production-deployment.sh

# Or manual deployment
./scripts/deploy-production.sh production
```

**Deployment Methods:**

#### Docker Compose
```bash
docker-compose build lumines-web
docker-compose up -d --no-deps lumines-web
```

#### Kubernetes
```bash
kubectl apply -f infrastructure/k8s/production/manifests/
kubectl rollout status deployment/lumines-web -n lumines
```

#### CI/CD
```bash
# Trigger via GitHub Actions
gh workflow run production-deploy.yml
```

---

### Step 3: Post-Deployment Verification

**Purpose:** Verify deployment was successful.

**Script:**
```bash
./scripts/verify-deployment.sh
```

**Manual Verification:**
```bash
# Health check
curl https://lumenforge.io/api/health

# Database health
curl https://lumenforge.io/api/health/db

# Metrics
curl https://lumenforge.io/api/metrics
```

**Verification Checklist:**
- [ ] Health endpoint responding (200)
- [ ] Database connection verified
- [ ] Metrics endpoint accessible
- [ ] Response time < 500ms
- [ ] No critical errors in logs

---

### Step 4: Production Smoke Tests

**Purpose:** Quick validation of critical functionality.

**Script:**
```bash
BASE_URL=https://lumenforge.io npm run test:e2e -- tests/e2e/smoke.spec.ts
```

**Tests:**
- Health endpoint
- Database health
- Metrics endpoint
- Home page
- API base
- Authentication endpoints
- Response time

---

### Step 5: Monitoring Verification

**Purpose:** Ensure monitoring infrastructure is working.

**Script:**
```bash
./scripts/verify-monitoring.sh
```

**Manual Verification:**
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Alertmanager: http://localhost:9093

---

### Step 6: Continuous Monitoring

**Purpose:** Monitor production for issues.

**Script:**
```bash
# Monitor for 1 hour
./scripts/monitor-production.sh

# Monitor for custom duration (in seconds)
MONITORING_DURATION=7200 ./scripts/monitor-production.sh
```

**Monitoring Checklist:**
- [ ] Error rate < 0.1%
- [ ] Response time p95 < 500ms
- [ ] Database connection pool healthy
- [ ] Cache hit rates acceptable
- [ ] Message queue depth normal
- [ ] No critical alerts

---

## Monitoring Dashboard

### Key Metrics to Watch

1. **Error Rate**
   - Target: < 0.1%
   - Alert: > 0.5%
   - Critical: > 1%

2. **Response Time (p95)**
   - Target: < 500ms
   - Alert: > 1s
   - Critical: > 2s

3. **Database Connections**
   - Target: < 80% of pool
   - Alert: > 90%
   - Critical: > 95%

4. **Cache Hit Rate**
   - Target: > 80%
   - Alert: < 70%
   - Critical: < 60%

5. **Message Queue Depth**
   - Target: < 1000 messages
   - Alert: > 5000
   - Critical: > 10000

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
5. Consider rollback

### Health Checks Fail

**Symptoms:**
- Health endpoint returns 500
- Database health fails
- Metrics unavailable

**Solutions:**
1. Check service logs
2. Verify database connection
3. Check resource usage
4. Review configuration
5. Consider rollback

### High Error Rate

**Symptoms:**
- Error rate > 0.1%
- Multiple 5xx errors
- User complaints

**Solutions:**
1. Review error logs
2. Check database performance
3. Verify cache connectivity
4. Review recent changes
5. Consider rollback

### High Response Time

**Symptoms:**
- Response time > 500ms
- Slow database queries
- High CPU usage

**Solutions:**
1. Check database performance
2. Review query optimization
3. Check cache hit rates
4. Scale resources if needed
5. Review application code

---

## Rollback Procedure

### Immediate Rollback

If critical issues are detected:

```bash
# Docker Compose
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build lumines-web

# Kubernetes
kubectl rollout undo deployment/lumines-web -n lumines
```

### Database Rollback

If database changes need to be rolled back:

```bash
# Restore from backup
./scripts/test-backup-restore.sh
```

### Communication

1. Notify team immediately
2. Update status page
3. Document issue
4. Schedule post-mortem

---

## Post-Deployment Checklist

### Immediate (First 15 Minutes)
- [ ] Health endpoint responding
- [ ] Database connection verified
- [ ] Metrics endpoint accessible
- [ ] Smoke tests passing
- [ ] No critical errors in logs

### Short Term (First Hour)
- [ ] Error rate < 0.1%
- [ ] Response time acceptable
- [ ] Monitoring dashboards active
- [ ] Alerts configured
- [ ] Team monitoring

### Long Term (First 24 Hours)
- [ ] No critical issues
- [ ] Performance within targets
- [ ] User feedback positive
- [ ] All services stable
- [ ] Post-deployment verification complete

---

## Success Criteria

### Deployment Success
- ✅ All services deployed
- ✅ Health checks passing
- ✅ Smoke tests passing
- ✅ Monitoring active
- ✅ No critical errors

### Production Health
- ✅ Error rate < 0.1%
- ✅ Response time p95 < 500ms
- ✅ Database connections healthy
- ✅ Cache hit rate > 80%
- ✅ Message queue depth normal

---

## Next Steps

After successful deployment:

1. **Monitor for 24 Hours**
   - Watch error rates
   - Monitor response times
   - Review logs
   - Check user feedback

2. **Run Post-Deployment Verification**
   - Comprehensive health check
   - Performance verification
   - Security audit
   - Team handoff

3. **Document Results**
   - Deployment summary
   - Performance metrics
   - Issues encountered
   - Lessons learned

---

## Support

For issues or questions:
- Review: `docs/PRODUCTION_RUNBOOK.md`
- Check: `docs/DISASTER_RECOVERY.md`
- Contact: DevOps team

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ **READY FOR USE**

