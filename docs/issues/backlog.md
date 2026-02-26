# Backlog

Architecture decisions and convention tasks from `local-notes.md` §1.

---

## #26 State management decision

**Status:** Deferred  
**Trigger:** Two or more unrelated components need to share state without a common ancestor.  
**Output:** ADR-006 — choose between `Service + BehaviorSubject` / `SignalStore` / `NgRx`.  
**Refs:** `ADR.md` (ADR-004)

---

## #27 Forms approach decision

**Status:** Deferred  
**Trigger:** First form component (composer or post editor) begins implementation.  
**Output:** ADR-007 — choose between Reactive Forms / Signal Forms. Template-driven ruled out.  
**Refs:** `ADR.md` (ADR-005), `./25_message_ui_logic.md`, `./10_feed_and_publishing_ui_logic.md`

---

## #28 Routing structure decision

**Status:** Deferred  
**Trigger:** First navigable screen (chat / feed / folder) is being implemented.  
**Output:** ADR entry — choose flat vs. nested, lazy-loaded vs. eager.  
**Refs:** `./5_screen_layout.md`, `./22_chat_ui_logic.md`

---

## #29 Angular API stability convention

**Status:** Done — `.windsurf/rules/conventions.md` §Angular API Stability Policy created.  
**Action:** No further work needed unless APIs change status in a future Angular release.

---

## #30 RxJS conventions

**Status:** Done — `.windsurf/rules/conventions.md` §RxJS Conventions created.  
**Action:** Review coverage once a second RxJS-heavy service/component is implemented.

---

## #31 Reactive data flow rule verification

**Status:** Pending  
**Action:** Confirm `docs/architecture/OVERVIEW.md` §Reactive Data Flow is sufficient, or extract missing rules into `.windsurf/rules/conventions.md`.
