# INPUT NEEDED — Open Concerns by Role

Gap analysis of `docs/issues/` against the four active roles: analyst, architect, dev_coder, designer.
Each concern is tagged with the role that raised it and the affected issue file(s).

---

## 🔍 Analyst

### A1 — No subtask decompositions exist

**Affects**: all issue files  
Every issue file describes _what_ to build but none contains the `### [N]. SubtaskName` decomposition format required by the analyst role. Dev coder cannot start work without these.  
**Action needed**: decompose each UI issue into Angular subtasks (component / pipe / directive / service method) in dependency order.

### A2 — Right panel: Files tab has no section

**Affects**: `22_chat_ui_logic.md`  
The header action buttons list `[Search]` `[Pin list]` `[Members]` `[Files]`, and Members/Pins/Search each have a dedicated `## Right panel: X tab` section. The **Files tab** has no section at all — no spec for what it renders, which `ApiService` call it uses, or how file rows are formatted.  
**Action needed**: add `## Right panel: Files tab` section to `22_chat_ui_logic.md`.

### A3 — Emoji picker is unspecified

**Affects**: `25_message_ui_logic.md`  
The `[emoji]` action bar button is mentioned but the picker itself has no spec: size, position (popover above composer?), grid vs. list layout, search input, emoji source, keyboard navigation, insert-at-cursor behavior.  
**Action needed**: add `## Emoji picker` section to `25_message_ui_logic.md`.

### A4 — Poll placeholder has no empty-state or future spec

**Affects**: `25_message_ui_logic.md`  
`[poll]` is listed as a placeholder but there is no spec for what it renders when clicked (disabled state? tooltip? nothing?).  
**Action needed**: clarify placeholder behavior (e.g., show tooltip "Coming soon", disable button, or hide entirely).

### A5 — Thread replies section below post content is unspecified

**Affects**: `10_feed_and_publishing_ui_logic.md`  
Post reader mode mentions "threaded replies section (same format as thread panel)" below post content but does not define: which `ApiService` call loads replies, ordering, composer behavior in this context, or how it differs from the chat thread panel.  
**Action needed**: add `## Post replies section` to `10_feed_and_publishing_ui_logic.md`.

### A6 — Share action has no UI flow

**Affects**: `10_feed_and_publishing_ui_logic.md`  
"Share action: forward post link to chat or another feed" is listed but the UI flow is undefined — what picker opens, what it looks like, which `ApiService` call is made.  
**Action needed**: specify the share/forward flow or reference a dedicated issue.

### A7 — No cross-issue consistency table

**Affects**: all issue files  
Shared concepts appear in multiple issues with potentially inconsistent descriptions: sidebar row format, right panel open/close contract, composer state machine, file row format. No single document reconciles these.  
**Action needed**: create a cross-issue consistency section (or separate doc) defining the canonical format for shared UI patterns.

### A8 — App header peer count has no data source

**Affects**: `5_screen_layout.md`  
The header shows `peers: N` but no issue references which `ApiService` method provides this count or how it updates live.  
**Action needed**: specify data source and update mechanism for peer count.

---

## 🏛️ Architect

### AR1 — No issue covers ApiService method expansion

**Affects**: all feature issues  
Every feature issue assumes methods like `getMessages()`, `getPosts()`, `getFiles()`, `getFolders()`, `getAuthor()` exist on `ApiService`, but no issue tracks adding them to the abstract contract. The abstract service is the single most-blocking dependency.  
**Action needed**: create an issue (or ADR entry) defining the full `ApiService` method surface before feature work begins.

### AR2 — State management approach not decided

**Affects**: `5_screen_layout.md`, `22_chat_ui_logic.md`, `25_message_ui_logic.md`  
Active chat ID, right panel tab, sidebar collapse state, and composer draft are shared UI state. The architect rule explicitly defers this decision, but no issue defines even the minimal `UiStateService` shape needed to unblock layout work.  
**Action needed**: decide (and record in `ADR.md`) the minimal state management approach for shared UI state. Candidate: simple service + `BehaviorSubject` until proven insufficient.

### AR3 — Routing structure not decided or documented

**Affects**: `9_prepare_app_ui.md`  
The URL scheme `/:type/:id` is implied in `9_prepare_app_ui.md` but no ADR records the routing decision (flat vs. nested, lazy vs. eager, 404 behavior, redirect on no selection). `app.routes.ts` exists but is empty.  
**Action needed**: record routing decision in `ADR.md` and create a routing issue.

### AR4 — Draft persistence key schema undefined

**Affects**: `25_message_ui_logic.md`, `10_feed_and_publishing_ui_logic.md`  
Both issues mention `localStorage` for draft persistence but no issue defines the key schema (e.g., `draft:chat:<id>`, `draft:post:<id>`), size limits, or conflict behavior on concurrent edits.  
**Action needed**: define key schema in the relevant issue or a shared persistence spec.

