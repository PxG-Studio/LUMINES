# Enable SSH on SBX04 (192.168.86.134)

**Device**: 192.168.86.134 | MAC: `14:59:c0:4a:94:8f`  
**Goal**: Enable SSH so you can connect with `ssh ncadmin@192.168.86.134`

---

## Method 1: Enable SSH via SD Card (Raspberry Pi – no monitor needed)

If the device is a Raspberry Pi and you can access the SD card:

### Steps

1. **Power off the device** (unplug power).

2. **Remove the SD card** and insert it into your Mac.

3. **Mount the boot partition**  
   - On Mac it usually appears as `boot` or `bootfs` in Finder.  
   - Or in Terminal:
   ```bash
   diskutil list
   # Find the partition (e.g. disk2s1), then:
   diskutil mount /dev/disk2s1
   ```

4. **Create an empty file named `ssh`** (no extension) in the root of the boot partition:
   ```bash
   # Replace /Volumes/bootfs with your actual boot volume name
   touch /Volumes/bootfs/ssh
   # Or if it's named "boot":
   touch /Volumes/boot/ssh
   ```

5. **Unmount and eject** the SD card safely, then put it back in the Raspberry Pi.

6. **Power on the device** and wait 1–2 minutes.

7. **Try SSH**:
   ```bash
   ssh ncadmin@192.168.86.134
   # Password: C0mp0$e2k3!!
   ```

---

## Method 2: Enable SSH via Raspberry Pi Imager (before first boot)

If you are re-imaging the SD card:

1. Download **Raspberry Pi Imager**: https://www.raspberrypi.com/software/

2. Choose your OS (e.g. Raspberry Pi OS Lite 64-bit).

3. Click the **gear icon** (Settings):
   - Set hostname: `SBX04` or `gitlab.pxg.studio`
   - Enable **SSH** with “Use password authentication”
   - Set username: `ncadmin`
   - Set password: `C0mp0$e2k3!!`
   - Configure Wi-Fi if needed
   - Set locale/timezone if desired

4. Write the image to the SD card, then boot the Pi.

5. Connect:
   ```bash
   ssh ncadmin@192.168.86.134
   ```

---

## Method 3: Enable SSH with monitor and keyboard

If you have a monitor and keyboard connected to the device:

### Raspberry Pi OS (and similar)

1. Boot and log in (e.g. `ncadmin` / `C0mp0$e2k3!!`).

2. Enable SSH:
   ```bash
   sudo raspi-config
   ```
   - Go to **Interface Options** → **SSH** → **Yes** → **OK** → **Finish**.

3. Or enable the service directly:
   ```bash
   sudo systemctl enable ssh
   sudo systemctl start ssh
   sudo systemctl status ssh
   ```

4. From your Mac:
   ```bash
   ssh ncadmin@192.168.86.134
   ```

### Generic Debian/Ubuntu (no raspi-config)

```bash
sudo apt update
sudo apt install -y openssh-server
sudo systemctl enable ssh
sudo systemctl start ssh
sudo systemctl status ssh
```

Then connect from your Mac:
```bash
ssh ncadmin@192.168.86.134
```

---

## Method 4: One-line “ssh” file creation on Mac

If the SD card is in your Mac and the boot volume is at `/Volumes/bootfs`:

```bash
touch /Volumes/bootfs/ssh
```

If the volume has a different name (e.g. `boot`):

```bash
touch /Volumes/boot/ssh
```

Then unmount, eject, reinsert SD card into the Pi, and power on.

---

## After SSH is working

1. **Verify connection**:
   ```bash
   ssh ncadmin@192.168.86.134
   hostname -I
   hostname
   ```

2. **Optional: set static IP to 192.168.86.29** (if you still want that):
   ```bash
   # On the device, after SSH is working:
   ~/setup-static-ip-v2.sh
   # Or run the NetworkManager/dhcpcd steps from docs/NETWORK_CONFIGURATION.md
   ```

3. **Optional: disable SSH password login and use keys** (after you’ve added your key):
   - Edit `/etc/ssh/sshd_config`: `PasswordAuthentication no`
   - Restart: `sudo systemctl restart ssh`

---

## Quick reference

| Item        | Value                    |
|------------|--------------------------|
| IP         | 192.168.86.134           |
| MAC        | 14:59:c0:4a:94:8f        |
| User       | ncadmin                  |
| Password   | C0mp0$e2k3!!             |
| SSH port   | 22 (default)             |

---

## Troubleshooting

- **“Connection refused”**  
  SSH service not running or not enabled. Use Method 1 (SD card) or Method 3 (console).

- **“Connection timed out”**  
  Device may be off, different IP, or firewall blocking. Check:
  ```bash
  ping 192.168.86.134
  arp -a | grep 192.168.86.134
  ```

- **Wrong password**  
  If you re-imaged with Imager (Method 2), use the password you set there. Otherwise use Method 1 + console (Method 3) to reset password if needed.

- **Boot volume name on Mac**  
  List volumes:
  ```bash
  ls /Volumes/
  ```
  Use the one that looks like the Pi’s boot partition (often `bootfs` or `boot`).
