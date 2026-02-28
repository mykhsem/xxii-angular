---
description: Feature development workflow — use when starting work on a new issue or continuing an in-progress issue
---

# Feature Development Workflow

## 1. Pick the issue

- Open `docs/issues/TRIAGING.md`
- Find the highest-priority issue where status is NOT `[DONE]`
- Verify all its `[blocked]` items either have their dependencies resolved or are not needed for the current scope
- If the user specifies an issue, use that instead

## 2. Check for blockers

- Open `docs/INPUT_NEEDED.md`
- Search for gap IDs referenced by the chosen issue in `TRIAGING.md` (e.g., A2, DS3)
- If any open gap blocks the deliverable you're about to build — stop and ask the user to resolve it
- If the gap only blocks a sub-feature, scope your work to what's unblocked

## 3. Check for deferred decisions

- Open `ADR.md`
- Check if this feature triggers a deferred decision:
  - **Composer / Post editor** → triggers ADR-008 (forms approach decision)
  - **Two+ unrelated components sharing state** → triggers ADR-007 (state management decision)
- If a trigger fires: stop, evaluate using `.windsurf/rules/architect.md` framework, record the decision in `ADR.md` before proceeding

## 4. Understand requirements

- Open the issue file: `docs/issues/<N>_<name>.md`
- Read every item — `[todo]` items are deliverables, `[review]` items need completion or verification
- Cross-reference with:
  - `docs/UI_UX_requirements.md` — design tokens (§3), spacing (§21), interaction states (§24), accessibility (§27), animations (§29)
  - `docs/architecture/OVERVIEW.md` — reactive data flow, service boundary patterns
- Check `public/mock-data.json` — verify mock data exists for the entities this feature needs

## 5. Implement

Follow these rules during implementation:

- **`.windsurf/rules/conventions.md`** — Angular API stability, RxJS patterns, component conventions
- **`.windsurf/rules/dev_coder.md`** — component scaffold, file structure, test scaffold, reactive patterns
- **`.windsurf/rules/designer.md`** — terminal aesthetic, design tokens, interaction states

Implementation order per component:
1. Scaffold component files following naming conventions
2. Implement all four states: loading, empty, error, success
3. Style with design tokens — never raw hex values
4. Add interaction states: hover, focus, active, disabled, selected
5. Add accessibility: ARIA roles, focus ring, touch targets
6. Write co-located tests (creation, empty state, error state, success scenario)

// turbo
7. Run `npx vitest run` to verify tests pass

// turbo
8. Run `npx prettier --check .` to verify formatting

// turbo
9. Run `npx ng lint` to verify linting

## 6. Update documentation

After implementation is complete:

- **Issue file** (`docs/issues/<N>_*.md`): flip completed items from `[todo]`/`[review]` → `[done]`
- **`TRIAGING.md`**: update the issue's open items section — flip resolved `[blocked]`/`[todo]`/`[review]` → `[done]`; check if completing this work unblocks `[blocked]` items in OTHER issues and flip those to `[todo]`
- **`INPUT_NEEDED.md`**: close any questions that were answered during implementation
- **`ADR.md`**: if a new decision was made, verify it's recorded with date, context, alternatives, consequences
