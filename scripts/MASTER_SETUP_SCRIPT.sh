#!/bin/bash
# MASTER_SETUP_SCRIPT.sh
# Master script to run all phases systematically

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  PostgreSQL 11 DR Setup - Master Script                  ║"
echo "║  Systematic and Methodical Installation                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "This script will run all phases in order:"
echo ""
echo "Phase 1: Check Docker installation"
echo "Phase 2: Install Docker (if needed)"
echo "Phase 3: Install iSCSI tools (if needed)"
echo "Phase 4: Setup iSCSI connection to SBX02"
echo "Phase 5: Deploy PostgreSQL 11 container"
echo "Phase 6: Configure replication (manual)"
echo ""
read -p "Continue? (y/n): " CONTINUE

if [ "$CONTINUE" != "y" ]; then
  echo "Aborted."
  exit 0
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 1: Docker Check                                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
./scripts/phase1-check-docker.sh

echo ""
read -p "Press Enter to continue to Phase 2..."

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 2: Docker Installation                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
./scripts/phase2-install-docker.sh

echo ""
read -p "Press Enter to continue to Phase 3..."

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 3: iSCSI Tools                                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
./scripts/phase3-install-iscsi.sh

echo ""
echo "⚠️  IMPORTANT: Before Phase 4, ensure iSCSI LUN is created on SBX02"
echo "   See guide: scripts/setup-iscsi-sbx02.md"
echo ""
read -p "Have you created the iSCSI LUN on SBX02? (y/n): " ISCSI_READY

if [ "$ISCSI_READY" != "y" ]; then
  echo ""
  echo "Please create the iSCSI LUN first:"
  echo "  1. Open DSM: http://192.168.86.28:5000"
  echo "  2. Install iSCSI Manager"
  echo "  3. Create Target: postgresql-storage"
  echo "  4. Create LUN: postgresql-data (100GB)"
  echo ""
  echo "Then re-run this script or continue with Phase 4"
  exit 0
fi

echo ""
read -p "Press Enter to continue to Phase 4..."

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 4: iSCSI Connection                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
./scripts/phase4-setup-iscsi-connection.sh

echo ""
read -p "Press Enter to continue to Phase 5..."

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 5: PostgreSQL 11 Deployment                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
./scripts/phase5-deploy-postgresql11.sh

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Installation Complete!                                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ PostgreSQL 11 is deployed and running!"
echo ""
echo "Next: Configure replication from PRIMARY (192.168.86.27)"
echo "   Run: ./scripts/phase6-configure-replication.sh"
echo ""