### AR5 — Column resize persistence strategy undefined

**Affects**: `5_screen_layout.md`, `8_prepare_app_ux.md`  
Draggable column borders are specified but no issue defines how the `resizable` directive stores/restores column widths (localStorage key, format, fallback to defaults).  
**Action needed**: specify persistence contract for column widths.

---

## 💻 Dev Coder

### D1 — `timeAgo` pipe has no precise format spec

**Affects**: `22_chat_ui_logic.md`, `21_folder_ui_logic.md`, `25_message_ui_logic.md`  
Issues say "show `HH:MM` for today, `yesterday`, or date" but edge cases are undefined: same minute? less than 1 hour ago? more than 1 year ago? What locale/timezone?  
**Action needed**: add a format table to the relevant issue or `9_prepare_app_ui.md`.

### D2 — `fileSize` pipe has no unit/precision spec

**Affects**: `19_file_ui_logic.md`, `21_folder_ui_logic.md`, `25_message_ui_logic.md`  
The pipe is referenced but thresholds and precision are undefined (e.g., when to switch KB→MB→GB, how many decimal places).  
**Action needed**: specify unit thresholds and precision in the relevant issue.

### D3 — `mentionHighlight` pipe parsing rules undefined

**Affects**: `25_message_ui_logic.md`  
The pipe is referenced but parsing rules are not defined: regex pattern, handling of nicks with special characters, behavior when nick is not in the known author list.  
**Action needed**: add parsing spec to `25_message_ui_logic.md`.

### D4 — `markdown` pipe subset and sanitization undefined

**Affects**: `10_feed_and_publishing_ui_logic.md`  
Post content is "markdown-rendered via `markdown` pipe" but the supported subset is unspecified (bold? code blocks? tables? images?) and sanitization strategy is not defined.  
**Action needed**: specify supported markdown subset and sanitization approach.

### D5 — `clickOutside` directive not tracked as a deliverable

**Affects**: `20_attachment_picker_ui_logic.md`, `8_prepare_app_ux.md`  
Referenced in two issues but no issue defines it as a component to build (path, inputs, outputs, events).  
**Action needed**: add as a subtask in `20_attachment_picker_ui_logic.md` or `9_prepare_app_ui.md`.

### D6 — `resizable` directive not tracked as a deliverable

**Affects**: `8_prepare_app_ux.md`, `5_screen_layout.md`  
Referenced but no issue defines it as a component to build (inputs for min/max, output for width change, persistence hook).  
**Action needed**: add as a subtask in `5_screen_layout.md` or `8_prepare_app_ux.md`.

### D7 — `UiStateService` not tracked as a deliverable

**Affects**: `5_screen_layout.md`, `22_chat_ui_logic.md`  
Shared UI state (active chat/feed/folder ID, right panel tab, sidebar collapse) needs a service, but no issue defines its shape, responsibility boundary, or file path.  
**Action needed**: add as a subtask once AR2 is resolved.

### D8 — `KeyboardNavDirective` not tracked as a deliverable

**Affects**: `8_prepare_app_ux.md`  
Keyboard navigation within sidebar, timeline, and right panel is specified in `8_prepare_app_ux.md` but no issue defines a directive (or per-component implementation) as a concrete deliverable.  
**Action needed**: decide directive vs. per-component approach and add subtask.

### D9 — No routing issue exists

**Affects**: `9_prepare_app_ui.md`  
`app.routes.ts` is empty. No issue covers wiring routes for `/chat/:id`, `/feed/:id`, `/folder/:id`, lazy loading strategy, or 404 handling.  
**Action needed**: create a routing issue or add routing subtasks to `9_prepare_app_ui.md`.

### D10 — `mock-data.json` completeness not audited

**Affects**: all feature issues  
No issue checks whether `public/mock-data.json` contains all required entities and relations (e.g., messages with reactions, pinned messages, forwarded messages, files with checksums, folders with subfolders).  
**Action needed**: audit mock data against all domain model fields and add missing fixtures.

### D11 — No integration or keyboard navigation test strategy

**Affects**: `8_prepare_app_ux.md`, `25_message_ui_logic.md`, `22_chat_ui_logic.md`  
Issues mention Vitest unit tests but no issue defines integration-level tests for: keyboard navigation flows, right panel open/close state, draft persistence round-trips.  
**Action needed**: define test scope boundaries in `9_prepare_app_ui.md` or a dedicated testing issue.

---

## 🎨 Designer

### DS1 — Skeleton shapes not specified per component

