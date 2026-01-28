#!/usr/bin/env bash
# Generate a dedicated SSH deploy key for GitLab CI → production server.
# Keys are written to ./deploy_key and ./deploy_key.pub (both are in .gitignore).
# After running, follow the printed instructions to add the public key to the
# server and the private key to GitLab CI/CD Variables (SSH_PRIVATE_KEY).

set -e

OUTPUT_DIR="${1:-.}"
KEY_FILE="$OUTPUT_DIR/deploy_key"
PUB_FILE="${KEY_FILE}.pub"
SERVER="${DEPLOY_SERVER:-ncadmin@192.168.86.29}"

if [ -f "$KEY_FILE" ]; then
  echo "Key already exists: $KEY_FILE"
  echo "Remove it first if you want to regenerate: rm $KEY_FILE ${PUB_FILE}"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
ssh-keygen -t ed25519 -C "gitlab-deploy-production" -f "$KEY_FILE" -N ""

echo ""
echo "=== Deploy key generated ==="
echo "  Private: $KEY_FILE"
echo "  Public:  $PUB_FILE"
echo ""
echo "1. Add the PUBLIC key to the production server:"
echo "   ssh-copy-id -i $PUB_FILE $SERVER"
echo ""
echo "2. Add the PRIVATE key to GitLab:"
echo "   - Open your project: Settings → CI/CD → Variables"
echo "   - Add variable: Key = SSH_PRIVATE_KEY"
echo "   - Value = contents of $KEY_FILE (paste the entire file including headers)"
echo "   - Type: Variable | Flags: Mask variable, Protect variable"
echo ""
echo "3. (Optional) Remove keys from this machine after adding to GitLab and server:"
echo "   rm $KEY_FILE ${PUB_FILE}"
echo ""
