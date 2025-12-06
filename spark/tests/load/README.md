# k6 Load Testing

Load testing infrastructure for SPARK using k6.

## Setup

1. Install k6:
   ```bash
   # Windows (using Chocolatey)
   choco install k6
   
   # macOS (using Homebrew)
   brew install k6
   
   # Linux
   sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update
   sudo apt-get install k6
   ```

2. Set environment variables:
   ```bash
   export BASE_URL=http://localhost:3000
   ```

## Test Types

### Smoke Test (`k6-smoke.js`)
- **Purpose**: Baseline performance verification
- **Load**: 5 concurrent users
- **Duration**: ~4 minutes
- **Run**: `k6 run tests/load/k6-smoke.js`

### Stress Test (`k6-stress.js`)
- **Purpose**: Find system limits
- **Load**: 10 → 20 → 30 users
- **Duration**: ~10 minutes
- **Run**: `k6 run tests/load/k6-stress.js`

### Soak Test (`k6-soak.js`)
- **Purpose**: Long-term stability (24h)
- **Load**: 10 concurrent users
- **Duration**: 2+ hours (adjust for full 24h)
- **Run**: `k6 run --duration 2h tests/load/k6-soak.js`

### Budget Test (`k6-budget.js`)
- **Purpose**: Validate performance budgets
- **Load**: 5 concurrent users
- **Duration**: 5 minutes
- **Run**: `k6 run tests/load/k6-budget.js`

## Performance Budgets

- **Generation Time**: p95 < 5 seconds
- **Health Check**: p95 < 500ms
- **Error Rate**: < 1%

## Running Tests

```bash
# Smoke test
k6 run spark/tests/load/k6-smoke.js

# Stress test
k6 run spark/tests/load/k6-stress.js

# Soak test (2 hours)
k6 run --duration 2h spark/tests/load/k6-soak.js

# Budget test
k6 run spark/tests/load/k6-budget.js

# With custom base URL
BASE_URL=https://spark.example.com k6 run spark/tests/load/k6-smoke.js
```

## Results

Test results are output to console. Budget test also generates `performance-budget.json`.

## CI/CD Integration

Add to CI pipeline:
```yaml
- name: Run k6 smoke test
  run: k6 run spark/tests/load/k6-smoke.js
```

