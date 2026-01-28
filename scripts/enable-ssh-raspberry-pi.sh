#!/bin/bash
# Enable SSH on Raspberry Pi by creating 'ssh' file on boot partition
# Run this when the Pi's SD card is inserted into your Mac
# Usage: ./enable-ssh-raspberry-pi.sh [boot_volume_path]

set -e

BOOT_VOLUME="${1:-}"

if [ -z "$BOOT_VOLUME" ]; then
  echo "Raspberry Pi Boot Partition - Enable SSH"
  echo "========================================="
  echo ""
  echo "Looking for boot partition..."
  
  for vol in /Volumes/bootfs /Volumes/boot /Volumes/RASPBERRYPI; do
    if [ -d "$vol" ]; then
      echo "Found: $vol"
      BOOT_VOLUME="$vol"
      break
    fi
  done
  
  if [ -z "$BOOT_VOLUME" ]; then
    echo ""
    echo "No standard boot volume found. Available volumes:"
    ls -la /Volumes/ 2>/dev/null | grep -v "Macintosh HD\|com.apple"
    echo ""
    echo "Usage: $0 /Volumes/YourBootVolumeName"
    echo "Example: $0 /Volumes/bootfs"
    exit 1
  fi
fi

if [ ! -d "$BOOT_VOLUME" ]; then
  echo "Error: $BOOT_VOLUME does not exist or is not mounted."
  exit 1
fi

SSH_FILE="$BOOT_VOLUME/ssh"
touch "$SSH_FILE"

if [ -f "$SSH_FILE" ]; then
  echo ""
  echo "Success! Created: $SSH_FILE"
  echo ""
  echo "Next steps:"
  echo "1. Eject the SD card safely (diskutil eject $BOOT_VOLUME)"
  echo "2. Insert SD card back into the Raspberry Pi"
  echo "3. Power on the Pi and wait 1-2 minutes"
  echo "4. Connect: ssh ncadmin@192.168.86.134"
  echo "   Password: C0mp0\$e2k3!!"
  echo ""
else
  echo "Error: Could not create ssh file. Check permissions."
  exit 1
fi
