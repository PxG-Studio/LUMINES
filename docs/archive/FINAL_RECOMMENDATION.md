# Final Recommendation: PostgreSQL 11 DR Setup

## Current Situation

- **SBX02 (DS213+):** PowerPC, 512MB RAM, DSM 6.2.4
- **Docker:** Not available (PowerPC incompatible)
- **Entware:** PowerPC repository not available (404 error)
- **Build Tools:** gcc/make not installed, difficult to obtain

## Problem

We need PostgreSQL 11 for DR/replica, but:
1. ❌ Docker not available
2. ❌ Entware PowerPC repo not available
3. ❌ Build tools (gcc/make) not easily installable
4. ⚠️ Compilation would take 30-60 minutes if tools were available

## Recommended Solution: Use Different Server ⭐

### Architecture

```
SBX02 (192.168.86.28) - Storage Provider
└── iSCSI LUN: postgresql-data (100GB)
    └── Provides persistent storage

Helios Compute (192.168.86.115) OR Helios Control (192.168.86.114)
├── Docker/microk8s installed
├── PostgreSQL 11 container
├── Connected to SBX02 iSCSI LUNs
└── Replicating from PRIMARY (192.168.86.27)
```

### Benefits

✅ **No compilation needed** - Use Docker/microk8s
✅ **Better resources** - More RAM, better CPU
✅ **Easier management** - Standard tools available
✅ **Faster setup** - Minutes instead of hours
✅ **SBX02 still used** - Provides reliable storage

### Steps

1. **Check Helios Compute/Control resources**
   ```bash
   ssh user@192.168.86.115  # or 192.168.86.114
   free -h
   uname -m
   ```

2. **Install Docker/microk8s on chosen server**
   - Standard installation
   - No PowerPC limitations

3. **Set up iSCSI on SBX02**
   - Create iSCSI LUN via DSM web interface
   - Configure target

4. **Deploy PostgreSQL 11 on other server**
   - Use Docker or microk8s
   - Connect to SBX02 iSCSI storage
   - Configure minimal memory (if needed)

5. **Configure replication**
   - From PRIMARY (192.168.86.27)
   - Verify WAL replay

## Alternative: If You Must Use SBX02

If you absolutely need PostgreSQL 11 on SBX02:

### Option 1: Cross-compile from Another Machine

1. Use another PowerPC or x86 machine
2. Cross-compile PostgreSQL 11 for PowerPC
3. Transfer binaries to SBX02
4. Install and configure

### Option 2: Find Pre-compiled Binaries

- Check community repositories
- Ask Synology community
- Check if someone has compiled PostgreSQL 11 for PowerPC

### Option 3: Use PostgreSQL 9.3.25 (NOT Recommended)

- ❌ Cannot replicate from PostgreSQL 11
- ❌ Only works for manual backups (pg_dump)
- ⚠️ Not true DR solution

## Next Steps

1. **Check Helios Compute/Control:**
   - Do you have SSH access?
   - What are the resources (RAM, CPU)?
   - Is Docker/microk8s available?

2. **If yes:** Proceed with multi-server architecture
3. **If no:** Consider cross-compilation or pre-built binaries

## Summary

✅ **Best approach:** Use different server for PostgreSQL 11, SBX02 for storage
❌ **Not feasible:** Compile on SBX02 without build tools
⚠️ **Possible but complex:** Cross-compile from another machine

The multi-server approach is the most practical and reliable solution.
