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

Note: Error pages are generated dynamically at runtime due to Next.js 14.2.0 styled-jsx limitation. This is non-blocking and error pages work correctly at runtime.

## Dependencies

- `clsx` - Class name utility
- `tailwind-merge` - Tailwind class merging
- `@codesandbox/sandpack-react` - Code execution environment

