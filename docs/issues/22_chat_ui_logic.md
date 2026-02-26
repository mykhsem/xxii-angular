# Chat UI logic

Refs: `./5_screen_layout.md`, `./10_feed_and_publishing_ui_logic.md`, `./21_folder_ui_logic.md`, `./25_message_ui_logic.md`

## Left sidebar: Chats section

- Render list of chats from `ApiService.getChats()`
- Each row: colored status dot (●) + `!name` + unread badge (number) + last activity time
- Status dot color derived from chat owner/last-active author status (online green / away yellow / offline gray)
- Unread badge: count of messages newer than last-read timestamp; hide when zero
- Last activity time: use `timeAgo` pipe — show `HH:MM` for today, `yesterday`, or date
- Active chat row highlighted with `Surface` background color (`#161b22`)
- Selecting a chat:
  - Updates center column header to `!chatname | description`
  - Loads messages for selected chat via `ApiService.getMessages(chatId)`
  - Sets composer placeholder to `> new message to !chatname`
  - Persists selected chat ID (survives page reload)
- Keyboard navigation: Up/Down to move selection, Enter to activate

## Left sidebar: Contacts section

- Render list of authors from `ApiService.getAuthors()`
- Each row: `👤` person icon + colored status dot (●) + name + unread badge + last seen time
- Selecting a contact could open or create a 1:1 direct chat
- Pinned contacts shown at the top of the section

## Left sidebar: Feeds section

- Render list of feeds from `ApiService.getFeeds()`
- Each row: colored sidebar indicator bar + `#name` + unread badge + last activity time
- Selecting a feed switches center column to feed mode (refs: `./10_feed_and_publishing_ui_logic.md`)

## Left sidebar: Folders section

- Render folder list (refs: `./21_folder_ui_logic.md`)
- Selecting a folder switches center column to folder/file-list mode

## Left sidebar: shared behavior

- Sections: CONTACTS, FEEDS, CHATS, FOLDERS — uppercase labels, each collapsible with chevron
- Collapsed/expanded state persisted in local storage
- Scrollable independently from center and right columns
- Sections support pinned items shown at top with visual separator

## Chat header bar + quick actions

- Left side: `!chatname | description` — name in accent green, description in muted text
- Description truncated with `…`, expand on hover/click
- Right side action buttons: `[Search]` `[Pin list]` `[Members]` `[Files]`
  - Each button toggles a tab in the right context panel
  - Active tab button visually highlighted
  - Opening a tab does not steal focus from composer
- Connection/peer indicator: `peers: N` count from app header, reflecting live connected peers

## Right panel: Members tab

- List chat members from `chat.members` array, resolve via `ApiService.getAuthor(id)`
- Each row: status dot + nick + role badge (owner / admin / moderator / member)
- Admins and moderators listed before regular members
- Owner shown with distinct accent color

## Right panel: Pins tab

- List pinned messages from `chat.pinned` array, resolve via `ApiService.getMessage(id)`
- Each row: `HH:MM nick: content…` (truncated) — click to jump to message in timeline
- Stable order: by message creation time ascending

## Right panel: Search tab

- Search input at top, results below
- Results: matching messages shown as `HH:MM nick: content…` with search term highlighted
- Click result to scroll-to and highlight message in center timeline
- Filter line placeholder: `in:!chat from:@author has:file`

## States

- **Loading**: skeleton rows in sidebar and timeline while data loads
- **Empty**: placeholder text when chat has no messages (`No messages yet`)
- **Error**: inline error banner if data fetch fails, with retry action
