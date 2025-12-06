#!/bin/bash
# Production Environment Setup Script
# Configures production environment variables and verifies connections

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
echo "║  Production Environment Setup                               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env.production exists
if [ -f ".env.production" ]; then
    log_warn ".env.production already exists"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Using existing .env.production"
        exit 0
    fi
fi

# Create .env.production from .env.example
log_section "Creating Production Environment File"

if [ -f ".env.example" ]; then
    cp .env.example .env.production
    log_info "Created .env.production from .env.example"
else
    log_error ".env.example not found"
    exit 1
fi

# Prompt for required variables
log_section "Configuring Required Variables"

# Database URL
if [ -z "$DATABASE_URL" ]; then
    read -p "Database URL (postgresql://user:password@host:port/database): " DATABASE_URL
    echo "DATABASE_URL=$DATABASE_URL" >> .env.production
else
    echo "DATABASE_URL=$DATABASE_URL" >> .env.production
fi

# Redis URL
if [ -z "$REDIS_URL" ]; then
    read -p "Redis URL (redis://host:port/db): " REDIS_URL
    echo "REDIS_URL=$REDIS_URL" >> .env.production
else
    echo "REDIS_URL=$REDIS_URL" >> .env.production
fi

# NATS URL
if [ -z "$NATS_URL" ]; then
    read -p "NATS URL (nats://host:port): " NATS_URL
    echo "NATS_URL=$NATS_URL" >> .env.production
else
    echo "NATS_URL=$NATS_URL" >> .env.production
fi

# JWT Secret
if [ -z "$NOCTURNA_JWT_SECRET" ]; then
    log_warn "Generating secure JWT secret..."
    JWT_SECRET=$(openssl rand -base64 32)
    echo "NOCTURNA_JWT_SECRET=$JWT_SECRET" >> .env.production
    log_info "JWT secret generated and saved"
else
    echo "NOCTURNA_JWT_SECRET=$NOCTURNA_JWT_SECRET" >> .env.production
fi

# Set NODE_ENV
echo "NODE_ENV=production" >> .env.production

# Verify connections
log_section "Verifying Connections"

# Test database
if command -v psql &> /dev/null; then
    log_info "Testing database connection..."
    if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        log_info "✅ Database connection successful"
    else
        log_error "❌ Database connection failed"
        exit 1
    fi
else
    log_warn "psql not found, skipping database test"
fi

# Test Redis
if command -v redis-cli &> /dev/null; then
    log_info "Testing Redis connection..."
    if redis-cli -u "$REDIS_URL" PING > /dev/null 2>&1; then
        log_info "✅ Redis connection successful"
    else
        log_error "❌ Redis connection failed"
        exit 1
    fi
else
    log_warn "redis-cli not found, skipping Redis test"
fi

# Summary
log_section "Setup Complete"

log_info "Production environment file created: .env.production"
log_info ""
log_warn "⚠️  IMPORTANT: Review .env.production and ensure all values are correct"
log_warn "⚠️  IMPORTANT: Never commit .env.production to version control"
log_info ""
log_info "Next steps:"
log_info "  1. Review .env.production"
log_info "  2. Run: ./scripts/final-validation.sh"
log_info "  3. Deploy: ./scripts/deploy-production.sh staging"

