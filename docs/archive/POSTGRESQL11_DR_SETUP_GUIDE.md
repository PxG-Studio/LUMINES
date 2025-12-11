# PostgreSQL 11 DR Setup on SBX02 (512MB RAM)

## Overview

This guide sets up PostgreSQL 11 on SBX02 (Synology DS213+ with 512MB RAM) as a disaster recovery/replica node using minimal memory configuration.

## Why This Works

- **PostgreSQL 11 can run on 512MB RAM** when configured for DR/replica use only
- **Minimal memory tuning** allows WAL replay and base backup restoration
- **Not suitable for active workloads** - only for disaster recovery

## Prerequisites

1. **SBX02 (192.168.86.28)** - Synology DS213+ with 512MB RAM
2. **Docker** - Must be installed from Synology Package Center
3. **PRIMARY (192.168.86.27)** - PostgreSQL 11.11 configured for replication
4. **SSH access** - To SBX02 with password authentication

## Installation Steps

### Step 1: Install Docker (if not already installed)

1. Open DSM web interface on SBX02
2. Go to **Package Center**
3. Search for **"Docker"**
4. Install Docker package
5. Wait for installation to complete

### Step 2: Run Complete Setup Script

```bash
# From your local machine
./scripts/complete-postgresql11-dr-setup.sh
```

This script will:
- ✅ Check for Docker
- ✅ Stop old PostgreSQL 9.3.25
- ✅ Create PostgreSQL 11 data directory
- ✅ Create minimal memory configuration
- ✅ Initialize PostgreSQL 11
- ✅ Start PostgreSQL 11 container
- ✅ Verify installation

### Step 3: Configure Replication

After PostgreSQL 11 is running, set up replication from PRIMARY:

```bash
./scripts/setup-postgresql11-replication.sh
```

## Minimal Memory Configuration

The setup uses this configuration for 512MB RAM:

```conf
# Memory Settings (Tiny Footprint)
shared_buffers = 64MB
work_mem = 1MB
maintenance_work_mem = 16MB
effective_cache_size = 128MB

# WAL & Checkpoint Tuning
wal_level = replica
max_wal_senders = 3
max_replication_slots = 1
archive_mode = on
archive_timeout = 60s
checkpoint_timeout = 15min
checkpoint_completion_target = 0.9

# Background Workers
max_worker_processes = 2
max_parallel_workers_per_gather = 0
max_parallel_workers = 1

# Connections
max_connections = 10

# Logging
logging_collector = on
log_min_duration_statement = 2000

# Network
listen_addresses = '*'
port = 5432
```

**Result:**
- Peak RAM: ~350-420MB
- Stable WAL replay
- Suitable for warm standby, PITR, and DR failover
- **NOT suitable for active workloads**

## Verification

After installation, verify PostgreSQL 11 is running:

```bash
# Check container status
ssh ncadmin@192.168.86.28 "sudo docker ps | grep postgresql11-dr"

# Check PostgreSQL version
ssh ncadmin@192.168.86.28 "sudo docker exec postgresql11-dr psql --version"

# Check memory settings
ssh ncadmin@192.168.86.28 "sudo docker exec postgresql11-dr psql -U postgres -c 'SHOW shared_buffers;'"
```

## Next Steps

1. **Configure PRIMARY for replication** (if not already done)
   - Create replication user
   - Configure pg_hba.conf
   - Set up replication slot

2. **Set up replication from PRIMARY**
   - Use pg_basebackup
   - Configure standby.signal
   - Set primary_conninfo

3. **Verify replication**
   - Check replication status
   - Verify WAL replay
   - Test failover (if needed)

## Troubleshooting

### Container won't start
```bash
# Check logs
ssh ncadmin@192.168.86.28 "sudo docker logs postgresql11-dr"

# Check disk space
ssh ncadmin@192.168.86.28 "df -h /volume1"
```

### Cannot connect to PostgreSQL
```bash
# Check if container is running
ssh ncadmin@192.168.86.28 "sudo docker ps | grep postgresql11-dr"

# Check port
ssh ncadmin@192.168.86.28 "netstat -tln | grep 5432"
```

### Memory issues
- Verify configuration is applied
- Check actual memory usage: `free -h`
- Consider even lower settings if needed

## Important Notes

1. **This is for DR/replica only** - Not for active workloads
2. **512MB RAM is minimal** - Monitor memory usage
3. **Docker required** - Must be installed first
4. **PostgreSQL 11 required** - For compatibility with PRIMARY (11.11)
5. **Version compatibility** - Replica must be same major version or newer

## Summary

✅ **PostgreSQL 11 can run on 512MB RAM** for DR purposes
✅ **Minimal memory tuning** allows WAL replay
✅ **Docker container** provides isolation and easy management
✅ **Compatible with PRIMARY** PostgreSQL 11.11

This setup provides a reliable disaster recovery solution without requiring hardware upgrades.
