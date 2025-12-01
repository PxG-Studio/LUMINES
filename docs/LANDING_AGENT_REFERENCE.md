# Referencing the Landing Page from External Agents

Here’s an agent-facing prompt you can drop into Storybook/Playwright/MCP tasks so they always target the real landing surface.

---

The production marketing experience lives entirely inside `apps/lumenforge-landing` (Vite + React). Any Storybook story, Playwright spec, or MCP “agent” must reference this package so screenshots and QA runs stay true to production.

## Runtime Surface

1. From the repo root run `cd apps/lumenforge-landing && pnpm dev` (or `npm run dev`).  
2. Use `http://localhost:3000/` for snapshots, Playwright tests, or MCP previews. This Vite bundle is the source of truth.  
3. For meta/SEO/head tags, fonts, and CSP, consult `apps/lumenforge-landing/index.html`. It defines the `<head>` surface you should mirror if your tool needs its own document shell.

## Module Imports

- Treat `apps/lumenforge-landing/src` as the module root. Key entry points:
  - `src/App.tsx` – assembles the entire landing page.
  - `src/components/**` – hero, CTA, cards, accessibility primitives.
  - `src/hooks/**`, `src/utils/**`, `src/data/**` – shared logic, translations, analytics helpers.

Storybook stories or other agents should import directly from these modules rather than duplicating code.

## Configuration & Tooling

- Tailwind, PostCSS, and TypeScript config for this package live alongside it:
  - `apps/lumenforge-landing/tailwind.config.js`
  - `apps/lumenforge-landing/postcss.config.js`
  - `apps/lumenforge-landing/tsconfig.json`

Re-use them in Storybook or other toolchains so class names, aliases, and TS paths match the app. Vite configuration is in `vite.config.ts` if you need the same path aliases.

## Data & Localization

- Shared content lives in `src/utils/content.ts`, translations in `src/data/translations.ts` + `src/utils/i18n.ts`.
- Component-specific copy (feature text, CTA labels, etc.) is sourced from `src/components` or those utilities—import from there instead of hard coding strings so updates stay centralized.

## Summary Checklist

- ✅ Run `pnpm dev` inside `apps/lumenforge-landing` and point tools at `http://localhost:3000/`.  
- ✅ Import components/utilities from `apps/lumenforge-landing/src/**`.  
- ✅ Mirror metadata/fonts/CSP from `apps/lumenforge-landing/index.html` when needed.  
- ✅ Reuse the package’s Tailwind/PostCSS/TS configs for consistent theming and aliases.  
- ✅ Pull copy/theme tokens from the same modules the page uses.

Following these instructions ensures any external agent (Storybook, Playwright, MCP) renders and verifies the exact Lumenforge.io landing experience.

