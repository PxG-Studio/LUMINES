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

Note: Error pages are generated dynamically at runtime due to Next.js 14.2.0 styled-jsx limitation. This is non-blocking and error pages work correctly at runtime.

## Environment Variables

See `docs/DEPLOYMENT_GUIDE.md` for required environment variables (database, AI services, NATS).

