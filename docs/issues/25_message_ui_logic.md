# Message timeline rendering

Refs: `./23_message_domain_logic.md`, `./20_attachment_picker_ui_logic.md`

## Message row layout

- Format: `HH:MM  nick: content…` — time in muted text, nick in author accent color, content in primary text
- Nick colors: each author gets a consistent accent color (green, yellow, red, blue from color palette)
- Messages rendered in chronological order (ascending), newest at bottom
- Auto-scroll to bottom on new messages; scroll-up pauses auto-scroll with "new messages" indicator

## Message decorations

- **Pinned**: 📌 icon inline before content
- **Edited**: `(edited)` marker in muted text after content
- **Deleted**: content replaced with italic muted placeholder `This message was deleted`
- **Reactions**: row below message — compact `Emoji Count` badges (e.g., `👍3 🔥1`), clickable to add/remove own reaction
- **Reply indicator**: `↳ N replies` below message — clickable, opens Thread panel in right sidebar
- **Forward block**: indented bordered block below message:
  - First line: `↪ forwarded message text…`
  - Second line (muted): `from #source  (author, HH:MM)`
- **Attachment chips**: `📄 name (size) 📥` — file icon + name + formatted size (`fileSize` pipe) + download icon; clickable to open file details (refs: `./19_file_ui_logic.md`)

## Mentions

- `@nick` in message content highlighted with author's accent color using `mentionHighlight` pipe
- Mentioned nicks are clickable — scroll to contact or open profile

## Message context actions

- Hover or right-click on message reveals action row/menu:
  - Reply (sets replyTo in composer)
  - Forward (opens chat/feed picker)
  - React (opens emoji picker)
  - Pin / Unpin
  - Edit (own messages only — loads content into composer)
  - Delete (own messages only — soft delete with confirmation)

# Composer (multiline editor)

## Input area

- Multiline textarea with `> ` prompt prefix
- Placeholder is context-aware: `> new message to !chatname`
- Enter sends message, Shift+Enter inserts newline
- Draft persistence: content saved per chat ID in local storage, restored on chat switch
- When replying: show reply preview bar above input (`Replying to nick: content…` with ✕ cancel)

## Action bar

- Below input: `[attach]` `[emoji]` `[poll]` on left, `[send]` on right
- **Attach**: opens attachment picker (refs: `./20_attachment_picker_ui_logic.md`), selected files shown as removable chips between input and action bar
- **Emoji**: opens emoji picker popover, inserts emoji at cursor position
- **Poll**: placeholder for future poll creation UI
- **Send**: enabled only when input has content or attachments; accent green color when active, muted when disabled

## States

- **Loading**: messages area shows skeleton lines while `getMessages()` resolves
- **Empty**: centered muted text `No messages yet — start the conversation`
- **Error**: inline error banner with retry action
- **Sending**: message appears immediately with pending/draft style (muted), confirmed style on sync
