# Spark App

Next.js app for Spark UI - AI-Powered Unity C# Script Generator.

## Status

✅ **Production Ready** - Core functionality builds successfully. Error pages work at runtime.

## Development

```bash
# From root
npm run dev:spark

# Or from app directory
cd apps/spark
npm run dev
```

## Build

```bash
npm run build
```

Error and 404 pages now prerender cleanly during `next build`, so static deployments no longer need a runtime-only fallback.

## Environment Variables

See `docs/DEPLOYMENT_GUIDE.md` for required environment variables (database, AI services, NATS).

