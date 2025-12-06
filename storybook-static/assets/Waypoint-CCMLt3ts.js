import{j as n}from"./iframe-BXkX_8oL.js";import{useMDXComponents as s}from"./index-4MjfFERE.js";import{M as t}from"./index-BxKd_lEk.js";import"./preload-helper-C1FmrZbK.js";import"./index-C-Mlwwfn.js";function i(r){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Lumenforge.io Design System/WIS2L Framework/Waypoint/Documentation/Waypoint",id:"wis2l-waypoint-docs-stories",name:"Waypoint WIS2L Docs"}),`
`,n.jsx(e.h1,{id:"waypoint---deployment--version-control",children:"WAYPOINT - Deployment & Version Control"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"WAYPOINT"})," manages the complete component lifecycle from development to production, including versioning, deployment, and release management."]}),`
`,n.jsx(e.h2,{id:"purpose",children:"Purpose"}),`
`,n.jsx(e.p,{children:"WAYPOINT orchestrates deployments by:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Version Management"}),": Semantic versioning and changelog generation"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Environment Control"}),": Production, staging, development environments"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Deployment Automation"}),": CI/CD pipelines and workflows"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Health Monitoring"}),": Uptime tracking and status checks"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Release Management"}),": Coordinated multi-service releases"]}),`
`]}),`
`,n.jsx(e.h2,{id:"architecture",children:"Architecture"}),`
`,n.jsx(e.h3,{id:"deployment-pipeline",children:"Deployment Pipeline"}),`
`,n.jsx(e.p,{children:"Automated workflow from commit to production:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`Git Push\r
    ↓\r
  GitHub Webhook\r
    ↓\r
  Build (IGNIS)\r
    ↓\r
  Test (Jest + Playwright)\r
    ↓\r
  Visual Regression (Chromatic)\r
    ↓\r
  Deploy to Staging\r
    ↓\r
  Smoke Tests\r
    ↓\r
  Deploy to Production\r
    ↓\r
  Health Check\r
    ↓\r
  Version Tag
`})}),`
`,n.jsx(e.h3,{id:"environments",children:"Environments"}),`
`,n.jsx(e.p,{children:"Three deployment targets:"}),`
`,n.jsx(e.h4,{id:"production",children:"Production"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"URL"}),`: nocturna.network\r
`,n.jsx(e.strong,{children:"Location"}),`: Cloudflare Pages\r
`,n.jsx(e.strong,{children:"Version"}),`: v1.2.3\r
`,n.jsx(e.strong,{children:"Uptime"}),`: 99.98%\r
`,n.jsx(e.strong,{children:"Auto-deploy"}),": main branch"]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Configuration:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const production = {\r
  url: 'https://nocturna.network',\r
  cdn: 'cloudflare',\r
  ssl: true,\r
  caching: {\r
    static: '1y',\r
    dynamic: '5m',\r
  },\r
  monitoring: {\r
    healthCheck: '/api/health',\r
    interval: 60, // seconds\r
  },\r
};
`})}),`
`,n.jsx(e.h4,{id:"staging",children:"Staging"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"URL"}),`: staging.nocturna.network\r
`,n.jsx(e.strong,{children:"Location"}),`: Vercel\r
`,n.jsx(e.strong,{children:"Version"}),`: v1.2.2\r
`,n.jsx(e.strong,{children:"Uptime"}),`: 99.95%\r
`,n.jsx(e.strong,{children:"Auto-deploy"}),": develop branch"]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Configuration:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const staging = {\r
  url: 'https://staging.nocturna.network',\r
  platform: 'vercel',\r
  preview: true,\r
  analytics: true,\r
  passwordProtection: process.env.STAGING_PASSWORD,\r
};
`})}),`
`,n.jsx(e.h4,{id:"development",children:"Development"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"URL"}),`: dev.nocturna.network\r
`,n.jsx(e.strong,{children:"Location"}),`: Helios Compute\r
`,n.jsx(e.strong,{children:"Version"}),`: v1.3.0-beta\r
`,n.jsx(e.strong,{children:"Uptime"}),`: 98.50%\r
`,n.jsx(e.strong,{children:"Deploy"}),": On demand"]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Configuration:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const development = {\r
  url: 'https://dev.nocturna.network',\r
  host: '192.168.86.115',\r
  port: 3000,\r
  hot reload: true,\r
  debugMode: true,\r
};
`})}),`
`,n.jsx(e.h2,{id:"version-control",children:"Version Control"}),`
`,n.jsx(e.h3,{id:"semantic-versioning",children:"Semantic Versioning"}),`
`,n.jsx(e.p,{children:"Follow semver 2.0.0 standard:"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Format"}),": ",n.jsx(e.code,{children:"MAJOR.MINOR.PATCH"})]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"MAJOR"}),": Breaking changes (v1.0.0 → v2.0.0)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"MINOR"}),": New features, backward compatible (v1.0.0 → v1.1.0)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"PATCH"}),": Bug fixes, backward compatible (v1.0.0 → v1.0.1)"]}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Examples:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`v1.2.3       # Stable release\r
v1.3.0-beta  # Beta release\r
v2.0.0-rc.1  # Release candidate
`})}),`
`,n.jsx(e.h3,{id:"version-history",children:"Version History"}),`
`,n.jsx(e.p,{children:"Complete audit trail:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface VersionRecord {\r
  version: string;\r
  date: Date;\r
  type: 'major' | 'minor' | 'patch';\r
  changes: string[];\r
  author: string;\r
  commit: string;\r
  deployments: Deployment[];\r
}\r
\r
const versions: VersionRecord[] = [\r
  {\r
    version: 'v1.2.3',\r
    date: new Date('2024-11-29'),\r
    type: 'patch',\r
    changes: [\r
      'Fixed SLATE token loading',\r
      'Improved HMR performance',\r
      'Updated dependencies',\r
    ],\r
    author: 'Lumines',\r
    commit: 'abc123',\r
    deployments: [\r
      { environment: 'staging', timestamp: '2024-11-29T10:00:00Z' },\r
      { environment: 'production', timestamp: '2024-11-29T14:00:00Z' },\r
    ],\r
  },\r
];
`})}),`
`,n.jsx(e.h3,{id:"changelog",children:"Changelog"}),`
`,n.jsx(e.p,{children:"Auto-generated from commits:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-markdown",children:`# Changelog\r
\r
## [1.2.3] - 2024-11-29\r
\r
### Fixed\r
- Fixed SLATE token loading race condition\r
- Improved HMR performance for large projects\r
\r
### Changed\r
- Updated dependencies to latest versions\r
- Optimized bundle size (-12%)\r
\r
## [1.2.2] - 2024-11-25\r
\r
### Added\r
- New SPARK features for component generation\r
- IGNIS build profiling\r
\r
### Fixed\r
- WAYPOINT deployment timeout issue
`})}),`
`,n.jsx(e.h2,{id:"deployment-workflow",children:"Deployment Workflow"}),`
`,n.jsx(e.h3,{id:"automated-deployment",children:"Automated Deployment"}),`
`,n.jsx(e.p,{children:"GitHub Actions workflow:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`name: Deploy\r
on:\r
  push:\r
    branches: [main, develop]\r
\r
jobs:\r
  deploy:\r
    runs-on: ubuntu-latest\r
    steps:\r
      - uses: actions/checkout@v3\r
\r
      - name: Setup Node\r
        uses: actions/setup-node@v3\r
        with:\r
          node-version: '18'\r
          cache: 'npm'\r
\r
      - name: Install Dependencies\r
        run: npm ci\r
\r
      - name: Run Tests\r
        run: npm test\r
\r
      - name: Build\r
        run: npm run build\r
        env:\r
          NODE_ENV: production\r
\r
      - name: Deploy to Production\r
        if: github.ref == 'refs/heads/main'\r
        uses: cloudflare/pages-action@v1\r
        with:\r
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}\r
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}\r
          projectName: wissil\r
          directory: dist\r
