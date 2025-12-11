# Production Readiness Checklist
## Synology NAS Servers: 192.168.86.27 & 192.168.86.28

**Version:** 1.0.0
**Date:** December 2024
**Status:** Production Configuration Guide

---

## Table of Contents

1. [Overview](#overview)
2. [Server Roles](#server-roles)
3. [Production Readiness Checklist](#production-readiness-checklist)
4. [Configuration Steps](#configuration-steps)
5. [Verification Procedures](#verification-procedures)
6. [Health Checks](#health-checks)
7. [Backup & Recovery](#backup--recovery)
8. [Monitoring Setup](#monitoring-setup)
9. [Security Hardening](#security-hardening)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This document ensures both Synology NAS servers are production-ready:

- **192.168.86.27** - Primary Data Server (Primary/Active)
- **192.168.86.28** - Secondary Data Server (Replica/Backup)

### High Availability Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              HIGH AVAILABILITY SETUP                         │
└─────────────────────────────────────────────────────────────┘

Primary Server (192.168.86.27)          Secondary Server (192.168.86.28)
├── PostgreSQL (Primary)                 ├── PostgreSQL (Replica)
├── Redis (Master)                       ├── Redis Sentinel
├── NATS (Primary)                       ├── NATS Cluster Node
└── Registry (Primary)                   └── Registry Mirror

Replication Flow:
192.168.86.27 ──[Replication]──> 192.168.86.28
     │                                  │
     └──[Failover]──────────────────────┘
```

---

## Server Roles

### 192.168.86.27 - Primary Data Server

| Service | Port | Role | Status |
|---------|------|------|--------|
| **PostgreSQL** | 5432 | Primary Database | ✅ Active |
| **Redis** | 6379 | Master Cache | ✅ Active |
| **NATS** | 4222 | Primary Message Bus | ✅ Active |
| **Container Registry** | 5000 | Primary Registry | ✅ Active |

**Responsibilities:**
- Primary data storage and processing
- Active service handling
- Replication source for secondary server
- Primary registry for Docker images

### 192.168.86.28 - Secondary Data Server

| Service | Port | Role | Status |
|---------|------|------|--------|
| **PostgreSQL** | 5432 | Replica Database | ⏳ To Configure |
| **Redis Sentinel** | 26379 | High Availability | ⏳ To Configure |
| **NATS** | 4222 | Cluster Node | ⏳ To Configure |
| **Registry Mirror** | 5000 | Backup Registry | ⏳ To Configure |

**Responsibilities:**
- Database replication and failover
- Redis high availability monitoring
- NATS cluster participation
- Registry mirroring and backup

---

## Production Readiness Checklist

### Infrastructure Requirements

#### ✅ Network Configuration

- [ ] Both servers on same network (192.168.86.0/24)
- [ ] Static IP addresses configured
- [ ] DNS resolution working
- [ ] Firewall rules configured
- [ ] Port forwarding configured (if needed)
- [ ] Network connectivity verified between servers

#### ✅ Server Access

- [ ] SSH access configured (warden-ssh user)
- [ ] SSH keys configured for passwordless access
- [ ] Sudo permissions configured
- [ ] Docker access configured
- [ ] User permissions verified

#### ✅ Storage Configuration

- [ ] Sufficient disk space (>500GB recommended)
- [ ] Storage volumes configured
- [ ] Backup storage allocated
- [ ] Disk health monitoring enabled

### Service Configuration

#### ✅ PostgreSQL (192.168.86.27 - Primary)

- [ ] PostgreSQL installed and running
- [ ] Database `wissil` created
- [ ] User `wissil` created with proper permissions
- [ ] Connection pooling configured
- [ ] Backup schedule configured
- [ ] Replication user created for 192.168.86.28
- [ ] Replication slot created
- [ ] WAL archiving enabled

#### ✅ PostgreSQL (192.168.86.28 - Replica)

- [ ] PostgreSQL installed and running
- [ ] Replication configured from 192.168.86.27
- [ ] Replication lag monitoring enabled
- [ ] Read-only mode verified
- [ ] Failover procedures documented
- [ ] Recovery procedures tested

#### ✅ Redis (192.168.86.27 - Master)

- [ ] Redis installed and running
- [ ] Memory limits configured
- [ ] Persistence enabled (RDB + AOF)
- [ ] Password authentication configured
- [ ] Replication configured for Sentinel

#### ✅ Redis Sentinel (192.168.86.28)

- [ ] Redis Sentinel installed
- [ ] Sentinel monitoring 192.168.86.27
- [ ] Quorum configured (minimum 2 sentinels)
- [ ] Failover timeout configured
- [ ] Notification scripts configured

#### ✅ NATS (192.168.86.27 - Primary)

- [ ] NATS server installed and running
- [ ] Cluster configuration prepared
- [ ] Authentication configured
- [ ] Max payload configured (1MB)
- [ ] Connection limits configured

#### ✅ NATS Cluster (192.168.86.28)

- [ ] NATS server installed
- [ ] Cluster configuration with 192.168.86.27
- [ ] Routes configured
- [ ] Authentication synchronized
- [ ] Cluster health monitoring

#### ✅ Container Registry (192.168.86.27 - Primary)

- [ ] Docker Registry installed
- [ ] SSL certificates configured
- [ ] Authentication configured
- [ ] Storage backend configured
- [ ] Garbage collection scheduled

#### ✅ Registry Mirror (192.168.86.28)

- [ ] Registry mirror configured
- [ ] Sync from 192.168.86.27 configured
- [ ] Mirror schedule configured
- [ ] Storage backend configured

### Security Configuration

#### ✅ Authentication & Authorization

- [ ] Strong passwords configured
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled (SSH)
- [ ] Sudoers configured properly
- [ ] Service passwords secured

#### ✅ Network Security

- [ ] Firewall rules configured
- [ ] Only required ports open
- [ ] Internal network access only
- [ ] VPN/Cloudflare Tunnel configured
- [ ] DDoS protection enabled

#### ✅ Data Security

- [ ] Database encryption at rest
- [ ] SSL/TLS for all services
- [ ] Certificate management configured
- [ ] Backup encryption enabled
- [ ] Access logs enabled

### Monitoring & Logging

#### ✅ Monitoring Setup

- [ ] Prometheus exporters installed
- [ ] Grafana dashboards configured
- [ ] Alert rules configured
- [ ] Health check endpoints configured
- [ ] Uptime monitoring enabled

#### ✅ Logging Configuration

- [ ] Centralized logging configured
- [ ] Log rotation configured
- [ ] Log retention policy set
- [ ] Error alerting configured
- [ ] Audit logging enabled

### Backup & Recovery

#### ✅ Backup Configuration

- [ ] Automated backup schedule
- [ ] Database backups configured
- [ ] Registry backups configured
- [ ] Configuration backups
- [ ] Backup verification automated

#### ✅ Recovery Procedures

- [ ] Recovery procedures documented
- [ ] Recovery tested
- [ ] RTO/RPO defined
- [ ] Disaster recovery plan
- [ ] Failover procedures tested

---

## Configuration Steps

### Step 1: Network Configuration

#### Verify Network Connectivity

```bash
# From 192.168.86.27, test connectivity to 192.168.86.28
ping -c 4 192.168.86.28

# From 192.168.86.28, test connectivity to 192.168.86.27
ping -c 4 192.168.86.27

# Test port connectivity
nc -zv 192.168.86.27 5432  # PostgreSQL
nc -zv 192.168.86.27 6379  # Redis
nc -zv 192.168.86.27 4222  # NATS
nc -zv 192.168.86.27 5000  # Registry
```

#### Configure Firewall Rules

```bash
# On both servers, allow internal network access
# Allow PostgreSQL
sudo ufw allow from 192.168.86.0/24 to any port 5432

# Allow Redis
sudo ufw allow from 192.168.86.0/24 to any port 6379

# Allow NATS
sudo ufw allow from 192.168.86.0/24 to any port 4222

# Allow Registry
sudo ufw allow from 192.168.86.0/24 to any port 5000

# Allow Redis Sentinel (on 192.168.86.28)
sudo ufw allow from 192.168.86.0/24 to any port 26379
```

### Step 2: PostgreSQL Replication Setup

#### On Primary Server (192.168.86.27)

```bash
# 1. Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add/modify:
wal_level = replica
max_wal_senders = 3
max_replication_slots = 3
archive_mode = on
archive_command = 'test ! -f /var/lib/postgresql/archive/%f && cp %p /var/lib/postgresql/archive/%f'

# 2. Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add replication line:
host    replication     replicator     192.168.86.28/32    md5

# 3. Create replication user
sudo -u postgres psql -c "CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'REPLICATION_PASSWORD_HERE';"

# 4. Create replication slot
sudo -u postgres psql -c "SELECT pg_create_physical_replication_slot('replica_slot');"

# 5. Restart PostgreSQL
sudo systemctl restart postgresql
```

#### On Replica Server (192.168.86.28)

```bash
# 1. Stop PostgreSQL
sudo systemctl stop postgresql

# 2. Backup existing data directory
sudo mv /var/lib/postgresql/14/main /var/lib/postgresql/14/main.backup

# 3. Perform base backup
sudo -u postgres pg_basebackup -h 192.168.86.27 -D /var/lib/postgresql/14/main -U replicator -v -P -W

# 4. Create recovery.conf (PostgreSQL 12+) or configure in postgresql.conf
sudo nano /var/lib/postgresql/14/main/postgresql.auto.conf

# Add:
primary_conninfo = 'host=192.168.86.27 port=5432 user=replicator password=REPLICATION_PASSWORD_HERE'
primary_slot_name = 'replica_slot'

# 5. Create standby.signal file
sudo -u postgres touch /var/lib/postgresql/14/main/standby.signal

# 6. Start PostgreSQL
sudo systemctl start postgresql

# 7. Verify replication
sudo -u postgres psql -c "SELECT * FROM pg_stat_replication;"
```

### Step 3: Redis Sentinel Setup

#### On Primary Server (192.168.86.27)

```bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf

# Configure:
bind 0.0.0.0
protected-mode yes
requirepass REDIS_PASSWORD_HERE
masterauth REDIS_PASSWORD_HERE
replica-serve-stale-data yes
replica-read-only yes
```

#### On Secondary Server (192.168.86.28)

```bash
# 1. Install Redis Sentinel
sudo apt-get install redis-sentinel

# 2. Configure Sentinel
sudo nano /etc/redis/sentinel.conf

# Add:
port 26379
sentinel monitor wissil-master 192.168.86.27 6379 2
sentinel auth-pass wissil-master REDIS_PASSWORD_HERE
sentinel down-after-milliseconds wissil-master 5000
sentinel failover-timeout wissil-master 10000
sentinel parallel-syncs wissil-master 1

# 3. Start Sentinel
sudo systemctl start redis-sentinel
sudo systemctl enable redis-sentinel
```

### Step 4: NATS Cluster Setup

#### On Primary Server (192.168.86.27)

```bash
# Edit nats-server.conf
sudo nano /etc/nats/nats-server.conf

# Configure:
port: 4222
cluster {
  port: 6222
  routes = [
    nats://192.168.86.28:6222
  ]
}
```

#### On Secondary Server (192.168.86.28)

```bash
# Edit nats-server.conf
sudo nano /etc/nats/nats-server.conf

# Configure:
port: 4222
cluster {
  port: 6222
  routes = [
    nats://192.168.86.27:6222
  ]
}

# Start NATS
sudo systemctl start nats-server
sudo systemctl enable nats-server
```

### Step 5: Registry Mirror Setup

#### On Secondary Server (192.168.86.28)

```bash
# 1. Install registry mirror
docker run -d \
  --name registry-mirror \
  -p 5000:5000 \
  -v /docker/registry-mirror:/var/lib/registry \
  -e REGISTRY_PROXY_REMOTEURL=https://192.168.86.27:5000 \
  registry:2

# 2. Configure sync schedule (cron job)
# Add to crontab:
0 2 * * * docker exec registry-mirror registry garbage-collect /etc/docker/registry/config.yml
```

---

## Verification Procedures

### Network Verification

```bash
#!/bin/bash
# verify-network.sh

echo "=== Network Connectivity Test ==="

# Test ping
echo "Testing ping..."
ping -c 3 192.168.86.27 && echo "✅ 192.168.86.27 reachable" || echo "❌ 192.168.86.27 unreachable"
ping -c 3 192.168.86.28 && echo "✅ 192.168.86.28 reachable" || echo "❌ 192.168.86.28 unreachable"

# Test ports
echo -e "\n=== Port Connectivity Test ==="
for port in 5432 6379 4222 5000; do
  nc -zv 192.168.86.27 $port && echo "✅ Port $port open on 192.168.86.27" || echo "❌ Port $port closed on 192.168.86.27"
done

for port in 5432 26379 4222 5000; do
  nc -zv 192.168.86.28 $port && echo "✅ Port $port open on 192.168.86.28" || echo "❌ Port $port closed on 192.168.86.28"
done
```

### Service Verification

```bash
#!/bin/bash
# verify-services.sh

echo "=== Service Status Check ==="

# PostgreSQL
echo "Testing PostgreSQL..."
psql -h 192.168.86.27 -U wissil -d wissil -c "SELECT 1" && echo "✅ PostgreSQL primary OK" || echo "❌ PostgreSQL primary FAILED"
psql -h 192.168.86.28 -U wissil -d wissil -c "SELECT 1" && echo "✅ PostgreSQL replica OK" || echo "❌ PostgreSQL replica FAILED"

# Redis
echo "Testing Redis..."
redis-cli -h 192.168.86.27 PING && echo "✅ Redis master OK" || echo "❌ Redis master FAILED"
redis-cli -h 192.168.86.28 -p 26379 SENTINEL masters && echo "✅ Redis Sentinel OK" || echo "❌ Redis Sentinel FAILED"

# NATS
echo "Testing NATS..."
nc -zv 192.168.86.27 4222 && echo "✅ NATS primary OK" || echo "❌ NATS primary FAILED"
nc -zv 192.168.86.28 4222 && echo "✅ NATS cluster OK" || echo "❌ NATS cluster FAILED"

# Registry
echo "Testing Registry..."
curl -k https://192.168.86.27:5000/v2/ && echo "✅ Registry primary OK" || echo "❌ Registry primary FAILED"
curl -k https://192.168.86.28:5000/v2/ && echo "✅ Registry mirror OK" || echo "❌ Registry mirror FAILED"
```

### Replication Verification

```bash
#!/bin/bash
# verify-replication.sh

echo "=== Replication Status Check ==="

# PostgreSQL Replication
echo "PostgreSQL Replication Status:"
psql -h 192.168.86.27 -U postgres -c "SELECT * FROM pg_stat_replication;"

# Redis Replication
echo -e "\nRedis Replication Status:"
redis-cli -h 192.168.86.27 INFO replication

# NATS Cluster
echo -e "\nNATS Cluster Status:"
curl http://192.168.86.27:8222/varz | jq '.cluster'
curl http://192.168.86.28:8222/varz | jq '.cluster'
```

---

## Health Checks

### Automated Health Check Script

```bash
#!/bin/bash
# health-check.sh

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
ALERT_EMAIL="admin@lumenforge.io"

check_service() {
  local host=$1
  local port=$2
  local service=$3

  if nc -zv $host $port 2>&1 | grep -q succeeded; then
    echo "✅ $service on $host:$port is UP"
    return 0
  else
    echo "❌ $service on $host:$port is DOWN"
    echo "ALERT: $service on $host:$port is DOWN" | mail -s "Service Down Alert" $ALERT_EMAIL
    return 1
  fi
}

echo "=== Health Check - $(date) ==="

# Primary Server Checks
check_service $PRIMARY_IP 5432 "PostgreSQL"
check_service $PRIMARY_IP 6379 "Redis"
check_service $PRIMARY_IP 4222 "NATS"
check_service $PRIMARY_IP 5000 "Registry"

# Secondary Server Checks
check_service $SECONDARY_IP 5432 "PostgreSQL Replica"
check_service $SECONDARY_IP 26379 "Redis Sentinel"
check_service $SECONDARY_IP 4222 "NATS Cluster"
check_service $SECONDARY_IP 5000 "Registry Mirror"

# Replication Checks
echo -e "\n=== Replication Status ==="
psql -h $PRIMARY_IP -U postgres -c "SELECT client_addr, state, sync_state FROM pg_stat_replication;" 2>/dev/null || echo "❌ Cannot check replication status"
```

### Cron Job Setup

```bash
# Add to crontab (crontab -e)
# Health check every 5 minutes
*/5 * * * * /path/to/health-check.sh >> /var/log/health-check.log 2>&1
```

---

## Backup & Recovery

### Backup Script

```bash
#!/bin/bash
# backup-all.sh

BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# PostgreSQL Backup
echo "Backing up PostgreSQL..."
pg_dump -h 192.168.86.27 -U wissil wissil > $BACKUP_DIR/postgresql-$(date +%H%M%S).sql

# Redis Backup
echo "Backing up Redis..."
redis-cli -h 192.168.86.27 --rdb $BACKUP_DIR/redis-$(date +%H%M%S).rdb

# Registry Backup
echo "Backing up Registry..."
docker exec registry-primary registry garbage-collect /etc/docker/registry/config.yml
tar -czf $BACKUP_DIR/registry-$(date +%H%M%S).tar.gz /docker/registry

# Compress and encrypt
echo "Compressing backups..."
tar -czf $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz $BACKUP_DIR/*.sql $BACKUP_DIR/*.rdb $BACKUP_DIR/*.tar.gz

# Cleanup old backups (keep last 30 days)
find /backup -type d -mtime +30 -exec rm -rf {} \;
```

---

## Monitoring Setup

### Prometheus Exporter Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'postgresql-primary'
    static_configs:
      - targets: ['192.168.86.27:9187']

  - job_name: 'postgresql-replica'
    static_configs:
      - targets: ['192.168.86.28:9187']

  - job_name: 'redis-primary'
    static_configs:
      - targets: ['192.168.86.27:9121']

  - job_name: 'redis-sentinel'
    static_configs:
      - targets: ['192.168.86.28:9121']

  - job_name: 'nats-primary'
    static_configs:
      - targets: ['192.168.86.27:8222']

  - job_name: 'nats-cluster'
    static_configs:
      - targets: ['192.168.86.28:8222']
```

---

## Security Hardening

### Security Checklist

- [ ] All default passwords changed
- [ ] SSH key authentication only
- [ ] Firewall configured (UFW/iptables)
- [ ] Fail2ban installed and configured
- [ ] SSL/TLS certificates installed
- [ ] Regular security updates enabled
- [ ] Log monitoring configured
- [ ] Intrusion detection enabled
- [ ] Access logs enabled for all services
- [ ] Regular security audits scheduled

---

## Troubleshooting

### Common Issues

#### PostgreSQL Replication Lag

```bash
# Check replication lag
psql -h 192.168.86.27 -U postgres -c "SELECT client_addr, state, sync_state, pg_wal_lsn_diff(pg_current_wal_lsn(), sent_lsn) AS lag_bytes FROM pg_stat_replication;"

# If lag is high, check network and disk I/O
```

#### Redis Sentinel Not Failing Over

```bash
# Check Sentinel status
redis-cli -h 192.168.86.28 -p 26379 SENTINEL masters
redis-cli -h 192.168.86.28 -p 26379 SENTINEL sentinels wissil-master
```

#### NATS Cluster Not Connecting

```bash
# Check NATS cluster status
curl http://192.168.86.27:8222/routez
curl http://192.168.86.28:8222/routez

# Check routes
curl http://192.168.86.27:8222/varz | jq '.cluster'
```

---

## Production Readiness Sign-Off

### Pre-Production Checklist

- [ ] All services running and healthy
- [ ] Replication verified and tested
- [ ] Backups configured and tested
- [ ] Monitoring configured
- [ ] Security hardening completed
- [ ] Documentation updated
- [ ] Disaster recovery plan tested
- [ ] Team trained on procedures

### Sign-Off

**Date:** _______________
**Approved By:** _______________
**Status:** ✅ Production Ready

---

**Last Updated:** December 2024
**Version:** 1.0.0
