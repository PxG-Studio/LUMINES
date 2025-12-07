# Production Runbook
## Complete Operational Guide for LUMINES/WIS2L Production Environment

**Version:** 1.0.0
**Last Updated:** December 6, 2025
**Status:** ✅ **PRODUCTION READY**
**Maintained By:** DevOps Team

---

## Table of Contents

1. [Quick Reference](#1-quick-reference)
2. [Deployment Procedures](#2-deployment-procedures)
3. [Troubleshooting Guide](#3-troubleshooting-guide)
4. [Emergency Procedures](#4-emergency-procedures)
5. [Service Dependencies](#5-service-dependencies)
6. [Health Checks](#6-health-checks)
7. [Monitoring & Alerts](#7-monitoring--alerts)
8. [Rollback Procedures](#8-rollback-procedures)
9. [Maintenance Windows](#9-maintenance-windows)
10. [Contact Information](#10-contact-information)

---

## 1. Quick Reference

### 1.1 Critical Services

| Service | Port | Health Check | Status Endpoint |
|---------|------|--------------|-----------------|
| LUMINES Web | 3000 | `/api/health` | `http://localhost:3000/api/health` |
| PostgreSQL | 5432 | `pg_isready` | `postgresql://localhost:5432` |
| Redis | 6379 | `PING` | `redis://localhost:6379` |
| NATS | 4222 | `INFO` | `nats://localhost:4222` |

### 1.2 Quick Commands

```bash
# Check service health
curl http://localhost:3000/api/health

# Check database connection
psql $DATABASE_URL -c "SELECT 1"

# Check Redis connection
redis-cli -u $REDIS_URL PING

# Check NATS connection
nats server info

# View logs
docker-compose logs -f lumines-web
kubectl logs -f deployment/lumines-web -n lumines

# Restart service
docker-compose restart lumines-web
kubectl rollout restart deployment/lumines-web -n lumines
```

### 1.3 Emergency Contacts

- **On-Call Engineer:** [TO BE CONFIGURED]
- **DevOps Lead:** [TO BE CONFIGURED]
- **Database Admin:** [TO BE CONFIGURED]
- **Security Team:** [TO BE CONFIGURED]

---

## 2. Deployment Procedures

### 2.1 Pre-Deployment Checklist

**Before every deployment, verify:**

- [ ] All tests passing (unit, integration, E2E)
- [ ] Security scan passed (no critical vulnerabilities)
- [ ] Performance benchmarks met
- [ ] Database migrations ready and tested
- [ ] Environment variables updated
- [ ] Rollback plan prepared
- [ ] Deployment window scheduled
- [ ] Team notified
- [ ] Monitoring dashboards ready
- [ ] Backup completed (if database changes)

**Validation Script:**
```bash
# Run pre-deployment validation
./scripts/validate-production.sh

# Expected output: ✅ All checks passed
```

### 2.2 Deployment Steps

#### Option A: Docker Compose Deployment

```bash
# 1. Pull latest code
git pull origin main

# 2. Build new image
docker-compose build lumines-web

# 3. Run pre-deployment checks
./scripts/validate-production.sh

# 4. Stop current service (zero-downtime with load balancer)
docker-compose up -d --no-deps lumines-web

# 5. Wait for health check
sleep 30
curl http://localhost:3000/api/health

# 6. Verify deployment
./scripts/verify-deployment.sh

# 7. Monitor for issues
docker-compose logs -f lumines-web
```

#### Option B: Kubernetes Deployment

```bash
# 1. Update image tag
kubectl set image deployment/lumines-web \
  lumines-web=registry.example.com/lumines:latest \
  -n lumines

# 2. Wait for rollout
kubectl rollout status deployment/lumines-web -n lumines

# 3. Verify deployment
kubectl get pods -n lumines
curl http://lumines.example.com/api/health

# 4. Monitor for issues
kubectl logs -f deployment/lumines-web -n lumines
```

#### Option C: Automated CI/CD Deployment

```bash
# Deployment is automated via GitHub Actions
# Trigger: Push to main branch
# Workflow: .github/workflows/deploy.yml

# Monitor deployment:
gh run watch
```

### 2.3 Post-Deployment Verification

**Immediate Checks (within 5 minutes):**

1. **Health Check:**
   ```bash
   curl http://localhost:3000/api/health
   # Expected: {"status":"healthy","timestamp":"..."}
   ```

2. **Service Availability:**
   ```bash
   curl http://localhost:3000/api/metrics
   # Expected: Prometheus metrics
   ```

3. **Database Connectivity:**
   ```bash
   curl http://localhost:3000/api/health/db
   # Expected: {"database":"connected"}
   ```

4. **Error Rate:**
   ```bash
   # Check logs for errors
   docker-compose logs lumines-web | grep -i error
   kubectl logs deployment/lumines-web -n lumines | grep -i error
   ```

5. **Response Time:**
   ```bash
   time curl http://localhost:3000/api/health
   # Expected: < 200ms
   ```

**Extended Monitoring (30 minutes):**

- Monitor error rate (should be < 0.1%)
- Monitor response time (p95 < 500ms)
- Monitor database connection pool (should be < 80% utilized)
- Monitor memory usage (should be < 80%)
- Monitor CPU usage (should be < 70%)

### 2.4 Deployment Verification Script

```bash
#!/bin/bash
# scripts/verify-deployment.sh

set -e

echo "🔍 Verifying deployment..."

# Health check
HEALTH=$(curl -s http://localhost:3000/api/health)
if echo "$HEALTH" | grep -q "healthy"; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed: $HEALTH"
  exit 1
fi

# Database check
DB=$(curl -s http://localhost:3000/api/health/db)
if echo "$DB" | grep -q "connected"; then
  echo "✅ Database connection verified"
else
  echo "❌ Database connection failed: $DB"
  exit 1
fi

# Metrics check
METRICS=$(curl -s http://localhost:3000/api/metrics)
if [ -n "$METRICS" ]; then
  echo "✅ Metrics endpoint accessible"
else
  echo "❌ Metrics endpoint failed"
  exit 1
fi

echo "✅ Deployment verification complete"
```

---

## 3. Troubleshooting Guide

### 3.1 Common Issues

#### Issue: Service Not Starting

**Symptoms:**
- Container/pod in `CrashLoopBackOff`
- Service not responding to health checks
- Logs show startup errors

**Diagnosis:**
```bash
# Check logs
docker-compose logs lumines-web
kubectl logs deployment/lumines-web -n lumines

# Check environment variables
docker-compose config
kubectl get deployment lumines-web -n lumines -o yaml

# Check resource limits
kubectl describe pod -n lumines | grep -A 10 "Limits"
```

**Common Causes:**
1. Missing environment variables
2. Database connection failure
3. Port already in use
4. Insufficient resources
5. Invalid configuration

**Resolution:**
```bash
# 1. Verify environment variables
./scripts/validate-production.sh

# 2. Check database connectivity
psql $DATABASE_URL -c "SELECT 1"

# 3. Check port availability
netstat -tuln | grep 3000

# 4. Restart service
docker-compose restart lumines-web
kubectl rollout restart deployment/lumines-web -n lumines
```

#### Issue: Database Connection Errors

**Symptoms:**
- `ECONNREFUSED` errors in logs
- Health check shows database disconnected
- API requests failing with 500 errors

**Diagnosis:**
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool
curl http://localhost:3000/api/metrics | grep database_connections

# Check database logs
docker-compose logs postgres
kubectl logs deployment/postgres -n lumines
```

**Common Causes:**
1. Database server down
2. Incorrect connection string
3. Network connectivity issues
4. Connection pool exhausted
5. Database authentication failure

**Resolution:**
```bash
# 1. Verify database is running
docker-compose ps postgres
kubectl get pods -n lumines | grep postgres

# 2. Test connection
psql $DATABASE_URL -c "SELECT 1"

# 3. Check connection string
echo $DATABASE_URL

# 4. Restart database if needed
docker-compose restart postgres
kubectl rollout restart deployment/postgres -n lumines

# 5. Restart application
docker-compose restart lumines-web
kubectl rollout restart deployment/lumines-web -n lumines
```

#### Issue: High Error Rate

**Symptoms:**
- Error rate > 1%
- Multiple 5xx errors in logs
- Users reporting issues

**Diagnosis:**
```bash
# Check error rate
curl http://localhost:3000/api/metrics | grep http_requests_total

# Check recent errors
docker-compose logs lumines-web --tail=100 | grep -i error
kubectl logs deployment/lumines-web -n lumines --tail=100 | grep -i error

# Check error types
curl http://localhost:3000/api/metrics | grep http_requests_total | grep "status=\"5"
```

**Common Causes:**
1. Database connection issues
2. External API failures
3. Memory leaks
4. Resource exhaustion
5. Code bugs

**Resolution:**
```bash
# 1. Identify error pattern
docker-compose logs lumines-web --tail=500 | grep -i error | sort | uniq -c

# 2. Check resource usage
docker stats
kubectl top pods -n lumines

# 3. Check database
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity"

# 4. Restart service if needed
docker-compose restart lumines-web
kubectl rollout restart deployment/lumines-web -n lumines

# 5. Scale up if resource constrained
kubectl scale deployment/lumines-web --replicas=3 -n lumines
```

#### Issue: High Latency

**Symptoms:**
- Response time > 1s
- p95 latency > 500ms
- Users reporting slowness

**Diagnosis:**
```bash
# Check response time
time curl http://localhost:3000/api/health

# Check metrics
curl http://localhost:3000/api/metrics | grep http_request_duration

# Check database query time
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10"
```

**Common Causes:**
1. Slow database queries
2. External API latency
3. Resource constraints
4. Network issues
5. Cache misses

**Resolution:**
```bash
# 1. Check slow queries
psql $DATABASE_URL -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10"

# 2. Check cache hit rate
curl http://localhost:3000/api/metrics | grep cache_hits

# 3. Check resource usage
docker stats
kubectl top pods -n lumines

# 4. Optimize queries
# Review slow query log and optimize

# 5. Scale up if needed
kubectl scale deployment/lumines-web --replicas=3 -n lumines
```

### 3.2 Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 500 | Internal Server Error | Check logs, restart service |
| 502 | Bad Gateway | Check upstream services |
| 503 | Service Unavailable | Check health, restart service |
| 504 | Gateway Timeout | Check database, external APIs |
| ECONNREFUSED | Connection Refused | Check service availability |
| ETIMEDOUT | Connection Timeout | Check network, firewall |

### 3.3 Log Analysis

**Key Log Patterns:**

```bash
# Errors
grep -i error /var/log/lumines/*.log

# Warnings
grep -i warn /var/log/lumines/*.log

# Database errors
grep -i "database\|postgres\|connection" /var/log/lumines/*.log

# Authentication errors
grep -i "auth\|unauthorized\|forbidden" /var/log/lumines/*.log

# Performance issues
grep -i "slow\|timeout\|latency" /var/log/lumines/*.log
```

**Docker Logs:**
```bash
# Follow logs
docker-compose logs -f lumines-web

# Last 100 lines
docker-compose logs --tail=100 lumines-web

# Since timestamp
docker-compose logs --since="2025-12-06T00:00:00" lumines-web
```

**Kubernetes Logs:**
```bash
# Follow logs
kubectl logs -f deployment/lumines-web -n lumines

# Last 100 lines
kubectl logs --tail=100 deployment/lumines-web -n lumines

# Since timestamp
kubectl logs --since=1h deployment/lumines-web -n lumines

# All pods
kubectl logs -l app=lumines-web -n lumines
```

---

## 4. Emergency Procedures

### 4.1 Incident Response

**Severity Levels:**

- **P0 (Critical):** Service completely down, data loss, security breach
- **P1 (High):** Major functionality broken, significant user impact
- **P2 (Medium):** Minor functionality broken, limited user impact
- **P3 (Low):** Cosmetic issues, no user impact

**Response Procedure:**

1. **Acknowledge Incident** (within 5 minutes)
   - Identify severity
   - Notify team
   - Create incident ticket

2. **Assess Impact** (within 10 minutes)
   - Check service status
   - Check error rates
   - Check user reports
   - Check monitoring dashboards

3. **Contain Issue** (within 30 minutes)
   - Isolate affected services
   - Rollback if necessary
   - Scale up resources if needed
   - Apply hotfix if available

4. **Resolve Issue** (within 2 hours for P0)
   - Identify root cause
   - Apply fix
   - Verify resolution
   - Monitor for stability

5. **Post-Mortem** (within 24 hours)
   - Document incident
   - Root cause analysis
   - Action items
   - Prevention measures

### 4.2 Service Recovery

**Complete Service Failure:**

```bash
# 1. Check service status
docker-compose ps
kubectl get pods -n lumines

# 2. Check logs
docker-compose logs lumines-web
kubectl logs deployment/lumines-web -n lumines

# 3. Restart service
docker-compose restart lumines-web
kubectl rollout restart deployment/lumines-web -n lumines

# 4. Verify recovery
curl http://localhost:3000/api/health
```

**Database Failure:**

```bash
# 1. Check database status
docker-compose ps postgres
kubectl get pods -n lumines | grep postgres

# 2. Check database logs
docker-compose logs postgres
kubectl logs deployment/postgres -n lumines

# 3. Restart database
docker-compose restart postgres
kubectl rollout restart deployment/postgres -n lumines

# 4. Verify recovery
psql $DATABASE_URL -c "SELECT 1"

# 5. Restart application
docker-compose restart lumines-web
kubectl rollout restart deployment/lumines-web -n lumines
```

**Data Recovery:**

```bash
# 1. Identify backup
ls -lh /backups/postgres/

# 2. Restore from backup
pg_restore -d lumines /backups/postgres/lumines_$(date +%Y%m%d).dump

# 3. Verify data
psql $DATABASE_URL -c "SELECT count(*) FROM users"

# 4. Notify team
# Send notification about data restoration
```

### 4.3 Communication Plan

**During Incident:**

1. **Internal Communication:**
   - Slack: `#incidents` channel
   - Email: `incidents@example.com`
   - PagerDuty: Auto-escalation

2. **External Communication:**
   - Status page: `https://status.example.com`
   - Twitter: `@example_status`
   - Email: `status@example.com`

**Communication Template:**

```
[INCIDENT] Service Degradation - LUMINES

Status: Investigating
Impact: Partial service degradation
Started: [TIMESTAMP]
Affected: [SERVICES/USERS]

We are currently investigating an issue affecting [SERVICE].
We will provide updates every 15 minutes.

Last Update: [TIMESTAMP]
```

---

## 5. Service Dependencies

### 5.1 Dependency Map

```
LUMINES Web Application
├── PostgreSQL (Required)
│   ├── Connection Pool
│   ├── Migrations
│   └── Replication
├── Redis (Required)
│   ├── Session Store
│   ├── Cache
│   └── Queue
├── NATS (Required)
│   ├── Event Publishing
│   └── Event Subscribing
└── External APIs (Optional)
    ├── Authentication Service
    └── Third-party APIs
```

### 5.2 Dependency Health Checks

**PostgreSQL:**
```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"

# Check replication
psql $DATABASE_URL -c "SELECT * FROM pg_stat_replication"

# Check connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity"
```

**Redis:**
```bash
# Check connection
redis-cli -u $REDIS_URL PING

# Check memory
redis-cli -u $REDIS_URL INFO memory

# Check keys
redis-cli -u $REDIS_URL DBSIZE
```

**NATS:**
```bash
# Check connection
nats server info

# Check subscriptions
nats sub list
```

### 5.3 Service Restart Order

**Normal Restart:**
1. Database (PostgreSQL)
2. Cache (Redis)
3. Message Queue (NATS)
4. Application (LUMINES Web)

**Emergency Restart:**
1. Application (LUMINES Web) - fastest recovery
2. Message Queue (NATS)
3. Cache (Redis)
4. Database (PostgreSQL) - if needed

---

## 6. Health Checks

### 6.1 Health Check Endpoints

**Application Health:**
```bash
curl http://localhost:3000/api/health
# Response: {"status":"healthy","timestamp":"2025-12-06T00:00:00Z"}
```

**Database Health:**
```bash
curl http://localhost:3000/api/health/db
# Response: {"database":"connected","latency":"5ms"}
```

**Cache Health:**
```bash
curl http://localhost:3000/api/health/cache
# Response: {"cache":"connected","latency":"2ms"}
```

**Message Queue Health:**
```bash
curl http://localhost:3000/api/health/nats
# Response: {"nats":"connected","latency":"3ms"}
```

**Readiness Check:**
```bash
curl http://localhost:3000/api/ready
# Response: {"ready":true,"checks":{"database":true,"cache":true,"nats":true}}
```

**Liveness Check:**
```bash
curl http://localhost:3000/api/live
# Response: {"alive":true}
```

### 6.2 Health Check Script

```bash
#!/bin/bash
# scripts/health-check.sh

set -e

echo "🔍 Running health checks..."

# Application health
HEALTH=$(curl -s http://localhost:3000/api/health)
if echo "$HEALTH" | grep -q "healthy"; then
  echo "✅ Application: Healthy"
else
  echo "❌ Application: Unhealthy - $HEALTH"
  exit 1
fi

# Database health
DB=$(curl -s http://localhost:3000/api/health/db)
if echo "$DB" | grep -q "connected"; then
  echo "✅ Database: Connected"
else
  echo "❌ Database: Disconnected - $DB"
  exit 1
fi

# Cache health
CACHE=$(curl -s http://localhost:3000/api/health/cache)
if echo "$CACHE" | grep -q "connected"; then
  echo "✅ Cache: Connected"
else
  echo "❌ Cache: Disconnected - $CACHE"
  exit 1
fi

# NATS health
NATS=$(curl -s http://localhost:3000/api/health/nats)
if echo "$NATS" | grep -q "connected"; then
  echo "✅ NATS: Connected"
else
  echo "❌ NATS: Disconnected - $NATS"
  exit 1
fi

echo "✅ All health checks passed"
```

---

## 7. Monitoring & Alerts

### 7.1 Key Metrics

**Application Metrics:**
- Request rate (requests/second)
- Error rate (errors/requests)
- Response time (p50, p95, p99)
- Active connections
- Memory usage
- CPU usage

**Database Metrics:**
- Connection pool usage
- Query latency
- Replication lag
- Disk usage
- Cache hit rate

**Infrastructure Metrics:**
- CPU usage
- Memory usage
- Disk I/O
- Network I/O
- Pod/container count

### 7.2 Alert Thresholds

| Metric | Warning | Critical | Action |
|--------|---------|----------|--------|
| Error Rate | > 0.1% | > 1% | Investigate, restart if needed |
| Response Time (p95) | > 500ms | > 1s | Check database, optimize |
| CPU Usage | > 70% | > 90% | Scale up |
| Memory Usage | > 80% | > 95% | Scale up, check leaks |
| Database Connections | > 80% | > 95% | Increase pool, optimize |
| Disk Usage | > 80% | > 90% | Clean up, expand |

### 7.3 Monitoring Dashboards

**Grafana Dashboards:**
- Application Overview
- Database Performance
- Infrastructure Health
- Error Analysis
- User Activity

**Access:**
- Grafana: `https://grafana.example.com`
- Prometheus: `https://prometheus.example.com`

---

## 8. Rollback Procedures

### 8.1 Quick Rollback

**Docker Compose:**
```bash
# 1. Stop current service
docker-compose stop lumines-web

# 2. Checkout previous version
git checkout <previous-commit>

# 3. Rebuild and start
docker-compose build lumines-web
docker-compose up -d lumines-web

# 4. Verify rollback
curl http://localhost:3000/api/health
```

**Kubernetes:**
```bash
# 1. Rollback deployment
kubectl rollout undo deployment/lumines-web -n lumines

# 2. Wait for rollout
kubectl rollout status deployment/lumines-web -n lumines

# 3. Verify rollback
curl http://lumines.example.com/api/health
```

### 8.2 Database Rollback

**If migrations need rollback:**
```bash
# 1. Identify migration to rollback
psql $DATABASE_URL -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5"

# 2. Rollback migration
npx prisma migrate resolve --rolled-back <migration-name>

# 3. Verify rollback
psql $DATABASE_URL -c "SELECT * FROM _prisma_migrations"
```

**⚠️ WARNING:** Database rollbacks can cause data loss. Always backup before rollback.

### 8.3 Rollback Checklist

- [ ] Identify issue
- [ ] Stop deployment
- [ ] Backup current state
- [ ] Rollback application
- [ ] Rollback database (if needed)
- [ ] Verify rollback
- [ ] Monitor for stability
- [ ] Document rollback reason

---

## 9. Maintenance Windows

### 9.1 Scheduled Maintenance

**Regular Maintenance:**
- **Weekly:** Database backups, log rotation
- **Monthly:** Security updates, dependency updates
- **Quarterly:** Performance review, capacity planning

**Maintenance Window:**
- **Schedule:** Sunday 2:00 AM - 4:00 AM UTC
- **Duration:** 2 hours
- **Notification:** 48 hours in advance

### 9.2 Maintenance Procedures

**Before Maintenance:**
1. Notify users (48 hours)
2. Create maintenance ticket
3. Backup all data
4. Prepare rollback plan
5. Schedule team availability

**During Maintenance:**
1. Put service in maintenance mode
2. Perform maintenance tasks
3. Verify service health
4. Test critical paths
5. Remove maintenance mode

**After Maintenance:**
1. Verify all services
2. Monitor for issues
3. Update documentation
4. Close maintenance ticket
5. Post-maintenance report

---

## 10. Contact Information

### 10.1 On-Call Rotation

**Current On-Call:**
- Primary: [TO BE CONFIGURED]
- Secondary: [TO BE CONFIGURED]

**Escalation:**
1. On-Call Engineer (5 minutes)
2. DevOps Lead (15 minutes)
3. Engineering Manager (30 minutes)
4. CTO (1 hour)

### 10.2 Communication Channels

- **Slack:** `#incidents`, `#devops`, `#alerts`
- **Email:** `devops@example.com`, `incidents@example.com`
- **PagerDuty:** [TO BE CONFIGURED]
- **Phone:** [TO BE CONFIGURED]

### 10.3 External Contacts

- **Cloud Provider:** [TO BE CONFIGURED]
- **Database Hosting:** [TO BE CONFIGURED]
- **CDN Provider:** [TO BE CONFIGURED]
- **Security Vendor:** [TO BE CONFIGURED]

---

## Appendix

### A. Environment Variables

**Required:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `NATS_URL` - NATS connection string
- `NOCTURNA_JWT_SECRET` - JWT secret key

**Optional:**
- `SENTRY_DSN` - Error tracking
- `LOG_LEVEL` - Logging level
- `NODE_ENV` - Environment (production/development)

### B. Useful Commands

```bash
# Service management
docker-compose up -d
docker-compose down
docker-compose restart

kubectl apply -f k8s/
kubectl delete -f k8s/
kubectl rollout restart deployment/lumines-web -n lumines

# Database management
npm run db:migrate
npm run db:seed
npm run db:studio

# Monitoring
curl http://localhost:3000/api/metrics
curl http://localhost:3000/api/health

# Logs
docker-compose logs -f
kubectl logs -f deployment/lumines-web -n lumines
```

### C. Documentation Links

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Environment Setup](./ENVIRONMENT_SETUP.md)
- [Prisma Migration Guide](./PRISMA_MIGRATION_GUIDE.md)
- [API Documentation](./API_DOCUMENTATION.md)

---

**Document Version:** 1.0.0
**Last Updated:** December 6, 2025
**Next Review:** January 6, 2026

