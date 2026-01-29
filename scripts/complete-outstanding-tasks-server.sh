#!/usr/bin/env bash
# Complete outstanding server-side tasks on SBX04: verify storage, reassemble RAID, mount, start GitLab.
# Run when SBX04 is reachable (after reboot).
#
# Usage:
#   ssh ncadmin@192.168.86.29 'bash -s' < scripts/complete-outstanding-tasks-server.sh
#   Or on server: bash scripts/complete-outstanding-tasks-server.sh

set -e

GITLAB_DIR="${GITLAB_DIR:-$HOME/gitlab-production}"
MOUNT_POINT="${MOUNT_POINT:-/mnt/gitlab-storage}"

echo "=== Completing outstanding server-side tasks on SBX04 ==="
echo ""

# 1. Verify Argon Eon storage
echo "1. Verifying Argon Eon storage..."
if lsusb | grep -qi "174e\|1741"; then
    echo "   ✅ SATA controllers detected"
else
    echo "   ⚠️  SATA controllers NOT detected. Check USB/power. Exiting."
    exit 1
fi

if lsblk | grep -qE "sd[a-z]"; then
    echo "   ✅ Storage devices detected"
    lsblk | grep -E "sd[a-z]" || true
else
    echo "   ⚠️  No storage devices. Exiting."
    exit 1
fi

# 2. Reassemble RAID if broken
echo ""
echo "2. Checking RAID array..."
if [ -e /dev/md0 ]; then
    if grep -q "active" /proc/mdstat 2>/dev/null; then
        echo "   ✅ RAID array already active"
    elif grep -q "broken\|FAILED" /proc/mdstat 2>/dev/null; then
        echo "   Reassembling RAID array..."
        if sudo mdadm --assemble --force /dev/md0 /dev/sda /dev/sdb /dev/sdc /dev/sdd 2>/dev/null; then
            echo "   ✅ RAID array reassembled"
        else
            echo "   ❌ Failed to reassemble RAID. Check: cat /proc/mdstat"
            exit 1
        fi
    fi
else
    echo "   ⚠️  /dev/md0 not found. If drives are new, create RAID first."
    exit 1
fi

# 3. Mount storage
echo ""
echo "3. Checking mount..."
if mount | grep -q "$MOUNT_POINT"; then
    echo "   ✅ $MOUNT_POINT already mounted"
else
    echo "   Mounting $MOUNT_POINT..."
    sudo mkdir -p "$MOUNT_POINT"
    if sudo mount /dev/md0 "$MOUNT_POINT" 2>/dev/null; then
        echo "   ✅ Mounted $MOUNT_POINT"
    else
        echo "   ❌ Failed to mount. Check: sudo mount /dev/md0 $MOUNT_POINT"
        exit 1
    fi
fi

# 4. Test write
echo ""
echo "4. Testing write capability..."
if sudo touch "$MOUNT_POINT/.write-test" 2>/dev/null && sudo rm "$MOUNT_POINT/.write-test" 2>/dev/null; then
    echo "   ✅ Storage is writable"
else
    echo "   ❌ Storage is NOT writable. Check permissions/mount."
    exit 1
fi

# 5. Ensure GitLab directories exist
echo ""
echo "5. Ensuring GitLab directories exist..."
for d in config logs data backups registry; do
    sudo mkdir -p "$MOUNT_POINT/gitlab/$d"
done
sudo chown -R 1000:1000 "$MOUNT_POINT/gitlab" 2>/dev/null || true
echo "   ✅ GitLab directories ready"

# 6. Start GitLab
echo ""
echo "6. Starting GitLab..."
if [ -d "$GITLAB_DIR" ]; then
    cd "$GITLAB_DIR"
    if docker-compose ps 2>/dev/null | grep -q "gitlab.*Up"; then
        echo "   ✅ GitLab container already running"
    else
        echo "   Starting GitLab (this may take a few minutes)..."
        docker-compose up -d gitlab 2>/dev/null || docker compose up -d gitlab 2>/dev/null || true
        echo "   ✅ GitLab start requested. Wait 5–10 min, then check: curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1/"
    fi
else
    echo "   ⚠️  GitLab dir not found: $GITLAB_DIR"
fi

echo ""
echo "=== Server-side tasks complete ==="
echo ""
echo "Next (run from your Mac when GitLab is up):"
echo "  1. Open http://192.168.86.29 and log in as root"
echo "  2. Create group PXG.STUDIO (path: pxg-studio) and project game-repo if not exists"
echo "  3. Push repo: git push gitlab main && git push gitlab develop && git push gitlab prototype"
echo "  4. Add SSH_PRIVATE_KEY in GitLab: Settings → CI/CD → Variables (see docs/GITLAB_ADD_SSH_KEY.md)"
echo ""
