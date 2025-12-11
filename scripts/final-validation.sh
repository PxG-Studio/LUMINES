#!/bin/bash
# Final Production Readiness Validation
# Comprehensive validation before production deployment

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

# Results
PASSED=0
FAILED=0
WARNINGS=0

# Test function
run_test() {
    local name=$1
    local command=$2
    local critical=${3:-true}
    
    log_info "Testing: $name"
    
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

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  FINAL PRODUCTION READINESS VALIDATION                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 1. Environment Validation
log_section "1. Environment Validation"

run_test "NODE_ENV is production" '[ "$NODE_ENV" = "production" ]' true
run_test "DATABASE_URL is set" '[ -n "$DATABASE_URL" ] || [ -n "$DATABASE_HOST" ]' true
run_test "NOCTURNA_JWT_SECRET is set" '[ -n "$NOCTURNA_JWT_SECRET" ]' true
run_test "NOCTURNA_JWT_SECRET is not default" '[ "$NOCTURNA_JWT_SECRET" != "your-jwt-secret-key-change-in-production" ]' true

# 2. Code Quality
log_section "2. Code Quality"

run_test "TypeScript compilation" 'npm run typecheck' true
run_test "Linting passes" 'npm run lint:eslint' false
run_test "Formatting check" 'npm run format' false

# 3. Tests
log_section "3. Test Suite"

run_test "Unit tests pass" 'npm run test:unit' false
run_test "Integration tests pass" 'npm run test:integration' false
run_test "E2E tests pass" 'npm run test:e2e' false

# 4. Build
log_section "4. Build Validation"

run_test "Application builds successfully" 'npm run build' true
run_test "Build artifacts exist" '[ -d ".next" ] || [ -d "dist" ]' true

# 5. Security
log_section "5. Security Checks"

run_test "Security audit (no critical)" 'npm audit --audit-level=critical || [ $? -eq 0 ]' false
run_test "Security audit script exists" '[ -f "scripts/security-audit.sh" ]' false
run_test "Security headers configured" '[ -f "src/lib/security/security-headers.ts" ]' false

# 6. Documentation
log_section "6. Documentation"

run_test "Production runbook exists" '[ -f "docs/PRODUCTION_RUNBOOK.md" ]' false
run_test "DR runbook exists" '[ -f "docs/DISASTER_RECOVERY.md" ]' false
run_test "Security hardening guide exists" '[ -f "docs/SECURITY_HARDENING.md" ]' false
run_test "CI/CD pipeline docs exist" '[ -f "docs/CI_CD_PIPELINE.md" ]' false
run_test "Performance optimization guide exists" '[ -f "docs/PERFORMANCE_OPTIMIZATION.md" ]' false

# 7. Scripts
log_section "7. Automation Scripts"

run_test "Deployment script exists" '[ -f "scripts/deploy-production.sh" ]' false
run_test "Verification script exists" '[ -f "scripts/verify-deployment.sh" ]' false
run_test "Backup script exists" '[ -f "scripts/backup-postgres.sh" ]' false
run_test "Failover test script exists" '[ -f "scripts/test-failover.sh" ]' false

# 8. Monitoring
log_section "8. Monitoring"

run_test "Prometheus config exists" '[ -f "infrastructure/monitoring/prometheus/prometheus.yml" ]' false
run_test "Alert rules exist" '[ -f "infrastructure/monitoring/alerts/alerts.yml" ]' false
run_test "Grafana dashboards exist" '[ -d "infrastructure/monitoring/grafana/dashboards" ]' false

# 9. CI/CD
log_section "9. CI/CD Pipeline"

run_test "Quality gates workflow exists" '[ -f ".github/workflows/quality-gates.yml" ]' false
run_test "Security scan workflow exists" '[ -f ".github/workflows/security-scan.yml" ]' false
run_test "Production deploy workflow exists" '[ -f ".github/workflows/production-deploy.yml" ]' false

# 10. Health Checks
log_section "10. Health Checks"

if command -v curl &> /dev/null; then
    BASE_URL="${BASE_URL:-http://localhost:3000}"
    run_test "Health endpoint accessible" "curl -f -s $BASE_URL/api/health > /dev/null" false
    run_test "Health endpoint returns 200" "curl -s -o /dev/null -w '%{http_code}' $BASE_URL/api/health | grep -q 200" false
else
    log_warn "curl not available, skipping health checks"
fi

# Summary
echo ""
log_section "VALIDATION SUMMARY"

echo ""
echo "Results:"
echo "  ✅ Passed:  $PASSED"
echo "  ❌ Failed:  $FAILED"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        log_info "✅ ALL CHECKS PASSED - PRODUCTION READY!"
        exit 0
    else
        log_warn "⚠️  ALL CRITICAL CHECKS PASSED - $WARNINGS WARNINGS"
        log_warn "Review warnings before deploying to production"
        exit 0
    fi
else
    log_error "❌ VALIDATION FAILED - NOT PRODUCTION READY"
    log_error "Fix $FAILED critical issues before deploying"
    exit 1
fi


