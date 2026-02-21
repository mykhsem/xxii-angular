# UI & UX Requirements: Terminal Chat Application

Derived from mocks (`chat-interface.png`, `chat-list-interface.png`, `chat-thread-interface.png`) and functional requirement docs.

## 1. Design Philosophy & Aesthetic
- **Theme**: High-contrast, dark-mode "Modern Terminal" / "Retro-Computing" aesthetic.
- **Typography**: Strictly **Monospace** across all elements (JetBrains Mono, Fira Code, or system monospace).
- **Density**: High information density with minimal padding, using ASCII-like separators (`|`, `↳`, `↪`) and brackets `[ ]` for buttons.
- **Interactivity**: Keyboard-first navigation (Ctrl+F for search, Ctrl+P for pins, Esc to close panels).

## 2. Layout & Grid System
- **Scaffold**: 3-column responsive layout with fixed headers and footers.
- **Column 1: Left Navigation (Fixed ~260px)**
    - Sections: Contacts, Feeds, Chats, Folders.
    - Scrollable independent of the main timeline.
- **Column 2: Main Content (Flexible)**
    - Modes: Chat Timeline or Feed List (Cards).
    - Fixed Header: Context title, description, and primary action links.
    - Fixed Footer: Message/Post composer.
- **Column 3: Right Context Panel (Fixed ~320px - 400px)**
    - Contextual: Post Details, Threaded Replies, or File Properties.
    - Collapsible/Expandable with state persistence.

## 3. Color Palette (Visual System)
| Category | Token | Hex Value (Approx) | Usage |
| :--- | :--- | :--- | :--- |
| **Neutral** | Background | `#0d1117` | Main app background |
| | Surface | `#161b22` | Sidebars, Cards, and Panel backgrounds |
| | Border | `#30363d` | Dividers, Separators, Section lines |
| | Text-Primary | `#c9d1d9` | Message body, primary labels |
| | Text-Muted | `#8b949e` | Timestamps, metadata, secondary info |
| **Accent** | Terminal-Green | `#4af626` | Main accents, `$ Chat title`, active nicks |
| | User-Yellow | `#e3b341` | Secondary nicks, notifications |
| | User-Red | `#f85149` | Alert status, alex nick, errors |
| | User-Blue | `#58a6ff` | Mike nick, links, attachments |
| **Status** | Online | `#4af626` | Green dot |
| | Busy/Away | `#e3b341` | Yellow/Orange dot |
| | Offline | `#484f58` | Gray dot |

## 4. Typography Scale
- **Header**: 14px / 1.2 Line-height (Bold)
- **Body/Message**: 13px / 1.5 Line-height
- **Small/Meta**: 11px / 1.2 Line-height (Timestamps, badges)

## 5. Basic Components List
- **`SidebarSection`**: Collapsible header with uppercase label.
- **`SidebarRow`**: `[Icon] [Status] [Name] [Badge] [Time]`.
- **`TimelineMessage`**: `HH:MM nick: message`. Decorations for pinned/edited.
- **`FeedCard`**: Bordered container with title, author, date snippet, and reaction footer.
- **`Composer`**: Textarea with `> ` prompt and action bar `[attach] [emoji] [poll] [send]`.
- **`RightPanel`**: Header with `X` close button, scrollable content area.
- **`ReactionBadge`**: Compact `Emoji Count` chip with hover state.
- **`AttachmentChip`**: `[file] name (size) [download-icon]`.

## 6. Logic: Pipes & Directives
### Pipes
- **`timeAgo`**: Converts timestamps to "12:41" or "yesterday".
- **`fileSize`**: Formats bytes to "2.3MB".
- **`mentionHighlight`**: Scans content for `@nick` and applies accent color.
- **`markdown`**: Basic parsing for bold, code-blocks, and links.

### Directives
- **`keyboardNav`**: Enables Up/Down/Enter selection on sidebar and feed items.
- **`autoFocus`**: Forces focus to composer when chat context changes.
- **`resizable`**: Allows dragging column borders to resize (with min/max constraints).
- **`clickOutside`**: Closes dropdowns or temporary right panels.

