import{j as n}from"./iframe-BXkX_8oL.js";import{useMDXComponents as s}from"./index-4MjfFERE.js";import{M as t}from"./index-BxKd_lEk.js";import"./preload-helper-C1FmrZbK.js";import"./index-C-Mlwwfn.js";function r(i){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Lumenforge.io Design System/WIS2L Framework/Ignition/Documentation/Ignition",id:"wis2l-ignition-docs-stories",name:"Ignition WIS2L Docs"}),`
`,n.jsx(e.h1,{id:"ignition---project-initialization-system",children:"IGNITION - Project Initialization System"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"IGNITION"})," kickstarts new projects with intelligent scaffolding, best practices, and seamless WISSIL integration."]}),`
`,n.jsx(e.h2,{id:"purpose",children:"Purpose"}),`
`,n.jsx(e.p,{children:"IGNITION automates project setup by:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Template Selection"}),": Pre-configured project templates"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Smart Scaffolding"}),": Intelligent file structure generation"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Best Practices"}),": Built-in linting, testing, CI/CD"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"WISSIL Integration"}),": Automatic subsystem connections"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Configuration Wizard"}),": 5-step guided setup"]}),`
`]}),`
`,n.jsx(e.h2,{id:"templates",children:"Templates"}),`
`,n.jsx(e.h3,{id:"nextjs-application",children:"Next.js Application"}),`
`,n.jsx(e.p,{children:"Full-stack React application with modern tooling:"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Features:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"App Router (Next.js 14+)"}),`
`,n.jsx(e.li,{children:"TypeScript with strict mode"}),`
`,n.jsx(e.li,{children:"Tailwind CSS with SLATE tokens"}),`
`,n.jsx(e.li,{children:"ESLint + Prettier configuration"}),`
`,n.jsx(e.li,{children:"Jest + React Testing Library"}),`
`,n.jsx(e.li,{children:"GitHub Actions CI/CD"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Structure:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`my-app/\r
├── src/\r
│   ├── app/          # Next.js App Router\r
│   ├── components/   # React components\r
│   ├── tokens/       # SLATE design tokens\r
│   └── styles/       # Global styles\r
├── tests/            # Test files\r
├── .github/          # CI/CD workflows\r
└── package.json
`})}),`
`,n.jsx(e.h3,{id:"component-library",children:"Component Library"}),`
`,n.jsx(e.p,{children:"Standalone library with Storybook:"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Features:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Atomic Design structure"}),`
`,n.jsx(e.li,{children:"Storybook 8 integration"}),`
`,n.jsx(e.li,{children:"TypeScript declarations"}),`
`,n.jsx(e.li,{children:"Bundle optimization (Rollup)"}),`
`,n.jsx(e.li,{children:"Chromatic visual testing"}),`
`,n.jsx(e.li,{children:"NPM publishing workflow"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Structure:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`my-library/\r
├── src/\r
│   ├── atoms/        # Atomic components\r
│   ├── molecules/    # Composite components\r
│   ├── organisms/    # Complex components\r
│   └── index.ts      # Public API\r
├── .storybook/       # Storybook config\r
├── dist/             # Build output\r
└── package.json
`})}),`
`,n.jsx(e.h3,{id:"api-service",children:"API Service"}),`
`,n.jsx(e.p,{children:"RESTful API with authentication:"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Features:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Express.js server"}),`
`,n.jsx(e.li,{children:"PostgreSQL with Prisma ORM"}),`
`,n.jsx(e.li,{children:"nocturnaID authentication"}),`
`,n.jsx(e.li,{children:"OpenAPI documentation"}),`
`,n.jsx(e.li,{children:"Docker containerization"}),`
`,n.jsx(e.li,{children:"Health check endpoints"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Structure:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`my-api/\r
├── src/\r
│   ├── routes/       # API endpoints\r
│   ├── controllers/  # Business logic\r
│   ├── models/       # Data models\r
│   ├── middleware/   # Auth, validation\r
│   └── server.ts     # Entry point\r
├── prisma/           # Database schema\r
├── docker/           # Container config\r
└── package.json
`})}),`
`,n.jsx(e.h2,{id:"setup-process",children:"Setup Process"}),`
`,n.jsx(e.h3,{id:"step-1-project-details",children:"Step 1: Project Details"}),`
`,n.jsx(e.p,{children:"Configure basic metadata:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface ProjectDetails {\r
  name: string;              // Project name (kebab-case)\r
  displayName: string;       // Human-readable name\r
  description: string;       // Brief description\r
  author: string;            // Author name\r
  license: 'MIT' | 'Apache-2.0' | 'Proprietary';\r
  repository?: string;       // Git repository URL\r
}
`})}),`
`,n.jsx(e.h3,{id:"step-2-template-selection",children:"Step 2: Template Selection"}),`
`,n.jsx(e.p,{children:"Choose your starting point:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Next.js Application"}),`
`,n.jsx(e.li,{children:"Component Library"}),`
`,n.jsx(e.li,{children:"API Service"}),`
`,n.jsx(e.li,{children:"Blank (minimal setup)"}),`
`]}),`
`,n.jsx(e.h3,{id:"step-3-dependencies",children:"Step 3: Dependencies"}),`
`,n.jsx(e.p,{children:"Select integrations and packages:"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"UI Frameworks:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Tailwind CSS (recommended)"}),`
`,n.jsx(e.li,{children:"⬜ Styled Components"}),`
`,n.jsx(e.li,{children:"⬜ Emotion"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"State Management:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ React Context"}),`
`,n.jsx(e.li,{children:"⬜ Redux Toolkit"}),`
`,n.jsx(e.li,{children:"⬜ Zustand"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Testing:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Jest (recommended)"}),`
`,n.jsx(e.li,{children:"✅ React Testing Library"}),`
`,n.jsx(e.li,{children:"⬜ Playwright"}),`
`,n.jsx(e.li,{children:"⬜ Cypress"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"WISSIL Integrations:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ SLATE (design tokens)"}),`
`,n.jsx(e.li,{children:"✅ SPARK (AI generation)"}),`
`,n.jsx(e.li,{children:"✅ IGNIS (dev server)"}),`
`,n.jsx(e.li,{children:"✅ WAYPOINT (deployment)"}),`
`]}),`
`,n.jsx(e.h3,{id:"step-4-configuration",children:"Step 4: Configuration"}),`
`,n.jsx(e.p,{children:"Fine-tune your setup:"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Code Style:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ ESLint (recommended)"}),`
`,n.jsx(e.li,{children:"✅ Prettier (recommended)"}),`
`,n.jsx(e.li,{children:"✅ TypeScript strict mode"}),`
`,n.jsx(e.li,{children:"⬜ Husky pre-commit hooks"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"CI/CD:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ GitHub Actions"}),`
`,n.jsx(e.li,{children:"⬜ GitLab CI"}),`
`,n.jsx(e.li,{children:"⬜ CircleCI"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Deployment:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Vercel"}),`
`,n.jsx(e.li,{children:"⬜ Netlify"}),`
`,n.jsx(e.li,{children:"⬜ Custom Docker"}),`
`]}),`
`,n.jsx(e.h3,{id:"step-5-initialize",children:"Step 5: Initialize"}),`
`,n.jsx(e.p,{children:"Generate and set up your project:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# 1. Create project structure\r
$ ignition generate my-app --template nextjs\r
\r
# 2. Install dependencies\r
$ cd my-app && npm install\r
\r
# 3. Initialize Git\r
$ git init && git add . && git commit -m "Initial commit"\r
\r
# 4. Start development\r
$ npm run dev
`})}),`
`,n.jsx(e.h2,{id:"architecture",children:"Architecture"}),`
`,n.jsx(e.h3,{id:"file-generation",children:"File Generation"}),`
`,n.jsx(e.p,{children:"IGNITION uses templates with smart replacements:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface TemplateContext {\r
  projectName: string;\r
  displayName: string;\r
  author: string;\r
  dependencies: string[];\r
  integrations: string[];\r
}\r
\r
function generateFile(template: string, context: TemplateContext): string {\r
  return template\r
    .replace(/\\{\\{projectName\\}\\}/g, context.projectName)\r
    .replace(/\\{\\{displayName\\}\\}/g, context.displayName)\r
    // ... more replacements\r
}
`})}),`
`,n.jsx(e.h3,{id:"template-registry",children:"Template Registry"}),`
`,n.jsx(e.p,{children:"Templates are version-controlled and maintained:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const templates = {\r
  'nextjs-app': {\r
    version: '1.2.0',\r
    source: 'https://registry.nocturna.network/templates/nextjs-app',\r
    files: ['package.json', 'tsconfig.json', 'next.config.js', ...],\r
  },\r
  'component-library': {\r
    version: '1.1.0',\r
    source: 'https://registry.nocturna.network/templates/component-library',\r
    files: ['package.json', 'rollup.config.js', '.storybook/', ...],\r
  },\r
};
`})}),`
`,n.jsx(e.h2,{id:"network-topology",children:"Network Topology"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Location"}),": Helios Control (192.168.86.114)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Port"}),": 3002"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Protocol"}),": HTTPS"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Auth"}),": nocturnaID with Engineer role"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Storage"}),": Synology NAS (192.168.86.27)"]}),`
`]}),`
`,n.jsx(e.h2,{id:"integration-points",children:"Integration Points"}),`
`,n.jsx(e.h3,{id:"slate-integration",children:"SLATE Integration"}),`
`,n.jsx(e.p,{children:"Automatically includes design tokens:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Generated file: src/tokens/index.ts\r
export { slateTokens } from '@wissil/slate';\r
\r
// Tailwind config extends SLATE\r
module.exports = {\r
  presets: [require('@wissil/slate/tailwind')],\r
  // ... your customizations\r
};
`})}),`
`,n.jsx(e.h3,{id:"spark-integration",children:"SPARK Integration"}),`
`,n.jsx(e.p,{children:"AI-powered component generation:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-json",children:`{\r
  "scripts": {\r
    "spark:generate": "spark generate --project .",\r
    "spark:chat": "spark chat --context ."\r
  }\r
}
`})}),`
`,n.jsx(e.h3,{id:"ignis-integration",children:"IGNIS Integration"}),`
`,n.jsx(e.p,{children:"Development server configuration:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-json",children:`{\r
  "scripts": {\r
    "dev": "ignis dev",\r
    "build": "ignis build",\r
    "preview": "ignis preview"\r
  }\r
}
`})}),`
`,n.jsx(e.h3,{id:"waypoint-integration",children:"WAYPOINT Integration"}),`
`,n.jsx(e.p,{children:"Deployment pipeline setup:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/deploy.yml\r
name: Deploy\r
on:\r
  push:\r
    branches: [main]\r
jobs:\r
  deploy:\r
    runs-on: ubuntu-latest\r
    steps:\r
      - uses: actions/checkout@v3\r
      - run: npm install\r
      - run: npm run build\r
      - uses: waypoint/deploy@v1
`})}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.h3,{id:"project-naming",children:"Project Naming"}),`
`,n.jsx(e.p,{children:"Follow these conventions:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"kebab-case"}),": ",n.jsx(e.code,{children:"my-awesome-app"})]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Descriptive"}),": Clear purpose from name"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Unique"}),": Avoid common names"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Consistent"}),": Match repository name"]}),`
`]}),`
`,n.jsx(e.h3,{id:"directory-structure",children:"Directory Structure"}),`
`,n.jsx(e.p,{children:"Maintain clean organization:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Flat when possible"}),": Avoid deep nesting"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Logical grouping"}),": Related files together"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Index files"}),": Export from folders"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Tests alongside"}),": ",n.jsx(e.code,{children:"Button.tsx"})," + ",n.jsx(e.code,{children:"Button.test.tsx"})]}),`
`]}),`
`,n.jsx(e.h3,{id:"configuration",children:"Configuration"}),`
`,n.jsx(e.p,{children:"Keep configs minimal:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Extend presets"}),": Don't reinvent the wheel"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Document overrides"}),": Explain custom settings"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Version control"}),": Commit all config files"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Environment variables"}),": Use ",n.jsx(e.code,{children:".env.example"})]}),`
`]}),`
`,n.jsx(e.h2,{id:"performance",children:"Performance"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Template download"}),": < 2s"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"File generation"}),": < 5s"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Dependency install"}),": Varies (60s - 180s)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Total setup time"}),": < 3 minutes"]}),`
`]}),`
`,n.jsx(e.h2,{id:"accessibility",children:"Accessibility"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Keyboard navigation through wizard"}),`
`,n.jsx(e.li,{children:"✅ Screen reader compatible"}),`
`,n.jsx(e.li,{children:"✅ Clear error messages"}),`
`,n.jsx(e.li,{children:"✅ Progress indicators"}),`
`,n.jsx(e.li,{children:"✅ Cancel/back support"}),`
`]}),`
`,n.jsx(e.h2,{id:"future-enhancements",children:"Future Enhancements"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Custom template creation UI"}),`
`,n.jsx(e.li,{children:"[ ] Template marketplace"}),`
`,n.jsx(e.li,{children:"[ ] AI-assisted configuration"}),`
`,n.jsx(e.li,{children:"[ ] Visual project structure preview"}),`
`,n.jsx(e.li,{children:"[ ] One-click deployment setup"}),`
`]})]})}function h(i={}){const{wrapper:e}={...s(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(r,{...i})}):r(i)}export{h as default};
