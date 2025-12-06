#!/bin/bash
# Security Audit Script
# Comprehensive security scanning and audit

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cd "$PROJECT_ROOT"

echo "🔒 Starting security audit..."

# 1. Dependency Vulnerability Scan
log_info "Running npm audit..."
npm audit --audit-level=moderate || {
    log_warn "npm audit found vulnerabilities (see above)"
}

# 2. Check for known vulnerable packages
log_info "Checking for known vulnerable packages..."
if command -v npx &> /dev/null; then
    npx audit-ci --moderate || {
        log_warn "audit-ci found issues"
    }
fi

# 3. Check for exposed secrets
log_info "Scanning for exposed secrets..."
if command -v git-secrets &> /dev/null; then
    git-secrets --scan || {
        log_warn "git-secrets found potential secrets"
    }
else
    log_warn "git-secrets not installed, skipping secret scan"
fi

# 4. Check for hardcoded credentials
log_info "Checking for hardcoded credentials..."
if grep -r "password.*=.*['\"].*[a-zA-Z0-9]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ 2>/dev/null | grep -v "test" | grep -v "example"; then
    log_warn "Potential hardcoded credentials found"
else
    log_info "No hardcoded credentials detected"
fi

# 5. Check for SQL injection vulnerabilities
log_info "Checking for SQL injection patterns..."
if grep -r "query.*\+.*\$" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | grep -v "test"; then
    log_warn "Potential SQL injection patterns found"
else
    log_info "No SQL injection patterns detected"
fi

# 6. Check for XSS vulnerabilities
log_info "Checking for XSS patterns..."
if grep -r "dangerouslySetInnerHTML\|innerHTML" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | grep -v "test"; then
    log_warn "Potential XSS patterns found (dangerouslySetInnerHTML/innerHTML usage)"
else
    log_info "No XSS patterns detected"
fi

# 7. Check for insecure random number generation
log_info "Checking for insecure random usage..."
if grep -r "Math\.random" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | grep -v "test" | grep -v "mock"; then
    log_warn "Math.random() usage found (consider using crypto.randomBytes)"
else
    log_info "No insecure random usage detected"
fi

# 8. Check for eval usage
log_info "Checking for eval usage..."
if grep -r "eval\|Function(" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | grep -v "test"; then
    log_warn "eval() or Function() usage found"
else
    log_info "No eval usage detected"
fi

# 9. Check environment variable usage
log_info "Checking environment variable configuration..."
if [ ! -f ".env.example" ]; then
    log_warn ".env.example not found"
else
    log_info ".env.example found"
fi

# 10. Check for exposed API keys
log_info "Checking for exposed API keys..."
if grep -r "api[_-]?key.*=.*['\"].*[a-zA-Z0-9]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" -i src/ 2>/dev/null | grep -v "test" | grep -v "example"; then
    log_warn "Potential exposed API keys found"
else
    log_info "No exposed API keys detected"
fi

# Summary
echo ""
log_info "Security audit complete!"
log_info "Review the warnings above and address any security concerns."


