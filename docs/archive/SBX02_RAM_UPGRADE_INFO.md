# SBX02 (Synology DS213+) RAM Upgrade Information

## Current System

- **Model:** Synology DS213+
- **Platform:** P1022 DS (PowerPC architecture)
- **Current RAM:** 512MB (514,948 kB)
- **CPU:** Dual-core e500v2 @ 1.067 GHz
- **Architecture:** PowerPC (ppc)

## RAM Upgrade Options

### Official Specifications

**Synology DS213+ RAM:**
- **Default:** 512MB DDR3
- **Maximum:** Typically 1GB (check Synology compatibility)
- **Type:** DDR3 SODIMM (likely)
- **Speed:** Check motherboard specifications

### Upgrade Considerations

1. **Check if RAM is upgradeable:**
   - Some Synology models have soldered RAM (not upgradeable)
   - DS213+ may have a RAM slot or soldered RAM
   - Check Synology documentation for your specific model

2. **RAM Type:**
   - Likely DDR3 SODIMM (laptop-style RAM)
   - Check exact specifications before purchasing

3. **Compatibility:**
   - Must match PowerPC architecture requirements
   - Check Synology compatibility list
   - Verify voltage and speed requirements

### How to Check Current RAM Setup

**Via SSH:**
```bash
# Check RAM slots
cat /proc/meminfo | grep -i memtotal

# Check if RAM is soldered or socketed (may require physical inspection)
```

**Physical Inspection:**
- Open the NAS case (voids warranty)
- Check if RAM is soldered to motherboard
- Look for RAM slots
- Note RAM module specifications if visible

### Recommended RAM

**If upgradeable:**
- **Type:** DDR3 SODIMM
- **Size:** 1GB or 2GB (check max supported)
- **Speed:** Match existing RAM speed
- **Voltage:** Low voltage (1.35V) or standard (1.5V)

### microk8s Requirements

**Even with RAM upgrade:**
- microk8s minimum: **2GB RAM**
- Recommended: **4GB+ RAM**
- DS213+ max likely: **1GB** (if upgradeable)

**Conclusion:** Even with RAM upgrade, DS213+ may not have enough for microk8s.

## Alternative Solutions

### Option 1: Use Different Server for microk8s
- SBX02: Storage only (iSCSI LUNs)
- Another server: Run microk8s + PostgreSQL 11
- **Best option if you have another server**

### Option 2: Use Docker Directly (Lighter)
- If Docker is available for DS213+
- Run PostgreSQL 11 container directly (no Kubernetes)
- Requires less RAM than microk8s
- **Check if Docker supports PowerPC**

### Option 3: Backup-Only Solution
- Use SBX02 for automated backups
- No real-time replication
- **Works with current 512MB RAM**

## Next Steps

1. **Check if RAM is upgradeable:**
   - Physical inspection
   - Synology documentation
   - Community forums

2. **If upgradeable:**
   - Purchase compatible RAM
   - Install (may void warranty)
   - Test with microk8s

3. **If not upgradeable or insufficient:**
   - Use alternative architecture (different server for microk8s)
   - Or use backup-only solution

## Resources

- Synology DS213+ specifications
- Synology community forums
- RAM compatibility lists
- PowerPC DDR3 SODIMM specifications
