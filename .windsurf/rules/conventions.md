---
trigger: always_on
description: Coding conventions for xxii-angular — Angular API stability policy, RxJS patterns, and reactive data flow rules
---

# Coding Conventions — xxii-angular

These are **always-enforced** rules. They are not architectural decisions (those live in `ADR.md`) — they are ground-level constraints that apply to every line of code written in this repo.

---

## Angular API Stability Policy

**Baseline: Angular 21 stable.**

- Only use APIs marked **stable** in the Angular 21 documentation.
- `experimental` and `developer preview` APIs are **blocked** until they reach stable status.
  - Example: Signal Forms (`@angular/forms` signal-based API) — blocked. See ADR-005.
  - Example: `@angular/core` resource API — check stability before use.
- When an API's stability is unclear, check the Angular changelog or source `@publicApi` tag.
- All components must be **standalone** — no `NgModule` declarations.

---

## RxJS Conventions

### Subscription cleanup

- Use `takeUntilDestroyed()` (from `@angular/core/rxjs-interop`) in components and directives.
- Do **not** use manual `unsubscribe()` calls stored in class fields.
- Do **not** use `takeUntil(this.destroy$)` with a `Subject` — `takeUntilDestroyed` replaces this pattern.

```ts
// Correct
this.api.getMessages(chatId).pipe(
  takeUntilDestroyed(this.destroyRef),
).subscribe(...)

// Wrong
this.subscription = this.api.getMessages(chatId).subscribe(...)
ngOnDestroy() { this.subscription.unsubscribe(); }
```

### Template rendering

- Prefer `async` pipe in templates over subscribing in `ngOnInit`.
- Subscribing in `ngOnInit` is acceptable only when side-effects (non-rendering) are needed.

```html
<!-- Correct -->
@if (messages$ | async; as messages) { ... }

<!-- Wrong (unless side-effect needed) -->
ngOnInit() { this.messages$.subscribe(m => this.messages = m); }
```

### Error handling

- `catchError` belongs at the **service boundary**, not in components.
- Services must return a safe fallback value (e.g. `[]`, `null`) on error — never re-throw to the component.
- Components may show an error state, but they receive it as a value, not a caught exception.

```ts
// Correct (in service)
getMessages(chatId: string): Observable<Message[]> {
  return this.http.get<Message[]>(...).pipe(
    catchError(() => of([]))
  );
}

// Wrong (in component)
this.api.getMessages(id).pipe(catchError(...)).subscribe(...)
```

### Stream composition

- No nested subscribes. Flatten with `switchMap`, `mergeMap`, `concatMap`, or `combineLatest`.

```ts
// Wrong
this.selectedChatId$.subscribe(id => {
  this.api.getMessages(id).subscribe(msgs => this.messages = msgs);
});

// Correct
this.messages$ = this.selectedChatId$.pipe(
  switchMap(id => this.api.getMessages(id))
);
```

---

## Component Conventions

- Inject `ApiService`, never `MockApiService` directly.
- No domain logic in components — validation, permission checks, and business rules belong in `xxii-domain`.
- Template logic is minimal: heavy transforms go into **pipes** or **computed signals**, not inline template expressions.
- CSS uses Tailwind utility classes or CSS variables from the design token set — no magic hex values inline.

---

## Related

- `ADR.md` — architectural decisions (state management, forms, routing, etc.)
- `docs/architecture/OVERVIEW.md` — reactive data flow, state management patterns
- `.windsurf/rules/architect.md` — structural review checklist and anti-patterns
