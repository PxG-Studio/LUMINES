# Environment Setup Guide

## Spark App Environment Variables

Create `apps/spark/.env.local` with the following variables:

```bash
# Database Configuration (PostgreSQL)
# Used for storing generation history and user preferences
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=spark
VITE_DB_USER=spark_user
VITE_DB_PASSWORD=your_password_here

# AI Service API Keys
# Required for code generation functionality
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# NATS WebSocket URL (Optional)
# Used for real-time Unity preview updates
# If not set, preview features will be disabled (OK for MVP)
NEXT_PUBLIC_NATS_WS_URL=ws://localhost:4222

# Optional: Database Replica (for read-only queries)
VITE_DB_REPLICA_HOST=localhost
VITE_DB_REPLICA_PORT=5432
```

## Other Apps

- **Slate**: No special environment variables required
- **Lumen**: No special environment variables required
- **Ignis**: No special environment variables required
- **Waypoint**: No special environment variables required

## Setup Instructions

1. Copy the environment variables above
2. Create `.env.local` file in `apps/spark/` directory
3. Fill in your actual values
4. Restart the dev server if running

## Notes

- `.env.local` files are gitignored and should not be committed
- Use `.env.example` as a template (if created)
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Environment variables prefixed with `VITE_` are used by Vite-based tooling
