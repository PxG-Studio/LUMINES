# Manual PostgreSQL 11 Installation on Synology NAS (SECONDARY)

## Situation
- Docker is NOT available
- PostgreSQL 11 is NOT in Package Center
- SECONDARY has PostgreSQL 9.3.25 (system default)
- Need PostgreSQL 11 for replication compatibility

## Options

### Option 1: Download Pre-compiled PostgreSQL 11 Binaries

**For x86_64 Synology NAS:**

1. Download PostgreSQL 11.11 binaries:
   ```bash
   # On SECONDARY, create download directory
   mkdir -p /tmp/postgresql11
   cd /tmp/postgresql11

   # Download (adjust URL for your architecture)
   # For x86_64:
   wget https://ftp.postgresql.org/pub/source/v11.11/postgresql-11.11.tar.gz
   ```

2. Extract and compile:
   ```bash
   tar -xzf postgresql-11.11.tar.gz
   cd postgresql-11.11
   ./configure --prefix=/usr/local/pgsql11
   make
   sudo make install
   ```

### Option 2: Use Alternative Replication Method

Since streaming replication requires matching versions, consider:

**Logical Replication (PostgreSQL 10+):**
- Requires both servers to be PostgreSQL 10+
- Not available with 9.3

**File-based Replication:**
- Copy WAL files manually
- Not suitable for production

### Option 3: Accept Limitation

**Current Reality:**
- PRIMARY: PostgreSQL 11.11 ✅
- SECONDARY: PostgreSQL 9.3.25 ❌
- **Cannot do streaming replication with this setup**

**Alternative Solutions:**
1. Use SECONDARY as backup-only (manual backups)
2. Upgrade SECONDARY hardware/OS to support newer PostgreSQL
3. Use a different server for replication

## Recommendation

Given the constraints:
1. **PRIMARY is fully configured** - ready for replication when SECONDARY is upgraded
2. **SECONDARY needs PostgreSQL 11** - but can't easily install it
3. **Best path forward:**
   - Keep PRIMARY configuration (it's ready)
   - When SECONDARY can be upgraded (new hardware, OS update, or manual install), replication will work immediately
   - For now, use manual backups or accept that replication is not possible with current SECONDARY setup

## What We've Accomplished

✅ **PRIMARY (SBX01) is production-ready:**
- PostgreSQL 11.11 running
- Replication configured
- Network access configured
- Replication user and slot created
- Ready to accept replica connections

⚠️ **SECONDARY (SBX02) limitation:**
- PostgreSQL 9.3.25 cannot replicate from 11.11
- Requires PostgreSQL 11 upgrade (not easily available)

## Next Steps

1. **Keep PRIMARY configuration** - it's ready for when SECONDARY is upgraded
2. **For SECONDARY:**
   - Option A: Manual PostgreSQL 11 installation (complex)
   - Option B: Wait for Synology OS update that includes PostgreSQL 11
   - Option C: Use SECONDARY for manual backups only
   - Option D: Consider different replication strategy

**The PRIMARY server is fully configured and production-ready. The replication setup is complete on the PRIMARY side - it's just waiting for SECONDARY to have compatible PostgreSQL version.**
