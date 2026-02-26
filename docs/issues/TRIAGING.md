# UI Issues — Implementation Triage

Covers only UI issues. Domain-only files (`11_feed_and_subscription_domain_logic.md`, `23_message_domain_logic.md`) are excluded.

Dependency rule: an issue cannot start until all issues it `refs:` are at least **in progress**.

---

## Priority 1 — Foundation (must be done first, everything else blocks on these)

### #9 `prepare_app_ui`
**File**: `9_prepare_app_ui.md`  
**Refs**: `8_prepare_app_ux.md`, `5_screen_layout.md`  
**Why first**: defines the design system (colors, typography, spacing, tokens, component list, interaction states, animations) that every other component consumes. No feature component can be styled correctly without this being settled.  
**Deliverables**:
- Tailwind config with all color tokens and font stack
- `Button`, `Input`, `Textarea`, `Select`, `Badge`, `Modal`, `Tooltip`, `Skeleton`, `ErrorBanner` shared components
- Global CSS baseline (monospace font, background, scrollbar styles)
- Routing shell (`app.routes.ts`) with `/:type/:id` pattern

---

### #8 `prepare_app_ux`
**File**: `8_prepare_app_ux.md`  
**Refs**: `9_prepare_app_ui.md`, `5_screen_layout.md`  
**Why first**: defines keyboard navigation contract, focus order, ARIA roles, breakpoints, and touch gestures that every interactive component must implement. Shared directives live here.  
**Deliverables**:
- `resizable` directive (column drag-resize + localStorage persistence)
- `clickOutside` directive
- Global hotkey handler (Ctrl+F, Ctrl+P, Escape)
- Skip link for screen readers
- Breakpoint service or CSS-only responsive rules

---

### #5 `screen_layout`
**File**: `5_screen_layout.md`  
**Refs**: `22_chat_ui_logic.md`, `9_prepare_app_ui.md`  
**Why first**: the 3-column shell is the host for every feature. Nothing can be placed or navigated to until the layout scaffold exists.  
**Deliverables**:
- `AppShellComponent` — 3-column grid with independent scroll per column
- `AppHeaderComponent` — fixed top bar with `$` prefix and peer count
- `UiStateService` — active item ID, right panel tab, sidebar collapse state
- Column resize with min/max constraints and persistence
- Responsive collapse behavior at all 4 breakpoints

---

## Priority 2 — Shared primitives (pipes + sidebar row, consumed by all features)

These are standalone artifacts with no feature dependencies. Build them immediately after Priority 1 so feature tracks can proceed in parallel.

### Pipes
| Pipe | Used by | Key spec gap (see `INPUT_NEEDED.md`) |
|------|---------|--------------------------------------|
| `timeAgo` | `#22`, `#21`, `#25` | Edge cases (same minute, <1h, >1yr) need clarification |
| `fileSize` | `#19`, `#21`, `#25` | Unit thresholds and decimal precision need clarification |
| `mentionHighlight` | `#25` | Parsing regex and unknown-nick fallback need clarification |
| `markdown` | `#10` | Supported subset and sanitization strategy need clarification |

### Shared display components
| Component | Used by |
|-----------|---------|
| `SidebarSection` (collapsible, chevron, uppercase label) | `#22`, `#21` |
| `SidebarRow` (`[Icon] [Status] [Name] [Badge] [Time]`) | `#22`, `#21` |
| `ReactionBadge` (`Emoji Count` chip) | `#25`, `#10` |
| `AttachmentChip` (`📄 name (size) 📥`) | `#25`, `#10`, `#20` |

---

## Priority 3 — Core chat track (primary user-facing feature)

