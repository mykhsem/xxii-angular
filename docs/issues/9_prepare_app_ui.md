# Prepare App UI — [IN PROGRESS]

**Status:** Completed 2026-02-26  
Refs: `./8_prepare_app_ux.md`, `./5_screen_layout.md`

Target platforms: Web (primary), iOS, Android, Desktop (PWA / Electron)

> Packaging strategy deferred — no ADR yet. Will be recorded when crossplatform packaging decision is triggered. See `ADR.md`.

## Screens list

| Screen                | Center Mode               | Right Panel        | Trigger                    | Status   |
| --------------------- | ------------------------- | ------------------ | -------------------------- | -------- |
| Chat timeline         | Message list + composer   | (closed)           | Select chat in sidebar     | [todo]   |
| Chat + Thread         | Message list + composer   | Thread panel       | Click `↳ N replies`        | [todo]   |
| Chat + Members        | Message list + composer   | Members list       | Click `[Members]`          | [todo]   |
| Chat + Pins           | Message list + composer   | Pinned messages    | Click `[Pin list]`         | [todo]   |
| Chat + Search         | Message list + composer   | Search results     | Click `[Search]` or Ctrl+F | [todo]   |
| Chat + Files          | Message list + composer   | File list          | Click `[Files]`            | [todo]   |
| Feed timeline         | Post cards + composer     | (closed)           | Select feed in sidebar     | [todo]   |
| Feed + Post Details   | Post cards or reader      | Post Details panel | Click post title           | [todo]   |
| Folder view           | File list (terminal rows) | (closed)           | Select folder in sidebar   | [todo]   |
| Folder + File Details | File list                 | File details panel | Click file row             | [todo]   |

## Global states: empty, loading, error, success

| State       | Visual                                                               | Behavior                                    | Status   |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------- | -------- |
| **Loading** | Skeleton rows/cards matching target layout shape                     | Shown while `Observable` is pending         | [done]   |
| **Empty**   | Centered muted text (e.g., `No messages yet`)                        | Shown when data resolves to empty array     | [todo]   |
| **Error**   | Inline error banner (`User-Red` text on `Surface` bg) with `[Retry]` | Shown on fetch failure; retry re-subscribes | [done]   |
| **Success** | Normal content rendering                                             | Default state after data loads              | [todo]   |

- [review] Skeleton shapes must match the component they replace (sidebar rows, timeline messages, post cards, file rows) — `SkeletonComponent` is generic; no per-context shape variants yet
- [todo] Empty states use `Text-Muted` color, centered vertically and horizontally
- [review] Error banners are non-blocking — other parts of the app remain usable — component exists; no usage context yet

## Navigation flows

- [todo] **Sidebar → Center**: selecting any sidebar item (chat, feed, folder) replaces center content
- [todo] **Center → Right panel**: clicking a message action or header button opens right panel without losing center scroll position
- [todo] **Right panel → Center**: clicking a pinned message or search result scrolls center to that item and highlights it
- [done] **Back navigation**: browser back button returns to previous sidebar selection; right panel close is not a navigation event
- [done] URL reflects current context: `/:type/:id` (e.g., `/chat/abc`, `/feed/xyz`, `/folder/123`)

## Colors

See `../UI_UX_requirements.md` §3 for full palette. Summary:

| Token          | Hex       | Usage                                         | Status |
| -------------- | --------- | --------------------------------------------- | ------ |
| Background     | `#0d1117` | Main app background                           | [done] |
| Surface        | `#161b22` | Sidebars, cards, panel backgrounds            | [done] |
| Border         | `#30363d` | Dividers, separators                          | [done] |
| Text-Primary   | `#c9d1d9` | Message body, labels                          | [done] |
| Text-Muted     | `#8b949e` | Timestamps, metadata                          | [done] |
| Terminal-Green | `#4af626` | Accents, `$` prefix, active nicks, focus ring | [done] |
| User-Yellow    | `#e3b341` | Secondary nicks, notifications, away status   | [done] |
| User-Red       | `#f85149` | Errors, alerts, danger actions                | [done] |
| User-Blue      | `#58a6ff` | Links, attachments                            | [done] |

## Typography scale

- [done] **Font family**: JetBrains Mono → Fira Code → `monospace` (fallback chain)
- [done] **Header**: `14px` / `1.2` line-height / `700` weight (bold)
- [done] **Body/Message**: `13px` / `1.5` line-height / `400` weight (regular)
- [review] **Author nick**: `13px` / `1.5` line-height / `500` weight (medium) — CSS vars defined; no `SidebarRow` or message component using weight 500 yet
- [done] **Small/Meta**: `11px` / `1.2` line-height / `400` weight (timestamps, badges)

## Spacing system

