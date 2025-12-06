#!/bin/bash
# Production Monitoring Script
# Continuous monitoring of production deployment

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
MONITORING_INTERVAL="${MONITORING_INTERVAL:-60}"
MONITORING_DURATION="${MONITORING_DURATION:-3600}" # 1 hour default

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
echo "║  Production Monitoring                                     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

log_info "Production URL: $PRODUCTION_URL"
log_info "Monitoring Interval: ${MONITORING_INTERVAL}s"
log_info "Monitoring Duration: ${MONITORING_DURATION}s"
log_info ""

START_TIME=$(date +%s)
END_TIME=$((START_TIME + MONITORING_DURATION))
CHECK_COUNT=0
ERROR_COUNT=0
WARNING_COUNT=0

# Monitoring function
check_production() {
    ((CHECK_COUNT++))
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    
    log_section "Check #$CHECK_COUNT (Elapsed: ${ELAPSED}s)"
    
    # Health check
    if command -v curl &> /dev/null; then
        HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$PRODUCTION_URL/api/health" 2>&1 || echo "ERROR")
        HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
        HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)
        
        if [ "$HTTP_CODE" = "200" ]; then
            log_info "✅ Health check: OK"
        else
            log_error "❌ Health check: FAILED (HTTP $HTTP_CODE)"
            ((ERROR_COUNT++))
        fi
        
        # Response time check
        START=$(date +%s%N)
        curl -f -s "$PRODUCTION_URL/api/health" > /dev/null 2>&1
        END=$(date +%s%N)
        DURATION=$(( (END - START) / 1000000 ))
        
        if [ "$DURATION" -lt 500 ]; then
            log_info "✅ Response time: ${DURATION}ms (OK)"
        elif [ "$DURATION" -lt 1000 ]; then
            log_warn "⚠️  Response time: ${DURATION}ms (WARNING)"
            ((WARNING_COUNT++))
        else
            log_error "❌ Response time: ${DURATION}ms (CRITICAL)"
            ((ERROR_COUNT++))
        fi
        
        # Database health
        DB_HEALTH=$(curl -s -w "\n%{http_code}" "$PRODUCTION_URL/api/health/db" 2>&1 || echo "ERROR")
        DB_HTTP_CODE=$(echo "$DB_HEALTH" | tail -n1)
        
        if [ "$DB_HTTP_CODE" = "200" ]; then
            log_info "✅ Database health: OK"
        else
            log_error "❌ Database health: FAILED (HTTP $DB_HTTP_CODE)"
            ((ERROR_COUNT++))
        fi
        
        # Metrics check
        METRICS_RESPONSE=$(curl -s -w "\n%{http_code}" "$PRODUCTION_URL/api/metrics" 2>&1 || echo "ERROR")
        METRICS_HTTP_CODE=$(echo "$METRICS_RESPONSE" | tail -n1)
        
        if [ "$METRICS_HTTP_CODE" = "200" ]; then
            log_info "✅ Metrics endpoint: OK"
        else
            log_warn "⚠️  Metrics endpoint: FAILED (HTTP $METRICS_HTTP_CODE)"
            ((WARNING_COUNT++))
        fi
    else
        log_warn "curl not available, skipping checks"
    fi
    
    # Summary
    log_info "Summary: $CHECK_COUNT checks, $ERROR_COUNT errors, $WARNING_COUNT warnings"
}

# Main monitoring loop
log_section "Starting Production Monitoring"

while [ $(date +%s) -lt $END_TIME ]; do
    check_production
    
    # Check if we should continue
    if [ $(date +%s) -ge $END_TIME ]; then
        break
    fi
    
    # Wait for next check
    sleep "$MONITORING_INTERVAL"
done

log_section "Monitoring Summary"

FINAL_TIME=$(date +%s)
TOTAL_DURATION=$((FINAL_TIME - START_TIME))
TOTAL_MINUTES=$((TOTAL_DURATION / 60))

log_info "Monitoring completed:"
log_info "  Total checks: $CHECK_COUNT"
log_info "  Total errors: $ERROR_COUNT"
log_info "  Total warnings: $WARNING_COUNT"
log_info "  Duration: ${TOTAL_MINUTES} minutes"
log_info ""

if [ $ERROR_COUNT -eq 0 ]; then
    if [ $WARNING_COUNT -eq 0 ]; then
        log_info "✅ Production monitoring: ALL CHECKS PASSED"
    else
        log_warn "⚠️  Production monitoring: $WARNING_COUNT WARNINGS (no errors)"
    fi
else
    log_error "❌ Production monitoring: $ERROR_COUNT ERRORS detected"
    log_error "Review production logs and consider rollback if issues persist"
    exit 1
fi

