# PostgreSQL 11 Installation Options for SBX02 (DS213+)

## Problem

- **Docker not available** in Package Center for DS213+ (PowerPC)
- **Current PostgreSQL:** 9.3.25 (too old, incompatible with PRIMARY 11.11)
- **Need:** PostgreSQL 11 for DR/replica compatibility

## Installation Options

### Option 1: Compile PostgreSQL 11 from Source ⭐ RECOMMENDED

**Pros:**
- ✅ Works on PowerPC architecture
- ✅ No Docker required
- ✅ Native installation, minimal overhead
- ✅ Full control over configuration

**Cons:**
- ⚠️ Requires build tools (gcc, make)
- ⚠️ Takes 30-60 minutes to compile
- ⚠️ Requires sufficient disk space

**Requirements:**
- gcc compiler
- make
- Development libraries
- ~500MB disk space for source + build

**Steps:**
```bash
# 1. Install build tools (if not available)
# Via Entware or Package Center

# 2. Run compilation script
./scripts/install-postgresql11-direct-sbx02.sh
```

### Option 2: Use Pre-built Binaries (If Available)

**Check for:**
- Entware packages: `opkg install postgresql11`
- Synology packages: Check Package Center
- Third-party repositories

**Likelihood:** Low - PostgreSQL 11 binaries for PowerPC are rare

### Option 3: Alternative Architecture

**Use different server for PostgreSQL 11:**
- **SBX02:** Storage only (iSCSI/NFS)
- **Helios Compute/Control:** Run PostgreSQL 11
- **Connect:** microk8s or Docker on the other server

**Pros:**
- ✅ No compilation needed
- ✅ Better resources
- ✅ Easier management

**Cons:**
- ⚠️ Requires another server
- ⚠️ Network dependency

### Option 4: Use PostgreSQL 9.3.25 (NOT Recommended)

**Why not:**
- ❌ Cannot replicate from PostgreSQL 11
- ❌ Streaming replication incompatible
- ❌ Only works for manual backups (pg_dump)

**If you must:**
- Use pg_dump for backups only
- No real-time replication
- Manual restore process

## Recommended Approach

### Step 1: Check Build Tools

```bash
ssh ncadmin@192.168.86.28 "which gcc make wget tar"
```

If missing, install via:
- Entware (if available)
- Package Center (Development Tools)
- Manual installation

### Step 2: Compile PostgreSQL 11

```bash
./scripts/install-postgresql11-direct-sbx02.sh
```

This will:
1. Download PostgreSQL 11.23 source
2. Configure for PowerPC
3. Compile (30-60 minutes)
4. Install to `/opt/postgresql11`
5. Configure minimal memory settings
6. Start PostgreSQL 11

### Step 3: Configure Replication

After installation, set up replication from PRIMARY:
```bash
./scripts/setup-postgresql11-replication.sh
```

## Installation Requirements

### Build Tools Needed

- **gcc** - C compiler
- **make** - Build system
- **wget/curl** - Download source
- **tar** - Extract archives
- **Development libraries:**
  - readline (optional)
  - zlib (optional)
  - openssl (optional)

### Disk Space

- Source code: ~50MB
- Build directory: ~200MB
- Installation: ~100MB
- Data directory: Variable (depends on database size)
- **Total:** ~500MB minimum

### Time Estimate

- Download: 2-5 minutes
- Configure: 2-5 minutes
- Compile: 30-60 minutes (PowerPC is slow)
- Install: 2-5 minutes
- **Total:** ~40-75 minutes

## Troubleshooting

### Build Tools Missing

```bash
# Check what's available
ssh ncadmin@192.168.86.28 "which gcc make"

# Install via Entware (if available)
ssh ncadmin@192.168.86.28 "sudo /opt/bin/opkg install gcc make"

# Or check Package Center for Development Tools
```

### Compilation Fails

- Check error messages
- Verify all dependencies installed
- Check disk space: `df -h`
- Check memory: `free -h`

### Installation Fails

- Check permissions
- Verify data directory exists
- Check PostgreSQL user exists
- Review logs: `/var/log/postgresql11.log`

## Alternative: If Compilation Not Possible

If you cannot compile PostgreSQL 11 on SBX02:

1. **Use different server** for PostgreSQL 11 (Helios Compute/Control)
2. **Use SBX02 for storage** only (iSCSI/NFS shares)
3. **Set up replication** on the other server
4. **Backup to SBX02** for additional redundancy

## Summary

✅ **Best option:** Compile PostgreSQL 11 from source
✅ **Alternative:** Use different server for PostgreSQL 11
❌ **Not recommended:** Use PostgreSQL 9.3.25 (incompatible)

The compilation approach is the most reliable way to get PostgreSQL 11 on PowerPC DS213+.
