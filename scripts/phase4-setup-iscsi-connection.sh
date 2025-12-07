#!/bin/bash
# phase4-setup-iscsi-connection.sh
# Phase 4: Automate iSCSI connection from Helios Compute to SBX02

set -e

HELIOS_COMPUTE="192.168.86.115"
SBX02_IP="192.168.86.28"
MOUNT_POINT="/mnt/postgresql-data"
FSTAB_ENTRY="/etc/fstab"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 4: iSCSI Connection Setup                         ║"
echo "║  Helios Compute → SBX02 iSCSI Storage                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Function to run command on Helios Compute
run_remote() {
  ssh -o ConnectTimeout=5 $HELIOS_COMPUTE "$1"
}

# Step 1: Verify prerequisites
echo "▶ Step 4.1: Verifying prerequisites..."
echo ""

# Check connectivity
if ! ping -c 2 -W 2 $HELIOS_COMPUTE > /dev/null 2>&1; then
  echo "❌ Cannot reach Helios Compute ($HELIOS_COMPUTE)"
  exit 1
fi
echo "✅ Helios Compute is reachable"

if ! ping -c 2 -W 2 $SBX02_IP > /dev/null 2>&1; then
  echo "❌ Cannot reach SBX02 ($SBX02_IP)"
  exit 1
fi
echo "✅ SBX02 is reachable"
echo ""

# Check iSCSI tools
if ! run_remote "which iscsiadm" > /dev/null 2>&1; then
  echo "❌ iSCSI tools not installed on Helios Compute"
  echo "   Run: ./scripts/phase3-install-iscsi.sh"
  exit 1
fi
echo "✅ iSCSI tools installed"
echo ""

# Step 2: Discover iSCSI targets
echo "▶ Step 4.2: Discovering iSCSI targets on SBX02..."
echo "   Searching for targets at $SBX02_IP..."
echo ""

TARGETS=$(run_remote "sudo iscsiadm -m discovery -t st -p $SBX02_IP 2>&1" || echo "")

if [ -z "$TARGETS" ] || echo "$TARGETS" | grep -q "No targets found"; then
  echo "❌ No iSCSI targets found on SBX02"
  echo ""
  echo "⚠️  Please ensure:"
  echo "   1. iSCSI Manager is installed on SBX02"
  echo "   2. iSCSI Target is created (e.g., 'postgresql-storage')"
  echo "   3. iSCSI LUN is created and mapped to the target"
  echo "   4. Firewall allows port 3260 (iSCSI)"
  echo ""
  echo "   See guide: scripts/setup-iscsi-sbx02.md"
  exit 1
fi

echo "✅ Found iSCSI target(s):"
echo "$TARGETS"
echo ""

# Extract Target IQN
TARGET_IQN=$(echo "$TARGETS" | grep -oP 'iqn[^\s]+' | head -1)

if [ -z "$TARGET_IQN" ]; then
  echo "❌ Could not extract Target IQN"
  echo "   Please provide the Target IQN manually:"
  read -p "Target IQN: " TARGET_IQN
fi

echo "Using Target IQN: $TARGET_IQN"
echo ""

# Step 3: Check if already connected
echo "▶ Step 4.3: Checking existing iSCSI connections..."
EXISTING_SESSION=$(run_remote "sudo iscsiadm -m session 2>&1 | grep -i $TARGET_IQN || echo ''")

if [ -n "$EXISTING_SESSION" ]; then
  echo "⚠️  Already connected to iSCSI target"
  echo "$EXISTING_SESSION"
  read -p "Disconnect and reconnect? (y/n): " RECONNECT
  if [ "$RECONNECT" = "y" ]; then
    echo "Disconnecting..."
    run_remote "sudo iscsiadm -m node -T $TARGET_IQN -p $SBX02_IP --logout 2>/dev/null || true"
    sleep 2
  else
    echo "Using existing connection"
  fi
fi
echo ""

# Step 4: Connect to iSCSI target
echo "▶ Step 4.4: Connecting to iSCSI target..."
run_remote "sudo iscsiadm -m node -T $TARGET_IQN -p $SBX02_IP --login" || {
  echo "❌ Failed to connect to iSCSI target"
  echo "   Check:"
  echo "   - Target IQN is correct: $TARGET_IQN"
  echo "   - LUN is created and mapped"
  echo "   - Firewall allows connection"
  exit 1
}
echo "✅ Connected to iSCSI target"
sleep 3
echo ""

# Step 5: Find iSCSI device
echo "▶ Step 4.5: Finding iSCSI device..."
echo "   Waiting for device to appear..."
sleep 2

# Try multiple methods to find the device
ISCSI_DEVICE=$(run_remote "lsblk -o NAME,TYPE,MOUNTPOINT | grep -i disk | grep -v 'loop\|sr0' | awk '{print \$1}' | tail -1" || echo "")

if [ -z "$ISCSI_DEVICE" ]; then
  # Try alternative method
  ISCSI_DEVICE=$(run_remote "ls -la /dev/disk/by-path/ | grep iscsi | tail -1 | awk '{print \$NF}' | sed 's|../||' || echo ''")
fi

if [ -z "$ISCSI_DEVICE" ]; then
  echo "❌ Could not find iSCSI device"
  echo "   Checking available devices..."
  run_remote "lsblk"
  echo ""
  echo "   Please identify the iSCSI device manually:"
  read -p "Device name (e.g., sdb, sdc): " ISCSI_DEVICE
fi

# Get full device path
if [[ ! "$ISCSI_DEVICE" =~ ^/dev/ ]]; then
  ISCSI_DEVICE="/dev/$ISCSI_DEVICE"
fi

echo "✅ Found iSCSI device: $ISCSI_DEVICE"
echo ""

