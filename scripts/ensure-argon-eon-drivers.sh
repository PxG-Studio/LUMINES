#!/usr/bin/env bash
# Ensure all Argon Eon drivers are installed and configured for Raspberry Pi 4.
# This script ensures USB storage modules are loaded and USB autosuspend is disabled.
#
# Usage:
#   bash scripts/ensure-argon-eon-drivers.sh
#   Or on server: ssh ncadmin@192.168.86.29 'bash -s' < scripts/ensure-argon-eon-drivers.sh

set -e

echo "Ensuring Argon Eon drivers are installed and configured..."

# 1. Install required firmware packages
echo "1. Checking firmware packages..."
if ! dpkg -l | grep -q "firmware-linux"; then
    echo "   Installing firmware packages..."
    sudo apt-get update -qq
    sudo apt-get install -y firmware-linux firmware-linux-free firmware-linux-nonfree firmware-brcm80211
else
    echo "   ✅ Firmware packages already installed"
fi

# 2. Ensure USB storage modules are configured to load on boot
echo "2. Configuring USB storage modules..."
sudo mkdir -p /etc/modules-load.d
sudo bash -c "cat > /etc/modules-load.d/argon-eon.conf << 'EOF'
# Argon Eon USB storage modules
usb_storage
uas
usbhid
EOF"
echo "   ✅ Modules configuration created at /etc/modules-load.d/argon-eon.conf"

# 3. Disable USB autosuspend (prevents USB devices from going to sleep)
echo "3. Disabling USB autosuspend..."
sudo mkdir -p /etc/modprobe.d
sudo bash -c "cat > /etc/modprobe.d/usb-autosuspend-disable.conf << 'EOF'
# Disable USB autosuspend for Argon Eon SATA controllers
options usbcore autosuspend=-1
EOF"
echo "   ✅ USB autosuspend disabled"

# 4. Load modules immediately (if not already loaded)
echo "4. Loading USB storage modules..."
sudo modprobe usb_storage 2>/dev/null || true
sudo modprobe uas 2>/dev/null || true
sudo modprobe usbhid 2>/dev/null || true
echo "   ✅ Modules loaded"

# 5. Verify modules are loaded
echo "5. Verifying modules..."
if lsmod | grep -q "usb_storage" && lsmod | grep -q "uas"; then
    echo "   ✅ USB storage modules are loaded"
else
    echo "   ⚠️  Warning: Some modules may not be loaded"
    lsmod | grep -E "usb_storage|uas|usbhid" || echo "   No USB storage modules found"
fi

# 6. Check USB devices
echo "6. Checking USB devices..."
USB_COUNT=$(lsusb | wc -l)
echo "   Found $USB_COUNT USB device(s)"
if lsusb | grep -qi "174e\|1741\|sata"; then
    echo "   ✅ SATA controllers detected"
    lsusb | grep -i "174e\|1741\|sata"
else
    echo "   ⚠️  SATA controllers not detected (may require reboot)"
fi

# 7. Check storage devices
echo "7. Checking storage devices..."
if lsblk | grep -qE "sd[a-z]"; then
    echo "   ✅ Storage devices detected:"
    lsblk | grep -E "sd[a-z]"
else
    echo "   ⚠️  No storage devices detected (may require reboot or physical reconnection)"
fi

echo ""
echo "=== Summary ==="
echo "✅ Firmware packages: Installed"
echo "✅ Module configuration: /etc/modules-load.d/argon-eon.conf"
echo "✅ USB autosuspend: Disabled"
echo "✅ Modules loaded: $(lsmod | grep -cE 'usb_storage|uas' || echo 0) module(s)"
echo ""
echo "⚠️  If SATA controllers are still not detected:"
echo "   1. Check physical USB connections to Argon Eon"
echo "   2. Check power supply to Argon Eon"
echo "   3. Reboot the system: sudo reboot"
echo "   4. After reboot, check: lsusb | grep -i '174e\|1741'"
echo ""
