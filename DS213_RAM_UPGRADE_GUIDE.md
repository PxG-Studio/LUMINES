# Synology DS213+ RAM Upgrade Guide

## Your System: DS213+ (SBX02)

- **Current RAM:** 512MB (514,948 kB)
- **Platform:** P1022 DS (PowerPC)
- **CPU:** Dual-core e500v2 @ 1.067 GHz
- **Architecture:** PowerPC (ppc)

## RAM Upgrade Information

### DS213+ RAM Specifications

**According to Synology specifications:**
- **Default RAM:** 512MB DDR3
- **Maximum RAM:** **1GB** (if upgradeable)
- **RAM Type:** DDR3 SODIMM (laptop-style)
- **Speed:** Check exact specifications (likely DDR3-1066 or DDR3-1333)

### Important Notes

1. **DS213+ is an older model (2013)**
   - May have soldered RAM (not upgradeable)
   - Check physical inspection to confirm

2. **Even if upgradeable:**
   - Maximum likely **1GB total** (512MB + 512MB)
   - Still **insufficient for microk8s** (needs 2GB+)

3. **microk8s Requirements:**
   - Minimum: **2GB RAM**
   - Recommended: **4GB+ RAM**
   - DS213+ max: **1GB** (if upgradeable) ❌

## How to Check if RAM is Upgradeable

### Method 1: Physical Inspection

1. **Power down and unplug** the NAS
2. **Remove drive bays** (if needed)
3. **Open the case** (may void warranty)
4. **Check for RAM slot:**
   - Look for a SODIMM slot on the motherboard
   - If RAM is soldered, it's not upgradeable

### Method 2: Check Synology Documentation

- Visit Synology website
- Check DS213+ hardware installation guide
- Look for RAM upgrade instructions

### Method 3: Check Current RAM Setup

```bash
# Via SSH (already checked)
cat /proc/meminfo | grep MemTotal
# Shows: 514948 kB (512MB)
```

## If RAM is Upgradeable

### Recommended RAM Module

**If you find a RAM slot:**
- **Type:** DDR3 SODIMM
- **Size:** 512MB or 1GB module
- **Speed:** Match existing (likely DDR3-1066 or DDR3-1333)
- **Voltage:** 1.5V (standard) or 1.35V (low voltage)
- **Compatibility:** Must work with PowerPC architecture

### Where to Buy

1. **Synology Official RAM:**
   - More expensive
   - Guaranteed compatibility
   - Maintains warranty

2. **Third-Party RAM:**
   - More affordable
   - May void warranty
   - Must match exact specifications

### Installation Steps

1. **Power down** the NAS completely
2. **Unplug** from power
3. **Remove drive bays** (if needed)
4. **Open case** (check for warranty void stickers)
5. **Locate RAM slot** (if exists)
6. **Remove old RAM** (if socketed)
7. **Install new RAM** (match notch orientation)
8. **Reassemble** and power on
9. **Verify** in DSM: Control Panel > Info Center

## Reality Check: Will 1GB Be Enough?

**Even with 1GB RAM upgrade:**
- ❌ **microk8s:** Needs 2GB+ (won't work)
- ⚠️ **Docker:** Might work (lighter than microk8s)
- ✅ **Backup storage:** Works fine
- ✅ **iSCSI storage:** Works fine

## Recommended Solution

**Given RAM limitations, best approach:**

### Option 1: Use Different Server for microk8s ⭐ BEST

```
SBX02 (DS213+) - Storage Provider
└── iSCSI LUN: postgresql-data (100GB)
    └── Provides persistent storage

Helios Compute (192.168.86.115) - microk8s + PostgreSQL
├── microk8s installed (has enough RAM)
├── PostgreSQL 11 container
├── Connected to SBX02 iSCSI LUNs
└── Replicating from PRIMARY (192.168.86.27)
```

**Benefits:**
- ✅ SBX02 provides reliable storage
- ✅ microk8s runs on server with sufficient resources
- ✅ No RAM upgrade needed on SBX02
- ✅ PostgreSQL 11 in container (version compatible)

### Option 2: Try Docker on DS213+ (If Available)

**If Docker is available for DS213+:**
- Install Docker from Package Center
- Run PostgreSQL 11 container directly (no Kubernetes)
- Requires less RAM than microk8s
- **Check if Docker supports PowerPC**

### Option 3: Backup-Only Solution

**Use SBX02 for backups:**
- Automated backups from PRIMARY
- No real-time replication
- Works with current 512MB RAM
- Simple and reliable

## Next Steps

1. **Decide on approach:**
   - Upgrade RAM? (likely won't help for microk8s)
   - Use different server for microk8s? (recommended)
   - Use backup-only solution? (simplest)

2. **If upgrading RAM:**
   - Physical inspection to confirm upgradeability
   - Purchase compatible DDR3 SODIMM
   - Install (may void warranty)

3. **If using different server:**
   - Check Helios Compute/Control resources
   - Set up iSCSI on SBX02
   - Install microk8s on chosen server

## Summary

**DS213+ RAM Upgrade:**
- ✅ Likely upgradeable to **1GB max**
- ❌ Still **insufficient for microk8s** (needs 2GB+)
- ⚠️ May void warranty
- 💡 **Better to use different server for microk8s**

**Recommendation:** Use SBX02 for storage only, run microk8s on a different server with more resources.
