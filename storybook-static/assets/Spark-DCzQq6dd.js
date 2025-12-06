import{j as n}from"./iframe-BXkX_8oL.js";import{useMDXComponents as s}from"./index-4MjfFERE.js";import{M as t}from"./index-BxKd_lEk.js";import"./preload-helper-C1FmrZbK.js";import"./index-C-Mlwwfn.js";function r(i){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Lumenforge.io Design System/WIS2L Framework/Spark/Documentation/Spark",id:"wis2l-spark-docs-stories",name:"Spark WIS2L Docs"}),`
`,n.jsx(e.h1,{id:"spark---ai-component-generator",children:"SPARK - AI Component Generator"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"SPARK"})," uses Mixture of Experts (MoE) and Model Context Protocol (MCP) to generate production-ready components with intelligent context awareness."]}),`
`,n.jsx(e.h2,{id:"purpose",children:"Purpose"}),`
`,n.jsx(e.p,{children:"SPARK revolutionizes component development by:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"AI Generation"}),": Natural language to production code"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Context Awareness"}),": Understands your project structure"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"WISSIL Standards"}),": Follows design patterns automatically"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Multi-Expert System"}),": Specialized AI models collaborate"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Instant Iteration"}),": Rapid prototyping and refinement"]}),`
`]}),`
`,n.jsx(e.h2,{id:"architecture",children:"Architecture"}),`
`,n.jsx(e.h3,{id:"mixture-of-experts-moe",children:"Mixture of Experts (MoE)"}),`
`,n.jsx(e.p,{children:"SPARK employs three specialized experts:"}),`
`,n.jsx(e.h4,{id:"design-expert",children:"Design Expert"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Specialty"}),": Visual Design & Styling"]}),`
`,n.jsx(e.p,{children:"Responsibilities:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"SLATE token usage"}),`
`,n.jsx(e.li,{children:"Responsive design patterns"}),`
`,n.jsx(e.li,{children:"Accessibility (WCAG AA+)"}),`
`,n.jsx(e.li,{children:"Visual hierarchy"}),`
`,n.jsx(e.li,{children:"Animation and transitions"}),`
`,n.jsx(e.li,{children:"Glassmorphism and effects"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Example Output:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Design Expert ensures SLATE tokens and responsive design\r
<div className="glass-container p-6 rounded-2xl">\r
  <h2 className="text-3xl font-bold text-gradient-spark mb-4">\r
    Generated Component\r
  </h2>\r
  <p className="text-neutral-300 text-lg leading-relaxed">\r
    Content with proper spacing and typography\r
  </p>\r
</div>
`})}),`
`,n.jsx(e.h4,{id:"logic-expert",children:"Logic Expert"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Specialty"}),": Business Logic & State Management"]}),`
`,n.jsx(e.p,{children:"Responsibilities:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"React hooks (useState, useEffect, etc.)"}),`
`,n.jsx(e.li,{children:"State management patterns"}),`
`,n.jsx(e.li,{children:"Data flow architecture"}),`
`,n.jsx(e.li,{children:"Event handling"}),`
`,n.jsx(e.li,{children:"API integration"}),`
`,n.jsx(e.li,{children:"Form validation"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Example Output:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Logic Expert handles state and interactions\r
const [data, setData] = useState<Item[]>([]);\r
const [loading, setLoading] = useState(false);\r
\r
useEffect(() => {\r
  async function fetchData() {\r
    setLoading(true);\r
    const result = await api.getItems();\r
    setData(result);\r
    setLoading(false);\r
  }\r
  fetchData();\r
}, []);
`})}),`
`,n.jsx(e.h4,{id:"performance-expert",children:"Performance Expert"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Specialty"}),": Optimization & Best Practices"]}),`
`,n.jsx(e.p,{children:"Responsibilities:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"React.memo, useMemo, useCallback"}),`
`,n.jsx(e.li,{children:"Lazy loading and code splitting"}),`
`,n.jsx(e.li,{children:"Bundle size optimization"}),`
`,n.jsx(e.li,{children:"Render performance"}),`
`,n.jsx(e.li,{children:"Image optimization"}),`
`,n.jsx(e.li,{children:"Accessibility best practices"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Example Output:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// Performance Expert adds optimizations\r
const MemoizedComponent = React.memo(({ items }) => {\r
  const sortedItems = useMemo(\r
    () => items.sort((a, b) => a.name.localeCompare(b.name)),\r
    [items]\r
  );\r
\r
  return <List items={sortedItems} />;\r
});
`})}),`
`,n.jsx(e.h3,{id:"intelligent-routing",children:"Intelligent Routing"}),`
`,n.jsx(e.p,{children:"SPARK analyzes your prompt and routes to relevant experts:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface PromptAnalysis {\r
  intent: 'create' | 'modify' | 'debug';\r
  complexity: 'low' | 'medium' | 'high';\r
  domains: ('design' | 'logic' | 'performance')[];\r
  confidence: number;\r
}\r
\r
function routePrompt(prompt: string): Expert[] {\r
  const analysis = analyzePrompt(prompt);\r
\r
  // Route to appropriate experts\r
  const experts: Expert[] = [];\r
  if (analysis.domains.includes('design')) experts.push(designExpert);\r
  if (analysis.domains.includes('logic')) experts.push(logicExpert);\r
  if (analysis.domains.includes('performance')) experts.push(performanceExpert);\r
\r
  return experts;\r
}
`})}),`
`,n.jsx(e.h2,{id:"features",children:"Features"}),`
`,n.jsx(e.h3,{id:"natural-language-input",children:"Natural Language Input"}),`
`,n.jsx(e.p,{children:"Simply describe what you need:"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Examples:"})}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Simple Component:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`"Create a button with loading state"
`})}),`
`,n.jsx(e.p,{children:"Output: Button component with spinner, disabled state, and proper aria-labels."}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Complex Component:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`"Build a data table with sorting, filtering, pagination, and row selection"
`})}),`
`,n.jsx(e.p,{children:"Output: Full-featured table with all requested functionality, TypeScript types, and tests."}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Layout Component:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`"Design a dashboard layout with sidebar navigation and responsive grid"
`})}),`
`,n.jsx(e.p,{children:"Output: Complete layout with mobile hamburger menu, responsive breakpoints, and smooth transitions."}),`
`]}),`
`]}),`
`,n.jsx(e.h3,{id:"context-aware-generation",children:"Context-Aware Generation"}),`
`,n.jsx(e.p,{children:"SPARK understands your project:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Existing Components"}),": Reuses patterns from your codebase"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Design System"}),": Applies your SLATE tokens"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"TypeScript Types"}),": Infers and generates proper types"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"File Structure"}),": Matches your project organization"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Dependencies"}),": Uses packages already in your project"]}),`
`]}),`
`,n.jsx(e.h3,{id:"quick-examples",children:"Quick Examples"}),`
`,n.jsx(e.p,{children:"Pre-built prompts for common needs:"}),`
`,n.jsx(e.p,{children:`| Example | Complexity | Time |\r
|---------|-----------|------|\r
| Navigation Bar | Medium | ~10s |\r
| Data Table | High | ~20s |\r
| Card Component | Low | ~5s |\r
| Form with Validation | High | ~25s |\r
| Modal Dialog | Medium | ~12s |\r
| Search Input | Low | ~8s |`}),`
`,n.jsx(e.h2,{id:"mcp-integration",children:"MCP Integration"}),`
`,n.jsx(e.h3,{id:"model-context-protocol",children:"Model Context Protocol"}),`
`,n.jsx(e.p,{children:"SPARK uses MCP to maintain context across interactions:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface MCPContext {\r
  projectStructure: FileTree;\r
  existingComponents: Component[];\r
  designTokens: SlateTokens;\r
  dependencies: Package[];\r
  userPreferences: Preferences;\r
  conversationHistory: Message[];\r
}
`})}),`
`,n.jsx(e.h3,{id:"mcp-tools",children:"MCP Tools"}),`
`,n.jsx(e.p,{children:"Available tools for component management:"}),`
`,n.jsx(e.h4,{id:"mcp_luminera_read_component",children:"mcp_luminera_read_component"}),`
`,n.jsx(e.p,{children:"Read existing component definitions:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const component = await mcp.readComponent('Button');\r
// Returns: component code, props, dependencies
`})}),`
`,n.jsx(e.h4,{id:"mcp_luminera_write_component",children:"mcp_luminera_write_component"}),`
`,n.jsx(e.p,{children:"Save generated components:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`await mcp.writeComponent('NewCard', {\r
  code: generatedCode,\r
  path: 'src/components/NewCard.tsx',\r
  tests: generatedTests,\r
});
`})}),`
`,n.jsx(e.h4,{id:"mcp_vfs_read--mcp_vfs_write",children:"mcp_vfs_read / mcp_vfs_write"}),`
`,n.jsx(e.p,{children:"File system operations:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const packageJson = await mcp.vfs.read('package.json');\r
await mcp.vfs.write('src/utils/helper.ts', helperCode);
`})}),`
`,n.jsx(e.h2,{id:"generation-workflow",children:"Generation Workflow"}),`
`,n.jsx(e.h3,{id:"1-prompt-analysis",children:"1. Prompt Analysis"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const analysis = {\r
  intent: 'create',\r
  componentType: 'molecule', // Atomic design level\r
  requiredExperts: ['design', 'logic'],\r
  estimatedComplexity: 'medium',\r
  suggestedFiles: ['Component.tsx', 'Component.test.tsx', 'Component.stories.tsx'],\r
};
`})}),`
`,n.jsx(e.h3,{id:"2-expert-collaboration",children:"2. Expert Collaboration"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Design Expert generates structure and styles\r
const designOutput = await designExpert.generate(prompt, context);\r
\r
// Logic Expert adds functionality\r
const logicOutput = await logicExpert.generate(prompt, {\r
  ...context,\r
  designOutput,\r
});\r
\r
// Performance Expert optimizes\r
const finalOutput = await performanceExpert.optimize({\r
  ...designOutput,\r
  ...logicOutput,\r
});
`})}),`
`,n.jsx(e.h3,{id:"3-validation",children:"3. Validation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Validate generated code\r
const validation = {\r
  syntax: checkSyntax(finalOutput.code),\r
  types: checkTypes(finalOutput.code),\r
  linting: runESLint(finalOutput.code),\r
  accessibility: checkA11y(finalOutput.code),\r
};
`})}),`
`,n.jsx(e.h3,{id:"4-output",children:"4. Output"}),`
`,n.jsx(e.p,{children:"Generated files:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`src/components/GeneratedComponent/\r
├── GeneratedComponent.tsx        # Component code\r
├── GeneratedComponent.test.tsx   # Unit tests\r
├── GeneratedComponent.stories.tsx # Storybook story\r
└── index.ts                      # Export
`})}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.h3,{id:"prompt-engineering",children:"Prompt Engineering"}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Good Prompts:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:'✅ "Create a responsive card with image, title, description, and CTA button"'}),`
`,n.jsx(e.li,{children:'✅ "Build a form with email validation and loading state"'}),`
`,n.jsx(e.li,{children:'✅ "Design a modal dialog with smooth animations"'}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Bad Prompts:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:'❌ "Make a component"'}),`
`,n.jsx(e.li,{children:'❌ "Button thing"'}),`
`,n.jsx(e.li,{children:'❌ "Something for users"'}),`
`]}),`
`,n.jsx(e.h3,{id:"iterative-refinement",children:"Iterative Refinement"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Start General"}),': "Create a data table"']}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Add Details"}),': "Add sorting and filtering"']}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Refine"}),': "Make it responsive with mobile view"']}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Polish"}),': "Add loading states and error handling"']}),`
`]}),`
`,n.jsx(e.h3,{id:"review-generated-code",children:"Review Generated Code"}),`
`,n.jsx(e.p,{children:"Always review before committing:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Check for unused imports"}),`
`,n.jsx(e.li,{children:"✅ Verify TypeScript types"}),`
`,n.jsx(e.li,{children:"✅ Test accessibility"}),`
`,n.jsx(e.li,{children:"✅ Confirm responsive behavior"}),`
`,n.jsx(e.li,{children:"✅ Review performance implications"}),`
`]}),`
`,n.jsx(e.h2,{id:"performance",children:"Performance"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Simple Components"}),": 5-10 seconds"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Medium Components"}),": 10-20 seconds"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Complex Components"}),": 20-40 seconds"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Token Usage"}),": Optimized for cost efficiency"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Cache Hit Rate"}),": 60%+ for common patterns"]}),`
`]}),`
`,n.jsx(e.h2,{id:"network-topology",children:"Network Topology"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Location"}),": Helios Compute (192.168.86.115)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Port"}),": 3003"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Protocol"}),": HTTPS + WebSocket"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Auth"}),": nocturnaID with Agent role"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"AI Backend"}),": Distributed MoE cluster"]}),`
`]}),`
`,n.jsx(e.h2,{id:"integration-points",children:"Integration Points"}),`
`,n.jsx(e.h3,{id:"slate",children:"SLATE"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Automatic token usage"}),`
`,n.jsx(e.li,{children:"System color application"}),`
`,n.jsx(e.li,{children:"Typography scale adherence"}),`
`]}),`
`,n.jsx(e.h3,{id:"ignis",children:"IGNIS"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Hot-reload generated components"}),`
`,n.jsx(e.li,{children:"Live preview in browser"}),`
`,n.jsx(e.li,{children:"Instant feedback loop"}),`
`]}),`
`,n.jsx(e.h3,{id:"waypoint",children:"WAYPOINT"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Version generated components"}),`
`,n.jsx(e.li,{children:"Track component evolution"}),`
`,n.jsx(e.li,{children:"Deploy to registry"}),`
`]}),`
`,n.jsx(e.h2,{id:"accessibility",children:"Accessibility"}),`
`,n.jsx(e.p,{children:"Generated components are WCAG AA+ compliant:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ Semantic HTML"}),`
`,n.jsx(e.li,{children:"✅ ARIA labels and roles"}),`
`,n.jsx(e.li,{children:"✅ Keyboard navigation"}),`
`,n.jsx(e.li,{children:"✅ Focus management"}),`
`,n.jsx(e.li,{children:"✅ Color contrast"}),`
`,n.jsx(e.li,{children:"✅ Screen reader tested"}),`
`]}),`
`,n.jsx(e.h2,{id:"future-enhancements",children:"Future Enhancements"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Visual component builder (drag-and-drop)"}),`
`,n.jsx(e.li,{children:"[ ] Component variants generation"}),`
`,n.jsx(e.li,{children:"[ ] Automatic test generation"}),`
`,n.jsx(e.li,{children:"[ ] Design to code (Figma plugin)"}),`
`,n.jsx(e.li,{children:"[ ] Real-time collaboration"}),`
`,n.jsx(e.li,{children:"[ ] Component marketplace"}),`
`]})]})}function p(i={}){const{wrapper:e}={...s(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(r,{...i})}):r(i)}export{p as default};
