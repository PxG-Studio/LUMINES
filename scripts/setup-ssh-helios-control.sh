#!/bin/bash
# Set up SSH access to Helios Control (192.168.86.114)
# Creates SSH key if needed and configures access

set -e

HELIOS_CONTROL="192.168.86.114"
SSH_KEY_PATH="$HOME/.ssh/id_ed25519_helios"
SSH_KEY_PUB="$SSH_KEY_PATH.pub"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     SSH Access Setup - Helios Control                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if key already exists
if [ -f "$SSH_KEY_PATH" ]; then
    echo "✓ SSH key already exists: $SSH_KEY_PATH"
else
    echo "▶ Generating SSH key..."
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "helios-control-access"
    echo "✓ SSH key generated"
fi

# Display public key
echo ""
echo "Public key:"
cat "$SSH_KEY_PUB"
echo ""

# Test current access
echo "▶ Testing SSH access..."
if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=5 "$HELIOS_CONTROL" "hostname" >/dev/null 2>&1; then
    echo "✓ SSH access already configured"
    exit 0
fi

# Instructions for manual setup
echo ""
echo "════════════════════════════════════════════════════════════"
echo "SSH Key Setup Instructions"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "1. Copy the public key above"
echo "2. SSH to Helios Control:"
echo "   ssh user@$HELIOS_CONTROL"
echo ""
echo "3. Add the public key to ~/.ssh/authorized_keys:"
echo "   mkdir -p ~/.ssh"
echo "   chmod 700 ~/.ssh"
echo "   echo 'PASTE_PUBLIC_KEY_HERE' >> ~/.ssh/authorized_keys"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "4. Test access:"
echo "   ssh -i $SSH_KEY_PATH $HELIOS_CONTROL 'hostname'"
echo ""
echo "Or use ssh-copy-id (if password authentication works):"
echo "   ssh-copy-id -i $SSH_KEY_PUB user@$HELIOS_CONTROL"
echo ""
