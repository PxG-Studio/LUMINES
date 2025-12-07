#!/bin/bash
# Production Deployment Preparation Script
# Comprehensive preparation before production deployment

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
echo "║  Production Deployment Preparation                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Test function
run_check() {
    local name=$1
    local command=$2
    local critical=${3:-true}

    log_info "Checking: $name"

    if eval "$command" > /dev/null 2>&1; then
        log_info "  ✅ PASSED: $name"
        ((PASSED++))
        return 0
    else
        if [ "$critical" = "true" ]; then
            log_error "  ❌ FAILED: $name"
            ((FAILED++))
            return 1
        else
            log_warn "  ⚠️  WARNING: $name"
            ((WARNINGS++))
            return 0
        fi
    fi
}

log_section "1. Production Readiness Review"

# Check sign-off document
run_check "Production readiness sign-off exists" '[ -f "docs/PRODUCTION_READINESS_SIGN_OFF.md" ]' true

# Check staging deployment
run_check "Staging deployment successful" '[ -n "$STAGING_URL" ] || curl -f -s "${STAGING_URL:-http://localhost:3000}/api/health" > /dev/null' false

log_section "2. Backup Verification"

# Check backup script exists
run_check "Backup script exists" '[ -f "scripts/backup-postgres.sh" ]' true

# Run backup
if [ -f "$SCRIPT_DIR/backup-postgres.sh" ]; then
    log_info "Creating pre-deployment backup..."
    "$SCRIPT_DIR/backup-postgres.sh" || {
        log_error "Pre-deployment backup failed"
        ((FAILED++))
    }
else
    log_warn "Backup script not found, skipping backup"
    ((WARNINGS++))
fi

log_section "3. Disaster Recovery Verification"

# Check DR scripts
run_check "Failover test script exists" '[ -f "scripts/test-failover.sh" ]' false
run_check "Backup restore test script exists" '[ -f "scripts/test-backup-restore.sh" ]' false

# Run DR tests
if [ -f "$SCRIPT_DIR/test-failover.sh" ]; then
    log_info "Testing failover procedures..."
    "$SCRIPT_DIR/test-failover.sh" || {
        log_warn "Failover test failed, but continuing..."
        ((WARNINGS++))
    }
else
    log_warn "Failover test script not found, skipping"
    ((WARNINGS++))
fi

if [ -f "$SCRIPT_DIR/test-backup-restore.sh" ]; then
    log_info "Testing backup restore procedures..."
    "$SCRIPT_DIR/test-backup-restore.sh" || {
        log_warn "Backup restore test failed, but continuing..."
        ((WARNINGS++))
    }
else
    log_warn "Backup restore test script not found, skipping"
    ((WARNINGS++))
fi

log_section "4. Environment Validation"

# Check environment variables
run_check "NODE_ENV is production" '[ "$NODE_ENV" = "production" ]' true
run_check "DATABASE_URL is set" '[ -n "$DATABASE_URL" ] || [ -n "$DATABASE_HOST" ]' true
run_check "NOCTURNA_JWT_SECRET is set" '[ -n "$NOCTURNA_JWT_SECRET" ]' true
run_check "NOCTURNA_JWT_SECRET is not default" '[ "$NOCTURNA_JWT_SECRET" != "your-jwt-secret-key-change-in-production" ]' true

# Run final validation
if [ -f "$SCRIPT_DIR/final-validation.sh" ]; then
    log_info "Running final validation..."
    "$SCRIPT_DIR/final-validation.sh" || {
        log_error "Final validation failed"
        ((FAILED++))
    }
else
    log_warn "Final validation script not found"
    ((WARNINGS++))
fi

log_section "5. Monitoring Verification"

# Check monitoring
if [ -f "$SCRIPT_DIR/verify-monitoring.sh" ]; then
    log_info "Verifying monitoring infrastructure..."
    "$SCRIPT_DIR/verify-monitoring.sh" || {
        log_warn "Monitoring verification failed, but continuing..."
        ((WARNINGS++))
    }
else
    log_warn "Monitoring verification script not found, skipping"
    ((WARNINGS++))
fi

log_section "6. Deployment Scripts Verification"

# Check deployment scripts
run_check "Production deployment script exists" '[ -f "scripts/deploy-production.sh" ]' true
run_check "Deployment verification script exists" '[ -f "scripts/verify-deployment.sh" ]' true
run_check "Production runbook exists" '[ -f "docs/PRODUCTION_RUNBOOK.md" ]' false
run_check "DR runbook exists" '[ -f "docs/DISASTER_RECOVERY.md" ]' false

log_section "7. Team Preparation Checklist"

log_info "Team preparation checklist:"
log_info "  [ ] All team members notified"
log_info "  [ ] Communication channels set up"
log_info "  [ ] Incident response plan reviewed"
log_info "  [ ] Rollback plan documented"
log_info "  [ ] Deployment window scheduled"
log_info "  [ ] Stakeholders notified"

log_warn "⚠️  Manual step: Complete team preparation checklist above"

log_section "Preparation Summary"

echo ""
echo "Results:"
echo "  ✅ Passed:  $PASSED"
echo "  ❌ Failed:  $FAILED"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        log_info "✅ ALL CHECKS PASSED - READY FOR PRODUCTION DEPLOYMENT!"
        log_info ""
        log_info "Next steps:"
        log_info "  1. Complete team preparation checklist"
        log_info "  2. Schedule deployment window"
        log_info "  3. Notify stakeholders"
        log_info "  4. Execute: ./scripts/deploy-production.sh production"
        exit 0
    else
        log_warn "⚠️  ALL CRITICAL CHECKS PASSED - $WARNINGS WARNINGS"
        log_warn "Review warnings before deploying to production"
        log_info ""
        log_info "Next steps:"
        log_info "  1. Address warnings"
        log_info "  2. Complete team preparation checklist"
        log_info "  3. Schedule deployment window"
        exit 0
    fi
else
    log_error "❌ PREPARATION FAILED - $FAILED CRITICAL ISSUES"
    log_error "Fix critical issues before proceeding with production deployment"
    exit 1
fi
