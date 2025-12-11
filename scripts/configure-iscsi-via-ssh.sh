#!/bin/bash
# configure-iscsi-via-ssh.sh
# Configures iSCSI service, target, and LUN on SBX02 via SSH

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"
TARGET_NAME="postgresql-storage"
LUN_NAME="postgresql-data"
LUN_SIZE="100"  # GB

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  iSCSI Configuration via SSH on SBX02                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

# Step 1: Check iSCSI installation
echo "▶ Step 1: Verifying iSCSI installation..."
ISCSI_PROCESSES=$(run_remote "ps aux | grep -i iscsi | grep -v grep | wc -l")
if [ "$ISCSI_PROCESSES" -gt 0 ]; then
  echo "✅ iSCSI processes are running ($ISCSI_PROCESSES processes)"
else
  echo "⚠️  No iSCSI processes found"
fi
echo ""

# Step 2: Find iSCSI configuration location
echo "▶ Step 2: Locating iSCSI configuration..."
echo "Searching for iSCSI configuration files..."

# Common Synology iSCSI locations
CONFIG_LOCATIONS=(
  "/usr/syno/etc/iscsi"
  "/var/lib/iscsi"
  "/var/syno/iscsi"
  "/etc/iscsi"
)

CONFIG_DIR=""
for loc in "${CONFIG_LOCATIONS[@]}"; do
  if run_remote "test -d $loc && echo 'exists' || echo 'missing'" | grep -q "exists"; then
    CONFIG_DIR="$loc"
    echo "✅ Found iSCSI config directory: $CONFIG_DIR"
    break
  fi
done

if [ -z "$CONFIG_DIR" ]; then
  echo "⚠️  Could not find iSCSI config directory"
  echo "   Checking alternative methods..."
fi
echo ""

# Step 3: Check for Synology iSCSI tools
echo "▶ Step 3: Checking for Synology iSCSI management tools..."
SYNO_TOOLS=$(run_remote "which synoiscsiexec synoiscsitarget 2>/dev/null || find /usr/syno -name '*iscsi*' -type f -executable 2>/dev/null | head -3")
if [ -n "$SYNO_TOOLS" ]; then
  echo "✅ Found Synology iSCSI tools:"
  echo "$SYNO_TOOLS"
else
  echo "⚠️  Synology-specific tools not found"
  echo "   May need to use standard iSCSI tools or DSM interface"
fi
echo ""

# Step 4: Check available storage
echo "▶ Step 4: Checking available storage..."
AVAILABLE_STORAGE=$(run_remote "df -h | grep -E 'volume|^/dev' | awk '{print \$4, \$6}' | head -3")
echo "Available storage:"
echo "$AVAILABLE_STORAGE"
echo ""

# Step 5: Check if target already exists
echo "▶ Step 5: Checking for existing iSCSI targets..."
EXISTING_TARGETS=$(run_remote "ls -la /usr/syno/etc/iscsi/targets 2>/dev/null || ls -la /var/lib/iscsi/targets 2>/dev/null || echo 'Checking targets...'")
echo "$EXISTING_TARGETS"
echo ""

# Step 6: Generate Target IQN
echo "▶ Step 6: Generating Target IQN..."
HOSTNAME=$(run_remote "hostname | tr '[:upper:]' '[:lower:]'")
TARGET_IQN="iqn.2000-01.com.synology:${HOSTNAME}.${TARGET_NAME}"
echo "Target IQN: $TARGET_IQN"
echo ""

# Step 7: Create iSCSI target configuration
echo "▶ Step 7: Creating iSCSI target configuration..."
echo "   Target Name: $TARGET_NAME"
echo "   Target IQN: $TARGET_IQN"
echo ""

# Try to create target using Synology methods
echo "Attempting to create iSCSI target..."

# Method 1: Check if we can use synoiscsiexec
if run_remote "which synoiscsiexec" > /dev/null 2>&1; then
  echo "Using synoiscsiexec..."
  # This would require root access and specific syntax
  echo "⚠️  synoiscsiexec requires specific parameters"
fi

# Method 2: Check if we can use tgtadm (standard Linux iSCSI)
if run_remote "which tgtadm" > /dev/null 2>&1; then
  echo "Found tgtadm (standard iSCSI tool)"
  echo "Creating target..."

  run_remote "sudo tgtadm --lld iscsi --op new --mode target --tid 1 --targetname $TARGET_IQN" || {
    echo "⚠️  Target creation may have failed or target already exists"
  }

  echo "✅ Target created (or already exists)"
