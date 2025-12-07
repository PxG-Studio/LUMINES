#!/bin/bash
# Team Handoff Script
# Provides team handoff information and access details

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

log_section() {
    echo -e "\n${BLUE}════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"
}

cd "$PROJECT_ROOT"

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  Team Handoff - Production Deployment                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PRODUCTION_URL="${PRODUCTION_URL:-https://lumenforge.io}"

log_section "Production Access Information"

log_info "Production URL: $PRODUCTION_URL"
log_info "Health Endpoint: $PRODUCTION_URL/api/health"
log_info "Metrics Endpoint: $PRODUCTION_URL/api/metrics"
log_info ""

log_section "Monitoring Dashboards"

log_info "Grafana: http://localhost:3001 (admin/admin)"
log_info "  - Default password: admin"
log_info "  - Change password on first login"
log_info ""
log_info "Prometheus: http://localhost:9090"
log_info "  - Query interface"
log_info "  - Alert rules"
log_info ""
log_info "Alertmanager: http://localhost:9093"
log_info "  - Alert management"
log_info "  - Notification channels"
log_info ""

log_section "Key Documentation"

log_info "Production Runbook:"
log_info "  docs/PRODUCTION_RUNBOOK.md"
log_info ""
log_info "Disaster Recovery:"
log_info "  docs/DISASTER_RECOVERY.md"
log_info ""
log_info "Security Hardening:"
log_info "  docs/SECURITY_HARDENING.md"
log_info ""
log_info "Monitoring Setup:"
log_info "  docs/MONITORING_SETUP.md"
log_info ""
log_info "Deployment Guides:"
log_info "  docs/PRODUCTION_DEPLOYMENT_EXECUTION.md"
log_info "  docs/STAGING_DEPLOYMENT.md"
log_info ""

log_section "Critical Scripts"

log_info "Deployment:"
log_info "  ./scripts/deploy-production.sh production"
log_info ""
log_info "Verification:"
log_info "  ./scripts/verify-deployment.sh"
log_info "  ./scripts/post-deployment-verification.sh"
log_info ""
log_info "Monitoring:"
log_info "  ./scripts/monitor-production.sh"
log_info "  ./scripts/verify-monitoring.sh"
log_info ""
log_info "Backup & DR:"
log_info "  ./scripts/backup-postgres.sh"
log_info "  ./scripts/test-failover.sh"
log_info "  ./scripts/test-backup-restore.sh"
log_info ""

log_section "On-Call Rotation"

log_warn "⚠️  IMPORTANT: Set up on-call rotation"
log_info ""
log_info "Update contact information in:"
log_info "  docs/PRODUCTION_RUNBOOK.md"
log_info "  docs/DISASTER_RECOVERY.md"
log_info ""

log_section "Quick Reference Commands"

log_info "Check health:"
log_info "  curl $PRODUCTION_URL/api/health"
log_info ""
log_info "Check database:"
log_info "  curl $PRODUCTION_URL/api/health/db"
log_info ""
log_info "View metrics:"
log_info "  curl $PRODUCTION_URL/api/metrics"
log_info ""
log_info "View logs (Docker):"
log_info "  docker-compose logs -f lumines-web"
log_info ""
log_info "View logs (Kubernetes):"
log_info "  kubectl logs -f deployment/lumines-web -n lumines"
log_info ""

log_section "Team Handoff Checklist"

log_info "Complete the following:"
log_info "  [ ] All team members have access credentials"
log_info "  [ ] Monitoring dashboards reviewed"
log_info "  [ ] Runbooks reviewed and understood"
log_info "  [ ] On-call rotation established"
log_info "  [ ] Contact information updated"
log_info "  [ ] Incident response plan reviewed"
log_info "  [ ] Rollback procedures understood"
log_info "  [ ] Backup procedures understood"
log_info "  [ ] DR procedures understood"
log_info ""

log_section "Support Resources"

log_info "For issues or questions:"
log_info "  - Review: docs/PRODUCTION_RUNBOOK.md"
log_info "  - Check: docs/DISASTER_RECOVERY.md"
log_info "  - Contact: DevOps team"
log_info ""

log_info "✅ Team handoff information provided"
log_info ""
log_warn "⚠️  Remember to:"
log_warn "  1. Update contact information in runbooks"
log_warn "  2. Set up on-call rotation"
log_warn "  3. Review and test all procedures"
log_warn "  4. Document any custom configurations"
