# Argon Eon Driver Setup for Raspberry Pi 4

This document describes the driver configuration for the Argon Eon chassis on Raspberry Pi 4.

## Overview

The Argon Eon chassis uses USB-to-SATA controllers (Pinas controllers) to connect 4x SATA SSDs to the Raspberry Pi 4 via USB 3.0. The following drivers and configurations are required:

## Required Drivers

### 1. USB Storage Modules

- **usb_storage**: USB mass storage driver
- **uas**: USB Attached SCSI driver (for better performance)
- **usbhid**: USB Human Interface Device driver

### 2. USB Controller

- **xhci_hcd**: USB 3.0 (xHCI) host controller driver (built into kernel)

### 3. Firmware Packages

- `firmware-linux`: Linux firmware metapackage
- `firmware-linux-free`: Free firmware
- `firmware-linux-nonfree`: Non-free firmware
- `firmware-brcm80211`: Broadcom WiFi/Bluetooth firmware

## Installation

### Automated Installation

Run the setup script:

```bash
bash scripts/ensure-argon-eon-drivers.sh
```

Or on the server:

```bash
ssh ncadmin@192.168.86.29 'bash -s' < scripts/ensure-argon-eon-drivers.sh
```

### Manual Installation

1. **Install firmware packages:**

```bash
sudo apt-get update
sudo apt-get install -y firmware-linux firmware-linux-free firmware-linux-nonfree firmware-brcm80211
```

2. **Configure modules to load on boot:**

```bash
sudo bash -c "cat > /etc/modules-load.d/argon-eon.conf << 'EOF'
# Argon Eon USB storage modules
usb_storage
uas
usbhid
EOF"
```

3. **Disable USB autosuspend:**

```bash
sudo bash -c "cat > /etc/modprobe.d/usb-autosuspend-disable.conf << 'EOF'
# Disable USB autosuspend for Argon Eon SATA controllers
options usbcore autosuspend=-1
EOF"
```

4. **Load modules immediately:**

```bash
sudo modprobe usb_storage
sudo modprobe uas
sudo modprobe usbhid
```

## Verification

### Check Modules Are Loaded

```bash
lsmod | grep -E "usb_storage|uas|usbhid"
```

### Check USB Devices

```bash
lsusb
```

You should see Pinas SATA controllers:
- `Bus 002 Device 003: ID 174e:1155 Pinas SATA`
- `Bus 002 Device 004: ID 1741:1156 Pinas sata`

### Check Storage Devices

```bash
lsblk
```

You should see `sda`, `sdb`, `sdc`, `sdd` devices.

## Troubleshooting

### SATA Controllers Not Detected

**Symptoms:**
- `lsusb` shows no Pinas controllers
- `lsblk` shows no `sda-sdd` devices
- dmesg shows "xHCI host controller not responding"

**Possible Causes:**

1. **USB Controller Died (xHCI Error)**
   - **Solution:** Reboot the system
   ```bash
   sudo reboot
   ```

2. **Physical Connection Issue**
   - Check USB cables from Pi to Argon Eon
   - Check power supply to Argon Eon
   - Verify all 4 SSDs are properly seated

3. **Modules Not Loading**
   - Verify modules are in `/etc/modules-load.d/argon-eon.conf`
   - Check module loading: `dmesg | grep -i "usb\|sata"`
   - Manually load: `sudo modprobe usb_storage uas usbhid`

4. **USB Autosuspend**
   - Verify autosuspend is disabled: `cat /etc/modprobe.d/usb-autosuspend-disable.conf`
   - Check current setting: `cat /sys/module/usbcore/parameters/autosuspend`
   - Should be `-1` (disabled)

### USB Controller Recovery

If the xHCI controller has died:

1. **Check dmesg for errors:**
   ```bash
   dmesg | grep -i "xhci\|usb" | tail -20
   ```

2. **If you see "xHCI host controller not responding":**
   - The controller needs a reboot to recover
   - This is a hardware/firmware issue, not a driver issue
   - Reboot: `sudo reboot`

3. **After reboot:**
   - Check USB devices: `lsusb`
   - Check storage: `lsblk`
   - Verify modules: `lsmod | grep usb_storage`

### Module Loading Issues

If modules don't load:

1. **Check if modules exist:**
   ```bash
   modinfo usb_storage
   modinfo uas
   ```

2. **Check kernel version:**
   ```bash
   uname -r
   ```
   Should be a Raspberry Pi kernel (e.g., `6.12.47+rpt-rpi-v8`)

3. **Check module dependencies:**
   ```bash
   modprobe -D usb_storage
   ```

4. **Manually load with verbose output:**
   ```bash
   sudo modprobe -v usb_storage
   dmesg | tail -20
   ```

## Configuration Files

### `/etc/modules-load.d/argon-eon.conf`
Module loading configuration (modern method, replaces `/etc/modules`).

### `/etc/modprobe.d/usb-autosuspend-disable.conf`
USB autosuspend disable configuration.

### `/etc/modules` (legacy)
Legacy module loading (still works but deprecated).

## Boot Process

Modules are loaded automatically on boot via:
1. `/etc/modules-load.d/argon-eon.conf` (systemd)
2. `/etc/modules` (legacy, if present)

USB autosuspend is disabled via:
- `/etc/modprobe.d/usb-autosuspend-disable.conf`

## Related Documentation

- [CRITICAL_RAID_FAILURE_2026-01-28.md](CRITICAL_RAID_FAILURE_2026-01-28.md) - Storage failure troubleshooting
- [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) - Complete GitLab setup guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - General troubleshooting

## Scripts

- `scripts/ensure-argon-eon-drivers.sh` - Automated driver setup script

---

**Last Updated:** January 28, 2026  
**Status:** ✅ Drivers configured, reboot required for xHCI recovery
