# SPARK Complete Build Plan - 10/10 Comprehensive Todo List

This document contains ALL todos from the original plan PLUS all gap-filling items to bring the plan to 10/10. These are organized as comprehensive line items ready to be added to the plan.

---

## EXISTING PLAN TODOS (KEEP ALL OF THESE)

### Phase 0: Project Setup & Migration
1. Migrate to Next.js App Router
2. Install Next.js 14+ with App Router
3. Set up project structure: `/app`, `/public`, `/runtime`, `/server`, `/engines`
4. Configure TypeScript for Next.js
5. Set up path aliases (`@/app`, `@/runtime`, etc.)
6. Install Core Dependencies (Next.js 14+, React 18+, TypeScript, Monaco Editor, WebContainer libraries, Docker-related packages)

### Phase 1: Complete UI Layer
7. Create `app/spark/layout.tsx` - Root layout with metadata
8. Create `app/spark/page.tsx` - Main two-panel SPARK page
9. Create `app/spark/styles/globals.css` - Global theme tokens
10. Create `app/spark/components/MCPPanel/index.tsx` - Main MCP panel container
11. Create `app/spark/components/MCPPanel/TabSwitcher.tsx` - Tab navigation
12. Create `app/spark/components/MCPPanel/MCPChat.tsx` - Chat input & messages
13. Create `app/spark/components/MCPPanel/MCPPlan.tsx` - AI reasoning steps display
14. Create `app/spark/components/MCPPanel/MCPActions.tsx` - Executed actions log
15. Create `app/spark/components/MCPPanel/MCPAgents.tsx` - Multi-expert agent status
16. Create `app/spark/components/MCPPanel/MCPFiles.tsx` - Virtual FS tree viewer
17. Create `app/spark/components/MCPPanel/MCPHistory.tsx` - Session history
18. Create `app/spark/components/PreviewPanel/index.tsx` - Main preview container
19. Create `app/spark/components/PreviewPanel/RuntimeTabs.tsx` - Engine tabs
20. Create `app/spark/components/PreviewPanel/PopoutButton.tsx` - Pop-out window handler
21. Create `app/spark/components/PreviewPanel/PreviewModeSelector.tsx` - Auto/Fast/Accurate mode toggle
22. Create `app/spark/bridge/bridge-types.ts` - TypeScript message contracts
23. Create `app/spark/bridge/bridge-client.ts` - Next.js → Runtime communication
24. Create `app/spark/bridge/bridge-runtime.ts` - Runtime → UI communication
25. Create `app/spark/styles/ui.css` - Panel, tab, component styles

### Phase 2-10: (All existing todos from original plan)

---

## GAP-FILLING TODOS (ADD ALL OF THESE)

### SECTION A: MVP DEFINITION & INCREMENTAL DELIVERY

26. Define MVP 1 scope: Unity-only engine support
27. Define MVP 1 features: Basic UI, simple MCP chat, local preview, ZIP export
28. Define MVP 1 success criteria: User can generate Unity C# script and export as ZIP
29. Create MVP 1 acceptance test checklist
30. Define MVP 1 timeline and resource allocation
31. Create MVP 1 feature freeze date
32. Document MVP 1 user stories
33. Create MVP 1 demo script
34. Define MVP 2 scope: 3 engines (Unity, Godot, PICO-8)
35. Define MVP 2 features: Virtual FS, WASM preview (Tier A), multi-engine export
36. Define MVP 2 success criteria: User can generate assets for all 3 engines
37. Create MVP 2 acceptance test checklist
38. Define MVP 2 timeline and resource allocation
39. Define MVP 3 scope: All 7 engines with full support
40. Define MVP 3 features: Docker preview (Tier B), complete engine adapters
41. Define MVP 3 success criteria: All engines generate, validate, and export correctly
42. Create MVP 3 acceptance test checklist
43. Define MVP 4 scope: Full MCP agent system, Storybook, production deployment
44. Define MVP 4 features: Complete agent routing, comprehensive docs, CI/CD
45. Define MVP 4 success criteria: Production-ready system with full monitoring
46. Define shipping milestone after Phase 1: "SPARK Alpha - UI Works"
47. Define shipping milestone after Phase 3: "SPARK Beta - Virtual FS Works"
48. Define shipping milestone after Phase 5: "SPARK Beta+ - Preview Works"
49. Define shipping milestone after Phase 7: "SPARK v1.0 - All Engines"
50. Create milestone validation gates (go/no-go criteria)
51. Define rollback strategy for each milestone

