#!/bin/bash
# Verify Monitoring Infrastructure
# Checks that Prometheus, Grafana, and Alertmanager are running correctly

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
echo "║  Monitoring Infrastructure Verification                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PASSED=0
FAILED=0

# Test function
test_service() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    log_info "Testing: $name"

    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")

        if [ "$HTTP_CODE" = "$expected_status" ] || [ "$HTTP_CODE" = "200" ]; then
            log_info "  ✅ PASSED: $name (HTTP $HTTP_CODE)"
            ((PASSED++))
            return 0
        else
            log_error "  ❌ FAILED: $name (HTTP $HTTP_CODE, expected $expected_status)"
            ((FAILED++))
            return 1
        fi
    else
        log_warn "  ⚠️  SKIPPED: $name (curl not available)"
        return 0
    fi
}

# Check Prometheus
log_section "Prometheus Verification"

test_service "Prometheus API" "http://localhost:9090/api/v1/status/config"
test_service "Prometheus Targets" "http://localhost:9090/api/v1/targets"
test_service "Prometheus Alerts" "http://localhost:9090/api/v1/alerts"

# Check Grafana
log_section "Grafana Verification"

test_service "Grafana Health" "http://localhost:3001/api/health"
test_service "Grafana API" "http://localhost:3001/api/datasources"

# Check Alertmanager
log_section "Alertmanager Verification"

test_service "Alertmanager API" "http://localhost:9093/api/v1/status"
test_service "Alertmanager Alerts" "http://localhost:9093/api/v1/alerts"

# Check Docker containers (if using Docker)
log_section "Container Status"

if command -v docker &> /dev/null; then
    if docker ps | grep -q prometheus; then
        log_info "  ✅ Prometheus container running"
        ((PASSED++))
    else
        log_error "  ❌ Prometheus container not running"
        ((FAILED++))
    fi

    if docker ps | grep -q grafana; then
        log_info "  ✅ Grafana container running"
        ((PASSED++))
    else
        log_error "  ❌ Grafana container not running"
        ((FAILED++))
    fi

    if docker ps | grep -q alertmanager; then
        log_info "  ✅ Alertmanager container running"
        ((PASSED++))
    else
        log_error "  ❌ Alertmanager container not running"
        ((FAILED++))
    fi
else
    log_warn "  ⚠️  Docker not available, skipping container checks"
fi

# Summary
echo ""
log_section "Verification Summary"

echo ""
echo "Results:"
echo "  ✅ Passed:  $PASSED"
echo "  ❌ Failed:  $FAILED"
echo ""

if [ $FAILED -eq 0 ]; then
    log_info "✅ ALL CHECKS PASSED - MONITORING INFRASTRUCTURE HEALTHY!"
    exit 0
else
    log_error "❌ VERIFICATION FAILED - $FAILED CHECKS FAILED"
    log_error "Review the errors above and fix issues before proceeding"
    exit 1
fi
