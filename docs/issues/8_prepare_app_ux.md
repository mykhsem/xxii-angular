# Prepare App UX

Refs: `./9_prepare_app_ui.md`, `./5_screen_layout.md`

Target platforms: Web (primary), iOS, Android, Desktop (PWA / Electron)

> Packaging strategy deferred — no ADR yet. Will be recorded when crossplatform packaging decision is triggered. See `ADR.md`.

## Keyboard navigation & focus order

- Tab cycle across zones: App header → Left sidebar → Center header → Center timeline → Composer → Right panel (if open) → loop
- Shift+Tab reverses the cycle
- **Within sidebar**: Up/Down moves between items, Enter selects/activates, Escape collapses section
- **Within timeline**: Up/Down moves between messages, Enter opens context actions for selected message
- **Within composer**: Enter sends, Shift+Enter newline, Escape clears reply-to state
- **Within right panel**: Up/Down for list navigation, Escape closes panel
- Focus trapping: modals (attachment picker, emoji picker) trap Tab cycle until dismissed with Escape
- Visible focus indicator on all focusable elements: `1px` solid `Terminal-Green` (`#4af626`) outline
- Skip link: hidden "Skip to main content" link for screen readers, jumps to center timeline

### Global hotkeys

| Hotkey | Action |
| ------ | ------ |
| Ctrl+F | Focus search input (opens right panel Search tab) |
| Ctrl+P | Open pinned list in right panel |
| Ctrl+K | Command palette placeholder (future) |
| Escape | Close right panel, dismiss modal, or cancel current action |

## Layout & responsiveness

- 3-column layout with draggable column borders (`resizable` directive)
- Column min/max widths:
    - Left sidebar: min `200px`, max `360px`, default `260px`
    - Center content: min `400px`, flexible (fills remaining space)
    - Right panel: min `280px`, max `480px`, default `320–400px`
- **Breakpoints**:
    - `≥1280px`: all three columns visible
    - `1024–1279px`: right panel overlays center as slide-over
    - `768–1023px`: left sidebar collapses to icon-only rail (~48px), right panel overlays
    - `<768px`: left sidebar hidden (hamburger toggle), right panel full-screen overlay, composer always visible
- Column gap: `1px` solid `Border` color separator, no padding gap
- Each column scrolls independently with thin styled scrollbars

## Min/max sizes and overflow behavior

- Sidebar item text: single-line, truncated with ellipsis at container width
- Center header description: single-line truncated with ellipsis, full text in tooltip on hover
- Message content: no truncation — full content visible, long words break with `overflow-wrap: break-word`
- Timeline: vertical scroll, auto-scroll to bottom on new message; pauses on manual scroll-up with "new messages" indicator
- Right panel: vertical scroll independent of center
- Modals: max-height `80vh`, internal scroll for content

## Mobile & touch gestures

- **Swipe right** (from left edge): open left sidebar when collapsed
- **Swipe left**: close left sidebar or open right panel
- **Long press on message**: open context actions (reply, react, forward, pin)
- **Pull to refresh**: reload current chat/feed timeline
- **Tap outside**: close any open overlay/popover (same as `clickOutside` directive)
- **Pinch-to-zoom**: disabled — fixed font size for terminal consistency
- Touch targets: minimum `44px` height for all interactive elements on mobile

## Content & copy readiness

- All message text, post content, and file names are selectable
- Double-click selects word, triple-click selects line (native browser behavior preserved)
- Code blocks in posts: show `[copy]` button on hover (top-right of block)
- File checksums: truncated display with `[copy]` action for full value
- Links in messages/posts: clickable, open in new tab, underline on hover

## Text truncation rules

- **Single-line truncation** (sidebar names, header descriptions): `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` — tooltip shows full text on hover after `300ms`
- **Multi-line truncation** (feed post card snippets): max 3 lines via CSS `line-clamp: 3` with `…`
- **No truncation**: message content in timeline, post content in reader mode, thread replies
- **Long unbroken strings** (URLs, hashes, file paths): `overflow-wrap: break-word`

## ARIA & accessibility

- Sidebar: `role="navigation"`, sections as `role="group"` with `aria-label`
- Timeline: `role="log"` with `aria-live="polite"` for new messages
- Right panel: `role="complementary"`
- Composer: `role="textbox"` with `aria-label="Message input"`
- Modals: `role="dialog"` with `aria-modal="true"`
- Unread badges: `aria-label="N unread messages"` on sidebar items
- Status dots: `aria-label` describing status (e.g., "online", "away")
