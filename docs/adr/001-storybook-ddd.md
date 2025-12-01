# ADR 001: Storybook as Documentation-Driven Development (DDD) System

**Status:** Accepted  
**Date:** December 2024  
**Deciders:** WISSIL Engineering Team

---

## Context

WISSIL is a complex IDE system with 6 major subsystems (Slate, Ignis, Ignition, Spark, Waypoint, Unity Tools), each containing dozens of components. We need a single source of truth (SSOT) for documentation that:

1. Stays in sync with code changes
2. Provides interactive examples
3. Validates visual consistency
4. Scales with the team
5. Integrates with AI (LUNA) for auto-generation

## Decision

We will use **Storybook as our Documentation-Driven Development (DDD) system**, where:

- Every component must have a Storybook story
- Every component must have MDX documentation
- Documentation is validated in CI/CD
- Chromatic ensures visual consistency
- LUNA can auto-generate documentation
- Storybook serves as the developer portal

## Rationale

### Why Storybook?

1. **Component-First**: Storybook is built for component documentation
2. **Interactive**: Live examples and playgrounds
3. **Visual Validation**: Chromatic integration prevents regressions
4. **TypeScript Integration**: Auto-generates API docs from types
5. **MDX Support**: Rich documentation with code examples
6. **Industry Standard**: Used by Figma, Vercel, Shopify, Stripe

### Why DDD?

1. **Prevents Documentation Drift**: Docs must exist before merge
2. **Enforces Quality**: CI checks ensure coverage
3. **Scales with Team**: Clear ownership via CODEOWNERS
4. **AI Integration**: LUNA can generate and maintain docs
5. **Single Source of Truth**: All docs in one place

### Why Chromatic is Mandatory?

1. **Visual Regression Prevention**: Catches UI breaks automatically
2. **Owner-Based Approval**: CODEOWNERS review visual changes
3. **Baseline Management**: Controlled snapshot updates
4. **PR Integration**: Blocks merges on visual regressions

## Consequences

### Positive

- ✅ Documentation always up-to-date
- ✅ Interactive examples for all components
- ✅ Visual consistency enforced
- ✅ Developer onboarding simplified
- ✅ AI-assisted documentation generation

### Negative

- ⚠️ Initial setup overhead
- ⚠️ Requires discipline to maintain
- ⚠️ CI checks can slow PRs (mitigated by caching)

### Neutral

- Documentation lives in codebase
- Requires Storybook knowledge
- MDX learning curve

## Implementation

1. **Phase 6.1-6.3**: Storybook setup, Chromatic, caching
2. **Phase 6.4**: DDD system implementation
3. **Phase 6.5**: Interactive diagrams and cross-linking

## References

- [Storybook Documentation](https://storybook.js.org/)
- [Chromatic Documentation](https://www.chromatic.com/docs/)
- [MDX Documentation](https://mdxjs.com/)
- [Figma Developer Docs](https://www.figma.com/developers)
- [Vercel Design System](https://vercel.com/design)

---

**Status: Accepted** ✅

*Last Updated: December 2024*

