#!/bin/bash
# Verify NFS access on Helios Compute (192.168.86.115)

set -e

MOUNT_POINT="/mnt/postgresql-data"
POSTGRES_UID=999
POSTGRES_GID=999

echo "╔════════════════════════════════════════════════════════════╗"
echo "║ NFS Access Verification - Helios Compute                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if mounted
if ! mountpoint -q "$MOUNT_POINT"; then
    echo "❌ NFS not mounted at $MOUNT_POINT"
    echo "   Attempting to mount..."
    sudo mount "$MOUNT_POINT" || {
        echo "   ❌ Mount failed. Check NFS export configuration on SBX02."
        exit 1
    }
fi

echo "✅ NFS is mounted"
echo ""

# Check mount details
echo "📊 Mount Information:"
df -h "$MOUNT_POINT" | tail -1
echo ""

# Test read access
echo "🔍 Testing read access..."
if sudo -u \#999 ls "$MOUNT_POINT" >/dev/null 2>&1; then
    echo "✅ Read access: OK"
else
    echo "❌ Read access: FAILED"
    echo "   Check NFS export permissions on SBX02"
fi

# Test write access
echo ""
echo "🔍 Testing write access..."
TEST_FILE="$MOUNT_POINT/.nfs-test-$(date +%s)"
if sudo -u \#999 touch "$TEST_FILE" 2>/dev/null; then
    echo "✅ Write access: OK"
    sudo -u \#999 rm -f "$TEST_FILE"
else
    echo "❌ Write access: FAILED"
    echo "   Check NFS export permissions on SBX02"
    echo "   Required: rw (read/write) permission for 192.168.86.115"
fi

echo ""
echo "📋 Current mount options:"
mount | grep "$MOUNT_POINT"

echo ""
echo "💡 If access failed, configure NFS export on SBX02:"
echo "   - Hostname/IP: 192.168.86.115"
echo "   - Privilege: Read/Write"
echo "   - Squash: No mapping (or Map all users to admin)"
echo ""
