#!/bin/bash
# Production Environment Validation Script
# Validates production environment before deployment

set -e

echo "🔍 Validating production environment..."

ERRORS=0
WARNINGS=0

# Check NODE_ENV
if [ "$NODE_ENV" != "production" ]; then
  echo "❌ ERROR: NODE_ENV must be 'production'"
  ERRORS=$((ERRORS + 1))
fi

# Check database configuration
if [ -z "$DATABASE_URL" ] && [ -z "$DATABASE_USER" ]; then
  echo "❌ ERROR: DATABASE_URL or DATABASE_USER must be set"
  ERRORS=$((ERRORS + 1))
fi

# Check JWT secret
if [ -z "$NOCTURNA_JWT_SECRET" ]; then
  echo "❌ ERROR: NOCTURNA_JWT_SECRET must be set"
  ERRORS=$((ERRORS + 1))
elif [ "$NOCTURNA_JWT_SECRET" == "your-jwt-secret-key-change-in-production" ]; then
  echo "❌ ERROR: NOCTURNA_JWT_SECRET must be changed from default"
  ERRORS=$((ERRORS + 1))
fi

# Warnings
if [ -z "$SENTRY_DSN" ]; then
  echo "⚠️  WARNING: SENTRY_DSN not set - error tracking disabled"
  WARNINGS=$((WARNINGS + 1))
fi

if [ -z "$CHROMATIC_PROJECT_TOKEN" ]; then
  echo "⚠️  WARNING: CHROMATIC_PROJECT_TOKEN not set"
  WARNINGS=$((WARNINGS + 1))
fi

if [ "$LOG_LEVEL" == "debug" ]; then
  echo "⚠️  WARNING: LOG_LEVEL is set to debug in production"
  WARNINGS=$((WARNINGS + 1))
fi

# Summary
echo ""
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "✅ Production environment validation passed"
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo "✅ Production environment validation passed with $WARNINGS warnings"
  exit 0
else
  echo "❌ Production environment validation failed with $ERRORS errors and $WARNINGS warnings"
  exit 1
fi