- [done] **Base unit**: `4px`
- [done] **Scale**: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`
- [done] **Inline padding** (inside components): `8px`
- [todo] **Section gap** (between sidebar sections): `16px`
- [done] **Column gap**: `1px` border separator, no padding gap
- [todo] **Message vertical spacing**: `4px` between messages, `12px` between groups (different author or >5 min gap)
- [todo] **Card padding**: `12px` inside feed post cards
- [todo] **Composer padding**: `8px` around textarea, `4px` between action bar buttons

## Elevation & shadows

- [done] Terminal aesthetic: **no box-shadow** on any component
- [done] Depth conveyed through background color layering: `Background` → `Surface` → overlays slightly lighter
- [done] Modals/popovers: `Surface` background + `Border` outline, no shadow
- [done] Focus ring: `1px` solid `Terminal-Green` outline (replaces shadow-based focus)

## Reusable components

### Existing (from mocks)

- [todo] **`SidebarSection`**: collapsible header with uppercase label + chevron
- [todo] **`SidebarRow`**: `[Icon] [Status] [Name] [Badge] [Time]`
- [todo] **`TimelineMessage`**: `HH:MM nick: content` with decorations
- [todo] **`FeedCard`**: bordered container with title, author, snippet, reaction footer
- [todo] **`Composer`**: textarea with `> ` prompt + action bar
- [todo] **`RightPanel`**: header with title + `X` close, scrollable content
- [todo] **`ReactionBadge`**: compact `Emoji Count` chip
- [todo] **`AttachmentChip`**: `📄 name (size) 📥`

### Additional generic components

- [done] **`Button`**: bracket-style `[label]` — variants: Primary (green text), Ghost (default text), Danger (red text)
- [done] **`Input`**: `Background` fill, `Border` border, monospace, `Terminal-Green` focus border
- [done] **`Textarea`**: same as Input, multiline, auto-grow
- [todo] **`Select`**: Input-style trigger + `Surface` dropdown, no shadow (explicitly deferred — no consumer yet)
- [done] **`Badge`**: unread (green pill), role (`[admin]`), visibility (`(public)`)
- [done] **`Modal`**: dimmed backdrop (70% opacity), `Surface` container, `Border` border, focus-trapped
- [done] **`Tooltip`**: `Surface` bg, `Border` border, appears after `300ms` hover delay
- [done] **`Skeleton`**: pulsing placeholder matching target component shape
- [done] **`ErrorBanner`**: `User-Red` text + `[Retry]` button on `Surface` background

## Component variants

### Size

- [done] Single size for all components — `13px` font, consistent with terminal density
- [done] Buttons: `8px 12px` padding
- [review] Badges: `4px 8px` padding, `11px` font — `BadgeComponent` exists; exact padding/font-size needs verification

### State variants

- [done] All interactive components support: default, hover, focus, active, disabled
- [done] Buttons: disabled = `Text-Muted` text, `Background` fill, `not-allowed` cursor

### Intent variants (buttons only)

- [done] **Primary**: `Terminal-Green` text
- [done] **Ghost**: `Text-Primary` text, transparent background
- [done] **Danger**: `User-Red` text

## Component behavior rules

- [review] Buttons emit click only on mouseup/keyup (Enter or Space) — uses `(click)` which fires on mouseup; keyup for Enter/Space is browser-native default
- [done] Inputs emit value change on every keystroke (reactive binding)
- [todo] Selects close dropdown on selection or Escape
- [done] Modals prevent background scroll while open
- [done] Tooltips hide immediately on mouseout (no exit delay)
- [done] Right panel tabs are mutually exclusive — opening one closes the previous

## Interaction states

| State              | Visual Treatment                                                                   | Status   |
| ------------------ | ---------------------------------------------------------------------------------- | -------- |
| **Default**        | Normal colors as defined in color palette                                          | [done]   |
| **Hover**          | Background shifts to `Surface` for rows; border lightens to `#484f58` for buttons  | [review] |
| **Focus**          | `1px` solid `Terminal-Green` outline; no blur/shadow                               | [done]   |
| **Active/Pressed** | Background darkens slightly below `Surface`; text unchanged                        | [review] |
| **Disabled**       | `Text-Muted` text; `Background` fill; `not-allowed` cursor; no hover effect        | [done]   |
| **Selected**       | `Surface` background + left `2px` solid `Terminal-Green` accent bar (sidebar rows) | [todo]   |

## Animations & transitions

- [done] Terminal aesthetic: **minimal animation**
- [todo] **Panel collapse/expand**: `150ms` horizontal slide, `ease-out`
- [todo] **Right panel open/close**: `150ms` slide from right
- [todo] **New message appearing**: no animation — instant append
- [review] **Skeleton → content**: instant swap, no fade — `SkeletonComponent` exists; swap logic not implemented in any content component
- [todo] **Modal open/close**: `100ms` opacity fade
- [done] **Hover state transitions**: `100ms` `background-color` transition
- [done] **No bounces, springs, or parallax** — everything sharp and instant
