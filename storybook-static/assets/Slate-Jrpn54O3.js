import{j as n}from"./iframe-BXkX_8oL.js";import{useMDXComponents as r}from"./index-4MjfFERE.js";import{M as l}from"./index-BxKd_lEk.js";import"./preload-helper-C1FmrZbK.js";import"./index-C-Mlwwfn.js";function i(s){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(l,{title:"Lumenforge.io Design System/WIS2L Framework/Slate/Documentation/Slate",id:"wis2l-slate-docs-stories",name:"Slate WIS2L Docs"}),`
`,n.jsx(e.h1,{id:"slate---subsystem-layout--theming-engine",children:"SLATE - Subsystem Layout & Theming Engine"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"SLATE"})," is the centralized design system and token management layer for all WISSIL subsystems."]}),`
`,n.jsx(e.h2,{id:"purpose",children:"Purpose"}),`
`,n.jsx(e.p,{children:"SLATE serves as the single source of truth for:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Design Tokens"}),": Colors, typography, spacing, shadows"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Theme Configuration"}),": Light/dark modes, system themes"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Visual Consistency"}),": Standardized design language"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Component Styling"}),": Base styles and utilities"]}),`
`]}),`
`,n.jsx(e.h2,{id:"architecture",children:"Architecture"}),`
`,n.jsx(e.h3,{id:"token-structure",children:"Token Structure"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`slateTokens\r
├── colors\r
│   ├── landing (primary, secondary, accent, gradient)\r
│   ├── slate (primary, secondary, accent, gradient)\r
│   ├── ignition (primary, secondary, accent, gradient)\r
│   ├── spark (primary, secondary, accent, gradient)\r
│   ├── ignis (primary, secondary, accent, gradient)\r
│   ├── waypoint (primary, secondary, accent, gradient)\r
│   ├── nocturna (dark, midnight, twilight, dusk, dawn)\r
│   └── neutral (50-900)\r
├── typography\r
│   ├── fontFamily (sans, mono, display)\r
│   ├── fontSize (xs - 9xl)\r
│   ├── fontWeight (thin - black)\r
│   ├── lineHeight (none - loose)\r
│   └── letterSpacing (tighter - widest)\r
├── spacing (px, 0 - 96)\r
├── borderRadius (none - full)\r
├── shadows (sm - 2xl, glow)\r
├── animation (duration, easing)\r
├── breakpoints (sm - 2xl)\r
└── zIndex (hide - tooltip)
`})}),`
`,n.jsx(e.h3,{id:"network-topology",children:"Network Topology"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Location"}),": Helios Compute (192.168.86.115)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Port"}),": 3001"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Protocol"}),": HTTPS"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Auth"}),": nocturnaID with Designer role"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Access"}),": Authenticated users only"]}),`
`]}),`
`,n.jsx(e.h2,{id:"design-system",children:"Design System"}),`
`,n.jsx(e.h3,{id:"color-systems",children:"Color Systems"}),`
`,n.jsx(e.p,{children:"Each WISSIL subsystem has a dedicated color palette:"}),`
`,n.jsx(e.h4,{id:"landing-gold",children:"Landing (Gold)"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Primary: ",n.jsx(e.code,{children:"#FFD700"})," - Main actions, hero elements"]}),`
`,n.jsxs(e.li,{children:["Secondary: ",n.jsx(e.code,{children:"#1E3A8A"})," - Supporting elements"]}),`
`,n.jsxs(e.li,{children:["Accent: ",n.jsx(e.code,{children:"#F59E0B"})," - Highlights and CTAs"]}),`
`]}),`
`,n.jsx(e.h4,{id:"slate-indigo",children:"Slate (Indigo)"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Primary: ",n.jsx(e.code,{children:"#6366F1"})," - Design system elements"]}),`
`,n.jsxs(e.li,{children:["Secondary: ",n.jsx(e.code,{children:"#8B5CF6"})," - Secondary actions"]}),`
`,n.jsxs(e.li,{children:["Accent: ",n.jsx(e.code,{children:"#A78BFA"})," - Hover states"]}),`
`]}),`
`,n.jsx(e.h4,{id:"ignition-red",children:"Ignition (Red)"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Primary: ",n.jsx(e.code,{children:"#EF4444"})," - Project initialization"]}),`
`,n.jsxs(e.li,{children:["Secondary: ",n.jsx(e.code,{children:"#F97316"})," - Templates"]}),`
`,n.jsxs(e.li,{children:["Accent: ",n.jsx(e.code,{children:"#FB923C"})," - Configuration"]}),`
`]}),`
`,n.jsx(e.h4,{id:"spark-yellow",children:"Spark (Yellow)"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Primary: ",n.jsx(e.code,{children:"#FBBF24"})," - AI generation"]}),`
`,n.jsxs(e.li,{children:["Secondary: ",n.jsx(e.code,{children:"#F59E0B"})," - Expert routing"]}),`
`,n.jsxs(e.li,{children:["Accent: ",n.jsx(e.code,{children:"#FCD34D"})," - Generated code"]}),`
`]}),`
`,n.jsx(e.h4,{id:"ignis-coral",children:"Ignis (Coral)"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Primary: ",n.jsx(e.code,{children:"#FF6B35"})," - Build status"]}),`
`,n.jsxs(e.li,{children:["Secondary: ",n.jsx(e.code,{children:"#F7931E"})," - Performance metrics"]}),`
`,n.jsxs(e.li,{children:["Accent: ",n.jsx(e.code,{children:"#FFC857"})," - Optimizations"]}),`
`]}),`
`,n.jsx(e.h4,{id:"waypoint-green",children:"Waypoint (Green)"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Primary: ",n.jsx(e.code,{children:"#10B981"})," - Deployments"]}),`
`,n.jsxs(e.li,{children:["Secondary: ",n.jsx(e.code,{children:"#059669"})," - Version history"]}),`
`,n.jsxs(e.li,{children:["Accent: ",n.jsx(e.code,{children:"#34D399"})," - Environment status"]}),`
`]}),`
`,n.jsx(e.h3,{id:"typography-scale",children:"Typography Scale"}),`
`,n.jsx(e.p,{children:"SLATE provides a harmonious type scale:"}),`
`,n.jsx(e.p,{children:`| Size | Value | Usage |\r
|------|-------|-------|\r
| xs | 0.75rem | Small labels, captions |\r
| sm | 0.875rem | Secondary text |\r
| base | 1rem | Body text |\r
| lg | 1.125rem | Emphasized text |\r
| xl | 1.25rem | Small headings |\r
| 2xl | 1.5rem | Card headings |\r
| 3xl | 1.875rem | Section headings |\r
| 4xl | 2.25rem | Page headings |\r
| 5xl | 3rem | Hero headings (mobile) |\r
| 6xl | 3.75rem | Hero headings (tablet) |\r
| 7xl | 4.5rem | Hero headings (desktop) |`}),`
`,n.jsx(e.h3,{id:"spacing-system",children:"Spacing System"}),`
`,n.jsx(e.p,{children:"Consistent spacing based on 4px base unit:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Micro"}),": 1-3 (4px - 12px) - Component internal spacing"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Small"}),": 4-6 (16px - 24px) - Component margins"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Medium"}),": 8-12 (32px - 48px) - Section spacing"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Large"}),": 16-24 (64px - 96px) - Major section gaps"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"XLarge"}),": 32-96 (128px - 384px) - Layout sections"]}),`
`]}),`
`,n.jsx(e.h2,{id:"features",children:"Features"}),`
`,n.jsx(e.h3,{id:"token-explorer",children:"Token Explorer"}),`
`,n.jsx(e.p,{children:"Interactive browser for all design tokens:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Color Viewer"}),": Visual swatches with hex values"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Copy to Clipboard"}),": One-click token copying"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Live Preview"}),": Real-time token updates"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Search"}),": Filter tokens by name or value"]}),`
`]}),`
`,n.jsx(e.h3,{id:"typography-showcase",children:"Typography Showcase"}),`
`,n.jsx(e.p,{children:"Visual reference for all font sizes:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Side-by-side comparison"}),`
`,n.jsx(e.li,{children:"Actual rendered sizes"}),`
`,n.jsx(e.li,{children:"Font family and weight info"}),`
`,n.jsx(e.li,{children:"Usage guidelines"}),`
`]}),`
`,n.jsx(e.h3,{id:"spacing-visualizer",children:"Spacing Visualizer"}),`
`,n.jsx(e.p,{children:"Interactive spacing grid:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Visual representation of all sizes"}),`
`,n.jsx(e.li,{children:"Size labels and rem values"}),`
`,n.jsx(e.li,{children:"Responsive behavior preview"}),`
`]}),`
`,n.jsx(e.h2,{id:"usage",children:"Usage"}),`
`,n.jsx(e.h3,{id:"importing-tokens",children:"Importing Tokens"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`import { slateTokens, getSystemColors } from '@/tokens/slate.tokens';\r
\r
// Get all tokens\r
const colors = slateTokens.colors;\r
const spacing = slateTokens.spacing;\r
\r
// Get system-specific colors\r
const landingColors = getSystemColors('landing');
`})}),`
`,n.jsx(e.h3,{id:"tailwind-integration",children:"Tailwind Integration"}),`
`,n.jsx(e.p,{children:"All SLATE tokens are automatically available in Tailwind:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Color classes\r
<div className="bg-slate-primary text-white" />\r
<div className="text-gradient-landing" />\r
\r
// Spacing\r
<div className="px-4 py-8 gap-6" />\r
\r
// Typography\r
<h1 className="text-7xl font-bold" />
`})}),`
`,n.jsx(e.h3,{id:"css-variables",children:"CSS Variables"}),`
`,n.jsx(e.p,{children:"SLATE tokens can be exported as CSS custom properties:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`:root {\r
  --color-landing-primary: #FFD700;\r
  --spacing-4: 1rem;\r
  --font-size-7xl: 4.5rem;\r
}
`})}),`
`,n.jsx(e.h2,{id:"token-management",children:"Token Management"}),`
`,n.jsx(e.h3,{id:"adding-new-tokens",children:"Adding New Tokens"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Update ",n.jsx(e.code,{children:"src/tokens/slate.tokens.ts"})]}),`
`,n.jsx(e.li,{children:"Add to appropriate category"}),`
`,n.jsx(e.li,{children:"Update Tailwind config if needed"}),`
`,n.jsx(e.li,{children:"Document in SLATE page"}),`
`,n.jsx(e.li,{children:"Run validation tests"}),`
`]}),`
`,n.jsx(e.h3,{id:"naming-convention",children:"Naming Convention"}),`
`,n.jsx(e.p,{children:"Follow this pattern for consistency:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Colors"}),": ",n.jsx(e.code,{children:"system-category"})," (e.g., ",n.jsx(e.code,{children:"landing-primary"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Spacing"}),": Numeric scale (e.g., ",n.jsx(e.code,{children:"4"}),", ",n.jsx(e.code,{children:"8"}),", ",n.jsx(e.code,{children:"12"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Typography"}),": T-shirt sizing (e.g., ",n.jsx(e.code,{children:"xs"}),", ",n.jsx(e.code,{children:"sm"}),", ",n.jsx(e.code,{children:"lg"}),")"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Effects"}),": Descriptive (e.g., ",n.jsx(e.code,{children:"glow"}),", ",n.jsx(e.code,{children:"shimmer"}),")"]}),`
`]}),`
`,n.jsx(e.h3,{id:"token-validation",children:"Token Validation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Validate color contrast\r
checkContrast(foreground, background) >= 4.5\r
\r
// Validate spacing scale\r
isMultipleOf(spacing, 4) === true\r
\r
// Validate font scale\r
fontScale.follows(perfectFourth) === true
`})}),`
`,n.jsx(e.h2,{id:"integration-points",children:"Integration Points"}),`
`,n.jsx(e.h3,{id:"component-libraries",children:"Component Libraries"}),`
`,n.jsx(e.p,{children:"SLATE integrates with:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"React Components"}),": Via props and className"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Storybook"}),": Theme provider and decorators"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tailwind CSS"}),": Extended configuration"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"CSS-in-JS"}),": Token exports for styled-components"]}),`
`]}),`
`,n.jsx(e.h3,{id:"mcp-tools",children:"MCP Tools"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"mcp_luminera_read_component"}),": Read token definitions"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"mcp_luminera_write_component"}),": Update tokens"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.code,{children:"mcp_vfs_read"}),": Access token files"]}),`
`]}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Always use tokens"}),": Never hardcode colors or spacing"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"System colors"}),": Use appropriate system colors for context"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Responsive scales"}),": Utilize breakpoint tokens"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Accessibility"}),": Maintain WCAG AA+ contrast ratios"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Consistency"}),": Stick to the defined scale"]}),`
`]}),`
`,n.jsx(e.h2,{id:"performance",children:"Performance"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Token file size"}),": < 5 KB (minified)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tree-shakeable"}),": Unused tokens removed in production"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"CSS generation"}),": Tailwind JIT for minimal output"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Cache-friendly"}),": Tokens rarely change"]}),`
`]}),`
`,n.jsx(e.h2,{id:"future-enhancements",children:"Future Enhancements"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Theme builder UI"}),`
`,n.jsx(e.li,{children:"[ ] Custom token generation"}),`
`,n.jsx(e.li,{children:"[ ] Token analytics and usage tracking"}),`
`,n.jsx(e.li,{children:"[ ] A/B testing for token variations"}),`
`,n.jsx(e.li,{children:"[ ] Export to Figma/Sketch"}),`
`]})]})}function h(s={}){const{wrapper:e}={...r(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{h as default};
