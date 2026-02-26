# Prepare App UI — [DONE]

**Status:** Completed 2026-02-26  
Refs: `./8_prepare_app_ux.md`, `./5_screen_layout.md`

Target platforms: Web (primary), iOS, Android, Desktop (PWA / Electron)

> Packaging strategy deferred — no ADR yet. Will be recorded when crossplatform packaging decision is triggered. See `ADR.md`.

## Screens list

| Screen                | Center Mode               | Right Panel        | Trigger                    |
| --------------------- | ------------------------- | ------------------ | -------------------------- |
| Chat timeline         | Message list + composer   | (closed)           | Select chat in sidebar     |
| Chat + Thread         | Message list + composer   | Thread panel       | Click `↳ N replies`        |
| Chat + Members        | Message list + composer   | Members list       | Click `[Members]`          |
| Chat + Pins           | Message list + composer   | Pinned messages    | Click `[Pin list]`         |
| Chat + Search         | Message list + composer   | Search results     | Click `[Search]` or Ctrl+F |
| Chat + Files          | Message list + composer   | File list          | Click `[Files]`            |
| Feed timeline         | Post cards + composer     | (closed)           | Select feed in sidebar     |
| Feed + Post Details   | Post cards or reader      | Post Details panel | Click post title           |
| Folder view           | File list (terminal rows) | (closed)           | Select folder in sidebar   |
| Folder + File Details | File list                 | File details panel | Click file row             |

## Global states: empty, loading, error, success

| State       | Visual                                                               | Behavior                                    |
| ----------- | -------------------------------------------------------------------- | ------------------------------------------- |
| **Loading** | Skeleton rows/cards matching target layout shape                     | Shown while `Observable` is pending         |
| **Empty**   | Centered muted text (e.g., `No messages yet`)                        | Shown when data resolves to empty array     |
| **Error**   | Inline error banner (`User-Red` text on `Surface` bg) with `[Retry]` | Shown on fetch failure; retry re-subscribes |
| **Success** | Normal content rendering                                             | Default state after data loads              |

- Skeleton shapes must match the component they replace (sidebar rows, timeline messages, post cards, file rows)
- Empty states use `Text-Muted` color, centered vertically and horizontally
- Error banners are non-blocking — other parts of the app remain usable

## Navigation flows

- **Sidebar → Center**: selecting any sidebar item (chat, feed, folder) replaces center content
- **Center → Right panel**: clicking a message action or header button opens right panel without losing center scroll position
- **Right panel → Center**: clicking a pinned message or search result scrolls center to that item and highlights it
- **Back navigation**: browser back button returns to previous sidebar selection; right panel close is not a navigation event
- URL reflects current context: `/:type/:id` (e.g., `/chat/abc`, `/feed/xyz`, `/folder/123`)

## Colors

See `../UI_UX_requirements.md` §3 for full palette. Summary:

| Token          | Hex       | Usage                                         |
| -------------- | --------- | --------------------------------------------- |
| Background     | `#0d1117` | Main app background                           |
| Surface        | `#161b22` | Sidebars, cards, panel backgrounds            |
| Border         | `#30363d` | Dividers, separators                          |
| Text-Primary   | `#c9d1d9` | Message body, labels                          |
| Text-Muted     | `#8b949e` | Timestamps, metadata                          |
| Terminal-Green | `#4af626` | Accents, `$` prefix, active nicks, focus ring |
| User-Yellow    | `#e3b341` | Secondary nicks, notifications, away status   |
| User-Red       | `#f85149` | Errors, alerts, danger actions                |
| User-Blue      | `#58a6ff` | Links, attachments                            |

## Typography scale

- **Font family**: JetBrains Mono → Fira Code → `monospace` (fallback chain)
- **Header**: `14px` / `1.2` line-height / `700` weight (bold)
- **Body/Message**: `13px` / `1.5` line-height / `400` weight (regular)
- **Author nick**: `13px` / `1.5` line-height / `500` weight (medium)
- **Small/Meta**: `11px` / `1.2` line-height / `400` weight (timestamps, badges)

## Spacing system

