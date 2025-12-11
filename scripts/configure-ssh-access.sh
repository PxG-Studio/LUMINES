#!/bin/bash
# Complete SSH Access Configuration for Helios Control
# Attempts to configure SSH access automatically

set -e

HELIOS_CONTROL="192.168.86.114"
SSH_KEY_PATH="$HOME/.ssh/id_ed25519_helios"
SSH_KEY_PUB="$SSH_KEY_PATH.pub"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Complete SSH Access Configuration                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "❌ SSH key not found. Generating..."
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "helios-control-access"
    echo "✅ SSH key generated"
fi

# Display public key
echo ""
echo "════════════════════════════════════════════════════════════"
echo "Public Key (copy this):"
echo "════════════════════════════════════════════════════════════"
cat "$SSH_KEY_PUB"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""

# Try ssh-copy-id if password auth works
echo "▶ Attempting automatic SSH key deployment..."
if command -v ssh-copy-id >/dev/null 2>&1; then
    echo "Attempting ssh-copy-id (may prompt for password)..."
    if ssh-copy-id -i "$SSH_KEY_PUB" "$HELIOS_CONTROL" 2>/dev/null; then
        echo "✅ SSH key deployed successfully"
    else
        echo "⚠️  Automatic deployment failed. Manual setup required."
    fi
else
    echo "⚠️  ssh-copy-id not available. Manual setup required."
fi

# Test access
echo ""
echo "▶ Testing SSH access..."
if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$HELIOS_CONTROL" "hostname" >/dev/null 2>&1; then
    echo "✅ SSH access configured successfully!"
    echo ""
    echo "Testing Kubernetes access..."
    if ssh -i "$SSH_KEY_PATH" "$HELIOS_CONTROL" "microk8s status --wait-ready" >/dev/null 2>&1; then
        echo "✅ Kubernetes cluster accessible"
    else
        echo "⚠️  Kubernetes cluster not accessible (may need microk8s setup)"
    fi
    exit 0
else
    echo "⚠️  SSH access not yet configured"
    echo ""
    echo "════════════════════════════════════════════════════════════"
    echo "Manual Setup Instructions"
    echo "════════════════════════════════════════════════════════════"
    echo ""
    echo "1. SSH to Helios Control:"
    echo "   ssh user@$HELIOS_CONTROL"
    echo ""
    echo "2. Add the public key above to ~/.ssh/authorized_keys:"
    echo "   mkdir -p ~/.ssh"
    echo "   chmod 700 ~/.ssh"
    echo "   echo '$(cat "$SSH_KEY_PUB")' >> ~/.ssh/authorized_keys"
    echo "   chmod 600 ~/.ssh/authorized_keys"
    echo ""
    echo "3. Test access:"
    echo "   ssh -i $SSH_KEY_PATH $HELIOS_CONTROL 'hostname'"
    echo ""
    exit 1
fi
