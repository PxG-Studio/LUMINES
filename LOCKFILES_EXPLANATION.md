# Multiple Lockfiles Explanation

## Current State

This project has two `package-lock.json` files:
1. Root `/package-lock.json` - For the SLATE application (Vite + React)
2. `/spark/package-lock.json` - For the SPARK application (Next.js)

## Why Two Lockfiles?

This is **intentional and correct** because:

1. **Separate Applications**: SLATE and SPARK are separate applications with different dependencies
   - SLATE: Vite-based React app with its own dependency tree
   - SPARK: Next.js app with its own dependency tree

2. **Independent Versioning**: Each application can have different versions of shared dependencies
   - Example: Both use React, but may need different versions
   - Example: Different build tools (Vite vs Next.js)

3. **Deployment Isolation**: Each application can be deployed independently
   - SLATE can be built/deployed separately from SPARK
   - Dependencies don't interfere with each other

## Best Practices

This follows npm best practices:
- Each application/package should have its own `package-lock.json`
- Lockfiles ensure reproducible builds per application
- Prevents dependency conflicts between applications

## When to Consolidate

Only consolidate if:
- Applications are merged into a monorepo with shared dependencies
- Using a monorepo tool like pnpm workspaces or npm workspaces
- Both applications share the exact same dependency versions

## Current Recommendation

**Keep both lockfiles** - This is the correct setup for separate applications.

## Git Configuration

Both lockfiles should be committed to git:
```gitignore
# Do NOT ignore package-lock.json files
# They ensure reproducible builds
```

## Build Commands

When building/deploying:
- **SLATE**: `cd . && npm ci && npm run build`
- **SPARK**: `cd spark && npm ci && npm run build`

## Future Consideration

If moving to a monorepo structure:
- Consider using pnpm workspaces or npm workspaces
- Use a single lockfile at the root
- Configure workspace dependencies

