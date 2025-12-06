#!/bin/bash
# Post-Deployment Verification Script
# Comprehensive verification after production deployment

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PRODUCTION_URL="${PRODUCTION_URL:-https://lumenforge.io}"

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
echo "║  Post-Deployment Verification                               ║"
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

log_section "1. Comprehensive Health Check"

# Application health
if command -v curl &> /dev/null; then
    HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$PRODUCTION_URL/api/health" 2>&1 || echo "ERROR")
    HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)

    if [ "$HTTP_CODE" = "200" ]; then
        log_info "  ✅ Application health: OK"
        ((PASSED++))
    else
        log_error "  ❌ Application health: FAILED (HTTP $HTTP_CODE)"
        ((FAILED++))
    fi

    # Database health
    DB_HEALTH=$(curl -s -w "\n%{http_code}" "$PRODUCTION_URL/api/health/db" 2>&1 || echo "ERROR")
    DB_HTTP_CODE=$(echo "$DB_HEALTH" | tail -n1)

    if [ "$DB_HTTP_CODE" = "200" ]; then
        log_info "  ✅ Database health: OK"
        ((PASSED++))
    else
        log_error "  ❌ Database health: FAILED (HTTP $DB_HTTP_CODE)"
        ((FAILED++))
    fi

    # Cache health (if endpoint exists)
    CACHE_HEALTH=$(curl -s -w "\n%{http_code}" "$PRODUCTION_URL/api/health/cache" 2>&1 || echo "ERROR")
    CACHE_HTTP_CODE=$(echo "$CACHE_HEALTH" | tail -n1)

    if [ "$CACHE_HTTP_CODE" = "200" ]; then
        log_info "  ✅ Cache health: OK"
        ((PASSED++))
    else
        log_warn "  ⚠️  Cache health: Not available (HTTP $CACHE_HTTP_CODE)"
        ((WARNINGS++))
    fi
else
    log_warn "curl not available, skipping health checks"
    ((WARNINGS++))
fi

log_section "2. Performance Verification"

# Run performance benchmarks
if [ -f "$PROJECT_ROOT/tests/performance/benchmark.sh" ]; then
    log_info "Running performance benchmarks..."
    export BASE_URL="$PRODUCTION_URL"
    "$PROJECT_ROOT/tests/performance/benchmark.sh" || {
        log_warn "Performance benchmarks failed or warnings found"
        ((WARNINGS++))
    }
else
    log_warn "Performance benchmark script not found, skipping..."
    ((WARNINGS++))
fi

# Response time check
if command -v curl &> /dev/null; then
    START=$(date +%s%N)
    curl -f -s "$PRODUCTION_URL/api/health" > /dev/null 2>&1
    END=$(date +%s%N)
    DURATION=$(( (END - START) / 1000000 ))

    if [ "$DURATION" -lt 500 ]; then
        log_info "  ✅ Response time: ${DURATION}ms (OK)"
        ((PASSED++))
    elif [ "$DURATION" -lt 1000 ]; then
        log_warn "  ⚠️  Response time: ${DURATION}ms (WARNING - target < 500ms)"
        ((WARNINGS++))
    else
        log_error "  ❌ Response time: ${DURATION}ms (CRITICAL - target < 500ms)"
        ((FAILED++))
    fi
fi

log_section "3. Security Verification"

# Run security audit
if [ -f "$SCRIPT_DIR/security-audit.sh" ]; then
    log_info "Running security audit..."
    "$SCRIPT_DIR/security-audit.sh" || {
        log_warn "Security audit found issues or warnings"
        ((WARNINGS++))
    }
else
    log_warn "Security audit script not found, skipping..."
    ((WARNINGS++))
fi

log_section "4. Monitoring Verification"

# Verify monitoring
if [ -f "$SCRIPT_DIR/verify-monitoring.sh" ]; then
    log_info "Verifying monitoring infrastructure..."
    "$SCRIPT_DIR/verify-monitoring.sh" || {
        log_warn "Monitoring verification failed or warnings found"
        ((WARNINGS++))
    }
else
    log_warn "Monitoring verification script not found, skipping..."
    ((WARNINGS++))
fi

log_section "5. Documentation Review"

# Check documentation
run_check "Production runbook exists" '[ -f "docs/PRODUCTION_RUNBOOK.md" ]' false
run_check "DR runbook exists" '[ -f "docs/DISASTER_RECOVERY.md" ]' false
run_check "Security hardening guide exists" '[ -f "docs/SECURITY_HARDENING.md" ]' false
run_check "Monitoring setup guide exists" '[ -f "docs/MONITORING_SETUP.md" ]' false

log_section "6. Service Verification"

# Check all critical services
if command -v curl &> /dev/null; then
    # Metrics endpoint
    METRICS_RESPONSE=$(curl -s -w "\n%{http_code}" "$PRODUCTION_URL/api/metrics" 2>&1 || echo "ERROR")
    METRICS_HTTP_CODE=$(echo "$METRICS_RESPONSE" | tail -n1)

    if [ "$METRICS_HTTP_CODE" = "200" ]; then
        log_info "  ✅ Metrics endpoint: OK"
        ((PASSED++))
    else
        log_warn "  ⚠️  Metrics endpoint: Not available (HTTP $METRICS_HTTP_CODE)"
        ((WARNINGS++))
    fi
fi

log_section "Verification Summary"

echo ""
echo "Results:"
echo "  ✅ Passed:  $PASSED"
echo "  ❌ Failed:  $FAILED"
echo "  ⚠️  Warnings: $WARNINGS"
echo ""

# Generate report
REPORT_FILE="$PROJECT_ROOT/post-deployment-verification-$(date +%Y%m%d-%H%M%S).txt"
{
    echo "Post-Deployment Verification Report"
    echo "Date: $(date)"
    echo "Production URL: $PRODUCTION_URL"
    echo ""
    echo "Results:"
    echo "  Passed: $PASSED"
    echo "  Failed: $FAILED"
    echo "  Warnings: $WARNINGS"
} > "$REPORT_FILE"

log_info "Report saved to: $REPORT_FILE"

if [ $FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        log_info "✅ ALL CHECKS PASSED - PRODUCTION VERIFIED!"
        log_info ""
        log_info "Next steps:"
        log_info "  1. Review monitoring dashboards"
        log_info "  2. Complete team handoff"
        log_info "  3. Document deployment results"
        exit 0
    else
        log_warn "⚠️  ALL CRITICAL CHECKS PASSED - $WARNINGS WARNINGS"
        log_warn "Review warnings and address non-critical issues"
        log_info ""
        log_info "Next steps:"
        log_info "  1. Address warnings"
        log_info "  2. Review monitoring dashboards"
        log_info "  3. Complete team handoff"
        exit 0
    fi
else
    log_error "❌ VERIFICATION FAILED - $FAILED CRITICAL ISSUES"
    log_error "Fix critical issues immediately"
    log_error "Consider rollback if issues persist"
    exit 1
fi
