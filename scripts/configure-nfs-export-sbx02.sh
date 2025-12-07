#!/bin/bash
# Configure NFS export on SBX02 to allow chown operations

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ Configure NFS Export for PostgreSQL on SBX02             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Backup exports file
if [ -f /etc/exports ]; then
    sudo cp /etc/exports /etc/exports.backup.$(date +%Y%m%d-%H%M%S)
    echo "✅ Backed up /etc/exports"
fi

# Check if pgdata_nfs export exists
if grep -q "pgdata_nfs" /etc/exports 2>/dev/null; then
    echo "📝 Found existing pgdata_nfs export"
    grep "pgdata_nfs" /etc/exports
    echo ""
    echo "Updating export to allow chown operations..."

    # Remove old entry
    sudo sed -i '/pgdata_nfs.*192.168.86.115/d' /etc/exports

    # Add new entry with no_root_squash
    echo "/volume1/pgdata_nfs 192.168.86.115(rw,sync,no_root_squash,no_subtree_check)" | sudo tee -a /etc/exports
else
    echo "📝 Adding new NFS export for pgdata_nfs"
    echo "/volume1/pgdata_nfs 192.168.86.115(rw,sync,no_root_squash,no_subtree_check)" | sudo tee -a /etc/exports
fi

# Reload NFS exports
echo ""
echo "🔄 Reloading NFS exports..."
sudo exportfs -ra

echo ""
echo "✅ NFS export configured!"
echo ""
echo "📋 Current exports:"
cat /etc/exports | grep pgdata_nfs

echo ""
echo "💡 Now restart PostgreSQL container on Helios Compute:"
echo "   ssh 192.168.86.115 'sudo docker restart postgresql-dr'"
