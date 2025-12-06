# Disaster Recovery Runbook
## Complete Disaster Recovery Procedures for LUMINES/WIS2L

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ **PRODUCTION READY**

---

## Table of Contents

1. [Overview](#1-overview)
2. [RTO/RPO Definitions](#2-rtorpo-definitions)
3. [Backup Procedures](#3-backup-procedures)
4. [Failover Procedures](#4-failover-procedures)
5. [Recovery Procedures](#5-recovery-procedures)
6. [Testing Procedures](#6-testing-procedures)
7. [Contact Information](#7-contact-information)

---

## 1. Overview

This document provides complete disaster recovery procedures for LUMINES/WIS2L production environment.

### Disaster Scenarios

| Scenario | Impact | Recovery Method | RTO | RPO |
|----------|--------|-----------------|-----|-----|
| Database Failure | High | Failover to replica | 5 min | 0 min |
| Application Failure | High | Restart/Rollback | 2 min | 0 min |
| Data Center Failure | Critical | Failover to DR site | 30 min | 5 min |
| Data Corruption | Critical | Restore from backup | 1 hour | 24 hours |
| Security Breach | Critical | Isolate and restore | 2 hours | 0 min |

---

## 2. RTO/RPO Definitions

### 2.1 Recovery Time Objective (RTO)

**Definition:** Maximum acceptable downtime after a disaster.

| Service | RTO | Justification |
|---------|-----|---------------|
| **Application** | 5 minutes | Critical business operations |
| **Database** | 5 minutes | Data access required |
| **Cache (Redis)** | 10 minutes | Can degrade gracefully |
| **Message Queue (NATS)** | 10 minutes | Can queue messages |

### 2.2 Recovery Point Objective (RPO)

**Definition:** Maximum acceptable data loss.

| Service | RPO | Justification |
|---------|-----|---------------|
| **Database** | 0 minutes | Streaming replication |
| **Application State** | 0 minutes | Stateless design |
| **Cache (Redis)** | 5 minutes | Can rebuild from database |
| **Message Queue (NATS)** | 5 minutes | Messages can be reprocessed |

---

## 3. Backup Procedures

### 3.1 Database Backups

#### Automated Backups

**PostgreSQL:**
- **Frequency:** Daily at 2:00 AM UTC
- **Retention:** 30 days
- **Location:** `/backups/postgres/`
- **Method:** `pg_dump` with compression

**Backup Script:**
```bash
#!/bin/bash
# scripts/backup-postgres.sh

BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/lumines_$DATE.dump"

# Create backup
pg_dump -h $DATABASE_HOST -U $DATABASE_USER -d lumines \
  -F c -b -v -f "$BACKUP_FILE"

# Compress
gzip "$BACKUP_FILE"

# Remove backups older than 30 days
find "$BACKUP_DIR" -name "*.dump.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

#### Manual Backups

**Before Major Changes:**
```bash
# Create manual backup
./scripts/backup-postgres.sh manual

# Or using pg_dump directly
pg_dump -h 192.168.86.27 -U postgres -d lumines \
  -F c -b -v -f /backups/postgres/manual_$(date +%Y%m%d_%H%M%S).dump
```

### 3.2 Redis Backups

**Method:** AOF (Append-Only File) persistence

**Configuration:**
```redis
appendonly yes
appendfsync everysec
```

**Backup Location:** Redis data directory (automated)

**Manual Backup:**
```bash
# Copy AOF file
cp /var/lib/redis/appendonly.aof /backups/redis/appendonly_$(date +%Y%m%d_%H%M%S).aof
```

### 3.3 Application Backups

**Method:** Git repository (version control)

**Backup Location:** GitHub (remote repository)

**Manual Backup:**
```bash
# Push to remote
git push origin main

# Create release tag
git tag -a v$(date +%Y%m%d) -m "Backup tag"
git push origin --tags
```

### 3.4 Configuration Backups

**Backup:**
- Environment variables (secrets)
- Kubernetes manifests
- Docker Compose files
- Configuration files

**Location:** Encrypted storage (separate from application)

---

## 4. Failover Procedures

### 4.1 Database Failover

#### Primary Database Failure

**Scenario:** Primary PostgreSQL (192.168.86.27) is down

**Procedure:**

1. **Verify Primary is Down:**
   ```bash
   # Check connectivity
   psql -h 192.168.86.27 -U postgres -d lumines -c "SELECT 1" || echo "Primary is down"
   ```

2. **Promote Replica to Primary:**
   ```bash
   # On replica (192.168.86.28 or DR server)
   # Stop replica mode
   psql -h 192.168.86.28 -U postgres -d lumines -c "SELECT pg_promote();"
   
   # Or manually
   # Remove recovery.conf or standby.signal
   rm /var/lib/postgresql/data/standby.signal
   
   # Restart PostgreSQL
   systemctl restart postgresql
   # Or on Synology: /usr/syno/bin/synopkg restart pgsql
   ```

3. **Update Application Configuration:**
   ```bash
   # Update DATABASE_URL
   export DATABASE_URL="postgresql://user:password@192.168.86.28:5432/lumines"
   
   # Restart application
   docker-compose restart lumines-web
   # Or kubectl rollout restart deployment/lumines-web
   ```

4. **Verify Failover:**
   ```bash
   # Check database connectivity
   curl http://localhost:3000/api/health/db
   
   # Check application
   curl http://localhost:3000/api/health
   ```

5. **Update DNS/Load Balancer:**
   - Point database connection to new primary
   - Update connection strings

**Recovery Time:** 5-10 minutes

### 4.2 Application Failover

#### Application Instance Failure

**Scenario:** Application pod/container is down

**Procedure:**

1. **Identify Failure:**
   ```bash
   # Check pod status
   kubectl get pods -n lumines | grep lumines-web
   
   # Check container status
   docker-compose ps lumines-web
   ```

2. **Restart Application:**
   ```bash
   # Kubernetes
   kubectl rollout restart deployment/lumines-web -n lumines
   
   # Docker Compose
   docker-compose restart lumines-web
   ```

3. **If Restart Fails, Rollback:**
   ```bash
   # Kubernetes
   kubectl rollout undo deployment/lumines-web -n lumines
   
   # Docker Compose
   git checkout <previous-commit>
   docker-compose up -d --build lumines-web
   ```

4. **Verify Recovery:**
   ```bash
   curl http://localhost:3000/api/health
   ```

**Recovery Time:** 2-5 minutes

### 4.3 Data Center Failover

#### Complete Site Failure

**Scenario:** Primary data center is unavailable

**Procedure:**

1. **Activate DR Site:**
   - Switch DNS to DR site
   - Activate DR infrastructure
   - Start DR services

2. **Restore from Backup:**
   ```bash
   # Restore database
   pg_restore -h <dr-db-host> -U postgres -d lumines \
     /backups/postgres/lumines_latest.dump
   ```

3. **Start Application:**
   ```bash
   # Deploy application to DR site
   ./scripts/deploy-production.sh production
   ```

4. **Verify DR Site:**
   ```bash
   # Health checks
   curl https://dr.lumenforge.io/api/health
   ```

**Recovery Time:** 30-60 minutes

---

## 5. Recovery Procedures

### 5.1 Database Recovery

#### From Backup

**Procedure:**

1. **Stop Application:**
   ```bash
   docker-compose stop lumines-web
   # Or kubectl scale deployment/lumines-web --replicas=0 -n lumines
   ```

2. **Restore Database:**
   ```bash
   # Drop existing database (if needed)
   psql -h $DATABASE_HOST -U postgres -c "DROP DATABASE IF EXISTS lumines;"
   psql -h $DATABASE_HOST -U postgres -c "CREATE DATABASE lumines;"
   
   # Restore from backup
   gunzip -c /backups/postgres/lumines_YYYYMMDD_HHMMSS.dump.gz | \
     pg_restore -h $DATABASE_HOST -U postgres -d lumines
   ```

3. **Verify Restoration:**
   ```bash
   psql -h $DATABASE_HOST -U postgres -d lumines -c "SELECT count(*) FROM users;"
   ```

4. **Start Application:**
   ```bash
   docker-compose start lumines-web
   # Or kubectl scale deployment/lumines-web --replicas=1 -n lumines
   ```

5. **Verify Application:**
   ```bash
   curl http://localhost:3000/api/health
   ```

#### From Replication

**Procedure:**

1. **Stop Replication:**
   ```bash
   # On replica
   rm /var/lib/postgresql/data/standby.signal
   ```

2. **Promote Replica:**
   ```bash
   psql -h <replica-host> -U postgres -c "SELECT pg_promote();"
   ```

3. **Reconfigure Primary (if recovered):**
   ```bash
   # Set up as new replica
   # Follow replication setup guide
   ```

### 5.2 Application Recovery

#### From Git

**Procedure:**

1. **Identify Last Known Good Version:**
   ```bash
   git log --oneline -10
   ```

2. **Checkout Version:**
   ```bash
   git checkout <commit-hash>
   ```

3. **Rebuild and Deploy:**
   ```bash
   docker-compose build lumines-web
   docker-compose up -d lumines-web
   ```

#### From Container Image

**Procedure:**

1. **Pull Previous Image:**
   ```bash
   docker pull registry.example.com/lumines:previous-tag
   ```

2. **Deploy Previous Version:**
   ```bash
   docker-compose up -d lumines-web
   ```

### 5.3 Data Recovery

#### Point-in-Time Recovery

**Procedure:**

1. **Identify Recovery Point:**
   ```bash
   # List available backups
   ls -lh /backups/postgres/
   ```

2. **Restore to Point in Time:**
   ```bash
   # Using WAL files (if available)
   pg_basebackup -h <backup-host> -D /var/lib/postgresql/data
   # Configure recovery.conf for point-in-time recovery
   ```

3. **Verify Data:**
   ```bash
   psql -h $DATABASE_HOST -U postgres -d lumines -c "SELECT * FROM users LIMIT 10;"
   ```

---

## 6. Testing Procedures

### 6.1 Failover Testing

#### Database Failover Test

**Frequency:** Monthly

**Procedure:**

1. **Schedule Maintenance Window:**
   - Notify users
   - Schedule during low-traffic period

2. **Simulate Primary Failure:**
   ```bash
   # Stop primary database
   systemctl stop postgresql
   # Or on Synology: /usr/syno/bin/synopkg stop pgsql
   ```

3. **Execute Failover:**
   - Follow failover procedure (Section 4.1)
   - Time the process
   - Document issues

4. **Verify Functionality:**
   - Test application
   - Verify data integrity
   - Check replication lag

5. **Restore Primary:**
   - Restart primary database
   - Reconfigure as replica
   - Verify replication

6. **Document Results:**
   - Record RTO achieved
   - Document issues
   - Update procedures

**Expected RTO:** 5 minutes  
**Acceptable RTO:** < 10 minutes

### 6.2 Backup Restoration Test

**Frequency:** Quarterly

**Procedure:**

1. **Select Backup:**
   ```bash
   # Choose backup from 7 days ago
   BACKUP_FILE="/backups/postgres/lumines_$(date -d '7 days ago' +%Y%m%d)_*.dump.gz"
   ```

2. **Restore to Test Environment:**
   ```bash
   # Create test database
   createdb lumines_test
   
   # Restore backup
   gunzip -c $BACKUP_FILE | pg_restore -d lumines_test
   ```

3. **Verify Data:**
   ```bash
   psql -d lumines_test -c "SELECT count(*) FROM users;"
   psql -d lumines_test -c "SELECT count(*) FROM projects;"
   ```

4. **Test Application:**
   - Point application to test database
   - Run smoke tests
   - Verify functionality

5. **Document Results:**
   - Backup integrity
   - Restoration time
   - Data completeness

**Expected RPO:** 24 hours  
**Acceptable RPO:** < 48 hours

### 6.3 DR Site Testing

**Frequency:** Semi-annually

**Procedure:**

1. **Schedule DR Test:**
   - Notify stakeholders
   - Schedule during maintenance window

2. **Activate DR Site:**
   - Follow DR failover procedure (Section 4.3)
   - Time the process

3. **Verify DR Site:**
   - Test all services
   - Verify data integrity
   - Check performance

4. **Failback to Primary:**
   - Restore primary site
   - Sync data
   - Switch back

5. **Document Results:**
   - RTO achieved
   - RPO achieved
   - Issues encountered

**Expected RTO:** 30 minutes  
**Acceptable RTO:** < 60 minutes

---

## 7. Contact Information

### 7.1 Emergency Contacts

**On-Call Engineer:**
- Primary: [TO BE CONFIGURED]
- Secondary: [TO BE CONFIGURED]

**Database Administrator:**
- Primary: [TO BE CONFIGURED]
- Secondary: [TO BE CONFIGURED]

**Infrastructure Team:**
- Primary: [TO BE CONFIGURED]
- Secondary: [TO BE CONFIGURED]

**Management:**
- CTO: [TO BE CONFIGURED]
- Engineering Manager: [TO BE CONFIGURED]

### 7.2 Escalation Path

1. **Level 1:** On-Call Engineer (5 minutes)
2. **Level 2:** Database Administrator / Infrastructure Team (15 minutes)
3. **Level 3:** Engineering Manager (30 minutes)
4. **Level 4:** CTO (1 hour)

---

## Appendix

### A. Backup Locations

| Service | Location | Retention | Encryption |
|---------|----------|-----------|------------|
| PostgreSQL | `/backups/postgres/` | 30 days | Yes |
| Redis | `/backups/redis/` | 7 days | Yes |
| Application | GitHub | Permanent | Yes |
| Configuration | Encrypted storage | 90 days | Yes |

### B. Recovery Commands

**Quick Reference:**

```bash
# Database backup
./scripts/backup-postgres.sh

# Database restore
pg_restore -h $HOST -U $USER -d lumines /backups/postgres/latest.dump

# Application rollback
kubectl rollout undo deployment/lumines-web -n lumines

# Health check
curl http://localhost:3000/api/health
```

### C. Testing Schedule

| Test Type | Frequency | Next Test |
|-----------|-----------|-----------|
| Database Failover | Monthly | [TO BE SCHEDULED] |
| Backup Restoration | Quarterly | [TO BE SCHEDULED] |
| DR Site Test | Semi-annually | [TO BE SCHEDULED] |
| Security Incident | Annually | [TO BE SCHEDULED] |

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Next Review:** January 6, 2026


