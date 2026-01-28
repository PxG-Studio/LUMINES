#!/usr/bin/env bash
# Verify Argon Eon drivers and storage after reboot.
# Run this after rebooting to verify USB devices and storage are detected.
#
# Usage:
#   bash scripts/verify-argon-eon-after-reboot.sh
#   Or on server: ssh ncadmin@192.168.86.29 'bash -s' < scripts/verify-argon-eon-after-reboot.sh

set -e

echo "Verifying Argon Eon drivers and storage after reboot..."
echo ""

# 1. Check USB modules are loaded
echo "1. Checking USB storage modules..."
if lsmod | grep -qE "usb_storage|uas"; then
    echo "   ✅ USB storage modules loaded"
    lsmod | grep -E "usb_storage|uas|usbhid"
else
    echo "   ⚠️  USB storage modules not loaded (they may be builtin)"
fi

# 2. Check USB devices
echo ""
echo "2. Checking USB devices..."
USB_DEVICES=$(lsusb | wc -l)
echo "   Found $USB_DEVICES USB device(s)"

if lsusb | grep -qi "174e\|1741"; then
    echo "   ✅ SATA controllers detected:"
    lsusb | grep -i "174e\|1741"
else
    echo "   ❌ SATA controllers NOT detected"
    echo "   Check physical USB connections and power supply"
fi

# 3. Check storage devices
echo ""
echo "3. Checking storage devices..."
if lsblk | grep -qE "sd[a-z]"; then
    echo "   ✅ Storage devices detected:"
    lsblk | grep -E "sd[a-z]"
    SD_COUNT=$(lsblk | grep -cE "sd[a-z]" || echo "0")
    echo "   Found $SD_COUNT storage device(s)"
else
    echo "   ❌ No storage devices detected"
fi

# 4. Check RAID array
echo ""
echo "4. Checking RAID array..."
if [ -e /dev/md0 ]; then
    echo "   RAID array /dev/md0 exists"
    cat /proc/mdstat
    echo ""
    if grep -q "active" /proc/mdstat; then
        echo "   ✅ RAID array is active"
    elif grep -q "broken\|FAILED" /proc/mdstat; then
        echo "   ⚠️  RAID array is broken - may need reassembly"
        echo "   Try: sudo mdadm --assemble --force /dev/md0 /dev/sda /dev/sdb /dev/sdc /dev/sdd"
    fi
else
    echo "   ⚠️  RAID array /dev/md0 not found"
    echo "   If drives are detected, create RAID array"
fi

# 5. Check mount
echo ""
echo "5. Checking mount..."
if mount | grep -q "/mnt/gitlab-storage"; then
    echo "   ✅ /mnt/gitlab-storage is mounted"
    df -h /mnt/gitlab-storage
    echo ""
    echo "   Testing write capability..."
    if sudo touch /mnt/gitlab-storage/test-write 2>/dev/null && sudo rm /mnt/gitlab-storage/test-write 2>/dev/null; then
        echo "   ✅ Storage is writable"
    else
        echo "   ❌ Storage is NOT writable"
    fi
else
    echo "   ⚠️  /mnt/gitlab-storage is NOT mounted"
    if [ -e /dev/md0 ]; then
        echo "   Try: sudo mount /dev/md0 /mnt/gitlab-storage"
    fi
fi

# 6. Check xHCI controller
echo ""
echo "6. Checking xHCI controller..."
if dmesg | grep -q "xHCI host controller not responding"; then
    echo "   ❌ xHCI controller still has errors"
else
    echo "   ✅ No xHCI errors detected"
fi

# Summary
echo ""
echo "=== Summary ==="
if lsusb | grep -qi "174e\|1741" && lsblk | grep -qE "sd[a-z]"; then
    echo "✅ Argon Eon storage is working"
    echo ""
    echo "Next steps:"
    echo "  1. If RAID is broken, reassemble: sudo mdadm --assemble --force /dev/md0 /dev/sda /dev/sdb /dev/sdc /dev/sdd"
    echo "  2. If not mounted, mount: sudo mount /dev/md0 /mnt/gitlab-storage"
    echo "  3. Restart GitLab: cd ~/gitlab-production && docker-compose up -d"
else
    echo "❌ Argon Eon storage is NOT working"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check physical USB connections"
    echo "  2. Check power supply to Argon Eon"
    echo "  3. Verify all 4 SSDs are properly seated"
    echo "  4. Check dmesg for errors: dmesg | tail -50"
fi
echo ""
