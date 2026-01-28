# GitLab Performance Optimization for Raspberry Pi 4

## Optimizations Applied

### 1. GitLab Configuration (docker-compose.yml)

**Puma (Web Server):**
- Reduced workers: `2 → 1` (less CPU usage)
- Threads: `2-4` (balanced for Pi 4)
- Sidekiq concurrency: `5 → 3` (fewer background jobs)

**PostgreSQL:**
- `shared_buffers`: 128MB (reduced from default)
- `max_connections`: 20 (reduced from 200)
- `work_mem`: 8MB (reduced memory per query)
- `effective_cache_size`: 512MB (optimized for Pi)

**Redis:**
- `maxmemory`: 256MB (prevents memory bloat)
- `maxmemory_policy`: allkeys-lru (efficient eviction)

**Gitaly (Git Storage):**
- Reduced concurrency limits
- Cgroups configured for resource control

**Disabled Services:**
- Prometheus monitoring (internal)
- Grafana (internal)
- All exporters (node, redis, postgres)
- Usage ping
- Audit events
- Rack attack (for local network)

**Caching:**
- Memory store enabled (faster than disk)

### 2. System Optimizations

**Swap:**
- `vm.swappiness=10` (reduces swap usage, keeps more RAM free)

**I/O Scheduler:**
- Should use `mq-deadline` or `none` for SSDs (check with: `cat /sys/block/sda/queue/scheduler`)

### 3. Container Resource Limits

**GitLab:**
- CPU limit: 3.0 cores (out of 4)
- Memory limit: 4GB (if cgroups supported)

**Prometheus/Grafana:**
- CPU: 0.5 cores each
- Memory: 512MB each

## Expected Performance Improvements

- **Faster page loads**: Reduced workers = less context switching
- **Lower CPU usage**: From ~83% to ~40-50% typical
- **Better memory management**: Redis limits prevent bloat
- **Faster database queries**: Optimized PostgreSQL settings
- **Reduced background load**: Fewer exporters and services

## Monitoring

Check performance after restart:

```bash
# CPU usage
docker stats --no-stream gitlab

# GitLab health
docker-compose exec gitlab gitlab-rake gitlab:check

# Response time (from your Mac)
time curl -s -o /dev/null http://192.168.86.29/
```

## Rollback

If performance is worse, restore backup:

```bash
cd ~/gitlab-production
cp docker-compose.yml.backup docker-compose.yml
docker-compose down gitlab
docker-compose up -d gitlab
```

## Notes

- GitLab will take **5-10 minutes** to fully restart after config changes
- First page load after restart may be slow (Rails boot)
- Subsequent loads should be faster
- If still slow, consider reducing `puma["worker_processes"]` to 1 (already done) or disabling Container Registry if not needed
