# Alternative Architecture for PostgreSQL Replication

## Problem

SBX02 (192.168.86.28) has severe resource constraints:
- **512MB RAM** - Too small for microk8s (needs 2GB+)
- **PowerPC architecture** - Limited software compatibility
- **DSM 6.2.4** - Older version, limited packages
- **No Docker/microk8s** - Not available for this model

## Solution: Use Different Server for microk8s

### Recommended Architecture

```
SBX02 (192.168.86.28) - Storage Only
├── iSCSI LUN: postgresql-data (100GB)
└── Provides storage via iSCSI

Helios Compute (192.168.86.115) - microk8s + PostgreSQL
├── microk8s installed
├── PostgreSQL 11 container
└── Connected to SBX02 iSCSI LUNs
    └── Replicating from PRIMARY (192.168.86.27)
```

### Steps

1. **On SBX02:** Set up iSCSI LUN via DSM web interface
2. **On Helios Compute (192.168.86.115):** Install microk8s
3. **On Helios Compute:** Connect to SBX02 iSCSI LUNs
4. **On Helios Compute:** Deploy PostgreSQL 11 container
5. **Configure replication** from PRIMARY

## Alternative: Use SBX02 for Backups Only

Since SBX02 is resource-constrained:
- Use it for **backup storage only**
- Run automated backups from PRIMARY
- Store backups on SBX02
- No real-time replication, but reliable backups

## Which Server Should Run microk8s?

**Options:**
1. **Helios Compute (192.168.86.115)** - Likely has more resources
2. **Helios Control (192.168.86.114)** - Could work if resources available
3. **Separate VM/Server** - If available

## Next Steps

1. Check resources on Helios Compute/Control
2. Set up iSCSI LUN on SBX02 (storage provider)
3. Install microk8s on the chosen server
4. Connect to SBX02 iSCSI from that server
5. Deploy PostgreSQL 11
