#!/bin/bash
# Deployment Verification Script
# Usage: ./scripts/verify-deployment.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
HEALTH_URL="${HEALTH_URL:-http://localhost:3000/api/health}"
TIMEOUT="${TIMEOUT:-30}"

# Health check
check_health() {
    log_info "Checking application health..."
    
    if ! command -v curl &> /dev/null; then
        log_error "curl not found, cannot perform health check"
        return 1
    fi
    
    RESPONSE=$(curl -f -s -w "\n%{http_code}" "$HEALTH_URL" 2>&1) || {
        log_error "Health check failed: $RESPONSE"
        return 1
    }
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" != "200" ]; then
        log_error "Health check returned HTTP $HTTP_CODE: $BODY"
        return 1
    fi
    
    if echo "$BODY" | grep -q "healthy"; then
        log_info "✅ Health check passed"
        return 0
    else
        log_error "Health check response does not indicate healthy: $BODY"
        return 1
    fi
}

# Database health check
check_database() {
    log_info "Checking database connection..."
    
    DB_HEALTH_URL="${DB_HEALTH_URL:-http://localhost:3000/api/health/db}"
    
    if ! command -v curl &> /dev/null; then
        log_error "curl not found, cannot perform database check"
        return 1
    fi
    
    RESPONSE=$(curl -f -s -w "\n%{http_code}" "$DB_HEALTH_URL" 2>&1) || {
        log_error "Database check failed: $RESPONSE"
        return 1
    }
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" != "200" ]; then
        log_error "Database check returned HTTP $HTTP_CODE: $BODY"
        return 1
    fi
    
    if echo "$BODY" | grep -q "connected"; then
        log_info "✅ Database connection verified"
        return 0
    else
        log_error "Database check response does not indicate connected: $BODY"
        return 1
    fi
}

# Metrics check
check_metrics() {
    log_info "Checking metrics endpoint..."
    
    METRICS_URL="${METRICS_URL:-http://localhost:3000/api/metrics}"
    
    if ! command -v curl &> /dev/null; then
        log_error "curl not found, cannot perform metrics check"
        return 1
    fi
    
    RESPONSE=$(curl -f -s -w "\n%{http_code}" "$METRICS_URL" 2>&1) || {
        log_error "Metrics check failed: $RESPONSE"
        return 1
    }
    
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | head -n-1)
    
    if [ "$HTTP_CODE" != "200" ]; then
        log_error "Metrics check returned HTTP $HTTP_CODE: $BODY"
        return 1
    fi
    
    if [ -n "$BODY" ]; then
        log_info "✅ Metrics endpoint accessible"
        return 0
    else
        log_error "Metrics endpoint returned empty response"
        return 1
    fi
}

# Response time check
check_response_time() {
    log_info "Checking response time..."
    
    if ! command -v curl &> /dev/null; then
        log_error "curl not found, cannot perform response time check"
        return 1
    fi
    
    START_TIME=$(date +%s%N)
    curl -f -s "$HEALTH_URL" > /dev/null || {
        log_error "Response time check failed"
        return 1
    }
    END_TIME=$(date +%s%N)
    
    DURATION=$(( (END_TIME - START_TIME) / 1000000 )) # Convert to milliseconds
    
    if [ "$DURATION" -lt 500 ]; then
        log_info "✅ Response time acceptable: ${DURATION}ms"
        return 0
    else
        log_error "Response time too high: ${DURATION}ms (expected < 500ms)"
        return 1
    fi
}

# Main verification function
main() {
    log_info "Starting deployment verification..."
    
    # Wait for service to be ready
    log_info "Waiting for service to be ready..."
    sleep 5
    
    # Run checks
    CHECKS_PASSED=0
    CHECKS_FAILED=0
    
    check_health && ((CHECKS_PASSED++)) || ((CHECKS_FAILED++))
    check_database && ((CHECKS_PASSED++)) || ((CHECKS_FAILED++))
    check_metrics && ((CHECKS_PASSED++)) || ((CHECKS_FAILED++))
    check_response_time && ((CHECKS_PASSED++)) || ((CHECKS_FAILED++))
    
    # Summary
    echo ""
    log_info "Verification Summary:"
    log_info "  Passed: $CHECKS_PASSED"
    log_info "  Failed: $CHECKS_FAILED"
    
    if [ $CHECKS_FAILED -eq 0 ]; then
        log_info "✅ Deployment verification complete!"
        return 0
    else
        log_error "❌ Deployment verification failed ($CHECKS_FAILED checks failed)"
        return 1
    fi
}

# Run main function
main "$@"