**Affects**: `9_prepare_app_ui.md`, all feature issues  
`9_prepare_app_ui.md` states skeletons must match the target layout shape, but no issue defines the exact skeleton anatomy for each component: sidebar row skeleton, timeline message skeleton, post card skeleton, file row skeleton, right panel skeleton.  
**Action needed**: add skeleton shape specs to each feature issue or to `9_prepare_app_ui.md`.

### DS2 — Emoji picker has no visual spec

**Affects**: `25_message_ui_logic.md`  
See also A3. From the designer perspective: no dimensions, no popover anchor point, no grid column count, no search input styling, no scroll behavior.  
**Action needed**: add visual spec to `25_message_ui_logic.md`.

### DS3 — Folder picker modal has no visual spec

**Affects**: `19_file_ui_logic.md`, `21_folder_ui_logic.md`  
The `[Move]` action in both issues opens a "folder picker" but its visual design is never described — modal vs. popover, folder list format, confirm/cancel buttons.  
**Action needed**: add `## Folder picker modal` section to `19_file_ui_logic.md`.

### DS4 — Confirmation dialog has no visual spec

**Affects**: `19_file_ui_logic.md`, `21_folder_ui_logic.md`  
`[Delete]` in both issues requires a confirmation dialog but its layout, button labels (`[Cancel]` `[Delete]`?), focus trap behavior, and ARIA role are not specified.  
**Action needed**: add confirmation dialog spec to `9_prepare_app_ui.md` as a reusable component.

### DS5 — Status dot color tokens not defined

**Affects**: `22_chat_ui_logic.md`  
"Online green / away yellow / offline gray" are described in prose but no hex tokens are assigned. The color palette in `9_prepare_app_ui.md` does not include status-dot tokens.  
**Action needed**: add `Status-Online`, `Status-Away`, `Status-Offline` tokens to `9_prepare_app_ui.md` §Colors and `docs/UI_UX_requirements.md` §3.

### DS6 — Scroll-to + highlight state not visually specified

**Affects**: `22_chat_ui_logic.md`  
Pins tab and Search tab both say "scroll to and highlight message in timeline" but the highlight visual is undefined: color, duration, animation (flash? fade? persistent?).  
**Action needed**: add highlight state spec to `22_chat_ui_logic.md` or `9_prepare_app_ui.md` §Interaction states.

### DS7 — "New messages" indicator not visually specified

**Affects**: `25_message_ui_logic.md`  
Mentioned as appearing when user scrolls up, but no visual spec: position (bottom of timeline? floating?), format (text? badge?), dismiss behavior (click? auto on scroll-down?).  
**Action needed**: add spec to `25_message_ui_logic.md`.

### DS8 — Upload progress bar not visually specified

**Affects**: `20_attachment_picker_ui_logic.md`  
Mentioned as "shows upload progress bar per file" but height, color, animation, and error state appearance are undefined.  
**Action needed**: add progress bar spec to `20_attachment_picker_ui_logic.md`.

### DS9 — Reaction badge hover/active state undefined

**Affects**: `25_message_ui_logic.md`  
Reaction badges are "clickable to add/remove own reaction" but no hover, active, or "own reaction selected" visual state is defined.  
**Action needed**: add interaction states for `ReactionBadge` to `25_message_ui_logic.md` or `9_prepare_app_ui.md`.

### DS10 — Breadcrumb vs. back button decision pending

**Affects**: `21_folder_ui_logic.md`  
"Breadcrumb or back button for navigation context" is ambiguous — no design decision made. These have different visual footprints and interaction models.  
**Action needed**: decide and specify one approach.

### DS11 — Column resize handle visual appearance undefined

**Affects**: `5_screen_layout.md`, `8_prepare_app_ux.md`  
Draggable column borders are specified functionally but the resize handle's visual appearance (cursor, hover highlight, drag indicator) is not defined.  
**Action needed**: add resize handle visual spec to `5_screen_layout.md`.

### DS12 — Drag-and-drop zone visual spec missing

**Affects**: `20_attachment_picker_ui_logic.md`  
The Upload tab has a drag-and-drop zone but its border style (dashed? dotted?), hover/drag-over state, and drop-accepted/rejected states are not defined.  
**Action needed**: add drag-and-drop zone spec to `20_attachment_picker_ui_logic.md`.

### DS13 — Sidebar icon/emoji usage not canonicalized

**Affects**: `21_folder_ui_logic.md`, `22_chat_ui_logic.md`  
Issues use Unicode emoji (📁, 📄, 👤, ●) directly in specs, but `docs/UI_UX_requirements.md` §7 defines a symbols system. No issue reconciles which symbols come from §7 vs. literal Unicode emoji.  
**Action needed**: audit all icon references against §7 and document the canonical set.

---

## Implementation Order (logical dependency layers)

Resolve concerns in layer order — nothing in a layer should start until the layer above it is closed.

### Layer 0 — Contracts & decisions (unblocks everything else)

Must be resolved before any code is written.

