# Architecture Decision Records

This document collects all architectural decisions made in the project to keep history transparent.

---

## ADR-001: Derive TypeScript interfaces from xxii-schema

**Date:** 2025-02-21

**Status:** Accepted

**Context:**
The project uses `xxii-schema` (Metarhia metaschema format) as the shared domain model and backend contract. The package is runtime-only JavaScript — it exports a `load()` function and has no TypeScript declarations.

**Decision:**
Manually maintain TypeScript interfaces in `src/app/models/` that mirror the `xxii-schema` definitions. Each schema entity (Author, Chat, Feed, File, Folder, Message, Node, Peer, Post) gets its own file with a barrel re-export via `index.ts`.

Key mapping rules:
- Schema relations (e.g. `owner: 'Author'`) → `string` (ID reference)
- `many` relations → `string[]`
- `?` optional fields → optional property (`field?: type`)
- `enum` → TypeScript union literal types
- `datetime` → `string` (ISO 8601)
- `id: string` added explicitly (implicit in metaschema)

**Consequences:**
- Full compile-time type safety across the Angular app.
- Interfaces must be updated manually when `xxii-schema` evolves.
- The schema package remains the single source of truth for the backend; TypeScript interfaces are a projection for frontend consumption.

---

## ADR-002: Abstract ApiService with swappable mock implementation

**Date:** 2025-02-21

**Status:** Accepted

**Context:**
The backend API is not yet available, but the frontend needs data to develop and test UI components. The data contract is defined by `xxii-schema` and mirrored in `src/app/models/`.

**Decision:**
Introduce a two-layer API service design:
- `ApiService` — abstract class defining the full data-access contract (methods returning `Observable<T>`).
- `MockApiService` — concrete implementation that fetches `public/mock-data.json` via `HttpClient` and filters in memory.
- Wired via Angular DI: `{ provide: ApiService, useClass: MockApiService }` in `app.config.ts`.

Mock data in `public/mock-data.json` contains realistic interconnected records for all 9 entity types with consistent cross-references (author IDs in chats, chat IDs in messages, etc.).

**Consequences:**
- Components inject `ApiService` and are decoupled from the data source.
- Switching to a real backend requires only creating `HttpApiService extends ApiService` and changing `useClass` in the provider — no component changes needed.
- Mock data is served as a static asset, mimicking real HTTP latency and async patterns.
- `shareReplay(1)` caches the mock JSON to avoid repeated fetches during development.

---

## ADR-003: Prettier + ESLint with flat config

**Date:** 2025-02-22

**Status:** Accepted

**Context:**
The project had no linting or consistent formatting enforcement. An inline Prettier config in `package.json` (printWidth 100) existed but Prettier was not installed as a dependency, and no ESLint setup was present.

**Decision:**
Adopt a two-tool approach: Prettier owns formatting, ESLint owns code quality. No overlap.

- **Prettier** — `.prettierrc.json` with `printWidth: 120`, `singleQuote: true`, `bracketSameLine: true`.
- **ESLint** — flat config (`eslint.config.js`) using `@eslint/js`, `typescript-eslint`, `angular-eslint`, with `eslint-config-prettier` applied last to disable formatting rules.
- `eslint-plugin-prettier` intentionally excluded — running Prettier inside ESLint is the legacy pattern and adds noise.
- ESLint enforces: OnPush preference, `inject()` over constructor injection, standalone components, control flow syntax, template accessibility, explicit return types, `no-shadow` (TS-aware), `no-eval`.
- Pinned to `eslint@^9` due to `angular-eslint@21` peer dependency (does not yet support ESLint 10).

**Alternatives considered:**
1. **Do nothing** — formatting drift and no quality guardrails. Cost grows with every new contributor.
2. **Prettier only** — covers formatting but misses Angular-specific patterns (OnPush, signals, control flow).
3. **ESLint with formatting rules** — older approach, creates conflicts with Prettier, harder to maintain.

**Consequences:**
- All committed code must pass `prettier --check .` and `ng lint`.
- `consistent-type-definitions` is `off` — existing codebase uses `interface`; can be revisited later.
- `max-len` removed — Prettier handles line width; the ESLint rule creates false positives on unbreakable lines.
- Base `no-shadow` is `off` in favor of `@typescript-eslint/no-shadow` to avoid false positives on TS constructs.
- When `angular-eslint` supports ESLint 10, upgrade both `eslint` and `@eslint/js` together.
