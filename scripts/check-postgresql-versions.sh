#!/bin/bash
# check-postgresql-versions.sh
# Check PostgreSQL versions on PRIMARY and SECONDARY

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Checking PostgreSQL Versions                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "▶ PRIMARY (192.168.86.27) version:"
PGPASSWORD="Replication2024Secure" psql -h 192.168.86.27 -U replicator -d postgres -t -c "SELECT version();" 2>/dev/null | head -1

echo ""
echo "▶ SECONDARY (local) version:"
sudo -u postgres psql -t -c "SELECT version();" 2>/dev/null | head -1 || psql --version

echo ""
echo "Note: For streaming replication, SECONDARY must be same major version or newer than PRIMARY"
echo ""
