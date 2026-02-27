# Attachment picker UI logic

refs: `./19_file_ui_logic.md`, `./21_folder_ui_logic.md`

## Trigger & placement

- Activated from `[attach]` button in message composer or post editor
- Opens as a modal overlay or inline dropdown panel (similar to GitHub editor file lookup)
- Closes on Esc, click-outside (`clickOutside` directive), or explicit cancel
- Multiple files can be selected before confirming

## Tabs

### Recent

- Shows recently used/uploaded files for the current author
- Each row: `📄 name  size  mime  modified` — same terminal row format as folder view
- Click to toggle selection (checkbox or highlight)

### Folder browse

- Folder list at top: flat list of folders from `ApiService.getFolders()`
- Selecting a folder loads its files via `ApiService.getFiles(folderId)`
- File rows same format as Recent tab
- Remembers last-used folder between picker opens (persisted in local storage)
- Breadcrumb or back button for navigation context

### Upload

- Drag-and-drop zone or `[Choose file]` button to select from OS file dialog
- Shows upload progress bar per file
- After upload completes, file appears in selected list
- Accepts any file type; max size limit shown as hint text

## Selected files

- Selected files shown as removable chips below tabs: `📄 name (size) ✕`
- Click `✕` to deselect/remove
- Chips also visible in composer area after picker closes (between input and action bar)
- Confirm button: `[Attach N files]` — inserts file references into message/post draft

## States

- **Loading**: skeleton rows while file lists load
- **Empty folder**: muted text `No files in this folder`
- **Upload error**: inline error per file with retry action
- **No results**: muted text when search/filter returns nothing