## 7. Iconography & Symbols
- **Navigation**: `$`, `!`, `#`, `📁`, `📄`, `📦`.
- **Status Indicators**: `●` (Online/Busy/Offline).
- **Structural**: `↳` (Reply), `↪` (Forward), `|` (Vertical separator), `→` (Outline item), `·` (Middot separator).
- **Actions**: `📎` (Attach), `📥` (Download), `🔍` (Search), `📌` (Pin).

## 8. App Header (from `chat-interface.png`)
- Format: `$ Chat title   peers: N` — green `$` prefix, app name, and live peer count indicator.
- Peer count reflects connected peers for the current user.

## 9. Center Column Header
- **Chat mode**: `!chatname | description` (e.g., `!engineering | team communication channel`).
- **Feed mode**: `#feedname | description` (e.g., `#random | team announcements and updates`).
- Right-aligned action buttons: `[Search] [Pin list] [Members] [Files]`.

## 10. Left Sidebar Detail (from all mocks)
- **CONTACTS**: `👤` person icon + colored status dot (●) + name + unread badge (number) + last activity time.
- **FEEDS**: Colored sidebar indicator bar + `#name` + unread badge + time.
- **CHATS**: Colored status dot + `!name` + unread badge + time.
- **FOLDERS**: Expandable/collapsible with chevrons (`v`/`>`). Nested items indented. Folders show `📁`, files show `📄`. Some folders use emoji icons (e.g., `🎃 Archive`).

## 11. Forwarded Message Block (from `chat-interface.png`)
- Rendered as an **indented bordered block** (not just a text line).
- First line: `↪ forwarded message text…`
- Second line (muted): `from #source  (author, HH:MM)`

## 12. Shortcut Hint Bar (from all mocks)
- Visible bar between timeline and composer: `Ctrl+F: search | Ctrl+P: pinned | Esc: close`.
- Always visible, not a tooltip — acts as persistent keyboard affordance.

## 13. Composer Context (from `chat-interface.png`, `chat-list-interface.png`)
- Placeholder is context-aware:
    - Chat mode: `> new message to !chatname`
    - Feed mode: `> new post to #feedname`

## 14. Feed Post Card Detail (from `chat-list-interface.png`)
- **Title**: Accent/green color, bold.
- **Meta line**: `author · YYYY-MM-DD HH:MM` (middot separator).
- **Snippet**: 2–3 lines of content, truncated with `…`.
- **Footer**: `□ N replies  emoji N  emoji N` — reply count icon + reaction badges inline.

## 15. Post Details Panel (from `chat-list-interface.png`)
- Right panel header: `POST DETAILS` with `X` close button.
- Shows: title, author · date, content excerpt.
- **STATS** section: `Replies` count, `Reactions` breakdown (emoji + count).
- **OUTLINE** section: Table of contents for long posts, each heading prefixed with `→` (e.g., `→ Introduction`, `→ Key Features`, `→ Next Steps`).

## 16. Thread Panel (from `chat-thread-interface.png`)
- Right panel header: `Thread`.
- Original message shown at top with full reactions.
- Reply count separator: `N replies`.
- Reply format differs from timeline: `nick at HH:MM:` on first line, message content on next line.
- Each reply can have its own reactions.
- Chronological order (ascending).

## 17. Target Platforms
- **Web** (primary): Chrome, Firefox, Safari, Edge — latest two versions.
- **Desktop**: Electron wrapper or PWA installed — same codebase.
- **iOS / Android**: PWA with responsive layout. Native app wrappers are a future consideration.

> ⚠️ **Open decision (ADR-003 — Proposed):** Crossplatform packaging strategy (PWA / Capacitor / Electron / Tauri) is under discussion. No commitment made. See `ADR.md`.
>
> - [ ] Confirm whether PWA iOS limitations are acceptable for target users
> - [ ] Decide if desktop packaging (Electron / Tauri) is in scope for v1
> - [ ] Evaluate Capacitor when Stage ④ Service Worker integration begins

