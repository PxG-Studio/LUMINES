# Multi-Server PostgreSQL 11 DR Setup Plan

## Architecture

```
SBX02 (192.168.86.28) - Storage Provider
└── iSCSI LUN: postgresql-data (100GB)
    └── Provides persistent storage

Helios Control (192.168.86.114) OR Helios Compute (192.168.86.115)
├── Docker/microk8s installed
├── PostgreSQL 11 container
├── Connected to SBX02 iSCSI LUNs
└── Replicating from PRIMARY (192.168.86.27)
```

## Phase 1: Server Selection ✅

**Status:** In Progress

**Tasks:**
- [x] Check Helios Control (192.168.86.114) reachability
- [x] Check Helios Compute (192.168.86.115) reachability
- [ ] Get SSH credentials for chosen server
- [ ] Check resources (RAM, CPU, disk)
- [ ] Check Docker/microk8s availability
- [ ] Choose best server

## Phase 2: Storage Setup on SBX02

**Status:** Pending

**Tasks:**
- [ ] Access SBX02 DSM web interface
- [ ] Install iSCSI Manager (if needed)
- [ ] Create iSCSI Target: `postgresql-storage`
- [ ] Create iSCSI LUN: `postgresql-data` (100GB)
- [ ] Note IQN and connection details
- [ ] Configure firewall (port 3260)

**Guide:** `scripts/setup-iscsi-sbx02.md`

## Phase 3: Helios Server Setup

**Status:** Pending

**Tasks:**
- [ ] Install Docker OR microk8s
- [ ] Install iSCSI initiator tools
- [ ] Discover and connect to SBX02 iSCSI target
- [ ] Format and prepare storage
- [ ] Create Kubernetes StorageClass (if using microk8s)
- [ ] Create PersistentVolume for iSCSI

## Phase 4: PostgreSQL 11 Deployment

**Status:** Pending

**Tasks:**
- [ ] Create PostgreSQL 11 Docker container OR Kubernetes deployment
- [ ] Configure minimal memory settings (512MB RAM equivalent)
- [ ] Mount iSCSI storage as data directory
- [ ] Configure network (listen on all interfaces)
- [ ] Start PostgreSQL 11
- [ ] Verify it's running

## Phase 5: Replication Setup

**Status:** Pending

**Tasks:**
- [ ] Verify PRIMARY (192.168.86.27) is configured for replication
- [ ] Create replication user on PRIMARY (if needed)
- [ ] Configure pg_hba.conf on PRIMARY
- [ ] Use pg_basebackup to initialize replica
- [ ] Configure standby.signal
- [ ] Set primary_conninfo
- [ ] Start replication
- [ ] Verify WAL replay

## Phase 6: Verification & Testing

**Status:** Pending

**Tasks:**
- [ ] Check replication status
- [ ] Verify WAL replay is working
- [ ] Test failover (optional)
- [ ] Monitor resource usage
- [ ] Document final configuration

## Current Status

**Phase 1:** Checking server resources...

**Next Steps:**
1. Get SSH access to Helios Control/Compute
2. Check which server is better suited
3. Proceed with storage setup on SBX02

## Files Created

- `scripts/check-helios-servers.sh` - Server resource checker
- `scripts/setup-iscsi-sbx02.md` - iSCSI setup guide
- `MULTI_SERVER_SETUP_PLAN.md` - This file

## Notes

- SBX02 provides storage only (no PostgreSQL running on it)
- PostgreSQL 11 runs on Helios server with better resources
- iSCSI provides persistent storage across reboots
- Replication ensures DR capability
