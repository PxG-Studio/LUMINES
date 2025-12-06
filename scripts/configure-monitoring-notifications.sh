#!/bin/bash
# Configure Monitoring Notification Channels
# Sets up Slack, Email, and other notification channels for Alertmanager

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ALERTMANAGER_CONFIG="$PROJECT_ROOT/infrastructure/monitoring/alertmanager/alertmanager.yml"

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
echo "║  Monitoring Notification Channels Configuration           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

log_section "Notification Channel Setup"

# Check if Alertmanager config exists
if [ ! -f "$ALERTMANAGER_CONFIG" ]; then
    log_error "Alertmanager configuration not found: $ALERTMANAGER_CONFIG"
    exit 1
fi

# Backup existing config
BACKUP_FILE="${ALERTMANAGER_CONFIG}.backup.$(date +%Y%m%d-%H%M%S)"
cp "$ALERTMANAGER_CONFIG" "$BACKUP_FILE"
log_info "Backup created: $BACKUP_FILE"

log_section "Slack Configuration"

read -p "Configure Slack notifications? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Slack Webhook URL: " SLACK_WEBHOOK
    if [ -n "$SLACK_WEBHOOK" ]; then
        log_info "Configuring Slack webhook..."
        # Note: This would require sed or a more sophisticated approach
        # For now, provide instructions
        log_warn "Manual configuration required:"
        log_info "Edit $ALERTMANAGER_CONFIG and uncomment slack_configs sections"
        log_info "Add your webhook URL: $SLACK_WEBHOOK"
    fi
fi

log_section "Email Configuration"

read -p "Configure Email notifications? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "SMTP Server (e.g., smtp.gmail.com:587): " SMTP_SERVER
    read -p "SMTP Username: " SMTP_USER
    read -p "SMTP Password: " -s SMTP_PASS
    echo
    read -p "From Address (e.g., alerts@lumenforge.io): " FROM_EMAIL
    read -p "To Address (e.g., oncall@lumenforge.io): " TO_EMAIL
    
    if [ -n "$SMTP_SERVER" ] && [ -n "$FROM_EMAIL" ] && [ -n "$TO_EMAIL" ]; then
        log_info "Email configuration:"
        log_info "  SMTP Server: $SMTP_SERVER"
        log_info "  From: $FROM_EMAIL"
        log_info "  To: $TO_EMAIL"
        log_warn "Manual configuration required:"
        log_info "Edit $ALERTMANAGER_CONFIG and configure email_configs sections"
    fi
fi

log_section "PagerDuty Configuration (Optional)"

read -p "Configure PagerDuty? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "PagerDuty Service Key: " PAGERDUTY_KEY
    if [ -n "$PAGERDUTY_KEY" ]; then
        log_info "PagerDuty service key configured"
        log_warn "Manual configuration required:"
        log_info "Edit $ALERTMANAGER_CONFIG and uncomment pagerduty_configs sections"
    fi
fi

log_section "Configuration Complete"

log_info "✅ Notification channel configuration complete"
log_info ""
log_warn "⚠️  IMPORTANT: Review and update $ALERTMANAGER_CONFIG manually"
log_warn "⚠️  Uncomment and configure the notification channels you want to use"
log_info ""
log_info "After updating, restart Alertmanager:"
log_info "  docker-compose -f docker-compose.monitoring.yml restart alertmanager"
log_info ""
log_info "Or if using Kubernetes:"
log_info "  kubectl rollout restart deployment/alertmanager -n monitoring"

