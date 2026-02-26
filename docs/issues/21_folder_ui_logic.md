# Folder UI logic

Refs: `./19_file_ui_logic.md`, `./22_chat_ui_logic.md`

## Left sidebar: Folders section

- Flat list of folders (not a tree) — navigation model: enter/exit like Midnight Commander
- Loaded from `ApiService.getFolders()`
- Top-level shows root folders (where `parent` is null); selecting a folder "enters" it
- Each row: `📁` icon + name + visibility badge (`public` / `unlisted`)
- Some folders may use custom emoji icons (e.g., `🎃 Archive`)
- Current folder path shown as breadcrumb or `..` back row to exit to parent
- `..` row always first when inside a subfolder — click or Enter to go up
- Selecting a folder switches center column to folder/file-list mode
- Keyboard navigation: Up/Down to move, Enter to enter folder, Backspace to go up

## Folder view: center column (file list)

- Header: `📁 foldername` + description (if any) + visibility badge
- File list rendered as terminal-style rows:
  - Format: `📄 name    size    mime    modified`
  - Name: primary text, clickable to open file details in right panel (refs: `./19_file_ui_logic.md`)
  - Size: formatted via `fileSize` pipe
  - MIME: shown as-is in muted text
  - Modified: formatted via `timeAgo` pipe
- Columns aligned with fixed widths or tab-stop spacing for terminal feel
- **Sorting**: clickable column headers — toggle ascending/descending by name, size, or modified date
- Active sort column visually indicated (▲/▼ arrow)
- **Quick actions** (on hover or row context menu):
  - `[Open/Download]` — open file or trigger download
  - `[Copy link]` — copy direct file link to clipboard
  - `[Move]` — open folder picker to move file
  - `[Delete]` — soft delete with confirmation

## Subfolder rows

- Subfolders shown at top of file list before files
- Row: `📁 name` — click to enter subfolder
- Sorted separately from files (folders first, then files)

## Empty & loading states

- **Loading**: skeleton rows while `getFiles(folderId)` resolves
- **Empty folder**: centered muted text `Empty folder`
- **Error**: inline error banner with retry action
