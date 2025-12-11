# Copy Scripts to NAS - Instructions

Since you're already on the NAS (`ncadmin@SBX02`), you have a few options:

## Option 1: Create Scripts Directly on NAS (Easiest)

Since you're already logged into the NAS, you can create the scripts directly.

**From your LOCAL machine**, run this command to create the scripts on the NAS:

```bash
cd /home/cursor-dev/Documents/Lumines
./scripts/create-on-nas-direct.sh
```

This will try different SSH ports to connect.

## Option 2: Manual Copy via SCP (if SSH works)

From your **local machine**:

```bash
# Try standard port
scp scripts/configure-192.168.86.28.sh warden-ssh@192.168.86.28:~/scripts/
scp scripts/verify-production-readiness.sh warden-ssh@192.168.86.28:~/scripts/

# Or try port 22
scp -P 22 scripts/configure-192.168.86.28.sh warden-ssh@192.168.86.28:~/scripts/
scp scripts/verify-production-readiness.sh warden-ssh@192.168.86.28:~/scripts/
```

## Option 3: Create Scripts Manually on NAS

If you're already on the NAS and can't transfer files, you can create the scripts manually using `cat`:

**On the NAS**, run:

```bash
# Create directory
mkdir -p ~/scripts
cd ~/scripts

# Create configure script (you'll need to paste the content)
cat > configure-192.168.86.28.sh << 'EOF'
[paste script content here]
EOF

chmod +x configure-192.168.86.28.sh
```

## Option 4: Use USB/Network Share

If the NAS has a network share or USB drive accessible, you can:
1. Copy scripts to a USB drive
2. Mount it on the NAS
3. Copy scripts from USB to ~/scripts

## Check Current Location

To verify which server you're on:

```bash
hostname
ip addr show | grep "inet "
```

If you see `192.168.86.28`, you're already on the target server!

## After Scripts Are Created

Once scripts are in `~/scripts` on the NAS:

```bash
cd ~/scripts
sudo ./configure-192.168.86.28.sh
```
