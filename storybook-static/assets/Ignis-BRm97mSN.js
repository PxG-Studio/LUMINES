import{j as n}from"./iframe-BXkX_8oL.js";import{useMDXComponents as s}from"./index-4MjfFERE.js";import{M as l}from"./index-BxKd_lEk.js";import"./preload-helper-C1FmrZbK.js";import"./index-C-Mlwwfn.js";function i(r){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(l,{title:"Lumenforge.io Design System/WIS2L Framework/Ignis/Documentation/Ignis",id:"wis2l-ignis-docs-stories",name:"Ignis WIS2L Docs"}),`
`,n.jsx(e.h1,{id:"ignis---build-pipeline--development-server",children:"IGNIS - Build Pipeline & Development Server"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"IGNIS"})," provides lightning-fast hot-reload, build optimization, and live preview for all WISSIL components."]}),`
`,n.jsx(e.h2,{id:"purpose",children:"Purpose"}),`
`,n.jsx(e.p,{children:"IGNIS accelerates development with:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Hot Module Replacement"}),": Sub-200ms component updates"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Build Optimization"}),": Advanced bundling strategies"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Live Preview"}),": Real-time component rendering"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Performance Monitoring"}),": Build metrics and analytics"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Development Tools"}),": Debugging and profiling"]}),`
`]}),`
`,n.jsx(e.h2,{id:"architecture",children:"Architecture"}),`
`,n.jsx(e.h3,{id:"development-server",children:"Development Server"}),`
`,n.jsx(e.p,{children:"High-performance dev server with instant feedback:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface DevServer {\r
  port: number;\r
  host: string;\r
  hmr: HMRConfig;\r
  middleware: Middleware[];\r
  proxy: ProxyConfig;\r
}\r
\r
const server = {\r
  port: 3004,\r
  host: '0.0.0.0',\r
  hmr: {\r
    protocol: 'ws',\r
    host: '192.168.86.114',\r
    port: 24678,\r
    timeout: 30000,\r
  },\r
  middleware: [\r
    cors(),\r
    compression(),\r
    logger(),\r
  ],\r
};
`})}),`
`,n.jsx(e.h3,{id:"hot-module-replacement",children:"Hot Module Replacement"}),`
`,n.jsx(e.p,{children:"Instant updates without full reload:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// HMR accepts component changes\r
if (import.meta.hot) {\r
  import.meta.hot.accept((newModule) => {\r
    // Update component without losing state\r
    replaceComponent(newModule);\r
  });\r
}
`})}),`
`,n.jsx(e.h3,{id:"build-pipeline",children:"Build Pipeline"}),`
`,n.jsx(e.p,{children:"Multi-stage optimization process:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`Source Files\r
    ↓\r
  TypeScript Compilation\r
    ↓\r
  Tree Shaking (Remove unused code)\r
    ↓\r
  Code Splitting (Dynamic imports)\r
    ↓\r
  Minification (Terser)\r
    ↓\r
  Image Optimization (WebP, AVIF)\r
    ↓\r
  CSS Purging (Remove unused Tailwind)\r
    ↓\r
  Bundle Analysis\r
    ↓\r
  Output Files
`})}),`
`,n.jsx(e.h2,{id:"performance-metrics",children:"Performance Metrics"}),`
`,n.jsx(e.h3,{id:"build-time",children:"Build Time"}),`
`,n.jsx(e.p,{children:"Average build performance:"}),`
`,n.jsxs(e.p,{children:[`| Stage | Development | Production |\r
|-------|-------------|-----------|\r
| TypeScript | 0.4s | 0.8s |\r
| Tree Shaking | - | 0.2s |\r
| Code Splitting | 0.1s | 0.3s |\r
| Minification | - | 0.5s |\r
| `,n.jsx(e.strong,{children:"Total"})," | ",n.jsx(e.strong,{children:"1.2s"})," | ",n.jsx(e.strong,{children:"3.8s"})," |"]}),`
`,n.jsx(e.h3,{id:"bundle-size",children:"Bundle Size"}),`
`,n.jsx(e.p,{children:"Optimized output sizes:"}),`
`,n.jsxs(e.p,{children:[`| Asset Type | Size (Dev) | Size (Prod) | Compression |\r
|-----------|-----------|------------|-------------|\r
| JavaScript | 850 KB | 245 KB | gzip + brotli |\r
| CSS | 120 KB | 18 KB | purged + minified |\r
| Images | N/A | Optimized | WebP + lazy load |\r
| `,n.jsx(e.strong,{children:"Total"})," | ",n.jsx(e.strong,{children:"970 KB"})," | ",n.jsx(e.strong,{children:"263 KB"})," | ",n.jsx(e.strong,{children:"-73%"})," |"]}),`
`,n.jsx(e.h3,{id:"hot-reload",children:"Hot Reload"}),`
`,n.jsx(e.p,{children:"Lightning-fast updates:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Module Detection"}),": < 10ms"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Dependency Graph"}),": < 20ms"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Bundle Update"}),": < 50ms"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Browser Update"}),": < 30ms"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Total HMR"}),": ",n.jsx(e.strong,{children:"< 127ms"})," ⚡"]}),`
`]}),`
`,n.jsx(e.h3,{id:"component-tracking",children:"Component Tracking"}),`
`,n.jsx(e.p,{children:"Monitor component count and changes:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Active components: 42"}),`
`,n.jsx(e.li,{children:"Modified today: 7"}),`
`,n.jsx(e.li,{children:"Added this week: 3"}),`
`,n.jsx(e.li,{children:"Deprecated: 2"}),`
`]}),`
`,n.jsx(e.h2,{id:"build-optimizations",children:"Build Optimizations"}),`
`,n.jsx(e.h3,{id:"tree-shaking",children:"Tree Shaking"}),`
`,n.jsx(e.p,{children:"Remove unused code automatically:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Impact"}),`: High\r
`,n.jsx(e.strong,{children:"Savings"}),": ~150 KB"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Only imports used exports\r
import { Button } from './components'; // Button imported\r
// Toast, Modal, etc. are NOT included in bundle
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Configuration:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`// vite.config.ts\r
export default {\r
  build: {\r
    rollupOptions: {\r
      treeshake: {\r
        moduleSideEffects: false,\r
        propertyReadSideEffects: false,\r
      },\r
    },\r
  },\r
};
`})}),`
`,n.jsx(e.h3,{id:"code-splitting",children:"Code Splitting"}),`
`,n.jsx(e.p,{children:"Split code into smaller chunks:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Impact"}),`: High\r
`,n.jsx(e.strong,{children:"Savings"}),": Faster initial load"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Dynamic imports for route-based splitting\r
const LandingPage = lazy(() => import('./app/landing/page'));\r
const SlatePage = lazy(() => import('./app/slate/page'));\r
\r
// Component-level splitting\r
const HeavyChart = lazy(() => import('./components/HeavyChart'));
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Output:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`dist/\r
├── main-[hash].js       (Core app: 80 KB)\r
├── landing-[hash].js    (Landing route: 45 KB)\r
├── slate-[hash].js      (Slate route: 38 KB)\r
└── chart-[hash].js      (Heavy component: 120 KB)
`})}),`
`,n.jsx(e.h3,{id:"image-optimization",children:"Image Optimization"}),`
`,n.jsx(e.p,{children:"Automatic image processing:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Impact"}),`: Medium\r
`,n.jsx(e.strong,{children:"Savings"}),": ~60% image size reduction"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Automatic WebP conversion\r
<Image\r
  src="/hero.jpg"\r
  alt="Hero"\r
  width={1200}\r
  height={600}\r
  // Automatically serves:\r
  // - WebP for modern browsers\r
  // - JPEG fallback for others\r
  // - Responsive sizes (640w, 1024w, 1920w)\r
/>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Formats:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"WebP: 30% smaller than JPEG"}),`
`,n.jsx(e.li,{children:"AVIF: 50% smaller than JPEG (when supported)"}),`
`,n.jsx(e.li,{children:"Lazy loading: Deferred off-screen images"}),`
`]}),`
`,n.jsx(e.h3,{id:"css-purging",children:"CSS Purging"}),`
`,n.jsx(e.p,{children:"Remove unused Tailwind classes:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Impact"}),`: Medium\r
`,n.jsx(e.strong,{children:"Savings"}),": ~100 KB CSS reduction"]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Before Purge:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* Full Tailwind: 3.8 MB */\r
.text-xs { ... }\r
.text-sm { ... }\r
/* ... 50,000+ classes ... */\r
.bg-purple-950 { ... }
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"After Purge:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-css",children:`/* Used classes only: 18 KB */\r
.text-sm { ... }\r
.text-lg { ... }\r
.bg-slate-primary { ... }\r
/* Only 127 classes used */
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Configuration:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`// tailwind.config.ts\r
export default {\r
  content: [\r
    './src/**/*.{ts,tsx}',\r
    './.storybook/**/*.{ts,tsx}',\r
  ],\r
  // Purges unused classes in production\r
};
`})}),`
`,n.jsx(e.h2,{id:"development-tools",children:"Development Tools"}),`
`,n.jsx(e.h3,{id:"live-preview",children:"Live Preview"}),`
`,n.jsx(e.p,{children:"Real-time component rendering:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Watch for file changes\r
watcher.on('change', async (file) => {\r
  // Rebuild component\r
  const updated = await rebuild(file);\r
\r
  // Hot update in browser\r
  ws.send({\r
    type: 'update',\r
    path: file,\r
    timestamp: Date.now(),\r
  });\r
});
`})}),`
`,n.jsx(e.h3,{id:"source-maps",children:"Source Maps"}),`
`,n.jsx(e.p,{children:"Debug original TypeScript code:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`// vite.config.ts\r
export default {\r
  build: {\r
    sourcemap: process.env.NODE_ENV === 'development',\r
  },\r
};
`})}),`
`,n.jsx(e.p,{children:"Browser shows original source:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`src/components/Button.tsx:42\r
  const handleClick = () => {    ← Click to see original code
`})}),`
`,n.jsx(e.h3,{id:"error-overlay",children:"Error Overlay"}),`
`,n.jsx(e.p,{children:"Beautiful error messages in browser:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Syntax error\r
SyntaxError: Unexpected token ')'\r
  at Button.tsx:23:15\r
\r
// Type error\r
Type 'string' is not assignable to type 'number'\r
  at Card.tsx:45:7
`})}),`
`,n.jsx(e.h3,{id:"performance-profiling",children:"Performance Profiling"}),`
`,n.jsx(e.p,{children:"Built-in profiler:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`$ ignis build --profile\r
\r
Build Analysis:\r
  Bundle size: 245 KB\r
  Largest chunks:\r
    - main-abc123.js (80 KB)\r
    - vendor-def456.js (120 KB)\r
    - landing-ghi789.js (45 KB)\r
\r
  Slow imports:\r
    - lodash (12 KB) → Consider lodash-es\r
    - moment (67 KB) → Consider date-fns
`})}),`
`,n.jsx(e.h2,{id:"build-history",children:"Build History"}),`
`,n.jsx(e.p,{children:"Track all builds with metadata:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface BuildRecord {\r
  id: string;\r
  timestamp: Date;\r
  duration: number;\r
  status: 'success' | 'error';\r
  components: number;\r
  bundleSize: number;\r
  changes: string[];\r
  commit?: string;\r
}\r
\r
const recentBuilds: BuildRecord[] = [\r
  {\r
    id: 'build-001',\r
    timestamp: new Date('2024-11-29T14:23:00'),\r
    duration: 1.2,\r
    status: 'success',\r
    components: 42,\r
    bundleSize: 245_000,\r
    changes: ['+3 components', 'bug fixes'],\r
  },\r
];
`})}),`
`,n.jsx(e.h2,{id:"network-topology",children:"Network Topology"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Location"}),": Helios Control (192.168.86.114)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Port"}),": 3004 (HTTP), 24678 (HMR WebSocket)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Protocol"}),": HTTP/2 + WebSocket"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Auth"}),": nocturnaID (development server only)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Access"}),": Internal network"]}),`
`]}),`
`,n.jsx(e.h2,{id:"integration-points",children:"Integration Points"}),`
`,n.jsx(e.h3,{id:"slate-integration",children:"SLATE Integration"}),`
`,n.jsx(e.p,{children:"Hot-reload design token changes:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Update SLATE tokens\r
slateTokens.colors.landing.primary = '#FFD800';\r
\r
// HMR updates all components using this token\r
// No page reload required!
`})}),`
`,n.jsx(e.h3,{id:"spark-integration",children:"SPARK Integration"}),`
`,n.jsx(e.p,{children:"Preview AI-generated components:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// SPARK generates component\r
const newComponent = await spark.generate('Create a card');\r
\r
// IGNIS immediately shows preview\r
ignis.preview(newComponent);
`})}),`
`,n.jsx(e.h3,{id:"waypoint-integration",children:"WAYPOINT Integration"}),`
`,n.jsx(e.p,{children:"Build artifacts for deployment:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`$ ignis build --target production\r
\r
# Output ready for WAYPOINT\r
dist/\r
├── assets/\r
├── index.html\r
└── manifest.json
`})}),`
`,n.jsx(e.h2,{id:"configuration",children:"Configuration"}),`
`,n.jsx(e.h3,{id:"development-server-1",children:"Development Server"}),`
`,n.jsx(e.p,{children:"Customize dev server:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// ignis.config.ts\r
export default {\r
  server: {\r
    port: 3004,\r
    open: true,\r
    cors: true,\r
    hmr: {\r
      overlay: true,\r
      timeout: 30000,\r
    },\r
  },\r
  optimizeDeps: {\r
    include: ['react', 'react-dom'],\r
    exclude: ['@wissil/slate'],\r
  },\r
};
`})}),`
`,n.jsx(e.h3,{id:"build-options",children:"Build Options"}),`
`,n.jsx(e.p,{children:"Configure production builds:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`export default {\r
  build: {\r
    target: 'esnext',\r
    minify: 'terser',\r
    terserOptions: {\r
      compress: {\r
        drop_console: true,\r
        drop_debugger: true,\r
      },\r
    },\r
    rollupOptions: {\r
      output: {\r
        manualChunks: {\r
          vendor: ['react', 'react-dom'],\r
          utils: ['clsx', 'framer-motion'],\r
        },\r
      },\r
    },\r
  },\r
};
`})}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.h3,{id:"development",children:"Development"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Use HMR"}),": Don't disable hot reload"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Small Components"}),": Faster rebuilds"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Lazy Loading"}),": Split heavy components"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Dev Tools"}),": Use React DevTools + Profiler"]}),`
`]}),`
`,n.jsx(e.h3,{id:"production",children:"Production"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Analyze Bundle"}),": Check for bloat"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Code Splitting"}),": Route-based splits"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Image Optimization"}),": Use next/image"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"CSS Purging"}),": Enable in production"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Source Maps"}),": Disable in production"]}),`
`]}),`
`,n.jsx(e.h3,{id:"performance",children:"Performance"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Memo"}),": Use React.memo for expensive renders"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Callbacks"}),": useCallback for event handlers"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Effects"}),": Minimize useEffect dependencies"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Imports"}),": Import only what you need"]}),`
`]}),`
`,n.jsx(e.h2,{id:"monitoring",children:"Monitoring"}),`
`,n.jsx(e.h3,{id:"real-time-metrics",children:"Real-Time Metrics"}),`
`,n.jsx(e.p,{children:"Dashboard shows:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Build time trend"}),`
`,n.jsx(e.li,{children:"Bundle size over time"}),`
`,n.jsx(e.li,{children:"HMR performance"}),`
`,n.jsx(e.li,{children:"Component count"}),`
`,n.jsx(e.li,{children:"Error rate"}),`
`]}),`
`,n.jsx(e.h3,{id:"alerts",children:"Alerts"}),`
`,n.jsx(e.p,{children:"Notifications for:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"⚠️ Build time > 5s"}),`
`,n.jsx(e.li,{children:"⚠️ Bundle size > 500 KB"}),`
`,n.jsx(e.li,{children:"⚠️ HMR timeout"}),`
`,n.jsx(e.li,{children:"❌ Build errors"}),`
`]}),`
`,n.jsx(e.h2,{id:"future-enhancements",children:"Future Enhancements"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Parallel builds for faster compilation"}),`
`,n.jsx(e.li,{children:"[ ] Incremental type checking"}),`
`,n.jsx(e.li,{children:"[ ] Distributed caching"}),`
`,n.jsx(e.li,{children:"[ ] Visual bundle analyzer"}),`
`,n.jsx(e.li,{children:"[ ] AI-powered optimization suggestions"}),`
`]})]})}function h(r={}){const{wrapper:e}={...s(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(i,{...r})}):i(r)}export{h as default};
