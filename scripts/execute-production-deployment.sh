#!/bin/bash
# Production Deployment Execution Script
# Comprehensive production deployment with full monitoring and verification

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
echo "║  PRODUCTION DEPLOYMENT EXECUTION                           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PRODUCTION_URL="${PRODUCTION_URL:-https://lumenforge.io}"
DEPLOYMENT_START_TIME=$(date +%s)

log_section "Pre-Deployment Preparation"

# Run preparation script
if [ -f "$SCRIPT_DIR/prepare-production-deployment.sh" ]; then
    log_info "Running production deployment preparation..."
    "$SCRIPT_DIR/prepare-production-deployment.sh" || {
        log_error "Preparation failed - aborting deployment"
        exit 1
    }
else
    log_warn "Preparation script not found, continuing with deployment..."
fi

log_section "Production Deployment Execution"

# Set production environment
export NODE_ENV=production

# Execute deployment
log_info "Executing production deployment..."
"$SCRIPT_DIR/deploy-production.sh" production || {
    log_error "Production deployment failed"
    exit 1
}

log_section "Post-Deployment Verification"

# Wait for service to be ready
log_info "Waiting for service to be ready..."
sleep 20

# Run verification
if [ -f "$SCRIPT_DIR/verify-deployment.sh" ]; then
    log_info "Running deployment verification..."
    export HEALTH_URL="$PRODUCTION_URL/api/health"
    export DB_HEALTH_URL="$PRODUCTION_URL/api/health/db"
    export METRICS_URL="$PRODUCTION_URL/api/metrics"

    "$SCRIPT_DIR/verify-deployment.sh" || {
        log_error "Deployment verification failed"
        log_error "Consider rolling back if issues persist"
        exit 1
    }
else
    log_warn "Verification script not found, performing basic checks..."

    # Basic health check
    if command -v curl &> /dev/null; then
        for i in {1..30}; do
            if curl -f -s "$PRODUCTION_URL/api/health" > /dev/null; then
                log_info "✅ Health check passed"
                break
            fi
            if [ $i -eq 30 ]; then
                log_error "❌ Health check failed after 30 attempts"
                exit 1
            fi
            sleep 2
        done
    fi
fi

log_section "Production Smoke Tests"

# Run smoke tests
if [ -f "$PROJECT_ROOT/tests/e2e/smoke.spec.ts" ]; then
    log_info "Running production smoke tests..."
    export BASE_URL="$PRODUCTION_URL"

    if command -v npx &> /dev/null; then
        npx playwright test tests/e2e/smoke.spec.ts --reporter=list || {
            log_warn "Some smoke tests failed, but deployment succeeded"
            log_warn "Review test results and monitor production closely"
        }
    else
        log_warn "Playwright not available, skipping smoke tests"
    fi
else
    log_warn "Smoke test file not found, skipping..."
fi

log_section "Monitoring Verification"

# Verify monitoring
if [ -f "$SCRIPT_DIR/verify-monitoring.sh" ]; then
    log_info "Verifying monitoring infrastructure..."
    "$SCRIPT_DIR/verify-monitoring.sh" || {
        log_warn "Monitoring verification failed, but deployment succeeded"
    }
else
    log_warn "Monitoring verification script not found, skipping..."
fi

log_section "Production Monitoring"

log_info "Starting production monitoring..."
log_info ""
log_info "Monitor the following:"
log_info "  1. Health endpoints: $PRODUCTION_URL/api/health"
log_info "  2. Grafana dashboards: http://localhost:3001"
log_info "  3. Prometheus metrics: http://localhost:9090"
log_info "  4. Application logs: docker-compose logs -f lumines-web"
log_info ""
log_info "Key metrics to watch:"
log_info "  - Error rate (should be < 0.1%)"
log_info "  - Response time p95 (should be < 500ms)"
log_info "  - Database connection pool usage"
log_info "  - Cache hit rates"
log_info "  - Message queue depth"
log_info ""

# Calculate deployment duration
DEPLOYMENT_END_TIME=$(date +%s)
DEPLOYMENT_DURATION=$((DEPLOYMENT_END_TIME - DEPLOYMENT_START_TIME))
DEPLOYMENT_MINUTES=$((DEPLOYMENT_DURATION / 60))
DEPLOYMENT_SECONDS=$((DEPLOYMENT_DURATION % 60))

log_section "Deployment Summary"

log_info "✅ Production deployment completed successfully!"
log_info ""
log_info "Deployment Details:"
log_info "  Production URL: $PRODUCTION_URL"
log_info "  Duration: ${DEPLOYMENT_MINUTES}m ${DEPLOYMENT_SECONDS}s"
log_info "  Start Time: $(date -d @$DEPLOYMENT_START_TIME)"
log_info "  End Time: $(date -d @$DEPLOYMENT_END_TIME)"
log_info ""
log_info "Next Steps:"
log_info "  1. Monitor production for 24 hours"
log_info "  2. Review monitoring dashboards"
log_info "  3. Check error logs"
log_info "  4. Verify all services"
log_info "  5. Run post-deployment verification (Day 10)"
log_info ""
log_info "Rollback Procedure (if needed):"
log_info "  ./scripts/deploy-production.sh production --rollback"
log_info "  Or: git checkout <previous-commit> && ./scripts/deploy-production.sh production"