### SECTION B: TESTING STRATEGY

52. Set up Jest/Vitest for unit testing
53. Set up Playwright/Cypress for E2E testing
54. Set up Testing Library for component testing
55. Configure test coverage reporting (target: 80%+)
56. Set up CI test pipeline (run on every commit)
57. Create test data fixtures and mocks
58. Set up visual regression testing (Percy/Chromatic)
59. Unit tests for all UI components (MCP panels, preview panels, tabs)
60. Unit tests for bridge layer (bridge-client, bridge-runtime, bridge-types)
61. Unit tests for virtual filesystem (spark-fs.ts) - all operations
62. Unit tests for runtime sandbox (spark-worker.ts, spark-runtime.ts)
63. Unit tests for all 7 engine adapters (validate, generate, export methods)
64. Unit tests for preview renderers (WASM and Docker)
65. Unit tests for MCP agent routing logic
66. Unit tests for file system operations (read, write, delete, list)
67. Achieve 80%+ code coverage for all modules
68. Integration tests for Next.js ↔ WebContainer bridge communication
69. Integration tests for UI ↔ Runtime message passing
70. Integration tests for Docker preview container communication
71. Integration tests for engine adapter pipeline (prompt → generate → validate → export)
72. Integration tests for virtual FS ↔ runtime worker synchronization
73. Integration tests for MCP agent → engine adapter routing
74. Integration tests for preview mode switching (Tier A ↔ Tier B)
75. Integration tests for pop-out window synchronization
76. E2E test: User generates Unity C# script from prompt
77. E2E test: User generates Godot scene and exports
78. E2E test: User generates PICO-8 cart and previews
79. E2E test: User switches between engines seamlessly
80. E2E test: User exports multi-engine project as ZIP
81. E2E test: User uses pop-out preview window
82. E2E test: User switches preview modes (Auto/Fast/Accurate)
83. E2E test: MCP agent completes full generation workflow
84. E2E test: Error handling and recovery flows
85. E2E test: Concurrent user sessions (if applicable)
86. Performance test: Preview load time < 2 seconds (Tier A)
87. Performance test: Preview load time < 10 seconds (Tier B Docker)
88. Performance test: Code generation latency < 5 seconds
89. Performance test: File system operations < 100ms
90. Performance test: UI render time < 1 second
91. Performance test: Bridge message round-trip < 50ms
92. Performance test: Memory usage benchmarks (browser and Docker)
93. Performance test: Concurrent preview requests (load testing)
94. Performance test: Large file handling (10MB+ assets)
95. Create performance regression test suite
96. Security test: Code execution sandbox isolation
97. Security test: LLM prompt injection prevention
98. Security test: File system access controls
99. Security test: Docker container escape prevention
100. Security test: XSS prevention in UI components
101. Security test: CSRF protection for API endpoints
102. Security test: Input validation on all user inputs
103. Security test: Rate limiting on API endpoints
104. Security audit: Third-party dependency vulnerabilities
105. Penetration testing: Full security audit before production
106. Validation test: Unity C# syntax checking (AST validation)
107. Validation test: Godot GDScript syntax validation
108. Validation test: PICO-8 token count limits
109. Validation test: GameMaker GML syntax checking
110. Validation test: Ren'Py script grammar validation
111. Validation test: All engines generate valid export files
112. Validation test: Engine exports can be imported into real engines
113. Golden sample tests: 5-10 test cases per engine that must always pass

### SECTION C: RESOURCE PLANNING & BUDGET

