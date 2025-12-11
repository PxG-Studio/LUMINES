#!/bin/bash
# configure-iscsi-synology-lio.sh
# Configures iSCSI using Synology's LIO-based system via SSH

set -e

SBX02_IP="192.168.86.28"
SBX02_USER="ncadmin"
SBX02_PASSWORD="C0mp0\$e2k3!!"
TARGET_NAME="postgresql-storage"
LUN_NAME="postgresql-data"
LUN_SIZE="100"  # GB
TARGET_IQN="iqn.2000-01.com.synology:sbx02.postgresql-storage"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Synology iSCSI Configuration (LIO) via SSH            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

run_remote() {
  sshpass -p "$SBX02_PASSWORD" ssh -o StrictHostKeyChecking=no $SBX02_USER@$SBX02_IP "$1"
}

# Step 1: Backup existing configs
echo "▶ Step 1: Backing up existing iSCSI configurations..."
run_remote "sudo cp /usr/syno/etc/iscsi_target.conf /usr/syno/etc/iscsi_target.conf.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"
run_remote "sudo cp /usr/syno/etc/iscsi_setting.conf /usr/syno/etc/iscsi_setting.conf.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"
run_remote "sudo cp /usr/syno/etc/iscsi_lun.conf /usr/syno/etc/iscsi_lun.conf.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"
run_remote "sudo cp /usr/syno/etc/iscsi_mapping.conf /usr/syno/etc/iscsi_mapping.conf.backup.\$(date +%Y%m%d-%H%M%S) 2>/dev/null || true"
echo "✅ Configurations backed up"
echo ""

# Step 2: Read current settings
echo "▶ Step 2: Reading current iSCSI settings..."
CURRENT_SETTING=$(run_remote "cat /usr/syno/etc/iscsi_setting.conf 2>/dev/null || echo ''")
echo "Current settings:"
echo "$CURRENT_SETTING"
echo ""

# Step 3: Enable iSCSI service in settings
echo "▶ Step 3: Enabling iSCSI service..."
# Check if service is enabled
if echo "$CURRENT_SETTING" | grep -q "enable=\"yes\""; then
  echo "✅ iSCSI service is already enabled"
else
  echo "Enabling iSCSI service..."
  # Create/update setting file
  run_remote "sudo tee /usr/syno/etc/iscsi_setting.conf > /dev/null << 'SETTING_EOF'
enable=\"yes\"
SETTING_EOF
"
  echo "✅ iSCSI service enabled"
fi
echo ""

# Step 4: Create LUN file
echo "▶ Step 4: Creating iSCSI LUN file..."
LUN_PATH="/volume1/${LUN_NAME}.img"
LUN_SIZE_BYTES=$((LUN_SIZE * 1024 * 1024 * 1024))  # Convert to bytes

if run_remote "test -f $LUN_PATH && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "⚠️  LUN file already exists: $LUN_PATH"
  LUN_SIZE_ACTUAL=$(run_remote "ls -lh $LUN_PATH | awk '{print \$5}'")
  echo "   Current size: $LUN_SIZE_ACTUAL"
  echo "   Using existing LUN file"
else
  echo "Creating LUN file: $LUN_PATH (${LUN_SIZE}GB)..."
  echo "   This may take several minutes..."
  # Use fallocate for faster creation
  run_remote "sudo fallocate -l ${LUN_SIZE}G $LUN_PATH 2>/dev/null || \
sudo dd if=/dev/zero of=$LUN_PATH bs=1M count=$((LUN_SIZE * 1024)) 2>&1 | tail -3"
  echo "✅ LUN file created"
fi
echo ""

# Step 5: Create target configuration
echo "▶ Step 5: Creating iSCSI target configuration..."
TARGET_CONFIG="/usr/syno/etc/iscsi_target.conf"

# Check if target already exists
if run_remote "grep -q \"$TARGET_NAME\" $TARGET_CONFIG 2>/dev/null && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "⚠️  Target '$TARGET_NAME' already exists in config"
else
  echo "Adding target configuration..."
  # Append target config (Synology format)
  run_remote "sudo tee -a $TARGET_CONFIG > /dev/null << 'TARGET_EOF'
[$TARGET_NAME]
iqn=\"$TARGET_IQN\"
TARGET_EOF
"
  echo "✅ Target configuration added"
fi
echo ""

# Step 6: Create LUN configuration
echo "▶ Step 6: Creating LUN configuration..."
LUN_CONFIG="/usr/syno/etc/iscsi_lun.conf"