- **Base unit**: `4px`
- **Scale**: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`
- **Inline padding** (inside components): `8px`
- **Section gap** (between sidebar sections): `16px`
- **Column gap**: `1px` border separator, no padding gap
- **Message vertical spacing**: `4px` between messages, `12px` between groups (different author or >5 min gap)
- **Card padding**: `12px` inside feed post cards
- **Composer padding**: `8px` around textarea, `4px` between action bar buttons

## Elevation & shadows

- Terminal aesthetic: **no box-shadow** on any component
- Depth conveyed through background color layering: `Background` → `Surface` → overlays slightly lighter
- Modals/popovers: `Surface` background + `Border` outline, no shadow
- Focus ring: `1px` solid `Terminal-Green` outline (replaces shadow-based focus)

## Reusable components

### Existing (from mocks)

- **`SidebarSection`**: collapsible header with uppercase label + chevron
- **`SidebarRow`**: `[Icon] [Status] [Name] [Badge] [Time]`
- **`TimelineMessage`**: `HH:MM nick: content` with decorations
- **`FeedCard`**: bordered container with title, author, snippet, reaction footer
- **`Composer`**: textarea with `> ` prompt + action bar
- **`RightPanel`**: header with title + `X` close, scrollable content
- **`ReactionBadge`**: compact `Emoji Count` chip
- **`AttachmentChip`**: `📄 name (size) 📥`

### Additional generic components

- **`Button`**: bracket-style `[label]` — variants: Primary (green text), Ghost (default text), Danger (red text)
- **`Input`**: `Background` fill, `Border` border, monospace, `Terminal-Green` focus border
- **`Textarea`**: same as Input, multiline, auto-grow
- **`Select`**: Input-style trigger + `Surface` dropdown, no shadow
- **`Badge`**: unread (green pill), role (`[admin]`), visibility (`(public)`)
- **`Modal`**: dimmed backdrop (70% opacity), `Surface` container, `Border` border, focus-trapped
- **`Tooltip`**: `Surface` bg, `Border` border, appears after `300ms` hover delay
- **`Skeleton`**: pulsing placeholder matching target component shape
- **`ErrorBanner`**: `User-Red` text + `[Retry]` button on `Surface` background

## Component variants

### Size

- Single size for all components — `13px` font, consistent with terminal density
- Buttons: `8px 12px` padding
- Badges: `4px 8px` padding, `11px` font

### State variants

- All interactive components support: default, hover, focus, active, disabled
- Buttons: disabled = `Text-Muted` text, `Background` fill, `not-allowed` cursor

### Intent variants (buttons only)

- **Primary**: `Terminal-Green` text
- **Ghost**: `Text-Primary` text, transparent background
- **Danger**: `User-Red` text

## Component behavior rules

- Buttons emit click only on mouseup/keyup (Enter or Space)
- Inputs emit value change on every keystroke (reactive binding)
- Selects close dropdown on selection or Escape
- Modals prevent background scroll while open
- Tooltips hide immediately on mouseout (no exit delay)
- Right panel tabs are mutually exclusive — opening one closes the previous

## Interaction states

| State              | Visual Treatment                                                                   |
| ------------------ | ---------------------------------------------------------------------------------- |
| **Default**        | Normal colors as defined in color palette                                          |
| **Hover**          | Background shifts to `Surface` for rows; border lightens to `#484f58` for buttons  |
| **Focus**          | `1px` solid `Terminal-Green` outline; no blur/shadow                               |
| **Active/Pressed** | Background darkens slightly below `Surface`; text unchanged                        |
| **Disabled**       | `Text-Muted` text; `Background` fill; `not-allowed` cursor; no hover effect        |
| **Selected**       | `Surface` background + left `2px` solid `Terminal-Green` accent bar (sidebar rows) |

## Animations & transitions

- Terminal aesthetic: **minimal animation**
- **Panel collapse/expand**: `150ms` horizontal slide, `ease-out`
- **Right panel open/close**: `150ms` slide from right
- **New message appearing**: no animation — instant append
- **Skeleton → content**: instant swap, no fade
- **Modal open/close**: `100ms` opacity fade
- **Hover state transitions**: `100ms` `background-color` transition
- **No bounces, springs, or parallax** — everything sharp and instant
