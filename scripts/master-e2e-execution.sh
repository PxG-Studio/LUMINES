#!/bin/bash
# Master E2E Execution Script
# Comprehensive end-to-end testing and deployment automation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORT_DIR="/tmp/e2e-reports-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$REPORT_DIR"

print_header() {
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║$1${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_phase() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}PHASE: $1${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════════════════${NC}"
}

# Phase 1: Prerequisites Verification
print_phase "1. Prerequisites Verification"
print_header "  WISSIL Infrastructure E2E - Master Execution"

echo "Running systematic verification..."
bash "$SCRIPT_DIR/systematic-verification.sh" 2>&1 | tee "$REPORT_DIR/01-prerequisites.log"

# Phase 2: Telemetry Stack Deployment
print_phase "2. Telemetry Stack Deployment"

read -p "Deploy telemetry stack? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deploying telemetry stack..."
    bash "$SCRIPT_DIR/deploy-telemetry-stack.sh" 2>&1 | tee "$REPORT_DIR/02-deployment.log"

    echo "Waiting for deployments to stabilize..."
    sleep 30
else
    echo "Skipping deployment phase"
fi

# Phase 3: Health Checks
print_phase "3. Health Checks"

echo "Running comprehensive health checks..."
bash "$SCRIPT_DIR/health-check-telemetry.sh" 2>&1 | tee "$REPORT_DIR/03-health-check.log"

# Phase 4: Service Endpoint Testing
print_phase "4. Service Endpoint Testing"

echo "Testing service endpoints..."
bash "$SCRIPT_DIR/test-service-endpoints.sh" 2>&1 | tee "$REPORT_DIR/04-endpoints.log"

# Phase 5: Integration Testing
print_phase "5. Integration Testing"

echo "Running integration tests..."
bash "$SCRIPT_DIR/integration-test-pipelines.sh" 2>&1 | tee "$REPORT_DIR/05-integration.log"

# Phase 6: E2E Testing
print_phase "6. End-to-End Testing"

echo "Running comprehensive E2E tests..."
bash "$SCRIPT_DIR/e2e-test-luminera-complete.sh" 2>&1 | tee "$REPORT_DIR/06-e2e.log"

# Phase 7: Generate Final Report
print_phase "7. Final Report Generation"

print_header "  Generating Comprehensive Report"

FINAL_REPORT="$REPORT_DIR/FINAL_E2E_REPORT.md"
cat > "$FINAL_REPORT" << EOF
# Final E2E Execution Report
## WISSIL Infrastructure - Complete Testing & Deployment

**Date:** $(date)
**Execution ID:** $(basename "$REPORT_DIR")
**Script:** master-e2e-execution.sh

---

## Execution Summary

### Phase 1: Prerequisites Verification
\`\`\`
$(tail -20 "$REPORT_DIR/01-prerequisites.log" 2>/dev/null || echo "Log not available")
\`\`\`

### Phase 2: Telemetry Stack Deployment
\`\`\`
$(tail -20 "$REPORT_DIR/02-deployment.log" 2>/dev/null || echo "Log not available")
\`\`\`

### Phase 3: Health Checks
\`\`\`
$(tail -20 "$REPORT_DIR/03-health-check.log" 2>/dev/null || echo "Log not available")
\`\`\`

### Phase 4: Service Endpoint Testing
\`\`\`
$(tail -20 "$REPORT_DIR/04-endpoints.log" 2>/dev/null || echo "Log not available")
\`\`\`

### Phase 5: Integration Testing
\`\`\`
$(tail -20 "$REPORT_DIR/05-integration.log" 2>/dev/null || echo "Log not available")
\`\`\`

### Phase 6: End-to-End Testing
\`\`\`
$(tail -20 "$REPORT_DIR/06-e2e.log" 2>/dev/null || echo "Log not available")
\`\`\`

---

## Detailed Logs

All detailed logs are available in: \`$REPORT_DIR\`

- \`01-prerequisites.log\` - Prerequisites verification
- \`02-deployment.log\` - Telemetry stack deployment
- \`03-health-check.log\` - Health check results
- \`04-endpoints.log\` - Service endpoint tests
- \`05-integration.log\` - Integration test results
- \`06-e2e.log\` - End-to-end test results

---

## Next Steps

1. Review all logs in: \`$REPORT_DIR\`
2. Address any failures identified
3. Re-run specific phases as needed
4. Update documentation based on findings

EOF

echo ""
print_header "  Execution Complete"
echo ""
echo -e "${GREEN}✓ All phases completed${NC}"
echo ""
echo "Report directory: $REPORT_DIR"
echo "Final report: $FINAL_REPORT"
echo ""
echo "To view the final report:"
echo "  cat $FINAL_REPORT"
echo ""
echo "To view all logs:"
echo "  ls -la $REPORT_DIR"
