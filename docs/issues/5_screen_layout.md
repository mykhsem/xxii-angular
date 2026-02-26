# Screen layout: 3-column terminal-like scaffold — [DONE]

**Status:** Completed 2026-02-26  
Refs: `./22_chat_ui_logic.md`, `./9_prepare_app_ui.md`

## App header (fixed top bar)

- Format: `$ Chat title   peers: N`
- Green `$` prefix, app name, live peer count indicator
- Full width, spans all three columns

## Column 1: Left navigation sidebar (~260px fixed)

- Collapsible (toggle or drag to hide)
- Scrollable independent of center and right columns
- Sections with uppercase labels: CONTACTS, FEEDS, CHATS, FOLDERS
- Each section is collapsible with chevron toggle
- Section order and collapsed state persisted in local storage

## Column 2: Center main content (flexible width)

- Fixed header: context line `!chatname | description` or `#feedname | description` + action buttons `[Search] [Pin list] [Members] [Files]`
- Scrollable content area: chat timeline or feed post list depending on context
- Shortcut hint bar (fixed): `Ctrl+F: search | Ctrl+P: pinned | Esc: close`
- Fixed footer: composer with `> ` prompt and action bar `[attach] [emoji] [poll] [send]`

## Column 3: Right context panel (~320–400px fixed)

- Collapsible/expandable with `X` close button
- Opens on demand from header action buttons or message interactions
- Modes: Thread, Post Details, Pin list, Members list, Files list, Search results
- Scrollable content area independent of center column
- Panel state (open/closed, active tab) persisted

## Column borders

- Draggable column borders to resize (with min/max constraints)
- Min widths: left ~200px, center ~400px, right ~280px
- Visual border: 1px `#30363d` separator

## Keyboard navigation & focus zones

- Focus order: left sidebar → center timeline → composer
- Tab / Shift+Tab cycles between zones
- Ctrl+K: command palette placeholder
- Ctrl+F: focus search
- Ctrl+P: open pinned list in right panel
- Esc: close right panel or active overlay
- Up/Down/Enter: navigate items within active zone

## Responsive behavior

- Below ~1024px: right panel overlays center (slide-over)
- Below ~768px: left sidebar collapses to icon-only or hidden, toggle with hamburger
- Composer always visible in center column
