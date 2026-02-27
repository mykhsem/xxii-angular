# Screen layout: 3-column terminal-like scaffold — [IN PROGRESS]

**Status:** Completed 2026-02-26  
Refs: `./22_chat_ui_logic.md`, `./9_prepare_app_ui.md`

## App header (fixed top bar)

- [review] Format: `$ Chat title   peers: N` — shows `$ XXII  peers: 0`; title is static, not context-driven
- [done] Green `$` prefix, app name, live peer count indicator — `$` is green; peer count hardcoded at 0
- [done] Full width, spans all three columns

## Column 1: Left navigation sidebar (~260px fixed)

- [review] Collapsible (toggle or drag to hide) — `UiStateService.toggleLeftSidebar` exists; no toggle button in UI; drag-to-hide not implemented
- [done] Scrollable independent of center and right columns
- [todo] Sections with uppercase labels: CONTACTS, FEEDS, CHATS, FOLDERS
- [todo] Each section is collapsible with chevron toggle
- [todo] Section order and collapsed state persisted in local storage

## Column 2: Center main content (flexible width)

- [todo] Fixed header: context line `!chatname | description` or `#feedname | description` + action buttons `[Search] [Pin list] [Members] [Files]`
- [todo] Scrollable content area: chat timeline or feed post list depending on context
- [todo] Shortcut hint bar (fixed): `Ctrl+F: search | Ctrl+P: pinned | Esc: close`
- [todo] Fixed footer: composer with `> ` prompt and action bar `[attach] [emoji] [poll] [send]`

## Column 3: Right context panel (~320–400px fixed)

- [review] Collapsible/expandable with `X` close button — close wired via `UiStateService` + Escape hotkey; no X button rendered in UI
- [todo] Opens on demand from header action buttons or message interactions
- [todo] Modes: Thread, Post Details, Pin list, Members list, Files list, Search results
- [done] Scrollable content area independent of center column
- [review] Panel state (open/closed, active tab) persisted — open/closed is in `UiStateService` but NOT persisted to localStorage; tab state is ephemeral

## Column borders

- [done] Draggable column borders to resize (with min/max constraints)
- [done] Min widths: left ~200px, center ~400px, right ~280px
- [done] Visual border: 1px `#30363d` separator

## Keyboard navigation & focus zones

- [todo] Focus order: left sidebar → center timeline → composer
- [todo] Tab / Shift+Tab cycles between zones
- [todo] Ctrl+K: command palette placeholder
- [done] Ctrl+F: focus search
- [done] Ctrl+P: open pinned list in right panel
- [done] Esc: close right panel or active overlay
- [todo] Up/Down/Enter: navigate items within active zone

## Responsive behavior

- [done] Below ~1024px: right panel overlays center (slide-over)
- [review] Below ~768px: left sidebar collapses to icon-only or hidden, toggle with hamburger — sidebar hidden via CSS; no hamburger toggle button
- [todo] Composer always visible in center column
