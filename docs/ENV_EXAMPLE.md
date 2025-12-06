# Environment Variables Example

**Purpose:** Template for required environment variables

**Usage:** Copy values to `.env.local` for development or set in Kubernetes Secrets for production

See the `.env.example` content in the codebase (blocked from git for security).

## Required Variables

### Database
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`
- Or use `DATABASE_URL` connection string

### Redis
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` (optional), `REDIS_DB`
- Or use `REDIS_URL` connection string

### NATS
- `NATS_HOST`, `NATS_PORT`, `NATS_CLUSTER`
- Or use `NATS_URL` connection string

### Kubernetes
- `K8S_NAMESPACE`, `K8S_CONTROL_NODE_IP`, `K8S_COMPUTE_NODE_IP`

### Service Ports
- `PORT_LANDING`, `PORT_SLATE`, `PORT_IGNITION`, `PORT_SPARK`, `PORT_IGNIS`, `PORT_WAYPOINT`

### Authentication
- `NOCTURNA_JWT_SECRET`, `NOCTURNA_JWT_AUDIENCE`

## Validation

Environment variables are validated on application startup using `src/lib/config/environment.ts`.

If validation fails, the application will exit with a helpful error message listing missing or invalid variables.