# Generate LUN ID (usually sequential)
LUN_ID=$(run_remote "grep -c '^\[' $LUN_CONFIG 2>/dev/null || echo '0'")
LUN_ID=$((LUN_ID + 1))

if run_remote "grep -q \"$LUN_NAME\" $LUN_CONFIG 2>/dev/null && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "⚠️  LUN '$LUN_NAME' already exists in config"
else
  echo "Adding LUN configuration..."
  run_remote "sudo tee -a $LUN_CONFIG > /dev/null << 'LUN_EOF'
[$LUN_NAME]
lun_id=\"$LUN_ID\"
path=\"$LUN_PATH\"
LUN_EOF
"
  echo "✅ LUN configuration added (LUN ID: $LUN_ID)"
fi
echo ""

# Step 7: Create mapping configuration
echo "▶ Step 7: Creating target-LUN mapping..."
MAPPING_CONFIG="/usr/syno/etc/iscsi_mapping.conf"

if run_remote "grep -q \"$TARGET_NAME.*$LUN_NAME\" $MAPPING_CONFIG 2>/dev/null && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "⚠️  Mapping already exists"
else
  echo "Adding mapping configuration..."
  run_remote "sudo tee -a $MAPPING_CONFIG > /dev/null << 'MAPPING_EOF'
$TARGET_NAME:$LUN_NAME
MAPPING_EOF
"
  echo "✅ Mapping configuration added"
fi
echo ""

# Step 8: Configure ACL (allow all connections)
echo "▶ Step 8: Configuring access control..."
ACL_CONFIG="/usr/syno/etc/iscsi_acl.conf"

if run_remote "grep -q \"$TARGET_NAME\" $ACL_CONFIG 2>/dev/null && echo 'exists' || echo 'missing'" | grep -q "exists"; then
  echo "⚠️  ACL entry already exists"
else
  echo "Adding ACL configuration (allow all)..."
  run_remote "sudo tee -a $ACL_CONFIG > /dev/null << 'ACL_EOF'
$TARGET_NAME:ALL
ACL_EOF
"
  echo "✅ ACL configuration added"
fi
echo ""

# Step 9: Restart iSCSI service
echo "▶ Step 9: Restarting iSCSI service..."
echo "Stopping service..."
run_remote "sudo /usr/syno/bin/synopkg stop iSCSITarget 2>/dev/null || \
sudo /usr/syno/etc.defaults/rc.sysv/S78iscsitrg.sh stop 2>/dev/null || \
echo 'Stop attempted'"
sleep 3

echo "Starting service..."
run_remote "sudo /usr/syno/bin/synopkg start iSCSITarget 2>/dev/null || \
sudo /usr/syno/etc.defaults/rc.sysv/S78iscsitrg.sh start 2>/dev/null || \
echo 'Start attempted'"
sleep 5
echo "✅ Service restart attempted"
echo ""

# Step 10: Verify service
echo "▶ Step 10: Verifying iSCSI service..."
PORT_CHECK=$(run_remote "netstat -tln 2>/dev/null | grep 3260 || echo 'not listening'")
if echo "$PORT_CHECK" | grep -q "3260"; then
  echo "✅ iSCSI service is running!"
  echo "$PORT_CHECK"
else
  echo "⚠️  Port 3260 not listening yet"
  echo "   Service may need a moment to start"
  echo "   Or may need to be enabled via DSM interface"
fi
echo ""

# Step 11: Verify configuration files
echo "▶ Step 11: Verifying configuration files..."
echo "Target config:"
run_remote "cat $TARGET_CONFIG | grep -A 2 '$TARGET_NAME' || echo 'Not found'"
echo ""
echo "LUN config:"
run_remote "cat $LUN_CONFIG | grep -A 2 '$LUN_NAME' || echo 'Not found'"
echo ""
echo "Mapping config:"
run_remote "cat $MAPPING_CONFIG | grep '$TARGET_NAME' || echo 'Not found'"
echo ""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  iSCSI Configuration Complete                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Configuration files created:"
echo "  - Target: $TARGET_NAME"
echo "  - Target IQN: $TARGET_IQN"
echo "  - LUN: $LUN_NAME (${LUN_SIZE}GB)"
echo "  - LUN Path: $LUN_PATH"
echo ""
echo "Next steps:"
echo "  1. Verify service: ./scripts/check-iscsi-sbx02.sh"
echo "  2. Test discovery from Helios Compute"
echo "  3. Connect: ./scripts/phase4-setup-iscsi-connection.sh"
echo ""
