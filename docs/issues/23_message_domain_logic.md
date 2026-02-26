# Message posting and drafts

Refs: `./25_message_ui_logic.md`

- Create message (draft) locally, render immediately, reconcile with sync updates
- Create Message (draft) record with created, author, chat, content, attachments other fields
- Status: pending (draft) -> confirmed (sent)
- Message appears instantly and later becomes confirmed (sent) without duplication (we use unique UUID)
- Edit + soft delete semantics
- Implement edit and delete draft

# Support threaded replies (replyTo)

- Provide a way to fetch thread messages
- Thread loads in right panel with consistent ordering (asc by default)
- Reply count updates live as new replies arrive

# Forwarding messages

- Forward message into chat/feed as link-like structure
- Field forwarded points to original Message
- Forwarded preview works even if original is not in local cache

# Reactions (emoji)

- Something like { emoji: Author[] }
- Functions: add/remove reaction
- Prevent duplicate author in array

# Pinned messages helpers (chat.pinned array)

- Provide pin/unpin operations with consistent UX
- Pin list stable order (by pin time or message time)

# Mentions parsing (@nick) and mention index

- Detect mentions in content for highlighting/notifications policy later
- Parse mentions from content
- Store derived metadata (not backend): mentions: Author[]
- Mention highlighting works without server help


