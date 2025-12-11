#!/bin/bash
# Transfer deployment scripts to Helios Control

set -e

HELIOS_CONTROL="192.168.86.114"
SSH_KEY="$HOME/.ssh/id_ed25519_helios"
SCRIPTS_DIR="/home/cursor-dev/Documents/Lumines/scripts"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     Transfer Scripts to Helios Control                  ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ SSH key not found: $SSH_KEY"
    exit 1
fi

# Create scripts directory on Helios Control
echo "▶ Creating scripts directory on Helios Control..."
ssh -i "$SSH_KEY" "$HELIOS_CONTROL" "mkdir -p ~/scripts" || {
    echo "⚠️  Using password authentication..."
    ssh "$HELIOS_CONTROL" "mkdir -p ~/scripts"
}

# Transfer scripts
echo "▶ Transferring deployment scripts..."
scp -i "$SSH_KEY" "$SCRIPTS_DIR/deploy-telemetry-stack.sh" "$HELIOS_CONTROL:~/scripts/" 2>/dev/null || \
scp "$SCRIPTS_DIR/deploy-telemetry-stack.sh" "$HELIOS_CONTROL:~/scripts/" 2>/dev/null

scp -i "$SSH_KEY" "$SCRIPTS_DIR/health-check-telemetry.sh" "$HELIOS_CONTROL:~/scripts/" 2>/dev/null || \
scp "$SCRIPTS_DIR/health-check-telemetry.sh" "$HELIOS_CONTROL:~/scripts/" 2>/dev/null

# Make scripts executable
echo "▶ Making scripts executable..."
ssh -i "$SSH_KEY" "$HELIOS_CONTROL" "chmod +x ~/scripts/*.sh" 2>/dev/null || \
ssh "$HELIOS_CONTROL" "chmod +x ~/scripts/*.sh" 2>/dev/null

echo ""
echo "✅ Scripts transferred successfully!"
echo ""
echo "On Helios Control, you can now run:"
echo "  bash ~/scripts/deploy-telemetry-stack.sh"
echo "  bash ~/scripts/health-check-telemetry.sh"
