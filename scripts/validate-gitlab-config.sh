#!/usr/bin/env bash
# GitLab configuration validation script.
# Validates docker-compose.yml syntax and checks for common configuration errors.
# Run before starting GitLab to catch issues early.
#
# Usage:
#   bash scripts/validate-gitlab-config.sh [path/to/docker-compose.yml]
#   Or on server: ssh ncadmin@192.168.86.29 'bash -s' < scripts/validate-gitlab-config.sh

set -e

# Handle path - if no argument, use default relative to current directory or home
if [ -z "$1" ]; then
  # Try current directory first, then home
  if [ -f "docker-compose.yml" ]; then
    COMPOSE_FILE="docker-compose.yml"
  elif [ -f "$HOME/gitlab-production/docker-compose.yml" ]; then
    COMPOSE_FILE="$HOME/gitlab-production/docker-compose.yml"
  else
    COMPOSE_FILE="docker-compose.yml"  # Will fail with clear error
  fi
else
  COMPOSE_FILE="$1"
  # Expand ~ if present (works in local shell)
  if [[ "$COMPOSE_FILE" == ~* ]]; then
    COMPOSE_FILE="${COMPOSE_FILE/#\~/$HOME}"
  fi
fi
ERRORS=0

echo "Validating GitLab configuration: $COMPOSE_FILE"
echo ""

# Check if file exists
if [ ! -f "$COMPOSE_FILE" ]; then
  echo "❌ ERROR: Configuration file not found: $COMPOSE_FILE"
  exit 1
fi

# Validate docker-compose.yml syntax
echo "1. Checking docker-compose.yml syntax..."
if docker-compose -f "$COMPOSE_FILE" config > /dev/null 2>&1; then
  echo "   ✅ docker-compose.yml syntax is valid"
else
  echo "   ❌ docker-compose.yml syntax error:"
  docker-compose -f "$COMPOSE_FILE" config 2>&1 | head -10
  ERRORS=$((ERRORS + 1))
fi

# Check for known invalid config options
echo ""
echo "2. Checking for invalid GitLab Omnibus config options..."
INVALID_OPTS=(
  'grafana\["enable"\]'
  'prometheus_monitoring\["enable"\] = false'
)

for opt in "${INVALID_OPTS[@]}"; do
  if grep -q "$opt" "$COMPOSE_FILE" 2>/dev/null; then
    echo "   ❌ Found invalid config option: $opt"
    echo "      GitLab Omnibus does not support this option. Remove it."
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -eq 0 ]; then
  echo "   ✅ No invalid config options found"
fi

# Check for required settings
echo ""
echo "3. Checking for required configuration..."
REQUIRED_SETTINGS=(
  'external_url'
  'gitlab_rails\["gitlab_shell_ssh_port"\]'
)

for setting in "${REQUIRED_SETTINGS[@]}"; do
  if grep -q "$setting" "$COMPOSE_FILE" 2>/dev/null; then
    echo "   ✅ Found required setting: $setting"
  else
    echo "   ⚠️  Missing recommended setting: $setting"
  fi
done

# Summary
echo ""
if [ $ERRORS -eq 0 ]; then
  echo "✅ Configuration validation passed. Safe to start GitLab."
  exit 0
else
  echo "❌ Configuration validation failed with $ERRORS error(s)."
  echo "   Fix errors before starting GitLab."
  exit 1
fi