### #22 `chat_ui_logic`
**File**: `22_chat_ui_logic.md`  
**Refs**: `5_screen_layout.md`, `25_message_ui_logic.md`, `21_folder_ui_logic.md`, `10_feed_and_publishing_ui_logic.md`  
**Depends on**: #5, #9, #8, `SidebarSection`, `SidebarRow`, `timeAgo` pipe  
**Deliverables**:
- `LeftSidebarComponent` with CHATS / CONTACTS / FEEDS / FOLDERS sections
- `ChatListComponent` — rows with status dot, `!name`, unread badge, `timeAgo`
- `ContactListComponent` — rows with status dot, name, unread badge
- `FeedListComponent` — rows with indicator bar, `#name`, unread badge
- `CenterHeaderComponent` — `!name | description` + `[Search]` `[Pin list]` `[Members]` `[Files]` buttons
- `RightPanelComponent` — shell with tab switching, `X` close, slide animation
- `MembersTabComponent` — member rows with role badges
- `PinsTabComponent` — pinned message rows, click-to-scroll
- `SearchTabComponent` — search input + results with term highlight
- **Open gap**: Files tab section missing — see `INPUT_NEEDED.md` A2

---

### #25 `message_ui_logic`
**File**: `25_message_ui_logic.md`  
**Refs**: `23_message_domain_logic.md`, `20_attachment_picker_ui_logic.md`  
**Depends on**: #22, `timeAgo` pipe, `fileSize` pipe, `mentionHighlight` pipe, `ReactionBadge`, `AttachmentChip`  
**Deliverables**:
- `MessageTimelineComponent` — chronological list, auto-scroll, "new messages" indicator
- `MessageRowComponent` — `HH:MM nick: content` with all decorations (pinned, edited, deleted, reactions, reply indicator, forward block, attachment chips)
- `MessageContextActionsComponent` — hover/right-click action row (reply, forward, react, pin, edit, delete)
- `ComposerComponent` — multiline textarea with `> ` prompt, draft persistence, reply preview bar
- `ComposerActionBarComponent` — `[attach]` `[emoji]` `[poll]` `[send]`
- **Open gap**: emoji picker spec missing — see `INPUT_NEEDED.md` A3; poll placeholder behavior — see A4

---

## Priority 4 — Folder + file track (independent of chat track)

Can start in parallel with Priority 3 once Priority 1–2 are done.

### #21 `folder_ui_logic`
**File**: `21_folder_ui_logic.md`  
**Refs**: `19_file_ui_logic.md`, `22_chat_ui_logic.md`  
**Depends on**: #5, #9, `SidebarRow`, `fileSize` pipe, `timeAgo` pipe  
**Deliverables**:
- `FolderSidebarComponent` — flat folder list with `..` back row, Midnight Commander navigation
- `FolderViewComponent` — terminal-style file list with sortable columns (▲/▼)
- `SubfolderRowComponent` — `📁 name` rows at top of file list
- `FileRowComponent` — `📄 name  size  mime  modified` with hover quick actions
- **Open gap**: breadcrumb vs. back button decision pending — see `INPUT_NEEDED.md` DS10

---

### #19 `file_ui_logic`
**File**: `19_file_ui_logic.md`  
**Refs**: `21_folder_ui_logic.md`, `20_attachment_picker_ui_logic.md`  
**Depends on**: #21, `RightPanelComponent`, `fileSize` pipe  
**Deliverables**:
- `FileDetailsPanelComponent` — all properties (name, description, owner, folder, mime, size, checksum, visibility, dates)
- `FilePreviewComponent` — image inline, text/code first 20 lines, fallback icon
- Inline edit for name and description fields
- `[Rename]` `[Change visibility]` `[Move]` `[Copy link]` `[Download]` `[Delete]` actions
- Optimistic update + revert on error
- **Open gap**: folder picker modal for `[Move]` not specified — see `INPUT_NEEDED.md` DS3; confirmation dialog for `[Delete]` not specified — see DS4

---

## Priority 5 — Feed + publishing track (independent of chat and folder tracks)

Can start in parallel with Priority 3–4 once Priority 1–2 are done.