## 18. Screens Inventory

| Screen | Center Mode | Right Panel | Trigger |
| ------ | ----------- | ----------- | ------- |
| Chat timeline | Message list + composer | (closed) | Select chat in sidebar |
| Chat + Thread | Message list + composer | Thread panel | Click `↳ N replies` |
| Chat + Members | Message list + composer | Members list | Click `[Members]` |
| Chat + Pins | Message list + composer | Pinned messages | Click `[Pin list]` |
| Chat + Search | Message list + composer | Search results | Click `[Search]` or Ctrl+F |
| Chat + Files | Message list + composer | File list | Click `[Files]` |
| Feed timeline | Post cards + composer | (closed) | Select feed in sidebar |
| Feed + Post Details | Post cards or reader | Post Details panel | Click post title |
| Folder view | File list (terminal rows) | (closed) | Select folder in sidebar |
| Folder + File Details | File list | File details panel | Click file row |

## 19. Navigation Flows
- **Sidebar → Center**: selecting any sidebar item (chat, feed, folder) replaces center content.
- **Center → Right panel**: clicking a message action (thread, pin) or header button opens the right panel without losing center scroll position.
- **Right panel → Center**: clicking a pinned message or search result scrolls center to that item and highlights it.
- **Back navigation**: browser back button returns to previous sidebar selection. Right panel close is not a navigation event.

## 20. Global States (shared patterns)

| State | Visual | Behavior |
| ----- | ------ | -------- |
| **Loading** | Skeleton rows/cards matching target layout | Shown while `Observable` is pending |
| **Empty** | Centered muted text (e.g., `No messages yet`) | Shown when data resolves to empty array |
| **Error** | Inline error banner with `[Retry]` action | Shown on fetch failure; retry re-subscribes |
| **Success** | Normal content rendering | Default state after data loads |

- Skeleton shapes match the component they replace (sidebar rows, timeline messages, post cards, file rows).
- Error banners use `User-Red` (`#f85149`) text on `Surface` background.
- Empty states use `Text-Muted` color, centered vertically and horizontally in the content area.

## 21. Spacing System
- **Base unit**: `4px`.
- **Scale**: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`.
- **Inline padding** (inside components): `8px` (2 units).
- **Section gap** (between sidebar sections): `16px` (4 units).
- **Column gap** (between layout columns): `1px` border, no padding gap — content touches the separator.
- **Message vertical spacing**: `4px` between messages, `12px` between message groups (different author or >5 min gap).
- **Card padding**: `12px` inside feed post cards.
- **Composer padding**: `8px` around textarea, `4px` between action bar buttons.

## 22. Typography — Font Weights
- **Bold (700)**: section headers, post titles, chat/feed names in header, active sidebar item.
- **Medium (500)**: author nicks in timeline.
- **Regular (400)**: message body, metadata, descriptions, all other text.

## 23. Elevation & Shadows
- Terminal aesthetic: **no box-shadow** on any component.
- Depth conveyed through background color layering:
    - `Background` (`#0d1117`) → `Surface` (`#161b22`) → overlays slightly lighter.
- Modals/popovers (emoji picker, attachment picker): `Surface` background + `Border` outline, no shadow.
- Focus ring: `1px` solid `Terminal-Green` (`#4af626`) outline instead of shadow.

## 24. Interaction States

| State | Visual Treatment |
| ----- | ---------------- |
| **Default** | Normal colors as defined in §3 |
| **Hover** | Background shifts to `Surface` (`#161b22`) for rows; `Border` color lightens to `#484f58` for buttons |
| **Focus** | `1px` solid `Terminal-Green` outline; no blur/shadow |
| **Active/Pressed** | Background darkens slightly below `Surface`; text stays same |
| **Disabled** | `Text-Muted` color for text; `Background` color for fill; cursor `not-allowed`; no hover effect |
| **Selected** | `Surface` background + left `2px` solid `Terminal-Green` accent bar (sidebar rows) |

