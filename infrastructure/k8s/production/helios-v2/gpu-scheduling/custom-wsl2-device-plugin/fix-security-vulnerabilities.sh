#!/bin/bash

# Security Fix Script for golang.org/x/net vulnerabilities
# Fixes: CVE-2025-22872 (XSS) and CVE-2025-22870 (IPv6 Zone ID proxy bypass)
# Run this on both local repo and remote server (192.168.86.114)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔒 Fixing golang.org/x/net security vulnerabilities..."
echo ""

# Check if go.mod exists
if [ ! -f "go.mod" ]; then
    echo "❌ go.mod not found. Creating it..."
    cat > go.mod << 'EOF'
module github.com/PxG-Studio/LUMINES/infrastructure/k8s/production/helios-v2/gpu-scheduling/custom-wsl2-device-plugin

go 1.21

require (
	golang.org/x/net v0.47.0 // Fixed: CVE-2025-22872 (XSS), CVE-2025-22870 (IPv6 Zone ID proxy bypass)
)
EOF
    echo "✅ go.mod created"
else
    echo "✅ go.mod found"
fi

# Update golang.org/x/net to secure version
echo ""
echo "📦 Updating golang.org/x/net to v0.47.0..."
go get golang.org/x/net@v0.47.0

# Tidy dependencies
echo ""
echo "🧹 Running go mod tidy..."
go mod tidy

# Verify
echo ""
echo "✅ Verifying update..."
CURRENT_VERSION=$(go list -m golang.org/x/net | awk '{print $2}')
echo "Current version: $CURRENT_VERSION"

if [[ "$CURRENT_VERSION" == v0.3[89]* ]] || [[ "$CURRENT_VERSION" == v0.[4-9]* ]]; then
    echo "✅ Security fix applied successfully!"
    echo "   Version $CURRENT_VERSION includes fixes for:"
    echo "   - CVE-2025-22872 (XSS vulnerability)"
    echo "   - CVE-2025-22870 (IPv6 Zone ID proxy bypass)"
else
    echo "⚠️  Warning: Version may not include all security fixes"
    echo "   Expected: v0.38.0 or later"
    echo "   Found: $CURRENT_VERSION"
fi

# Verify module integrity
echo ""
echo "🔍 Verifying module integrity..."
go mod verify

echo ""
echo "✅ Security fix complete!"
echo ""
echo "Next steps:"
echo "1. Test the application: go test ./..."
echo "2. Build the application: go build"
echo "3. Commit changes: git add go.mod go.sum && git commit -m 'fix: update golang.org/x/net to v0.47.0 (CVE-2025-22872, CVE-2025-22870)'"

