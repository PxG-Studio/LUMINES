/*
  Grafana Dashboard Queries for SPARK Telemetry

  Use these in Grafana with PostgreSQL data source (192.168.86.28 replica)
*/

-- Preview success rate (last 1h)
SELECT
  COUNT(*) FILTER (WHERE type = 'preview.completed')::float /
  NULLIF(COUNT(*) FILTER (WHERE type IN ('preview.started', 'preview.completed', 'preview.failed')), 0) * 100 AS success_rate
FROM spark_events
WHERE ts >= NOW() - INTERVAL '1 hour'
  AND type LIKE 'preview.%';

-- P95 latency for generate_unity_script (last 1h)
WITH latencies AS (
  SELECT
    session_id,
    EXTRACT(EPOCH FROM (MAX(ts) FILTER (WHERE type = 'generate_unity_script.completed') -
                        MIN(ts) FILTER (WHERE type = 'generate_unity_script.started'))) * 1000 AS ms
  FROM spark_events
  WHERE ts >= NOW() - INTERVAL '1 hour'
    AND type IN ('generate_unity_script.started', 'generate_unity_script.completed')
  GROUP BY session_id
)
SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ms) AS p95_ms
FROM latencies
WHERE ms IS NOT NULL;

-- Error rate by tool (last 1h)
SELECT
  CASE
    WHEN type LIKE 'generate_unity_script.%' THEN 'unity_script'
    WHEN type LIKE 'preview.%' THEN 'preview'
    WHEN type LIKE 'build.%' THEN 'build'
    WHEN type LIKE 'ocr.%' THEN 'ocr'
    WHEN type LIKE 'asr.%' THEN 'asr'
    ELSE 'other'
  END AS tool,
  COUNT(*) FILTER (WHERE type LIKE '%.failed') AS errors,
  COUNT(*) FILTER (WHERE type LIKE '%.completed') AS success
FROM spark_events
WHERE ts >= NOW() - INTERVAL '1 hour'
GROUP BY tool;

-- Queue depth over time (5-minute windows)
SELECT
  DATE_TRUNC('minute', ts) AS minute,
  COUNT(*) FILTER (WHERE type LIKE '%.started') AS started,
  COUNT(*) FILTER (WHERE type LIKE '%.completed' OR type LIKE '%.failed') AS finished,
  COUNT(*) FILTER (WHERE type LIKE '%.started') - COUNT(*) FILTER (WHERE type LIKE '%.completed' OR type LIKE '%.failed') AS in_flight
FROM spark_events
WHERE ts >= NOW() - INTERVAL '1 hour'
GROUP BY minute
ORDER BY minute DESC;

-- Top 10 slowest sessions (last 24h)
WITH session_durations AS (
  SELECT
    session_id,
    MIN(ts) AS started,
    MAX(ts) AS ended,
    EXTRACT(EPOCH FROM (MAX(ts) - MIN(ts))) AS duration_sec
  FROM spark_events
  WHERE ts >= NOW() - INTERVAL '24 hours'
  GROUP BY session_id
)
SELECT
  session_id,
  duration_sec,
  started,
  ended
FROM session_durations
ORDER BY duration_sec DESC
LIMIT 10;

-- Function call success rate by name (last 1h)
SELECT
  name,
  COUNT(*) FILTER (WHERE status = 'success') AS success,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed,
  ROUND(COUNT(*) FILTER (WHERE status = 'success')::numeric / NULLIF(COUNT(*), 0) * 100, 2) AS success_rate,
  ROUND(AVG(duration_ms), 2) AS avg_duration_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) AS p95_duration_ms
FROM spark_function_calls
WHERE ts >= NOW() - INTERVAL '1 hour'
GROUP BY name
ORDER BY COUNT(*) DESC;

-- Token usage and cost (last 24h)
SELECT
  model,
  SUM(tokens_prompt) AS total_prompt_tokens,
  SUM(tokens_completion) AS total_completion_tokens,
  SUM(tokens_prompt + tokens_completion) AS total_tokens,
  ROUND(SUM(cost_estimate)::numeric, 4) AS total_cost
FROM spark_usage
WHERE ts >= NOW() - INTERVAL '24 hours'
GROUP BY model
ORDER BY total_cost DESC;

-- Active sessions (currently running)
SELECT
  s.session_id,
  s.user_id,
  s.model,
  s.mode,
  s.started_at,
  NOW() - s.started_at AS duration,
  COUNT(DISTINCT e.type) AS event_count
FROM spark_sessions s
LEFT JOIN spark_events e ON e.session_id = s.session_id
WHERE s.ended_at IS NULL
GROUP BY s.session_id, s.user_id, s.model, s.mode, s.started_at
ORDER BY s.started_at DESC;

-- Build job status summary
SELECT
  build_target,
  status,
  COUNT(*) AS count,
  ROUND(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))), 2) AS avg_duration_sec
FROM spark_build_jobs
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY build_target, status
ORDER BY build_target, status;
