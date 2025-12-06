#!/bin/bash
# Performance Benchmark Script
# Comprehensive performance testing

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
API_BASE="${BASE_URL}/api"
ITERATIONS="${ITERATIONS:-100}"
CONCURRENT="${CONCURRENT:-10}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

cd "$PROJECT_ROOT"

echo "⚡ Starting performance benchmarks..."

# Check if curl is available
if ! command -v curl &> /dev/null; then
    log_error "curl not found, please install curl"
    exit 1
fi

# Results storage
RESULTS_DIR="$PROJECT_ROOT/tests/performance/results"
mkdir -p "$RESULTS_DIR"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_FILE="$RESULTS_DIR/benchmark_$TIMESTAMP.json"

# Initialize results
echo "{" > "$RESULTS_FILE"
echo "  \"timestamp\": \"$(date -Iseconds)\"," >> "$RESULTS_FILE"
echo "  \"base_url\": \"$BASE_URL\"," >> "$RESULTS_FILE"
echo "  \"iterations\": $ITERATIONS," >> "$RESULTS_FILE"
echo "  \"concurrent\": $CONCURRENT," >> "$RESULTS_FILE"
echo "  \"tests\": {" >> "$RESULTS_FILE"

# Test function
run_test() {
    local endpoint=$1
    local name=$2
    local expected_status=${3:-200}
    
    log_info "Testing $name ($endpoint)..."
    
    local times=()
    local errors=0
    local total_time=0
    
    for i in $(seq 1 $ITERATIONS); do
        start_time=$(date +%s%N)
        response=$(curl -s -w "\n%{http_code}" "$endpoint" 2>&1)
        end_time=$(date +%s%N)
        
        http_code=$(echo "$response" | tail -n1)
        body=$(echo "$response" | head -n-1)
        
        duration=$(( (end_time - start_time) / 1000000 )) # Convert to milliseconds
        times+=($duration)
        total_time=$((total_time + duration))
        
        if [ "$http_code" != "$expected_status" ]; then
            errors=$((errors + 1))
        fi
    done
    
    # Calculate statistics
    IFS=$'\n' sorted=($(sort -n <<<"${times[*]}"))
    unset IFS
    
    local count=${#times[@]}
    local p50_idx=$((count * 50 / 100))
    local p95_idx=$((count * 95 / 100))
    local p99_idx=$((count * 99 / 100))
    
    local min=${sorted[0]}
    local max=${sorted[$((count - 1))]}
    local avg=$((total_time / count))
    local p50=${sorted[$p50_idx]}
    local p95=${sorted[$p95_idx]}
    local p99=${sorted[$p99_idx]}
    
    # Output results
    echo "    \"$name\": {" >> "$RESULTS_FILE"
    echo "      \"endpoint\": \"$endpoint\"," >> "$RESULTS_FILE"
    echo "      \"iterations\": $count," >> "$RESULTS_FILE"
    echo "      \"errors\": $errors," >> "$RESULTS_FILE"
    echo "      \"error_rate\": $(awk "BEGIN {printf \"%.2f\", $errors/$count*100}")," >> "$RESULTS_FILE"
    echo "      \"min_ms\": $min," >> "$RESULTS_FILE"
    echo "      \"max_ms\": $max," >> "$RESULTS_FILE"
    echo "      \"avg_ms\": $avg," >> "$RESULTS_FILE"
    echo "      \"p50_ms\": $p50," >> "$RESULTS_FILE"
    echo "      \"p95_ms\": $p95," >> "$RESULTS_FILE"
    echo "      \"p99_ms\": $p99" >> "$RESULTS_FILE"
    echo "    }," >> "$RESULTS_FILE"
    
    log_info "  ✅ $name: avg=${avg}ms, p95=${p95}ms, p99=${p99}ms, errors=$errors"
}

# Run benchmarks
log_info "Running benchmarks with $ITERATIONS iterations..."

# Test 1: Health check
run_test "$API_BASE/health" "health_check"

# Test 2: Templates endpoint
run_test "$API_BASE/templates?limit=10" "templates_list"

# Test 3: Tokens endpoint (cached)
run_test "$API_BASE/tokens?category=colors" "tokens_cached"

# Test 4: Metrics endpoint
run_test "$API_BASE/metrics" "metrics"

# Close JSON
sed -i '$ s/,$//' "$RESULTS_FILE"
echo "  }" >> "$RESULTS_FILE"
echo "}" >> "$RESULTS_FILE"

# Summary
log_info ""
log_info "Benchmark summary:"
log_info "  Results saved to: $RESULTS_FILE"
log_info "  Total iterations: $ITERATIONS"
log_info "  Base URL: $BASE_URL"
log_info ""
log_info "✅ Performance benchmarks complete!"

