#!/bin/bash
# configure-iscsi-on-sbx02.sh
# Run this script DIRECTLY on SBX02 (not via SSH)
# It will configure iSCSI target, LUN, and mappings

set -e

TARGET_NAME="postgresql-storage"
LUN_NAME="postgresql-data"
LUN_SIZE="100"  # GB
TARGET_IQN="iqn.2000-01.com.synology:sbx02.postgresql-storage"
LUN_PATH="/volume1/postgresql-data.img"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  iSCSI Configuration Script for SBX02                    ║"
echo "║  Run this script DIRECTLY on SBX02                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
  echo "⚠️  This script needs root privileges"
  echo "   Run with: sudo $0"
  exit 1
fi

# Step 1: Backup configs
echo "▶ Step 1: Backing up existing configurations..."
cp /usr/syno/etc/iscsi_target.conf /usr/syno/etc/iscsi_target.conf.backup.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
cp /usr/syno/etc/iscsi_lun.conf /usr/syno/etc/iscsi_lun.conf.backup.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
cp /usr/syno/etc/iscsi_mapping.conf /usr/syno/etc/iscsi_mapping.conf.backup.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
cp /usr/syno/etc/iscsi_acl.conf /usr/syno/etc/iscsi_acl.conf.backup.$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
echo "✅ Backups created"
echo ""

# Step 2: Verify LUN file exists
echo "▶ Step 2: Verifying LUN file..."
if [ -f "$LUN_PATH" ]; then
  LUN_SIZE_ACTUAL=$(ls -lh "$LUN_PATH" | awk '{print $5}')
  echo "✅ LUN file exists: $LUN_PATH ($LUN_SIZE_ACTUAL)"
else
  echo "❌ LUN file not found: $LUN_PATH"
  echo "   Creating LUN file (this will take several minutes)..."
  dd if=/dev/zero of="$LUN_PATH" bs=1M count=$((LUN_SIZE * 1024)) 2>&1 | tail -3
  echo "✅ LUN file created"
fi
echo ""

# Step 3: Write target configuration
echo "▶ Step 3: Writing target configuration..."
cat > /usr/syno/etc/iscsi_target.conf << TARGET_EOF
[$TARGET_NAME]
iqn="$TARGET_IQN"
TARGET_EOF
chmod 644 /usr/syno/etc/iscsi_target.conf
echo "✅ Target config written"
cat /usr/syno/etc/iscsi_target.conf
echo ""

# Step 4: Write LUN configuration
echo "▶ Step 4: Writing LUN configuration..."
cat > /usr/syno/etc/iscsi_lun.conf << LUN_EOF
[$LUN_NAME]
lun_id="1"
path="$LUN_PATH"
LUN_EOF
chmod 644 /usr/syno/etc/iscsi_lun.conf
echo "✅ LUN config written"
cat /usr/syno/etc/iscsi_lun.conf
echo ""

# Step 5: Write mapping configuration
echo "▶ Step 5: Writing mapping configuration..."
echo "$TARGET_NAME:$LUN_NAME" >> /usr/syno/etc/iscsi_mapping.conf
chmod 644 /usr/syno/etc/iscsi_mapping.conf
echo "✅ Mapping config written"
cat /usr/syno/etc/iscsi_mapping.conf
echo ""

# Step 6: Write ACL configuration
echo "▶ Step 6: Writing ACL configuration..."
echo "$TARGET_NAME:ALL" >> /usr/syno/etc/iscsi_acl.conf
chmod 644 /usr/syno/etc/iscsi_acl.conf
echo "✅ ACL config written"
cat /usr/syno/etc/iscsi_acl.conf
echo ""

# Step 7: Enable service in settings
echo "▶ Step 7: Enabling iSCSI service..."
if ! grep -q 'enable="yes"' /usr/syno/etc/iscsi_setting.conf 2>/dev/null; then
  echo 'enable="yes"' >> /usr/syno/etc/iscsi_setting.conf
fi
echo "✅ Service enabled"
echo ""

# Step 8: Restart iSCSI service
echo "▶ Step 8: Restarting iSCSI service..."
/usr/syno/bin/synoiscsiep --stopall iscsi 2>/dev/null || true
sleep 2
/usr/syno/bin/synoiscsiep --startall iscsi
sleep 5
echo "✅ Service restarted"
echo ""

# Step 9: Verify
echo "▶ Step 9: Verifying configuration..."
echo "Checking port 3260..."
if netstat -tln | grep -q 3260; then
  echo "✅ Port 3260 is listening!"
  netstat -tln | grep 3260
else
  echo "⚠️  Port 3260 not listening yet"
  echo "   Service may need a moment to start"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Configuration Complete!                                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Summary:"
echo "  - Target: $TARGET_NAME"
echo "  - Target IQN: $TARGET_IQN"
echo "  - LUN: $LUN_NAME (${LUN_SIZE}GB)"
echo "  - LUN Path: $LUN_PATH"
echo ""
echo "Next: Test discovery from Helios Compute:"
echo "  sudo iscsiadm -m discovery -t st -p 192.168.86.28"
echo ""
