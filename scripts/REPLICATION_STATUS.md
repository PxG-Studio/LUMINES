# PostgreSQL Replication Setup Status

## Current Status

### ✅ PRIMARY (SBX01, 192.168.86.27)
- **PostgreSQL Version:** 11.11
- **Status:** ✅ Fully configured and running
- **Configuration:**
  - `listen_addresses = '*'` (listening on all interfaces)
  - `wal_level = replica`
  - `max_wal_senders = 3`
  - Replication user `replicator` created
  - Replication slot `replica_slot` created
  - `pg_hba.conf` configured for replication from 192.168.86.28
  - Listening on `0.0.0.0:5432`

### ⚠️ SECONDARY (SBX02, 192.168.86.28)
- **PostgreSQL Version:** 9.3.25 (system default)
- **Status:** ⚠️ **BLOCKED** - Version mismatch
- **Issue:** PostgreSQL 9.3 cannot replicate from PostgreSQL 11
- **Required:** Upgrade to PostgreSQL 11.x or newer

## Problem

**Version Incompatibility:**
- PRIMARY: PostgreSQL 11.11
- SECONDARY: PostgreSQL 9.3.25
- **Streaming replication requires same major version or newer**

PostgreSQL 9.3.25 is too old and cannot replicate from PostgreSQL 11.11.

## Solutions

### Option 1: Install PostgreSQL 11 on SECONDARY (Recommended)

**Via Docker (Easiest):**
1. Install Docker from Synology Package Center
2. Run PostgreSQL 11 container:
   ```bash
   docker run -d \
     --name postgres11-replica \
     --restart unless-stopped \
     -e POSTGRES_PASSWORD=postgres \
     -v /volume1/docker/postgres11-data:/var/lib/postgresql/data \
     -p 5432:5432 \
     postgres:11
   ```
3. Use the Docker container for replication

**Via Manual Installation:**
1. Download PostgreSQL 11.11 source or binaries for your Synology architecture
2. Compile and install
3. Configure to use the new version

### Option 2: Alternative Replication Methods

**Logical Replication (PostgreSQL 10+):**
- Requires PRIMARY to be downgraded or both upgraded
- More complex setup

**File-based Replication:**
- Not recommended for production
- Requires shared storage

## Next Steps

1. **Upgrade SECONDARY to PostgreSQL 11**
   - Install Docker and use PostgreSQL 11 container, OR
   - Install PostgreSQL 11 manually

2. **After upgrade, complete replica setup:**
   ```bash
   # On SECONDARY
   PRIMARY_IP="192.168.86.27"
   REPLICATION_PASSWORD="Replication2024Secure"
   ACTUAL_DATA_DIR="/var/services/pgsql"

   # Stop old PostgreSQL
   /usr/syno/bin/synopkg stop pgsql

   # Remove old data
   rm -rf "$ACTUAL_DATA_DIR"

   # Create fresh directory
   mkdir -p "$ACTUAL_DATA_DIR"
   chown -R postgres:postgres "$ACTUAL_DATA_DIR"
   chmod 700 "$ACTUAL_DATA_DIR"

   # Perform base backup (now compatible)
   sudo -u postgres PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
     -h $PRIMARY_IP \
     -D "$ACTUAL_DATA_DIR" \
     -U replicator \
     -v -P -W -R

   # Start PostgreSQL
   /usr/syno/bin/synopkg start pgsql

   # Verify replication
   sudo -u postgres psql -c "SELECT pg_is_in_recovery();"
   ```

## Summary

- ✅ PRIMARY is ready
- ⚠️ SECONDARY needs PostgreSQL 11 upgrade
- 🔧 Install Docker + PostgreSQL 11 container, or install PostgreSQL 11 manually
- 📋 After upgrade, replication setup will complete automatically