114. Define required team size for MVP 1 (e.g., 2-3 developers)
115. Define required team size for full build (all 10 phases)
116. Define skill requirements: Next.js, WebContainers, Docker, LLM integration
117. Create role definitions (Frontend, Backend, DevOps, QA)
118. Define timeline estimates per phase (optimistic, realistic, pessimistic)
119. Create resource allocation matrix across phases
120. Calculate Docker container hosting costs (7 engines × container instances)
121. Calculate container pooling/reuse strategy cost savings
122. Calculate LLM API costs (Claude/GPT for MCP agents) - per-user estimate
123. Calculate compute resources for preview streaming (CPU, memory, bandwidth)
124. Calculate storage costs for virtual filesystem (IndexedDB limits)
125. Calculate CDN costs for static assets and preview frames
126. Calculate monitoring and logging infrastructure costs
127. Create cost model: Development vs. Production vs. Scale (100/1000/10000 users)
128. Define cost optimization strategies (container reuse, caching, rate limiting)
129. Create detailed timeline for Phase 0 (Setup): 1-2 weeks
130. Create detailed timeline for Phase 1 (UI): 3-4 weeks
131. Create detailed timeline for Phase 2 (Runtime HTML): 1 week
132. Create detailed timeline for Phase 3 (Virtual FS): 2-3 weeks
133. Create detailed timeline for Phase 4 (Runtime Sandbox): 3-4 weeks
134. Create detailed timeline for Phase 5 (Tier A Preview): 2-3 weeks
135. Create detailed timeline for Phase 6 (Tier B Preview): 4-6 weeks
136. Create detailed timeline for Phase 7 (Engine Adapters): 6-8 weeks
137. Create detailed timeline for Phase 8 (MCP Agents): 4-6 weeks
138. Create detailed timeline for Phase 9 (Storybook): 2 weeks
139. Create detailed timeline for Phase 10 (Deployment): 2-3 weeks
140. Create buffer time (20-30%) for unexpected delays
141. Create critical path analysis (which phases can't be delayed)

### SECTION D: RISK MANAGEMENT & MITIGATION

142. Risk mitigation: WebContainers don't work well for game engines - Create POC before Phase 4
143. Risk fallback: WebContainers - Use iframe + postMessage alternative if POC fails
144. Risk monitoring: WebContainer - Track WebContainer performance metrics
145. Risk mitigation: Docker preview containers are too slow/expensive - Container pooling and reuse strategy
146. Risk fallback: Docker preview - Limit to Tier A (WASM) preview only if costs too high
147. Risk monitoring: Docker preview - Track preview latency and costs
148. Risk mitigation: LLM API integration is unreliable or expensive - Multi-provider support (Claude + GPT + fallback)
149. Risk fallback: LLM API - Mock responses for development, graceful degradation
150. Risk monitoring: LLM API - Track API response times, errors, costs
151. Risk mitigation: One engine adapter breaks the entire system - Isolated adapter architecture, error boundaries
152. Risk fallback: Engine adapter - Disable broken engine, continue with others
153. Risk monitoring: Engine adapter - Per-engine error tracking and alerting
154. Risk mitigation: Browser memory limits for large projects - Virtual scrolling, lazy loading, pagination
155. Risk fallback: Browser memory - Server-side rendering for large files
156. Risk monitoring: Browser memory - Memory usage tracking and warnings
157. Risk mitigation: Scope creep during development - Strict MVP definition, feature freeze dates
158. Risk fallback: Scope creep - Defer non-MVP features to post-v1.0
159. Risk process: Scope creep - Change request review board
160. Risk mitigation: Timeline slips beyond acceptable window - Regular milestone reviews, buffer time
161. Risk fallback: Timeline - Reduce scope, ship MVP earlier
162. Risk process: Timeline - Weekly progress reviews
163. Risk mitigation: Resource constraints - Cross-training, documentation, knowledge sharing
164. Risk fallback: Resources - Reduce scope or extend timeline
165. Risk process: Resources - Monthly resource review
166. Risk mitigation: Insufficient testing leads to production bugs - Mandatory test coverage, QA review gates
167. Risk fallback: Testing - Extended beta testing period
168. Risk process: Testing - Test coverage reports in CI
169. Risk mitigation: Performance issues at scale - Performance budgets, load testing
170. Risk fallback: Performance - Optimize critical paths, add caching
171. Risk monitoring: Performance - Performance dashboards
172. Create risk register document (all risks, mitigations, owners)
173. Schedule weekly risk review meetings
174. Create risk escalation process
175. Define risk thresholds (when to trigger fallback plans)

### SECTION E: PERFORMANCE & SCALABILITY

176. Define performance budget: UI initial load < 2 seconds
177. Define performance budget: Preview load (Tier A) < 2 seconds
178. Define performance budget: Preview load (Tier B) < 10 seconds
179. Define performance budget: Code generation < 5 seconds
180. Define performance budget: File operations < 100ms
181. Define performance budget: Bridge messages < 50ms round-trip
182. Define performance budget: Memory usage < 500MB per user session
183. Set up performance monitoring to track budgets
184. Define concurrent user limit for MVP 1 (e.g., 10-50 users)
185. Define concurrent user limit for v1.0 (e.g., 100-500 users)
186. Define concurrent user limit for v2.0 (e.g., 1000+ users)
187. Define Docker container limits (max concurrent previews)
188. Define file system size limits (per project, per user)
189. Define API rate limits (per user, per endpoint)
190. Create auto-scaling strategy for Docker containers
191. Implement container pooling for Docker previews (reuse containers)
192. Implement preview request queuing (prevent overload)
193. Implement caching strategy (generated assets, preview frames)
194. Implement lazy loading for UI components
195. Implement virtual scrolling for large file lists
196. Implement code splitting for Next.js bundles
197. Implement CDN for static assets
198. Implement database query optimization (if database is added)
199. Define browser memory constraints (IndexedDB limits)
200. Define CPU usage constraints (worker thread limits)
201. Define network bandwidth constraints (preview streaming)
202. Define storage constraints (virtual FS per project)
203. Create resource monitoring and alerting

### SECTION F: SECURITY & SANDBOXING

204. Implement strict sandbox for runtime code execution
205. Prevent arbitrary code execution in browser (WebContainer isolation)
206. Implement timeout limits for code execution
207. Implement memory limits for code execution
208. Implement network access restrictions
209. Implement file system access restrictions (chroot-like)
210. Security audit: Review all code execution paths
211. Implement prompt injection prevention (input sanitization)
212. Implement output validation (check LLM outputs before execution)
213. Implement rate limiting on LLM API calls
214. Implement content filtering (block malicious prompts)
215. Security audit: Review all LLM integration points
216. Harden Docker containers (minimal base images, no root user)
217. Implement container resource limits (CPU, memory, disk)
218. Implement container network isolation
219. Implement container timeout and auto-cleanup
220. Implement container escape prevention (seccomp, AppArmor)
221. Security audit: Review all Docker configurations
222. Implement file path validation (prevent directory traversal)
223. Implement file size limits (prevent DoS)
224. Implement file type validation (whitelist allowed types)
225. Implement access controls (user can only access own files)
226. Implement file encryption at rest (if storing sensitive data)
227. Implement XSS prevention (Content Security Policy)
228. Implement CSRF protection (for API endpoints)
229. Implement input validation on all user inputs
230. Implement output encoding (prevent injection attacks)
231. Security audit: Review all UI components
232. Schedule security audit before MVP 1 release
233. Schedule security audit before v1.0 production release
234. Implement security logging and monitoring
235. Create incident response plan
236. Create security documentation (threat model, security architecture)

### SECTION G: DOCUMENTATION

237. Create architecture decision records (ADRs) for major decisions
238. Create system architecture diagram (high-level)
239. Create component architecture diagram (detailed)
240. Create data flow diagrams (UI → Runtime → Engine)
241. Document bridge layer protocol specification
242. Document engine adapter interface specification
243. Create deployment architecture diagram
244. Document Next.js API routes (if any)
245. Document bridge message protocol (bridge-types.ts)
246. Document engine adapter API (validate, generate, export methods)
247. Document Docker preview API endpoints
248. Create API usage examples for each endpoint
249. Generate API documentation (OpenAPI/Swagger)
250. Create developer onboarding guide
251. Create local development setup guide
252. Create code style guide and conventions
253. Document how to add a new engine adapter
254. Document how to add a new MCP agent tool
255. Create troubleshooting guide
256. Document testing guidelines
257. Create user guide for MVP 1 (basic usage)
258. Create user guide for each engine (how to generate assets)
259. Create video tutorials for common workflows
260. Create FAQ document
261. Create troubleshooting guide for users
262. Create deployment guide
263. Create monitoring and alerting guide
264. Create incident response runbook
265. Create backup and recovery procedures
266. Document environment variables and configuration

### SECTION H: VALIDATION GATES & CHECKPOINTS

267. Phase 0 Validation Gate: Next.js setup complete and working
268. Phase 0 Validation Gate: Project structure created correctly
269. Phase 0 Validation Gate: Dependencies installed and configured
270. Phase 0 Validation Gate: Development environment working
271. Phase 0 Validation Gate: Basic "Hello World" page renders
272. Phase 1 Validation Gate: Two-panel UI renders correctly
273. Phase 1 Validation Gate: MCP left panel with all tabs works
274. Phase 1 Validation Gate: Right preview panel renders
275. Phase 1 Validation Gate: Bridge layer initialized
276. Phase 1 Validation Gate: Theme and styling applied correctly
277. Phase 1 Validation Gate: No console errors
278. Phase 3 Validation Gate: Virtual filesystem can create/read/write files
279. Phase 3 Validation Gate: Files persist across sessions
280. Phase 3 Validation Gate: File operations are fast (< 100ms)
281. Phase 3 Validation Gate: No memory leaks in filesystem
282. Phase 3 Validation Gate: Files can be exported as ZIP
283. Phase 5 Validation Gate: WASM preview renders sprites correctly
284. Phase 5 Validation Gate: WASM preview renders animations
285. Phase 5 Validation Gate: Preview load time < 2 seconds
286. Phase 5 Validation Gate: No browser crashes
287. Phase 5 Validation Gate: Memory usage within limits
288. Phase 6 Validation Gate: Docker Unity preview works
289. Phase 6 Validation Gate: Docker Godot preview works
290. Phase 6 Validation Gate: Preview streaming is stable
291. Phase 6 Validation Gate: Preview load time < 10 seconds
292. Phase 6 Validation Gate: Container cleanup works
293. Phase 7 Validation Gate: All 7 engines can generate assets
294. Phase 7 Validation Gate: All 7 engines can validate outputs
295. Phase 7 Validation Gate: All 7 engines can export correctly
296. Phase 7 Validation Gate: Golden sample tests pass for all engines
297. Phase 7 Validation Gate: Engine exports work in real engines
298. MVP 1 Go/No-Go: Unity engine works, basic preview, export works
299. MVP 2 Go/No-Go: 3 engines work, Virtual FS works, Tier A preview works
300. MVP 3 Go/No-Go: All 7 engines work, Tier B preview works
301. MVP 4 Go/No-Go: MCP agents work, Storybook complete, production-ready

### SECTION I: MONITORING & OBSERVABILITY

302. Set up error tracking (Sentry or similar)
303. Set up performance monitoring (APM)
304. Set up user analytics (usage tracking)
305. Set up custom metrics dashboard
306. Implement health check endpoints
307. Monitor Docker container health and resource usage
308. Monitor LLM API usage and costs
309. Monitor file system storage usage
310. Monitor network bandwidth usage
311. Set up alerting for critical issues
312. Track user sign-ups and active users
313. Track generation requests per engine
314. Track preview requests (Tier A vs Tier B)
315. Track export/download rates
316. Track error rates and types

### SECTION J: ROLLBACK & RECOVERY STRATEGIES

317. Create rollback procedure for each deployment phase
318. Document how to rollback Next.js deployment
319. Document how to rollback Docker containers
320. Test rollback procedures in staging
321. Create automated rollback triggers (on critical errors)
322. Implement backup strategy for virtual filesystem
323. Implement backup strategy for user projects
324. Test data recovery procedures
325. Document recovery time objectives (RTO)
326. Document recovery point objectives (RPO)
327. Implement feature flags for major features
328. Create procedure to disable broken features quickly
329. Test feature rollback procedures

### SECTION K: MIGRATION & UPGRADE STRATEGIES

330. Create "what if Next.js doesn't work" fallback plan
331. Document alternative UI frameworks (if needed)
332. Test Next.js setup in isolation first
333. Plan for future database needs (if virtual FS needs backend)
334. Document migration path from IndexedDB to PostgreSQL (if needed)
335. Create migration scripts template
336. Document how to upgrade Next.js versions
337. Document how to upgrade Docker containers
338. Document how to upgrade engine adapters
339. Create compatibility matrix

### SECTION L: QUALITY ASSURANCE PROCESSES

340. Define code review requirements (all PRs must be reviewed)
341. Define code review checklist
342. Set up automated code quality checks (ESLint, Prettier)
343. Set up automated security scans
344. Define test requirements (all features must have tests)
345. Set up test coverage gates (minimum 80%)
346. Define when E2E tests are required
347. Set up automated test runs on PRs
348. Define release checklist
349. Define staging deployment process
350. Define production deployment process
351. Create release notes template
352. Define post-release monitoring period

---

## TOTAL TODOS: 352 Comprehensive Line Items

**Breakdown:**
- Original Plan Todos: ~15 (Phases 0-10 core tasks)
- Gap-Filling Todos: ~337 (All sections A-L)
- **Total: 352 comprehensive line items**

**All items should be added to the plan WITHOUT removing any existing items.**