### #10 `feed_and_publishing_ui_logic`
**File**: `10_feed_and_publishing_ui_logic.md`  
**Refs**: `11_feed_and_subscription_domain_logic.md`, `20_attachment_picker_ui_logic.md`  
**Depends on**: #5, #9, `markdown` pipe, `ReactionBadge`, `AttachmentChip`  
**Deliverables**:
- `FeedTimelineComponent` — post cards in reverse-chronological order
- `FeedCardComponent` — title, meta line, snippet (3-line clamp), reaction footer
- `PostReaderComponent` — full markdown-rendered post content
- `PostDetailsPanelComponent` — STATS section (replies, reactions) + OUTLINE section (ToC)
- `PostEditorComponent` — title input, markdown content editor, `[Save Draft]` `[Publish]`, visibility selector, pin toggle
- `FeedSubscriptionControlsComponent` — subscribe toggle, notifications policy, join policy indicator
- **Open gap**: post replies section below reader content not specified — see `INPUT_NEEDED.md` A5; share/forward flow not specified — see A6

---

## Priority 6 — Attachment picker (depends on folder + file track)

### #20 `attachment_picker_ui_logic`
**File**: `20_attachment_picker_ui_logic.md`  
**Refs**: `19_file_ui_logic.md`, `21_folder_ui_logic.md`  
**Depends on**: #19, #21, `Modal` component, `clickOutside` directive, `fileSize` pipe  
**Deliverables**:
- `AttachmentPickerComponent` — modal with 3 tabs (Recent / Folder browse / Upload)
- `RecentFilesTabComponent` — recently used file rows
- `FolderBrowseTabComponent` — folder list + file rows, last-used folder persisted
- `UploadTabComponent` — drag-and-drop zone + `[Choose file]`, per-file progress bar
- Selected file chips with `✕` remove, `[Attach N files]` confirm button
- **Open gap**: drag-and-drop zone visual spec missing — see `INPUT_NEEDED.md` DS12; upload progress bar spec missing — see DS8

---

## Dependency graph (ASCII)

```
#9 prepare_app_ui ──┐
#8 prepare_app_ux ──┤
                    ▼
              #5 screen_layout
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
    Shared pipes          SidebarSection
    & components          SidebarRow
          │                    │
    ┌─────┴──────┐             │
    ▼            ▼             ▼
  #22 chat    #21 folder ◄─────┘
    │              │
    ▼              ▼
  #25 message   #19 file
    │              │
    └──────┬────────┘
           ▼
        #20 attachment picker
           │
    (also consumed by)
           ▼
        #10 feed
```

---

## Issues excluded from UI triage

| File | Reason |
|------|--------|
| `11_feed_and_subscription_domain_logic.md` | Domain logic only — belongs in `xxii-domain` repo |
| `23_message_domain_logic.md` | Domain logic only — belongs in `xxii-domain` repo |

---

## Open gaps summary

Issues that cannot be fully implemented until input is provided (see `docs/INPUT_NEEDED.md` for details):

| Issue | Gap ID | Blocker |
|-------|--------|---------|
| `22_chat_ui_logic.md` | A2 | Files tab in right panel has no spec |
| `25_message_ui_logic.md` | A3 | Emoji picker has no spec |
| `25_message_ui_logic.md` | A4 | Poll placeholder behavior undefined |
| `10_feed_and_publishing_ui_logic.md` | A5 | Post replies section unspecified |
| `10_feed_and_publishing_ui_logic.md` | A6 | Share/forward UI flow unspecified |
| `19_file_ui_logic.md` | DS3, DS4 | Folder picker modal + confirmation dialog unspecified |
| `21_folder_ui_logic.md` | DS10 | Breadcrumb vs. back button undecided |
| `20_attachment_picker_ui_logic.md` | DS8, DS12 | Progress bar + drag-and-drop zone unspecified |
| All pipes | D1–D4 | Edge cases and parsing rules need clarification |