\r
      - name: Health Check\r
        run: |\r
          curl --fail https://nocturna.network/api/health || exit 1\r
\r
      - name: Create Release\r
        uses: actions/create-release@v1\r
        with:\r
          tag_name: v\${{ github.run_number }}\r
          release_name: Release v\${{ github.run_number }}\r
          body: Automated deployment from \${{ github.sha }}
`})}),`
`,n.jsx(e.h3,{id:"manual-deployment",children:"Manual Deployment"}),`
`,n.jsx(e.p,{children:"Deploy specific versions:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Deploy to staging\r
$ waypoint deploy --env staging --version v1.2.3\r
\r
# Deploy to production with confirmation\r
$ waypoint deploy --env production --version v1.2.3 --confirm\r
\r
# Rollback to previous version\r
$ waypoint rollback --env production --to v1.2.2
`})}),`
`,n.jsx(e.h3,{id:"deployment-checklist",children:"Deployment Checklist"}),`
`,n.jsx(e.p,{children:"Pre-deployment verification:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"✅ All tests passing"}),`
`,n.jsx(e.li,{children:"✅ No linter errors"}),`
`,n.jsx(e.li,{children:"✅ Visual regression tests passed"}),`
`,n.jsx(e.li,{children:"✅ Bundle size within limits"}),`
`,n.jsx(e.li,{children:"✅ Performance benchmarks met"}),`
`,n.jsx(e.li,{children:"✅ Security scan clean"}),`
`,n.jsx(e.li,{children:"✅ Changelog updated"}),`
`,n.jsx(e.li,{children:"✅ Version bumped"}),`
`]}),`
`,n.jsx(e.h2,{id:"health-monitoring",children:"Health Monitoring"}),`
`,n.jsx(e.h3,{id:"status-checks",children:"Status Checks"}),`
`,n.jsx(e.p,{children:"Continuous health monitoring:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface HealthCheck {\r
  status: 'healthy' | 'degraded' | 'down';\r
  timestamp: Date;\r
  checks: {\r
    api: boolean;\r
    database: boolean;\r
    cache: boolean;\r
    storage: boolean;\r
  };\r
  metrics: {\r
    responseTime: number;\r
    errorRate: number;\r
    uptime: number;\r
  };\r
}\r
\r
// Health check endpoint\r
app.get('/api/health', async (req, res) => {\r
  const health = await performHealthCheck();\r
  res.status(health.status === 'healthy' ? 200 : 503).json(health);\r
});
`})}),`
`,n.jsx(e.h3,{id:"uptime-tracking",children:"Uptime Tracking"}),`
`,n.jsx(e.p,{children:"Monitor availability:"}),`
`,n.jsx(e.p,{children:`| Environment | Uptime (30d) | Downtime | Incidents |\r
|------------|--------------|----------|-----------|\r
| Production | 99.98% | 8.6 min | 1 |\r
| Staging | 99.95% | 21.6 min | 3 |\r
| Development | 98.50% | 10.8 hr | 12 |`}),`
`,n.jsx(e.h3,{id:"incident-response",children:"Incident Response"}),`
`,n.jsx(e.p,{children:"Automated alerting:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Alert on downtime\r
if (healthCheck.status === 'down') {\r
  await notify({\r
    channel: 'ops',\r
    severity: 'critical',\r
    message: \`Production is down! \${healthCheck.error}\`,\r
    actions: [\r
      'Check logs',\r
      'Rollback deployment',\r
      'Contact on-call',\r
    ],\r
  });\r
}
`})}),`
`,n.jsx(e.h2,{id:"component-registry",children:"Component Registry"}),`
`,n.jsx(e.h3,{id:"publishing",children:"Publishing"}),`
`,n.jsx(e.p,{children:"Publish components to registry:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Publish to registry\r
$ waypoint publish --component Button --version 1.0.0\r
\r
# Package info\r
Component: Button\r
Version: 1.0.0\r
Size: 3.2 KB\r
Dependencies: react, clsx\r
Registry: https://registry.nocturna.network
`})}),`
`,n.jsx(e.h3,{id:"versioning",children:"Versioning"}),`
`,n.jsx(e.p,{children:"Track component versions:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface ComponentVersion {\r
  name: string;\r
  version: string;\r
  published: Date;\r
  size: number;\r
  dependencies: string[];\r
  downloads: number;\r
  deprecated?: boolean;\r
}\r
\r
const buttonVersions = [\r
  { name: 'Button', version: '1.2.0', published: new Date(), size: 3200 },\r
  { name: 'Button', version: '1.1.0', published: new Date(), size: 3100 },\r
  { name: 'Button', version: '1.0.0', published: new Date(), size: 2900 },\r
];
`})}),`
`,n.jsx(e.h2,{id:"network-topology",children:"Network Topology"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Location"}),": Helios Compute (192.168.86.115)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Port"}),": 3005"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Protocol"}),": HTTPS"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Auth"}),": nocturnaID with Admin role"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Storage"}),": Synology NAS (192.168.86.27)"]}),`
`]}),`
`,n.jsx(e.h2,{id:"integration-points",children:"Integration Points"}),`
`,n.jsx(e.h3,{id:"git-integration",children:"Git Integration"}),`
`,n.jsx(e.p,{children:"Automatic version bumps:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Commit triggers version bump\r
$ git commit -m "feat: Add new component"\r
# → Auto-bumps MINOR version\r
\r
$ git commit -m "fix: Bug in Button"\r
# → Auto-bumps PATCH version\r
\r
$ git commit -m "feat!: Breaking change"\r
# → Auto-bumps MAJOR version
`})}),`
`,n.jsx(e.h3,{id:"cicd-integration",children:"CI/CD Integration"}),`
`,n.jsx(e.p,{children:"Works with major CI platforms:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"GitHub Actions (primary)"}),`
`,n.jsx(e.li,{children:"GitLab CI"}),`
`,n.jsx(e.li,{children:"CircleCI"}),`
`,n.jsx(e.li,{children:"Jenkins"}),`
`]}),`
`,n.jsx(e.h3,{id:"monitoring-integration",children:"Monitoring Integration"}),`
`,n.jsx(e.p,{children:"Connects to:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Datadog"}),`
`,n.jsx(e.li,{children:"New Relic"}),`
`,n.jsx(e.li,{children:"Sentry (error tracking)"}),`
`,n.jsx(e.li,{children:"LogRocket (session replay)"}),`
`]}),`
`,n.jsx(e.h3,{id:"slackdiscord-notifications",children:"Slack/Discord Notifications"}),`
`,n.jsx(e.p,{children:"Deployment alerts:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`🚀 Deployment Started\r
Environment: Production\r
Version: v1.2.3\r
Triggered by: @lumines\r
ETA: 3 minutes\r
\r
✅ Deployment Successful\r
Environment: Production\r
Version: v1.2.3\r
Duration: 2m 45s\r
Health: ✓ All systems operational
`})}),`
`,n.jsx(e.h2,{id:"rollback",children:"Rollback"}),`
`,n.jsx(e.h3,{id:"automatic-rollback",children:"Automatic Rollback"}),`
`,n.jsx(e.p,{children:"Revert on failure:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`// Monitor deployment\r
const deployment = await waypoint.deploy({\r
  version: 'v1.2.3',\r
  environment: 'production',\r
  autoRollback: true,\r
  healthCheckTimeout: 300, // 5 minutes\r
});\r
\r
// Health check fails\r
if (!deployment.healthy) {\r
  // Automatic rollback\r
  await waypoint.rollback({\r
    environment: 'production',\r
    to: 'v1.2.2',\r
    reason: 'Health check failed',\r
  });\r
}
`})}),`
`,n.jsx(e.h3,{id:"manual-rollback",children:"Manual Rollback"}),`
`,n.jsx(e.p,{children:"Quick rollback command:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Rollback to previous version\r
$ waypoint rollback production\r
\r
# Rollback to specific version\r
$ waypoint rollback production --to v1.2.0\r
\r
# Rollback with reason\r
$ waypoint rollback production --to v1.2.0 --reason "Critical bug found"
`})}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsx(e.h3,{id:"deployment-strategy",children:"Deployment Strategy"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Blue-Green Deployment"}),": Zero-downtime updates"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Canary Releases"}),": Gradual rollout (10% → 50% → 100%)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Feature Flags"}),": Toggle features without deployment"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Staging First"}),": Always test in staging"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Off-Peak Deployments"}),": Deploy during low traffic"]}),`
`]}),`
`,n.jsx(e.h3,{id:"version-management",children:"Version Management"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Semantic Versioning"}),": Follow semver strictly"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Changelog"}),": Keep updated with every release"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Git Tags"}),": Tag all releases"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Breaking Changes"}),": Document thoroughly"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Deprecation"}),": Warn before removing features"]}),`
`]}),`
`,n.jsx(e.h3,{id:"monitoring",children:"Monitoring"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Health Checks"}),": Monitor all critical paths"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Error Tracking"}),": Catch and report errors"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Performance"}),": Track Core Web Vitals"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Alerts"}),": Set up for critical issues"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Logs"}),": Centralized logging system"]}),`
`]}),`
`,n.jsx(e.h2,{id:"security",children:"Security"}),`
`,n.jsx(e.h3,{id:"access-control",children:"Access Control"}),`
`,n.jsx(e.p,{children:"Role-based deployment permissions:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`const permissions = {\r
  Admin: ['deploy:*', 'rollback:*', 'publish:*'],\r
  Engineer: ['deploy:staging', 'deploy:dev'],\r
  Designer: ['deploy:dev'],\r
  Agent: ['read:*'],\r
};
`})}),`
`,n.jsx(e.h3,{id:"secrets-management",children:"Secrets Management"}),`
`,n.jsx(e.p,{children:"Secure credential storage:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Store secrets\r
$ waypoint secret set API_KEY xxx --env production\r
\r
# Use in deployment\r
environment:\r
  API_KEY: \${{ secrets.API_KEY }}
`})}),`
`,n.jsx(e.h2,{id:"future-enhancements",children:"Future Enhancements"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Multi-region deployments"}),`
`,n.jsx(e.li,{children:"[ ] A/B testing framework"}),`
`,n.jsx(e.li,{children:"[ ] Performance regression detection"}),`
`,n.jsx(e.li,{children:"[ ] Automated capacity scaling"}),`
`,n.jsx(e.li,{children:"[ ] Cost optimization recommendations"}),`
`]})]})}function h(r={}){const{wrapper:e}={...s(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(i,{...r})}):i(r)}export{h as default};
