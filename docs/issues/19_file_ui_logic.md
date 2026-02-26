# File UI logic

refs: `./21_folder_ui_logic.md`, `./20_attachment_picker_ui_logic.md`

## File details panel (right sidebar)

- Opens in right context panel when a file is selected from folder view, attachment chip, or search result
- Header: `FILE DETAILS` with `X` close button
- **Properties displayed**:
  - Name (editable inline)
  - Description (editable inline, optional)
  - Owner: author nick with accent color, resolved via `ApiService.getAuthor(file.owner)`
  - Folder: clickable folder name, navigates to parent folder
  - MIME type: shown as-is (e.g., `application/pdf`, `image/png`)
  - Size: formatted via `fileSize` pipe (e.g., `2.3MB`)
  - Checksum: truncated SHA256 with copy-to-clipboard action
  - Visibility: `public` / `unlisted` badge
  - Created: formatted datetime
  - Modified: formatted datetime
- **Actions**:
  - `[Rename]` — inline edit of name field
  - `[Change visibility]` — toggle public / unlisted
  - `[Move]` — opens folder picker to move file to different folder
  - `[Copy link]` — copies direct file link to clipboard
  - `[Download]` — triggers file download
  - `[Delete]` — soft delete with confirmation dialog
- Updates reflect instantly (optimistic UI) — revert on error

## File preview

- Preview area above properties in the details panel
- **Images** (jpg, png, gif, webp, svg): inline preview, scaled to fit panel width, click to expand
- **Audio/video**: native `<audio>` / `<video>` controls (task paused, implement later)
- **Text/code**: first ~20 lines with monospace font and syntax hint based on mime
- **Other types**: large file-type icon + metadata summary
- Preview loads lazily — does not block panel rendering or folder list
- Loading state: skeleton placeholder while preview loads

## States

- **Loading**: skeleton lines for properties while `getFile(id)` resolves
- **Error**: inline error message if file metadata fails to load
- **Not found**: muted text `File not found` if file ID is invalid or deleted
