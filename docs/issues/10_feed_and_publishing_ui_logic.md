# Feed and publishing UI logic

Refs: `./11_feed_and_subscription_domain_logic.md`, `./20_attachment_picker_ui_logic.md`

## Feed timeline (view mode)

- Center column switches to feed mode when a feed is selected in left sidebar
- Header: `#feedname | description` — name in accent green, description in muted text
- Action buttons in header: `[Search]` `[Pin list]` `[Members]` `[Files]`
- Composer placeholder: `> new post to #feedname`
- Posts rendered as cards in reverse-chronological order (newest first)

## Post card layout

- **Title**: accent/green color, bold — clickable to open reader mode
- **Meta line**: `author · YYYY-MM-DD HH:MM` — author nick in accent color, date in muted text, middot separator
- **Snippet**: 2–3 lines of content text, truncated with `…`
- **Footer**: `□ N replies  emoji N  emoji N` — reply count icon + inline reaction badges
- Card has `Border` color (`#30363d`) border, `Surface` background (`#161b22`)
- Hover: subtle border highlight

## Post reader mode

- Activated by clicking post title in timeline
- Center column shows full post content (long-form, markdown-rendered via `markdown` pipe)
- Right panel opens **Post Details** tab:
  - Header: `POST DETAILS` with `X` close
  - Post title, author · date, content excerpt
  - **STATS** section: Replies count, Reactions breakdown (emoji + count)
  - **OUTLINE** section: table of contents for long posts, headings prefixed with `→` (e.g., `→ Introduction`, `→ Key Features`) — clickable to scroll to section
- Below post content: threaded replies section (same format as thread panel)
- Reaction bar at bottom of post: click emoji to add/remove reaction

## Post editor mode

- Activated from composer area or "New Post" action
- **Title input**: required, single-line
- **Content editor**: multiline, supports markdown (bold, code blocks, links)
- **Status controls**: `[Save Draft]` `[Publish]` — drafts saved locally and via API
- **Attachments**: add via `[attach]` button (refs: `./20_attachment_picker_ui_logic.md`), shown as removable chips
- **Visibility selector**: dropdown — public / private / unlisted (from feed settings)
- **Pin toggle**: option to pin post to feed on publish

## Feed subscription & moderation (UI controls)

- Subscribe/unsubscribe toggle button in feed header or right panel
- Notifications policy selector: all / mentions / none
- Join policy indicator: open / invite / request — shown in feed description area
- Moderation badge on feed if user has moderator/admin role
- Share action: forward post link to chat or another feed

## States

- **Loading**: skeleton post cards while `getPosts(feedId)` resolves
- **Empty feed**: centered muted text `No posts yet`
- **Empty draft**: editor with placeholder content hints
- **Error**: inline error banner with retry action
