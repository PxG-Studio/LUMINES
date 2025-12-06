#!/bin/bash
# Staging Deployment Script
# Deploys LUMINES/WIS2L to staging environment with comprehensive verification

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
echo "║  Staging Deployment - LUMINES/WIS2L                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Set staging environment
export NODE_ENV=staging
STAGING_URL="${STAGING_URL:-http://localhost:3000}"

log_section "Pre-Deployment Validation"

# Run final validation
if [ -f "$SCRIPT_DIR/final-validation.sh" ]; then
    log_info "Running final validation..."
    "$SCRIPT_DIR/final-validation.sh" || {
        log_error "Pre-deployment validation failed"
        exit 1
    }
else
    log_warn "Final validation script not found, skipping..."
fi

# Check environment variables
if [ -z "$DATABASE_URL" ] && [ -z "$DATABASE_HOST" ]; then
    log_warn "DATABASE_URL not set, using defaults for staging"
    export DATABASE_URL="${DATABASE_URL:-postgresql://lumines:lumines@postgres:5432/lumines_dev}"
fi

if [ -z "$NOCTURNA_JWT_SECRET" ]; then
    log_warn "NOCTURNA_JWT_SECRET not set, using default (NOT FOR PRODUCTION)"
    export NOCTURNA_JWT_SECRET="${NOCTURNA_JWT_SECRET:-staging-jwt-secret-change-me}"
fi

log_section "Deploying to Staging"

# Use deploy-production.sh with staging environment
log_info "Deploying with staging configuration..."
"$SCRIPT_DIR/deploy-production.sh" staging || {
    log_error "Staging deployment failed"
    exit 1
}

log_section "Deployment Verification"

# Wait for service to be ready
log_info "Waiting for service to be ready..."
sleep 15

# Run verification script
if [ -f "$SCRIPT_DIR/verify-deployment.sh" ]; then
    log_info "Running deployment verification..."
    export HEALTH_URL="$STAGING_URL/api/health"
    "$SCRIPT_DIR/verify-deployment.sh" || {
        log_error "Deployment verification failed"
        exit 1
    }
else
    log_warn "Verification script not found, performing basic checks..."
    
    # Basic health check
    if command -v curl &> /dev/null; then
        for i in {1..30}; do
            if curl -f -s "$STAGING_URL/api/health" > /dev/null; then
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

log_section "Running Smoke Tests"

# Run smoke tests
if [ -f "$PROJECT_ROOT/tests/e2e/smoke.spec.ts" ] || [ -f "$PROJECT_ROOT/tests/e2e/auth-flow.spec.ts" ]; then
    log_info "Running smoke tests..."
    export BASE_URL="$STAGING_URL"
    
    # Run critical smoke tests
    if command -v npx &> /dev/null; then
        npx playwright test tests/e2e/auth-flow.spec.ts --grep "smoke" || {
            log_warn "Some smoke tests failed, but continuing..."
        }
    else
        log_warn "Playwright not available, skipping smoke tests"
    fi
else
    log_warn "Smoke test files not found, skipping..."
fi

log_section "Monitoring Verification"

# Check if monitoring is running
if [ -f "$SCRIPT_DIR/verify-monitoring.sh" ]; then
    log_info "Verifying monitoring infrastructure..."
    "$SCRIPT_DIR/verify-monitoring.sh" || {
        log_warn "Monitoring verification failed, but deployment succeeded"
    }
else
    log_warn "Monitoring verification script not found, skipping..."
fi

log_section "Staging Deployment Complete"

log_info "✅ Staging deployment successful!"
log_info ""
log_info "Staging URL: $STAGING_URL"
log_info ""
log_info "Next steps:"
log_info "  1. Verify application: $STAGING_URL"
log_info "  2. Check monitoring: http://localhost:3001 (Grafana)"
log_info "  3. Review logs: docker-compose logs -f lumines-web"
log_info "  4. Run full E2E tests: npm run test:e2e"
log_info ""
log_info "To rollback:"
log_info "  git checkout <previous-commit>"
log_info "  ./scripts/deploy-staging.sh"

