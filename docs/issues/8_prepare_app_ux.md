# Prepare App UX — [IN PORGRESS]

**Status:** Completed 2026-02-26  
Refs: `./9_prepare_app_ui.md`, `./5_screen_layout.md`

Target platforms: Web (primary), iOS, Android, Desktop (PWA / Electron)

> Packaging strategy deferred — no ADR yet. Will be recorded when crossplatform packaging decision is triggered. See `ADR.md`.

## Keyboard navigation & focus order

- [todo] Tab cycle across zones: App header → Left sidebar → Center header → Center timeline → Composer → Right panel (if open) → loop
- [todo] Shift+Tab reverses the cycle
- [todo] **Within sidebar**: Up/Down moves between items, Enter selects/activates, Escape collapses section
- [todo] **Within timeline**: Up/Down moves between messages, Enter opens context actions for selected message
- [todo] **Within composer**: Enter sends, Shift+Enter newline, Escape clears reply-to state
- [todo] **Within right panel**: Up/Down for list navigation, Escape closes panel
- [done] Focus trapping: modals (attachment picker, emoji picker) trap Tab cycle until dismissed with Escape
- [done] Visible focus indicator on all focusable elements: `1px` solid `Terminal-Green` (`#4af626`) outline
- [done] Skip link: hidden "Skip to main content" link for screen readers, jumps to center timeline

### Global hotkeys

| Hotkey | Status | Action                                                     |
| ------ | ------ | ---------------------------------------------------------- |
| Ctrl+F | [done] | Focus search input (opens right panel Search tab)          |
| Ctrl+P | [done] | Open pinned list in right panel                            |
| Ctrl+K | [todo] | Command palette placeholder (future)                       |
| Escape | [done] | Close right panel, dismiss modal, or cancel current action |

## Layout & responsiveness

- [done] 3-column layout with draggable column borders (`resizable` directive)
- Column min/max widths:
  - [done] Left sidebar: min `200px`, max `360px`, default `260px`
  - [done] Center content: min `400px`, flexible (fills remaining space)
  - [done] Right panel: min `280px`, max `480px`, default `320–400px`
- **Breakpoints**:
  - [done] `≥1280px`: all three columns visible
  - [done] `1024–1279px`: right panel overlays center as slide-over
  - [done] `768–1023px`: left sidebar collapses to icon-only rail (~48px), right panel overlays
  - [review] `<768px`: left sidebar hidden (hamburger toggle), right panel full-screen overlay, composer always visible — sidebar hidden via CSS; no hamburger toggle button; no composer
- [done] Column gap: `1px` solid `Border` color separator, no padding gap
- [done] Each column scrolls independently with thin styled scrollbars

## Min/max sizes and overflow behavior

- [todo] Sidebar item text: single-line, truncated with ellipsis at container width
- [todo] Center header description: single-line truncated with ellipsis, full text in tooltip on hover
- [todo] Message content: no truncation — full content visible, long words break with `overflow-wrap: break-word`
- [todo] Timeline: vertical scroll, auto-scroll to bottom on new message; pauses on manual scroll-up with "new messages" indicator
- [done] Right panel: vertical scroll independent of center
- [review] Modals: max-height `80vh`, internal scroll for content — `ModalComponent` exists; no explicit `max-height: 80vh` in styles

## Mobile & touch gestures

- [todo] **Swipe right** (from left edge): open left sidebar when collapsed
- [todo] **Swipe left**: close left sidebar or open right panel
- [todo] **Long press on message**: open context actions (reply, react, forward, pin)
- [todo] **Pull to refresh**: reload current chat/feed timeline
- [done] **Tap outside**: close any open overlay/popover (same as `clickOutside` directive)
- [todo] **Pinch-to-zoom**: disabled — fixed font size for terminal consistency
- [todo] Touch targets: minimum `44px` height for all interactive elements on mobile

## Content & copy readiness

- [review] All message text, post content, and file names are selectable — no explicit override; `user-select: none` on buttons only; browser default elsewhere
- [review] Double-click selects word, triple-click selects line (native browser behavior preserved) — no explicit override; relies on browser defaults
- [todo] Code blocks in posts: show `[copy]` button on hover (top-right of block)
- [todo] File checksums: truncated display with `[copy]` action for full value
- [todo] Links in messages/posts: clickable, open in new tab, underline on hover

## Text truncation rules

- [done] **Single-line truncation** (sidebar names, header descriptions): `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` — `.text-truncate` utility class in `styles.css`; `TooltipDirective` available for hover
- [todo] **Multi-line truncation** (feed post card snippets): max 3 lines via CSS `line-clamp: 3` with `…`
- [todo] **No truncation**: message content in timeline, post content in reader mode, thread replies
- [done] **Long unbroken strings** (URLs, hashes, file paths): `overflow-wrap: break-word` — `.break-anywhere` utility class in `styles.css`

## ARIA & accessibility

- [done] Sidebar: `role="navigation"`, sections as `role="group"` with `aria-label` — `role="navigation"` on shell aside; section `role="group"` pending `SidebarSection` component
- [todo] Timeline: `role="log"` with `aria-live="polite"` for new messages
- [done] Right panel: `role="complementary"`
- [todo] Composer: `role="textbox"` with `aria-label="Message input"`
- [done] Modals: `role="dialog"` with `aria-modal="true"`
- [todo] Unread badges: `aria-label="N unread messages"` on sidebar items
- [todo] Status dots: `aria-label` describing status (e.g., "online", "away")
