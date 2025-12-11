# SPARK ↔ SLATE Integration Contract (MVP)

This document defines the minimum interfaces needed to replace SLATE mocks with real SPARK services. Swap subsystems one axis at a time to keep the harness deterministic while SPARK matures.

## Subsystem Boundaries

### Filesystem (FS)
- `read(path: string) -> string | Buffer | null`
- `write(path: string, content: string | Buffer) -> { ok: boolean }`
- `exists(path: string) -> boolean`
- `list(dir: string) -> string[]`
- Events: `fs:written { path, content }`, `fs:deleted { path }`, `fs:renamed { from, to }`

### Compiler
- `compile(source: string, options?: { target?: string; flags?: string[] }) -> { ok: boolean; bytecode?: string; warnings: string[]; errors: string[] }`
- Supports timeouts; deterministic diagnostics.

### Build DB / CacheKeys
- Cache keys: `buildJob(id)`, `buildJobList(projectId)`
- Ops: `createBuildJob`, `getBuildJob`, `listBuildJobs`, `updateBuildJob`, `getBuildStatistics`

### Runtime
- `execute(bytecode: string) -> { ok: boolean; result: string; logs: any[]; metrics: { cpu: number; mem: number } }`
- Hooks: `reload()`, `refresh()`, optional `on(event, handler)` for runtime events.

### Messaging / Events
- Publish: build events, runtime events, fs events
- Subscribe: build updates, runtime updates, fs updates

## Swap Plan (incremental)
1) FS: swap `integration.mock.ts` FS layer to SPARK FS service; keep compiler/runtime mocked.
2) Compiler: swap compiler mock to SPARK compiler API; keep runtime deterministic until stable.
3) Build DB: replace BuildDb mock with SPARK build ops and CacheKeys alignment.
4) Runtime: optionally drive runtime via SPARK once stable; otherwise keep deterministic loop.
5) Reactivate tests per axis (FS → Compiler → Build DB → Runtime → Integration).

## Action Items (next steps)
- [ ] Add feature flags per subsystem to switch mocks ↔ SPARK services.
- [ ] Implement SPARK FS adapter replacing `FSMock` in `packages/slate/mocks/integration.mock.ts`.
- [ ] Implement SPARK compiler adapter replacing `CompilerMock` in `packages/slate/mocks/integration.mock.ts`.
- [ ] Align CacheKeys with SPARK build ops (`buildJob`, `buildJobList`) and swap BuildDb mock when ready.
- [ ] Keep runtime deterministic until SPARK runtime can feed stable outputs; then add adapter.
- [ ] Reactivate skipped test suites as each subsystem is swapped.

## Feature Flags
- Add a simple toggle (env or config) to switch between mocks and SPARK services per subsystem to allow gradual rollout.

## Test Reactivation Order
1) FS + compiler integration tests
2) Build DB tests
3) Full IDE chain tests
4) Editor-host and UI/Inspector once design-system alignment is ready


