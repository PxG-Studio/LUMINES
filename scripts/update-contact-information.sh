#!/bin/bash
# Update Contact Information Script
# Interactive script to update contact information in documentation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_section() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"
}

cd "$PROJECT_ROOT"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Update Contact Information                                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

log_section "Contact Information Collection"

# Collect contact information
read -p "On-Call Engineer (Primary): " ONCALL_PRIMARY
read -p "On-Call Engineer (Secondary): " ONCALL_SECONDARY
read -p "DevOps Lead: " DEVOPS_LEAD
read -p "Database Administrator (Primary): " DB_ADMIN_PRIMARY
read -p "Database Administrator (Secondary): " DB_ADMIN_SECONDARY
read -p "Security Team: " SECURITY_TEAM
read -p "Engineering Manager: " ENG_MANAGER
read -p "CTO: " CTO

log_section "Updating Documentation"

# Update PRODUCTION_RUNBOOK.md
if [ -f "docs/PRODUCTION_RUNBOOK.md" ]; then
    log_info "Updating PRODUCTION_RUNBOOK.md..."
    sed -i.bak "s/- \*\*On-Call Engineer:\*\* \[TO BE CONFIGURED\]/- **On-Call Engineer:** $ONCALL_PRIMARY/g" docs/PRODUCTION_RUNBOOK.md
    sed -i.bak "s/- \*\*DevOps Lead:\*\* \[TO BE CONFIGURED\]/- **DevOps Lead:** $DEVOPS_LEAD/g" docs/PRODUCTION_RUNBOOK.md
    sed -i.bak "s/- \*\*Database Admin:\*\* \[TO BE CONFIGURED\]/- **Database Admin:** $DB_ADMIN_PRIMARY/g" docs/PRODUCTION_RUNBOOK.md
    sed -i.bak "s/- \*\*Security Team:\*\* \[TO BE CONFIGURED\]/- **Security Team:** $SECURITY_TEAM/g" docs/PRODUCTION_RUNBOOK.md
    log_info "✅ PRODUCTION_RUNBOOK.md updated"
fi

# Update DISASTER_RECOVERY.md
if [ -f "docs/DISASTER_RECOVERY.md" ]; then
    log_info "Updating DISASTER_RECOVERY.md..."
    sed -i.bak "s/- Primary: \[TO BE CONFIGURED\]/- Primary: $ONCALL_PRIMARY/g" docs/DISASTER_RECOVERY.md
    sed -i.bak "s/- Secondary: \[TO BE CONFIGURED\]/- Secondary: $ONCALL_SECONDARY/g" docs/DISASTER_RECOVERY.md
    sed -i.bak "s/- Primary: \[TO BE CONFIGURED\]/- Primary: $DB_ADMIN_PRIMARY/g" docs/DISASTER_RECOVERY.md
    sed -i.bak "s/- Secondary: \[TO BE CONFIGURED\]/- Secondary: $DB_ADMIN_SECONDARY/g" docs/DISASTER_RECOVERY.md
    sed -i.bak "s/- CTO: \[TO BE CONFIGURED\]/- CTO: $CTO/g" docs/DISASTER_RECOVERY.md
    sed -i.bak "s/- Engineering Manager: \[TO BE CONFIGURED\]/- Engineering Manager: $ENG_MANAGER/g" docs/DISASTER_RECOVERY.md
    log_info "✅ DISASTER_RECOVERY.md updated"
fi

# Update SECURITY_HARDENING.md
if [ -f "docs/SECURITY_HARDENING.md" ]; then
    log_info "Updating SECURITY_HARDENING.md..."
    sed -i.bak "s/- \*\*Security Team:\*\* \[TO BE CONFIGURED\]/- **Security Team:** $SECURITY_TEAM/g" docs/SECURITY_HARDENING.md
    sed -i.bak "s/- \*\*On-Call:\*\* \[TO BE CONFIGURED\]/- **On-Call:** $ONCALL_PRIMARY/g" docs/SECURITY_HARDENING.md
    log_info "✅ SECURITY_HARDENING.md updated"
fi

# Clean up backup files
find docs -name "*.bak" -delete 2>/dev/null || true

log_section "Update Complete"

log_info "✅ Contact information updated in all documentation"
log_info ""
log_info "Updated files:"
log_info "  - docs/PRODUCTION_RUNBOOK.md"
log_info "  - docs/DISASTER_RECOVERY.md"
log_info "  - docs/SECURITY_HARDENING.md"
log_info ""
log_warn "⚠️  Review the updated files and commit changes:"
log_info "  git add docs/PRODUCTION_RUNBOOK.md docs/DISASTER_RECOVERY.md docs/SECURITY_HARDENING.md"
log_info "  git commit -m 'Update contact information in production documentation'"
