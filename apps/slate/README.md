# Slate App

Next.js app for Slate IDE - Browser-based Unity development environment.

## Status

✅ **Production Ready** - Core functionality builds successfully. Error pages work at runtime.

## Development

```bash
# From root
npm run dev:slate

# Or from app directory
cd apps/slate
npm run dev
```

## Build

```bash
npm run build
```

Error and 404 pages now prerender during `next build`, so static deployments can include the full error surface without fallbacks.

## Dependencies

- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging
- `@codesandbox/sandpack-react` - Code execution environment

