#!/bin/bash
# transfer-and-run.sh
# Transfer scripts to NAS servers and provide instructions

PRIMARY_IP="192.168.86.27"
SECONDARY_IP="192.168.86.28"
USER="ncadmin"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Transfer Scripts to NAS Servers                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "To transfer scripts, run these commands:"
echo ""
echo "1. Transfer PRIMARY script:"
echo "   scp scripts/PRIMARY-setup.sh ${USER}@${PRIMARY_IP}:~/"
echo ""
echo "2. Transfer SECONDARY script:"
echo "   scp scripts/SECONDARY-setup.sh ${USER}@${SECONDARY_IP}:~/"
echo ""
echo "Then on each server:"
echo "   ssh ${USER}@${PRIMARY_IP}"
echo "   sudo ./PRIMARY-setup.sh"
echo ""
echo "   ssh ${USER}@${SECONDARY_IP}"
echo "   sudo ./SECONDARY-setup.sh"
echo ""

# Try to transfer if possible
if command -v scp > /dev/null 2>&1; then
  read -p "Attempt to transfer scripts now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Transferring PRIMARY script..."
    scp scripts/PRIMARY-setup.sh ${USER}@${PRIMARY_IP}:~/ 2>/dev/null && echo "✅ PRIMARY script transferred" || echo "❌ Transfer failed (may need password)"

    echo "Transferring SECONDARY script..."
    scp scripts/SECONDARY-setup.sh ${USER}@${SECONDARY_IP}:~/ 2>/dev/null && echo "✅ SECONDARY script transferred" || echo "❌ Transfer failed (may need password)"
  fi
fi
