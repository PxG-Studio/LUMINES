# Upgrade SECONDARY PostgreSQL from 9.3 to 11.x

## Problem
- PRIMARY: PostgreSQL 11.11
- SECONDARY: PostgreSQL 9.3.25
- **Streaming replication requires same major version or newer**

## Solution Options

### Option 1: Install PostgreSQL 11 on SECONDARY (Recommended)

On Synology NAS, you may need to:
1. Install PostgreSQL 11 via Package Center (if available)
2. Or install via Docker
3. Or compile from source

### Option 2: Use Docker PostgreSQL 11 on SECONDARY

```bash
# On SECONDARY (SBX02)
# Stop old PostgreSQL
/usr/syno/bin/synopkg stop pgsql

# Install Docker (if not already installed)
# Then run PostgreSQL 11 container
docker run -d \
  --name postgres11-replica \
  -e POSTGRES_PASSWORD=postgres \
  -v /volume1/docker/postgres11:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:11

# Then configure replication using the Docker container
```

### Option 3: Upgrade PRIMARY to match SECONDARY (NOT Recommended)
- Downgrade PRIMARY from 11.11 to 9.3
- This would lose data and is not recommended

## Recommended Approach

Since PRIMARY is already 11.11 and working, upgrade SECONDARY to PostgreSQL 11.

**Check if PostgreSQL 11 is available in Synology Package Center:**
- Go to Package Center
- Search for "PostgreSQL"
- Check if version 11 or newer is available
- If yes, install it and configure replication
- If no, use Docker approach

## After Upgrading SECONDARY to PostgreSQL 11

Once SECONDARY has PostgreSQL 11, proceed with the base backup:

```bash
PRIMARY_IP="192.168.86.27"
REPLICATION_PASSWORD="Replication2024Secure"
ACTUAL_DATA_DIR="/var/services/pgsql"

# Stop PostgreSQL
/usr/syno/bin/synopkg stop pgsql
sleep 3

# Remove old data
rm -rf "$ACTUAL_DATA_DIR"

# Create fresh directory
mkdir -p "$ACTUAL_DATA_DIR"
chown -R postgres:postgres "$ACTUAL_DATA_DIR"
chmod 700 "$ACTUAL_DATA_DIR"

# Perform base backup (now with compatible version)
sudo -u postgres PGPASSWORD="$REPLICATION_PASSWORD" pg_basebackup \
  -h $PRIMARY_IP \
  -D "$ACTUAL_DATA_DIR" \
  -U replicator \
  -v -P -W -R

# Start PostgreSQL
/usr/syno/bin/synopkg start pgsql
```
