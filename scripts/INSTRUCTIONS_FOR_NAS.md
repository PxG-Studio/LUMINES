# Instructions: Running Scripts on Synology NAS (192.168.86.28)

You're currently on the Synology NAS (ash-4.3# prompt), but the scripts are on your local machine. Here are your options:

## Option 1: Transfer Scripts from Local Machine (Recommended)

From your **local machine** (not the NAS), run:

```bash
cd /home/cursor-dev/Documents/Lumines
./scripts/create-scripts-on-nas.sh
```

This will transfer the scripts to the NAS. Then on the NAS, run:

```bash
cd ~/scripts
sudo ./configure-192.168.86.28.sh
```

## Option 2: Manual Copy via SSH

From your **local machine**, copy the scripts:

```bash
# Load SSH key
ssh-add ~/.ssh/id_ed25519

# Create directory on NAS
ssh -p 2202 warden-ssh@192.168.86.28 "mkdir -p ~/scripts"

# Copy configure script
cat scripts/configure-192.168.86.28.sh | ssh -p 2202 warden-ssh@192.168.86.28 "cat > ~/scripts/configure-192.168.86.28.sh && chmod +x ~/scripts/configure-192.168.86.28.sh"

# Copy verify script
cat scripts/verify-production-readiness.sh | ssh -p 2202 warden-ssh@192.168.86.28 "cat > ~/scripts/verify-production-readiness.sh && chmod +x ~/scripts/verify-production-readiness.sh"
```

## Option 3: Create Script Directly on NAS

If you're already on the NAS and want to create the script there, you can use `cat` with a heredoc:

```bash
# On the NAS (192.168.86.28)
mkdir -p ~/scripts
cd ~/scripts

# Then create the script using cat (you'll need to paste the script content)
cat > configure-192.168.86.28.sh << 'SCRIPT_END'
[paste script content here]
SCRIPT_END

chmod +x configure-192.168.86.28.sh
```

## Quick Check: Are You on the Right Machine?

- **Local machine prompt:** `cursor-dev@hostname:~$` or similar
- **NAS prompt:** `ash-4.3#` or `warden-ssh@synology:~$`

If you see `ash-4.3#`, you're on the NAS. You need to run the transfer commands from your local machine first.

## After Transfer

Once scripts are on the NAS, you can run:

```bash
cd ~/scripts
sudo ./configure-192.168.86.28.sh
sudo ./verify-production-readiness.sh
```