## 25. Component Variants & Additional Components

### Button
- **Variant: Primary** — `Terminal-Green` text, `Border` background → hover: lighter border.
- **Variant: Ghost** — `Text-Primary` text, transparent background → hover: `Surface` background.
- **Variant: Danger** — `User-Red` text, transparent → hover: faint red background.
- **Size**: single size — `13px` font, `8px 12px` padding. All buttons use bracket notation: `[label]`.
- **Disabled**: muted text, no hover, `not-allowed` cursor.

### Input / Textarea
- `Background` fill, `Border` border, `Text-Primary` text.
- Placeholder: `Text-Muted`.
- Focus: `Terminal-Green` border.
- Monospace font consistent with all other text.

### Select / Dropdown
- Same styling as Input for the trigger.
- Dropdown menu: `Surface` background, `Border` border, no shadow.
- Option hover: `Background` highlight.
- Active option: `Terminal-Green` text.

### Badge
- **Unread badge**: `Terminal-Green` background, `Background` text, small rounded pill.
- **Role badge** (owner/admin/mod): `Text-Muted` color text in brackets, e.g., `[admin]`.
- **Visibility badge**: `Text-Muted` text, e.g., `(public)` / `(unlisted)`.

### Modal / Overlay
- Dimmed backdrop (`Background` at 70% opacity).
- Modal container: `Surface` background, `Border` border, no shadow.
- Header with title + `X` close.
- Closes on Esc and click-outside.

### Tooltip
- Small popover on hover: `Surface` background, `Border` border, `Text-Primary` text.
- Appears after `300ms` delay, no animation.
- Used for truncated text (show full text on hover).

## 26. Text Truncation & Overflow Rules
- **Single-line truncation**: sidebar item names, chat/feed descriptions in header — `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`. Full text shown in tooltip on hover.
- **Multi-line truncation**: feed post card snippets — max 3 lines, CSS `line-clamp: 3` with `…`.
- **Message content**: no truncation — full content always visible in timeline.
- **Scrollable areas**: each column scrolls independently. Scroll indicators (thin scrollbar, `Border` color track, `Text-Muted` thumb) consistent across all panels.
- **Overflow behavior**: long unbroken strings (URLs, hashes) — `overflow-wrap: break-word`.

## 27. Keyboard Focus Order & Accessibility
- **Tab cycle**: App header → Left sidebar → Center header → Center timeline → Composer → Right panel (if open) → back to App header.
- **Within sidebar**: Up/Down moves between items, Enter selects, Tab moves to next zone.
- **Within timeline**: Up/Down moves between messages, Enter opens context actions.
- **Focus trapping**: modals (attachment picker, emoji picker) trap focus until dismissed with Esc.
- **Visible focus indicator**: `1px` solid `Terminal-Green` outline on all focusable elements.
- **Skip link**: hidden "Skip to main content" link for screen readers, jumps to center timeline.
- **ARIA roles**: sidebar uses `navigation`, timeline uses `log`, right panel uses `complementary`.

## 28. Mobile & Touch Gestures
- **Swipe right**: open left sidebar (when collapsed).
- **Swipe left**: close left sidebar or open right panel.
- **Long press on message**: opens context actions (reply, react, forward, pin).
- **Pull to refresh**: reload current chat/feed timeline.
- **Tap outside**: closes any open overlay/popover (same as `clickOutside` directive).
- **Pinch-to-zoom**: disabled — fixed font size for terminal consistency.

## 29. Animations & Transitions
- Terminal aesthetic: **minimal animation**.
- **Panel collapse/expand**: `150ms` horizontal slide (`ease-out`).
- **Right panel open/close**: `150ms` slide from right.
- **New message appearing**: no animation — instant append (consistent with terminal feel).
- **Skeleton → content**: instant swap, no fade.
- **Modal open/close**: `100ms` opacity fade.
- **Hover state transitions**: `100ms` background-color transition.
- **No bounces, no springs, no parallax** — everything sharp and instant.