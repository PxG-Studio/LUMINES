import{j as e}from"./iframe-BXkX_8oL.js";import{useMDXComponents as r}from"./index-4MjfFERE.js";import{M as o}from"./index-BxKd_lEk.js";import"./preload-helper-C1FmrZbK.js";import"./index-C-Mlwwfn.js";function s(i){const n={blockquote:"blockquote",br:"br",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Lumenforge.io Design System/WIS2L Framework/Landing/Documentation/Landing",id:"wis2l-landing-docs-stories",name:"Landing WIS2L Docs"}),`
`,e.jsx(n.h1,{id:"landing---main-gateway",children:"LANDING - Main Gateway"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"LANDING"})," subsystem is the primary entry point into the WISSIL ecosystem and the marketing surface for ",e.jsx(n.strong,{children:"Lumenforge.io"}),`.\r
It introduces the value of the platform, then routes users into the individual subsystems (SLATE, SPARK, IGNITION, IGNIS, WAYPOINT).`]}),`
`,e.jsx(n.p,{children:"The current hero copy is:"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Your Entire Creative Pipeline in One Workspace"}),e.jsx(n.br,{}),`
`,"Lumenforge.io unifies AI generation, design tokens, blueprint editing, live previews, and deployment into a single, high-velocity development environment built for modern teams."]}),`
`]}),`
`,e.jsx(n.h2,{id:"purpose",children:"Purpose"}),`
`,e.jsx(n.p,{children:"LANDING provides a unified interface for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Product Story"}),": Explain what Lumenforge.io is and why it exists"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Navigation Hub"}),": Route into SPARK, SLATE, IGNITION, IGNIS, WAYPOINT"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Conversion Surface"}),": Capture signups, free trials, and demo requests"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"System Overview"}),": Communicate the capabilities of the full ",e.jsx(n.strong,{children:"WIS2L"})," stack"]}),`
`]}),`
`,e.jsx(n.h2,{id:"architecture",children:"Architecture"}),`
`,e.jsx(n.h3,{id:"component-hierarchy-current-implementation",children:"Component Hierarchy (Current Implementation)"}),`
`,e.jsxs(n.p,{children:["The canonical React composition lives in ",e.jsx(n.code,{children:"src/wissil/Landing/LandingLayout.tsx"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`LandingLayout\r
├── SimpleNav\r
├── HeroSection\r
├── StatsSection\r
├── FeatureGrid\r
├── CTASection (mid-page)\r
├── DetailedFeatures\r
├── ProductDemo\r
├── BenefitsSection\r
├── UseCasesSection\r
├── SocialProof\r
├── IntegrationsShowcase\r
├── ComparisonTable\r
├── PricingSection\r
├── FAQ\r
├── CTASection (end-of-page)\r
├── Footer\r
└── StickyCTA
`})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SimpleNav"})," – Top navigation with Docs + Open Editor"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"HeroSection"})," – Lumenforge.io hero copy + primary CTAs (Start Coding / Try AI Generator)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"StatsSection"})," – Key metrics (developers, projects, lines of code, uptime)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"FeatureGrid"})," – 3 core feature cards (Instant Preview, Clean Project Explorer, Code-First Workflow)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"DetailedFeatures"})," – 8 deeper feature explanations with benefits"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ProductDemo"})," – Video/demo slot and screenshot grid"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"BenefitsSection"})," – ROI-focused messaging and key outcomes"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"UseCasesSection"})," – “Perfect for teams like yours” by industry/use case"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SocialProof"})," – Testimonials, user counts, logos"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"IntegrationsShowcase"})," – Logos for GitHub, Unity, Vercel, etc."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ComparisonTable"})," – Lumenforge vs Bolt.new, StackBlitz, CodeSandbox"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"PricingSection"})," – Free/Pro/Enterprise tiers"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"FAQ"})," – 10 questions, accessible accordion"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"CTASection / StickyCTA"})," – Mid-page, end-of-page, and sticky CTAs for conversion"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Footer"})," – Newsletter, navigation, legal, social links"]}),`
`]}),`
`,e.jsx(n.h3,{id:"network-topology",children:"Network Topology"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Location"}),": Helios Control (192.168.86.114)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Port"}),": 3000"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Protocol"}),": HTTPS"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Auth"}),": nocturnaID integration"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Access"}),": Public facing"]}),`
`]}),`
`,e.jsx(n.h2,{id:"design-system",children:"Design System"}),`
`,e.jsx(n.h3,{id:"color-palette",children:"Color Palette"}),`
`,e.jsx(n.p,{children:"The LANDING subsystem uses the following SLATE tokens:"}),`
`,e.jsxs(n.p,{children:[`| Token | Value | Usage |\r
|-------|-------|-------|\r
| `,e.jsx(n.code,{children:"landing-primary"}),` | #FFD700 | Primary actions, headings |\r
| `,e.jsx(n.code,{children:"landing-secondary"}),` | #1E3A8A | Secondary elements |\r
| `,e.jsx(n.code,{children:"landing-accent"}),` | #F59E0B | Highlights, hover states |\r
| `,e.jsx(n.code,{children:"landing-gradient"})," | Gold → Amber | Hero backgrounds, CTAs |"]}),`
`,e.jsx(n.h3,{id:"typography",children:"Typography"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Headings"}),": Space Grotesk, Bold (72px - 96px)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Body"}),": Inter, Regular/Medium (16px - 20px)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Monospace"}),": JetBrains Mono (System info)"]}),`
`]}),`
`,e.jsx(n.h3,{id:"spacing",children:"Spacing"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Section padding: ",e.jsx(n.code,{children:"py-20 sm:py-32"})]}),`
`,e.jsxs(n.li,{children:["Card gap: ",e.jsx(n.code,{children:"gap-6"})]}),`
`,e.jsxs(n.li,{children:["Container: ",e.jsx(n.code,{children:"max-w-5xl"})," (Hero), ",e.jsx(n.code,{children:"max-w-6xl"})," (Grid)"]}),`
`]}),`
`,e.jsx(n.h2,{id:"interactive-elements",children:"Interactive Elements"}),`
`,e.jsx(n.h3,{id:"primary-ctas",children:"Primary CTAs"}),`
`,e.jsx(n.p,{children:"The hero section exposes two primary calls to action:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Start Coding"})," → ",e.jsx(n.code,{children:"/slate/ide"})," (opens the SLATE IDE experience)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Try AI Generator"})," → ",e.jsx(n.code,{children:"/spark"})," (opens the SPARK AI component generator)"]}),`
`]}),`
`,e.jsx(n.p,{children:"Additional CTAs appear mid-page, at the end of the page, and in a sticky bar:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Start Coding Now"})," (accent CTA section)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Get Started Free"})," / ",e.jsx(n.strong,{children:"Schedule Demo"})," (end-of-page CTA)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Sticky CTA"})," that appears after scroll for persistent conversion."]}),`
`]}),`
`,e.jsx(n.h3,{id:"feature--content-sections",children:"Feature & Content Sections"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Feature Cards"})," – Each card highlights a core workflow (preview, project explorer, code-first workflow)."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Detailed Feature Lists"})," – Bullet lists explaining concrete benefits."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Use Cases"})," – Chips/tags for industries and team types."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Stats"})," – Large-number metrics for social proof."]}),`
`]}),`
`,e.jsx(n.h3,{id:"animation--interaction-effects",children:"Animation & Interaction Effects"}),`
`,e.jsx(n.p,{children:"Animations are deliberately subtle to keep readability high:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"CTA hover states (scale + color shifts via design tokens)"}),`
`,e.jsx(n.li,{children:"Card hover elevation and subtle transforms"}),`
`,e.jsx(n.li,{children:"Sticky CTA reveal based on scroll position"}),`
`]}),`
`,e.jsxs(n.p,{children:["All interactions are covered by Storybook ",e.jsx(n.code,{children:"play"})," functions so they are testable and reproducible."]}),`
`,e.jsx(n.h2,{id:"responsive-design",children:"Responsive Design"}),`
`,e.jsx(n.h3,{id:"breakpoints",children:"Breakpoints"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Mobile"})," (< 640px): Single column, reduced spacing"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tablet"})," (640px - 1024px): 2-column grid"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Desktop"})," (1024px+): 3-column grid"]}),`
`]}),`
`,e.jsx(n.h3,{id:"mobile-optimizations",children:"Mobile Optimizations"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Reduced font sizes (6xl → 5xl)"}),`
`,e.jsx(n.li,{children:"Stacked CTA buttons"}),`
`,e.jsx(n.li,{children:"Simplified animation effects"}),`
`,e.jsx(n.li,{children:"Touch-optimized card sizing"}),`
`]}),`
`,e.jsx(n.h2,{id:"integration-points",children:"Integration Points"}),`
`,e.jsx(n.h3,{id:"authentication",children:"Authentication"}),`
`,e.jsxs(n.p,{children:["The production deployment still sits behind ",e.jsx(n.strong,{children:"Cloudflare Zero Trust + nocturnaID"})," for authenticated environments, but the ",e.jsx(n.strong,{children:"marketing landing"})," itself is publicly accessible."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`// nocturnaID integration (protected surfaces)\r
endpoint: /auth/login\r
roles: ['Designer', 'Engineer', 'Admin', 'Agent']\r
flow: Cloudflare Zero Trust → nocturnaID → JWT
`})}),`
`,e.jsx(n.h3,{id:"navigation",children:"Navigation"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Top nav routes users into ",e.jsx(n.strong,{children:"Docs"})," and ",e.jsx(n.strong,{children:"SLATE IDE"}),"."]}),`
`,e.jsxs(n.li,{children:["Hero CTAs route into ",e.jsx(n.strong,{children:"SLATE"})," and ",e.jsx(n.strong,{children:"SPARK"}),"."]}),`
`,e.jsx(n.li,{children:"Footer links expose About, Docs, Templates (IGNITION), and other key pages."}),`
`]}),`
`,e.jsx(n.h3,{id:"storybook--agents",children:"Storybook & Agents"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Storybook exposes multiple views of the landing experience:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"WIS2L Framework/Landing/Pages/Main Gateway"})," – Next.js-based landing page (",e.jsx(n.code,{children:"src/app/landing/page.tsx"})," → ",e.jsx(n.code,{children:"LandingLayout"}),")."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"WIS2L Framework/Landing/Shared Framework Components/Interactive Landing"})," – Minimal interactive shell (Nav + Hero + Features + Footer)."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"WIS2L Framework/Landing/Shared Framework Components/LandingComponents"})," – Full ",e.jsx(n.code,{children:"LandingLayout"})," with all sections."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Lumenforge.io / Landing / Pages / ProductionLanding"})," – The Vite app from ",e.jsx(n.code,{children:"src/apps/lumenforge-landing/App.tsx"})," rendered inside Storybook."]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["External agents (Playwright, MCP, etc.) should prefer the ",e.jsx(n.strong,{children:"ProductionLanding"})," story or the Vite app directly; see ",e.jsx(n.code,{children:"docs/LANDING_AGENT_REFERENCE.md"})," for precise instructions."]}),`
`]}),`
`,e.jsx(n.h2,{id:"user-flow",children:"User Flow"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-mermaid",children:`graph TD\r
  A[User arrives at LANDING] --> B{Authenticated?}\r
  B -->|No| C[Redirect to nocturnaID]\r
  C --> D[Login/Register]\r
  D --> E[JWT Token]\r
  E --> A\r
  B -->|Yes| F[Display System Cards]\r
  F --> G[User selects subsystem]\r
  G --> H[Navigate to subsystem]
`})}),`
`,e.jsx(n.h2,{id:"performance-metrics",children:"Performance Metrics"}),`
`,e.jsx(n.p,{children:"The landing page is designed to be light and fast:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Initial Load Target"}),": < 1.5s (on typical broadband)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Time to Interactive Target"}),": < 2s"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Key Optimizations"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Minimal above-the-fold JavaScript"}),`
`,e.jsx(n.li,{children:"Shared design tokens between Next.js app, Storybook, and Vite app"}),`
`,e.jsx(n.li,{children:"Ready for image/video lazy loading"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.h2,{id:"accessibility",children:"Accessibility"}),`
`,e.jsx(n.h3,{id:"wcag-aa-goals",children:"WCAG AA+ Goals"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["✅ Semantic HTML structure (",e.jsx(n.code,{children:"section"}),", ",e.jsx(n.code,{children:"nav"}),", ",e.jsx(n.code,{children:"footer"}),", ",e.jsx(n.code,{children:"article"}),")"]}),`
`,e.jsx(n.li,{children:"✅ ARIA attributes on interactive controls where needed"}),`
`,e.jsx(n.li,{children:"✅ Keyboard navigation support across all CTAs and FAQ accordions"}),`
`,e.jsx(n.li,{children:"✅ Visible focus indicators for buttons/links"}),`
`,e.jsx(n.li,{children:"✅ Contrast tuned with design tokens and verified via Storybook A11y panel"}),`
`]}),`
`,e.jsxs(n.p,{children:["Interactive stories (",e.jsx(n.code,{children:"Main Gateway"}),", ",e.jsx(n.code,{children:"Interactive Landing"}),", ",e.jsx(n.code,{children:"LandingComponents"}),") include ",e.jsx(n.code,{children:"play"})," functions that:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Walk the page via keyboard"}),`
`,e.jsx(n.li,{children:"Click through all CTAs"}),`
`,e.jsx(n.li,{children:"Exercise the FAQ accordion"}),`
`,e.jsx(n.li,{children:"Scroll through the full layout"}),`
`]}),`
`,e.jsx(n.h2,{id:"best-practices",children:"Best Practices"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Performance"}),": Keep heavy media (videos, large images) lazy-loaded and below the fold."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SEO"}),": Mirror meta tags and OG data from ",e.jsx(n.code,{children:"apps/lumenforge-landing/index.html"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Analytics"}),": Track hero CTAs, mid-page CTAs, pricing clicks, and StickyCTA dismissals."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Error Handling"}),": Provide graceful fallbacks for content/API failures (e.g., default copy, disabled CTAs)."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Loading States"}),": Use skeletons or graceful placeholders for any async-loaded sections."]}),`
`]}),`
`,e.jsx(n.h2,{id:"related-subsystems",children:"Related Subsystems"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SLATE"}),': Design system + IDE surface; primary target for "Open Editor" CTAs.']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"SPARK"}),': AI component generator; primary target for "Try AI Generator" CTAs.']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"IGNITION"}),": Project scaffolding; linked from Templates/Project Templates flows."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"IGNIS"}),": Build/runtime pipeline surfaced from marketing copy and deeper docs."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"WAYPOINT"}),": Manages deployment of the landing page and downstream apps."]}),`
`]})]})}function h(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{h as default};
