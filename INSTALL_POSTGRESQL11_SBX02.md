# Installing PostgreSQL 11 on SBX02 (DS213+) - Complete Guide

## Current Status

- ✅ **wget** and **tar** available
- ❌ **gcc** and **make** missing (need to install)
- ❌ **Docker** not available (PowerPC incompatible)
- ✅ **Disk space** available (1.8TB on /volume1)
- ⚠️ **512MB RAM** (sufficient for DR/replica)

## Solution: Compile PostgreSQL 11 from Source

Since Docker isn't available, we'll compile PostgreSQL 11 directly on SBX02.

## Step 1: Install Build Tools

### Option A: Install Entware (Recommended)

Entware is a package manager for embedded systems that works on Synology:

```bash
# SSH to SBX02
ssh ncadmin@192.168.86.28

# Install Entware
wget -O - http://bin.entware.net/armv7sf-k3.2/installer/generic.sh | sh

# Or for PowerPC:
wget -O - http://bin.entware.net/powerpc-k2.6/installer/generic.sh | sh

# Update package list
/opt/bin/opkg update

# Install build tools
/opt/bin/opkg install gcc make wget-ssl
```

### Option B: Check Synology Package Center

1. Open DSM web interface
2. Go to **Package Center**
3. Search for **"Development Tools"** or **"Tool Chain"**
4. Install if available

### Option C: Manual Installation

If Entware and Package Center don't work, you may need to:
- Download gcc/make binaries for PowerPC
- Or compile them from source (chicken-and-egg problem)

## Step 2: Verify Build Tools

```bash
# Check if tools are installed
which gcc
which make
gcc --version
make --version
```

## Step 3: Compile PostgreSQL 11

Once build tools are installed:

```bash
# Run the installation script
./scripts/install-postgresql11-direct-sbx02.sh
```

This will:
1. Download PostgreSQL 11.23 source code
2. Configure for PowerPC architecture
3. Compile (takes 30-60 minutes)
4. Install to `/opt/postgresql11`
5. Configure minimal memory settings (512MB RAM)
6. Start PostgreSQL 11

## Step 4: Configure Replication

After PostgreSQL 11 is installed:

```bash
./scripts/setup-postgresql11-replication.sh
```

## Alternative: If Build Tools Can't Be Installed

If you cannot install gcc/make on SBX02:

### Option 1: Use Different Server

- **SBX02:** Storage only (iSCSI/NFS)
- **Helios Compute/Control:** Run PostgreSQL 11
- **Connect:** microk8s or Docker on the other server

### Option 2: Pre-compiled Binary (If Available)

Check if someone has compiled PostgreSQL 11 for PowerPC:
- Community repositories
- Third-party packages
- Cross-compilation from another machine

## Installation Scripts

1. **`check-build-tools-sbx02.sh`** - Check what's available
2. **`install-postgresql11-direct-sbx02.sh`** - Compile and install PostgreSQL 11
3. **`setup-postgresql11-replication.sh`** - Configure replication (to be created)

## Time Estimate

- **Install build tools:** 10-20 minutes
- **Download source:** 2-5 minutes
- **Compile PostgreSQL 11:** 30-60 minutes (PowerPC is slow)
- **Install and configure:** 5-10 minutes
- **Total:** ~50-95 minutes

## Troubleshooting

### Entware Installation Fails

- Check if your architecture is supported
- Try different Entware repository
- Check disk space: `df -h`

### Compilation Fails

- Check error messages
- Verify all dependencies
- Check disk space: `df -h /tmp`
- Check memory: `free -h`

### PostgreSQL Won't Start

- Check logs: `/var/log/postgresql11.log`
- Verify data directory permissions
- Check if port 5432 is available

## Next Steps

1. **Install build tools** (Entware recommended)
2. **Run:** `./scripts/check-build-tools-sbx02.sh` to verify
3. **Run:** `./scripts/install-postgresql11-direct-sbx02.sh` to compile
4. **Configure replication** from PRIMARY

## Summary

✅ **Solution:** Compile PostgreSQL 11 from source
✅ **Requires:** gcc, make (install via Entware)
✅ **Time:** ~1-2 hours total
✅ **Result:** PostgreSQL 11 running with minimal memory config (512MB RAM)

This is the most reliable way to get PostgreSQL 11 on PowerPC DS213+ without Docker.
