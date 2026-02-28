# Feature Development Workflow — Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        START: /feature-dev                          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
                   ┌─────────────────────────┐
                   │  1. PICK THE ISSUE       │
                   │                          │
                   │  Read TRIAGING.md        │
                   │  Find highest-priority   │
                   │  non-[DONE] issue        │
                   └────────────┬─────────────┘
                                │
                                ▼
                   ┌─────────────────────────┐
                   │  2. CHECK BLOCKERS       │
                   │                          │
                   │  Read INPUT_NEEDED.md    │
                   │  Match gap IDs from      │
                   │  TRIAGING.md             │
                   └────────────┬─────────────┘
                                │
                     ┌──────────┴──────────┐
                     │                     │
                  has gap               no gap
                  blocking              blocking
                     │                     │
                     ▼                     │
              ┌─────────────┐              │
              │ ASK USER to │              │
              │ resolve gap │              │
              │ or scope    │              │
              │ work down   │              │
              └──────┬──────┘              │
                     │                     │
                     └──────────┬──────────┘
                                │
                                ▼
                   ┌─────────────────────────┐
                   │  3. CHECK DEFERRED       │
                   │     DECISIONS            │
                   │                          │
                   │  Read ADR.md             │
                   │  Does this feature       │
                   │  trigger ADR-007 or      │
                   │  ADR-008?                │
                   └────────────┬─────────────┘
                                │
                     ┌──────────┴──────────┐
                     │                     │
                  trigger               no trigger
                  fires                    │
                     │                     │
                     ▼                     │
              ┌──────────────┐             │
              │ STOP & DECIDE│             │
              │              │             │
              │ Use architect│             │
              │ .md framework│             │
              │ Record in    │             │
              │ ADR.md       │             │
              └──────┬───────┘             │
                     │                     │
                     └──────────┬──────────┘
                                │
                                ▼
                   ┌─────────────────────────┐
                   │  4. UNDERSTAND           │
                   │     REQUIREMENTS         │
                   │                          │
                   │  Read issue file         │
                   │  docs/issues/<N>_*.md    │
                   │                          │
                   │  Cross-reference:        │
                   │  ├─ UI_UX_requirements   │
                   │  ├─ architecture/        │
                   │  │  OVERVIEW.md          │
                   │  └─ mock-data.json       │
                   └────────────┬─────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. IMPLEMENT (per component)                                       │
│                                                                     │
│  Rules applied:                                                     │
│  ├─ conventions.md    (Angular API stability, RxJS)                 │
│  ├─ dev_coder.md      (scaffold, file structure, tests)             │
│  └─ designer.md       (terminal aesthetic, tokens)                  │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐        │
│  │ Scaffold  │──▶│ 4 States │──▶│ Style +  │──▶│ A11y +   │        │
│  │ files     │   │ loading  │   │ tokens   │   │ ARIA     │        │
│  │           │   │ empty    │   │ interact │   │ focus    │        │
│  │           │   │ error    │   │ states   │   │ touch    │        │
│  │           │   │ success  │   │          │   │ targets  │        │
│  └──────────┘   └──────────┘   └──────────┘   └────┬─────┘        │
│                                                      │              │
│                                                      ▼              │
│                                               ┌──────────┐         │
│                                               │  Write    │         │
│                                               │  tests    │         │
│                                               └────┬─────┘         │
│                                                    │                │
└────────────────────────────────────────────────────┼────────────────┘
                                                     │
                                                     ▼
                                          ┌─────────────────────┐
                                          │  VERIFY              │
                                          │                      │
                                          │  $ npx vitest run    │
                                          │  $ npx prettier      │
                                          │    --check .         │
                                          │  $ npx ng lint       │
                                          └──────────┬───────────┘
                                                     │
                                          ┌──────────┴──────────┐
                                          │                     │
                                        fail                  pass
                                          │                     │
                                          ▼                     │
                                   ┌─────────────┐             │
                                   │ Fix issues   │             │
                                   │ Re-run       │─────┐      │
                                   └─────────────┘     │      │
                                          ▲             │      │
                                          └─────────────┘      │
                                                               │
                                                               ▼
                   ┌─────────────────────────────────────────────────┐
                   │  6. UPDATE DOCUMENTATION                        │
                   │                                                 │
                   │  ┌─────────────────────────────────────┐        │
                   │  │ Issue file: [todo]/[review] → [done]│        │
                   │  └─────────────────────────────────────┘        │
                   │  ┌─────────────────────────────────────┐        │
                   │  │ TRIAGING.md: update open items      │        │
                   │  │ Unblock downstream [blocked] items  │        │
                   │  └─────────────────────────────────────┘        │
                   │  ┌─────────────────────────────────────┐        │
                   │  │ INPUT_NEEDED.md: close resolved Qs  │        │
                   │  └─────────────────────────────────────┘        │
                   │  ┌─────────────────────────────────────┐        │
                   │  │ ADR.md: record new decisions if any │        │
                   │  └─────────────────────────────────────┘        │
                   └────────────────────────┬────────────────────────┘
                                            │
                                            ▼
                              ┌──────────────────────────┐
                              │         DONE              │
                              │  Loop back to Step 1      │
                              │  for next issue            │
                              └──────────────────────────┘
```

## Document roles

| Document | Phase | Role |
|---|---|---|
| `TRIAGING.md` | Pick, Update | Issue priority, dependencies, blocked status |
| `INPUT_NEEDED.md` | Check, Update | Open questions that block implementation |
| `ADR.md` | Decide, Update | Architectural decisions — deferred and recorded |
| `docs/issues/<N>_*.md` | Understand, Update | Per-issue requirements and item status |
| `UI_UX_requirements.md` | Understand | Design system reference (tokens, states, a11y) |
| `architecture/OVERVIEW.md` | Understand | Data flow patterns, service boundaries |
| `conventions.md` | Implement | Angular API stability, RxJS rules |
| `dev_coder.md` | Implement | Component scaffold, file structure, tests |
| `designer.md` | Implement | Terminal aesthetic, visual rules |
| `architect.md` | Decide | Decision evaluation framework |