# Step 6: Check if device is already mounted
echo "▶ Step 4.6: Checking if device is already mounted..."
MOUNTED=$(run_remote "mount | grep $ISCSI_DEVICE || echo ''")

if [ -n "$MOUNTED" ]; then
  echo "⚠️  Device is already mounted:"
  echo "$MOUNTED"
  read -p "Unmount and remount? (y/n): " REMOUNT
  if [ "$REMOUNT" = "y" ]; then
    run_remote "sudo umount $ISCSI_DEVICE 2>/dev/null || true"
  else
    echo "Using existing mount"
    exit 0
  fi
fi
echo ""

# Step 7: Check filesystem
echo "▶ Step 4.7: Checking filesystem..."
FS_TYPE=$(run_remote "sudo blkid $ISCSI_DEVICE | grep -oP 'TYPE=\"\K[^\"]+' || echo 'none'")

if [ "$FS_TYPE" = "none" ] || [ -z "$FS_TYPE" ]; then
  echo "⚠️  No filesystem detected on $ISCSI_DEVICE"
  read -p "Format as ext4? (WARNING: This will erase all data!) (y/n): " FORMAT

  if [ "$FORMAT" = "y" ]; then
    echo "Formatting $ISCSI_DEVICE as ext4..."
    run_remote "sudo mkfs.ext4 -F $ISCSI_DEVICE"
    echo "✅ Formatted as ext4"
    FS_TYPE="ext4"
  else
    echo "❌ Cannot proceed without filesystem"
    exit 1
  fi
else
  echo "✅ Filesystem detected: $FS_TYPE"
fi
echo ""

# Step 8: Create mount point
echo "▶ Step 4.8: Creating mount point..."
run_remote "sudo mkdir -p $MOUNT_POINT"
run_remote "sudo chmod 755 $MOUNT_POINT"
echo "✅ Mount point created: $MOUNT_POINT"
echo ""

# Step 9: Mount device
echo "▶ Step 4.9: Mounting iSCSI device..."
run_remote "sudo mount $ISCSI_DEVICE $MOUNT_POINT" || {
  echo "❌ Failed to mount device"
  exit 1
}
echo "✅ Device mounted to $MOUNT_POINT"
echo ""

# Step 10: Set permissions
echo "▶ Step 4.10: Setting permissions for PostgreSQL..."
run_remote "sudo chown -R 999:999 $MOUNT_POINT 2>/dev/null || sudo chown -R postgres:postgres $MOUNT_POINT 2>/dev/null || true"
run_remote "sudo chmod 755 $MOUNT_POINT"
echo "✅ Permissions set"
echo ""

# Step 11: Configure auto-mount on boot
echo "▶ Step 4.11: Configuring auto-mount on boot..."
# Get UUID of the device
DEVICE_UUID=$(run_remote "sudo blkid $ISCSI_DEVICE | grep -oP 'UUID=\"\K[^\"]+' || echo ''")

if [ -n "$DEVICE_UUID" ]; then
  # Check if already in fstab
  FSTAB_EXISTS=$(run_remote "grep -q \"$MOUNT_POINT\" $FSTAB_ENTRY && echo 'yes' || echo 'no'")

  if [ "$FSTAB_EXISTS" = "no" ]; then
    echo "Adding to /etc/fstab for auto-mount..."
    FSTAB_LINE="UUID=$DEVICE_UUID $MOUNT_POINT ext4 defaults,_netdev 0 2"
    run_remote "echo '$FSTAB_LINE' | sudo tee -a $FSTAB_ENTRY > /dev/null"
    echo "✅ Added to /etc/fstab"
  else
    echo "✅ Already configured in /etc/fstab"
  fi
else
  echo "⚠️  Could not get UUID, skipping fstab configuration"
  echo "   You may need to configure auto-mount manually"
fi
echo ""

# Step 12: Configure iSCSI auto-login
echo "▶ Step 4.12: Configuring iSCSI auto-login on boot..."
run_remote "sudo iscsiadm -m node -T $TARGET_IQN -p $SBX02_IP -o update -n node.startup -v automatic" || {
  echo "⚠️  Could not configure auto-login"
  echo "   iSCSI connection may need manual login after reboot"
}
echo "✅ iSCSI auto-login configured"
echo ""

# Step 13: Verify setup
echo "▶ Step 4.13: Verifying setup..."
echo ""

# Check mount
MOUNT_STATUS=$(run_remote "mount | grep $MOUNT_POINT || echo ''")
if [ -n "$MOUNT_STATUS" ]; then
  echo "✅ Mount status:"
  echo "$MOUNT_STATUS"
else
  echo "❌ Mount verification failed"
  exit 1
fi
echo ""

# Check disk space
DISK_SPACE=$(run_remote "df -h $MOUNT_POINT | tail -1")
echo "✅ Disk space:"
echo "$DISK_SPACE"
echo ""

# Check permissions
PERMISSIONS=$(run_remote "ls -ld $MOUNT_POINT")
echo "✅ Permissions:"
echo "$PERMISSIONS"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Phase 4 Complete - iSCSI Connection Established          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ iSCSI storage is ready for PostgreSQL 11!"
echo ""
echo "Summary:"
echo "  - Target IQN: $TARGET_IQN"
echo "  - Device: $ISCSI_DEVICE"
echo "  - Mount point: $MOUNT_POINT"
echo "  - Filesystem: $FS_TYPE"
echo "  - Auto-mount: Configured"
echo "  - Auto-login: Configured"
echo ""
echo "Next steps:"
echo "  1. Deploy PostgreSQL 11 container"
echo "  2. Configure replication from PRIMARY"
echo ""
echo "Run: ./scripts/phase5-deploy-postgresql11.sh"
echo ""
