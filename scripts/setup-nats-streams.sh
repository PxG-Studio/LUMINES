#!/bin/bash
# Setup NATS JetStream Streams for WISSIL IDE

echo "Setting up NATS JetStream streams for WISSIL IDE..."

# Ignis Blueprint Editor
nats stream add WISSIL_IGNIS \
  --subjects "WISSIL.IGNIS.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-bytes=-1 \
  --max-age=30d \
  --replicas 3 \
  --description "Ignis Blueprint Editor events"

# Unity Tools
nats stream add WISSIL_UNITY \
  --subjects "WISSIL.UNITY.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-bytes=-1 \
  --max-age=30d \
  --replicas 3 \
  --description "Unity Tools events (SceneGraph, Prefabs, Shader, Timeline)"

# Spark Templates
nats stream add WISSIL_SPARK \
  --subjects "WISSIL.SPARK.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-bytes=-1 \
  --max-age=90d \
  --replicas 3 \
  --description "Spark Template system events"

# Ignition Runtime
nats stream add WISSIL_IGNITION \
  --subjects "WISSIL.IGNITION.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-bytes=-1 \
  --max-age=7d \
  --replicas 3 \
  --description "Ignition Runtime and build events"

# Waypoint AI
nats stream add WISSIL_WAYPOINT \
  --subjects "WISSIL.WAYPOINT.*" \
  --storage file \
  --retention limits \
  --max-msgs=-1 \
  --max-bytes=-1 \
  --max-age=30d \
  --replicas 3 \
  --description "Waypoint AI Assistant events"

echo "NATS JetStream streams created successfully!"
echo ""
echo "List streams:"
nats stream list