| #   | Concern                                                  | Why it blocks                                          |
| --- | -------------------------------------------------------- | ------------------------------------------------------ |
| AR1 | `ApiService` method surface defined                      | Every feature issue calls methods that don't exist yet |
| AR2 | State management decision → `UiStateService` shape       | Layout shell, sidebar, right panel all share state     |
| AR3 | Routing decision recorded in ADR + routing issue created | `app.routes.ts` is empty; no screen can be wired       |
| AR4 | Draft persistence key schema defined                     | Composer and post editor both write to localStorage    |
| AR5 | Column resize persistence strategy defined               | `resizable` directive needs a storage contract         |

### Layer 1 — Specs & decompositions (unblocks dev coder)

Analyst and designer work. No implementation until these are written.

| #    | Concern                                                       | Why it blocks                                       |
| ---- | ------------------------------------------------------------- | --------------------------------------------------- |
| A1   | Subtask decompositions for all UI issues                      | Dev coder has no actionable units of work           |
| A2   | Files tab section in `22_chat_ui_logic.md`                    | Right panel is incomplete without it                |
| A3   | Emoji picker spec in `25_message_ui_logic.md`                 | Composer action bar is partially unspecified        |
| A5   | Post replies section in `10_feed_and_publishing_ui_logic.md`  | Post reader mode is incomplete                      |
| A6   | Share/forward UI flow in `10_feed_and_publishing_ui_logic.md` | Feed moderation section references it               |
| A8   | Peer count data source in `5_screen_layout.md`                | App header cannot be implemented                    |
| DS1  | Skeleton shape per component                                  | Every data-driven component needs a loading state   |
| DS5  | Status dot color tokens (`Status-Online/Away/Offline`)        | Sidebar rows and member list use them               |
| DS13 | Canonicalize icon/emoji set against §7                        | Inconsistent symbols across sidebar and folder view |

### Layer 2 — Shared primitives (unblocks all feature components)

Pipes, directives, and services consumed by 3+ features. Build these before any feature component.

| #   | Concern                                         | Why it blocks                                       |
| --- | ----------------------------------------------- | --------------------------------------------------- |
| D1  | `timeAgo` pipe format spec (edge cases)         | Used in chat sidebar, folder view, message timeline |
| D2  | `fileSize` pipe unit/precision spec             | Used in file details, folder view, attachment chips |
| D3  | `mentionHighlight` pipe parsing rules           | Used in message timeline                            |
| D4  | `markdown` pipe subset + sanitization           | Used in post reader mode                            |
| D5  | `clickOutside` directive tracked as deliverable | Used in attachment picker, emoji picker             |
| D6  | `resizable` directive tracked as deliverable    | Used in 3-column layout shell                       |
| D7  | `UiStateService` tracked as deliverable         | Used by layout, sidebar, right panel, composer      |
| D8  | `KeyboardNavDirective` approach decided         | Used in sidebar, timeline, right panel              |

### Layer 3 — Layout shell & routing (unblocks feature placement)

The 3-column scaffold and routes must exist before features can be placed.

| #   | Concern                                       | Why it blocks                                                        |
| --- | --------------------------------------------- | -------------------------------------------------------------------- |
| D9  | Routing issue created + `app.routes.ts` wired | No screen can be navigated to                                        |
| D10 | `mock-data.json` audited and completed        | Components render empty/broken without fixture data                  |
| A7  | Cross-issue consistency table written         | Shared patterns (sidebar row, right panel contract) diverge silently |

### Layer 4 — Feature components (parallel tracks after Layer 3)

Each track is independent once layers 0–3 are resolved.

| Track                 | Issues       | Key open concerns to resolve first                                                                            |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| **Chat + Messages**   | `#22`, `#25` | A2 (Files tab), A3 (emoji picker), DS6 (highlight state), DS7 (new messages indicator), DS9 (reaction states) |
| **Feed + Publishing** | `#10`        | A5 (post replies), A6 (share flow)                                                                            |
| **Folder + Files**    | `#21`, `#19` | DS3 (folder picker modal), DS10 (breadcrumb decision), DS11 (resize handle)                                   |
| **Attachment picker** | `#20`        | DS8 (progress bar), DS12 (drag-and-drop zone)                                                                 |

### Layer 5 — Polish & cross-cutting (after feature components are stable)

| #   | Concern                                   | Notes                                        |
| --- | ----------------------------------------- | -------------------------------------------- |
| A4  | Poll placeholder behavior                 | Low risk — just a disabled button or tooltip |
| DS2 | Emoji picker visual spec                  | Depends on A3 being resolved in Layer 1      |
| DS4 | Confirmation dialog as reusable component | Needed by delete actions in `#19` and `#21`  |
| D11 | Integration + keyboard nav test strategy  | Define scope once component tree is stable   |
