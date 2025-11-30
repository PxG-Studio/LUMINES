#!/bin/bash

# Script to apply security fix on remote server (192.168.86.114)
# Usage: ./apply-remote-fix.sh [user@]192.168.86.114

set -e

REMOTE_HOST="${1:-192.168.86.114}"
REMOTE_PATH="~/LUMINES/infrastructure/k8s/production/helios-v2/gpu-scheduling/custom-wsl2-device-plugin"

echo "🚀 Applying security fix on remote server: $REMOTE_HOST"
echo ""

# Check if SSH key is available
if [ -z "$SSH_AUTH_SOCK" ] && [ ! -f ~/.ssh/id_rsa ] && [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "⚠️  Warning: No SSH key found. You may need to enter password."
fi

# Copy fix script to remote
echo "📤 Copying fix script to remote server..."
scp fix-security-vulnerabilities.sh "$REMOTE_HOST:$REMOTE_PATH/"

# Execute fix on remote
echo ""
echo "🔧 Executing fix on remote server..."
ssh "$REMOTE_HOST" "cd $REMOTE_PATH && chmod +x fix-security-vulnerabilities.sh && ./fix-security-vulnerabilities.sh"

echo ""
echo "✅ Security fix applied on remote server!"
echo ""
echo "To verify, run on remote:"
echo "  ssh $REMOTE_HOST 'cd $REMOTE_PATH && go list -m golang.org/x/net'"

