# SBX02 Resource Constraints and Solutions

## Current System Status

**SBX02 (192.168.86.28):**
- **Architecture:** PowerPC (ppc)
- **RAM:** 512MB total (very limited!)
- **OS:** Synology DSM (Linux 2.6.32)
- **iSCSI:** Not installed
- **Docker:** Not installed
- **microk8s:** Not available (snap not available)

## Challenges

1. **512MB RAM** - Very limited for microk8s (typically needs 2GB+)
2. **PowerPC architecture** - Limited software compatibility
3. **Old Linux kernel** (2.6.32) - May not support newer container runtimes
4. **No Docker/microk8s** - Need to install

## Solutions

### Option 1: Use Docker Directly (Lighter than microk8s)

**If Docker is available for this Synology model:**
- Install Docker from Package Center
- Run PostgreSQL 11 container directly (no Kubernetes)
- Use iSCSI LUNs for storage
- Much lighter than microk8s

### Option 2: Use Synology's Built-in Container Manager

**If available:**
- Use Synology Container Manager (if DSM version supports it)
- Deploy PostgreSQL 11 container
- Configure replication

### Option 3: Lightweight Alternative

**If containers aren't feasible:**
- Use alternative backup strategies (already documented)
- Wait for hardware upgrade
- Use a different server for replication

### Option 4: External Server for microk8s

**Run microk8s on a different server:**
- Use SBX02 only for iSCSI storage
- Run microk8s + PostgreSQL on another server (e.g., Helios Compute)
- Connect to SBX02 iSCSI LUNs from that server

## Recommended Approach

Given the constraints, **Option 4** might be best:
1. **SBX02:** Provide iSCSI storage only
2. **Another server:** Run microk8s + PostgreSQL 11
3. **Connect:** microk8s server connects to SBX02 iSCSI LUNs

Or **Option 1** if Docker is available:
1. Install Docker on SBX02
2. Run PostgreSQL 11 container directly
3. Use iSCSI for storage

## Next Steps

1. Check if Docker is available for this Synology model
2. Check DSM version and Container Manager availability
3. Consider using a different server for microk8s
4. Or proceed with alternative backup strategies
