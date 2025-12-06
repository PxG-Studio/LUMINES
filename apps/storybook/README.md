# LumenForge Storybook Design System Hub

**Purpose:** Unified design system documentation and component showcase

## Structure

This is the unified Storybook hub for all LumenForge components:
- UI components
- Tokens
- Layout primitives
- Assistant panes
- Preview frames
- Engine selectors

## TODO: Future Integration

- [ ] Integrate with existing `.storybook/` config (when ready to merge)
- [ ] Import stories from `packages/ui` once migrated
- [ ] Import stories from `packages/tokens` once migrated
- [ ] Integrate SPARK and SLATE stories (keep existing pipelines separate initially)
- [ ] Add global decorators and theme providers

## Development

```bash
npm run storybook
# or from root:
npm run dev:storybook
```

## Note

Currently this is a separate Storybook instance. The existing Storybook in the root `.storybook/` directory remains untouched and functional for SPARK and SLATE pipelines.