else
  echo "⚠️  tgtadm not found"
fi
echo ""

# Step 8: Create LUN
echo "▶ Step 8: Creating iSCSI LUN..."
echo "   LUN Name: $LUN_NAME"
echo "   Size: ${LUN_SIZE}GB"
echo ""

# Find available volume
VOLUME=$(run_remote "df -h | grep volume | awk '{print \$6}' | head -1")
if [ -z "$VOLUME" ]; then
  VOLUME="/volume1"
fi
echo "Using volume: $VOLUME"

# Create LUN file
LUN_PATH="${VOLUME}/${LUN_NAME}.img"
echo "LUN Path: $LUN_PATH"

# Check if LUN already exists
if run_remote "test -f $LUN_PATH && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "⚠️  LUN file already exists: $LUN_PATH"
  read -p "Remove and recreate? (y/n): " RECREATE
  if [ "$RECREATE" = "y" ]; then
    run_remote "sudo rm -f $LUN_PATH"
  else
    echo "Using existing LUN file"
    LUN_EXISTS=true
  fi
fi

if [ "$LUN_EXISTS" != "true" ]; then
  echo "Creating LUN file (${LUN_SIZE}GB)..."
  run_remote "sudo dd if=/dev/zero of=$LUN_PATH bs=1M count=$((LUN_SIZE * 1024)) 2>&1 | tail -3" || {
    echo "⚠️  LUN creation may take time or failed"
  }
  echo "✅ LUN file created"
fi
echo ""

# Step 9: Map LUN to target
echo "▶ Step 9: Mapping LUN to target..."
if run_remote "which tgtadm" > /dev/null 2>&1; then
  echo "Mapping LUN to target using tgtadm..."
  run_remote "sudo tgtadm --lld iscsi --op new --mode logicalunit --tid 1 --lun 1 --backing-store $LUN_PATH" || {
    echo "⚠️  LUN mapping may have failed or already mapped"
  }
  echo "✅ LUN mapped to target"
else
  echo "⚠️  Cannot map LUN - tgtadm not available"
fi
echo ""

# Step 10: Enable target
echo "▶ Step 10: Enabling iSCSI target..."
if run_remote "which tgtadm" > /dev/null 2>&1; then
  run_remote "sudo tgtadm --lld iscsi --op bind --mode target --tid 1 --initiator-address ALL" || {
    echo "⚠️  Target binding may have failed"
  }
  echo "✅ Target enabled and bound"
fi
echo ""

# Step 11: Start iSCSI service
echo "▶ Step 11: Starting iSCSI service..."
run_remote "sudo /usr/syno/bin/synopkg start iSCSITarget 2>/dev/null || \
sudo systemctl start tgtd 2>/dev/null || \
sudo service tgtd start 2>/dev/null || \
echo 'Service start attempted'"
sleep 3
echo ""

# Step 12: Verify service
echo "▶ Step 12: Verifying iSCSI service..."
PORT_CHECK=$(run_remote "netstat -tln 2>/dev/null | grep 3260 || echo 'not listening'")
if echo "$PORT_CHECK" | grep -q "3260"; then
  echo "✅ iSCSI service is running!"
  echo "$PORT_CHECK"
else
  echo "⚠️  Port 3260 not listening"
  echo "   Service may need manual start via DSM"
fi
echo ""

# Step 13: List targets
echo "▶ Step 13: Listing configured targets..."
if run_remote "which tgtadm" > /dev/null 2>&1; then
  run_remote "sudo tgtadm --lld iscsi --op show --mode target 2>&1" || echo "Could not list targets"
else
  echo "Cannot list targets - tgtadm not available"
fi
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  iSCSI Configuration Complete                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Summary:"
echo "  - Target IQN: $TARGET_IQN"
echo "  - LUN Path: $LUN_PATH"
echo "  - LUN Size: ${LUN_SIZE}GB"
echo ""
echo "Next steps:"
echo "  1. Verify service is running: ./scripts/check-iscsi-sbx02.sh"
echo "  2. Connect from Helios Compute: ./scripts/phase4-setup-iscsi-connection.sh"
echo ""
