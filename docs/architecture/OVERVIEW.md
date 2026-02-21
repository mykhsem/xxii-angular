# XXII Angular — Architecture Overview

High-level architecture of the Angular web client for the XXII Chat platform: a unified messaging, file exchange, and article publishing application with a terminal-like UI aesthetic.

## Product Context

XXII Chat is a local-first platform built on the Metarhia tech stack. Multiple client implementations exist in parallel (Pure DOM, React, Angular, Web Components), each consuming the same domain model and shared schema (`xxii-schema`). This repository (`xxii-angular`) is the **Angular client**.

The platform currently operates at **Stage ③** (Metacom + Globalstorage) and is moving toward **Stage ④** (+ Business Logic Runner + Sync Engine in Service Worker). The Angular client does not yet interact with the Service Worker layer — it consumes data through an abstract `ApiService` backed by mock data during development.

### Ecosystem Repositories

| Layer | Repository | Role |
| ----- | ---------- | ---- |
| Schema | `xxii-schema` | Metaschema definitions for all 9 domain entities |
| Domain | `xxii-domain` | Shared business logic (chat, bot) |
| Clients | `xxii.chat` (Pure DOM), `xxii-react`, **`xxii-angular`**, `xxii-web-components` | UI implementations |
| Servers | `xxii.chat` (Impress), `xxii-fastify`, `xxii-nestjs` | Backend implementations |

## Tech Stack

| Concern | Technology | Version |
| ------- | ---------- | ------- |
| Framework | Angular | 21 |
| Language | TypeScript | 5.9 |
| Reactive layer | RxJS | 7.8 |
| Styling | TailwindCSS (via PostCSS) | 4 |
| Testing | Vitest + jsdom | 4 |
| Schema source | `xxii-schema` | 0.0.1 |
| Package manager | npm | 11.6 |

## Domain Model

Nine entities defined in `xxii-schema`, mirrored as hand-maintained TypeScript interfaces in `src/app/models/` (see ADR-001).

```
Author ──┬── Node (server)
         ├── Peer (device)
         ├── Feed ── Post ── File (attach), Reaction
         ├── Chat ── Message ── File (attach), Reaction
         ├── Folder ── File
         └── Author (contact, self-referencing)
```

**Central entity**: `Author` — owns chats, feeds, folders, files; authors messages and posts.

Each model file exports a TypeScript interface and related union types (e.g., `AuthorStatus`, `FeedVisibility`, `PostStatus`). Barrel re-export via `src/app/models/index.ts`.

Key mapping rules from Metaschema to TypeScript:
- Relations (`owner: 'Author'`) → `string` (ID reference)
- `many` relations → `string[]`
- `?` optional fields → optional property
- `enum` → union literal types
- `datetime` → `string` (ISO 8601)
- `id: string` added explicitly

## Data Access Layer

### Abstract ApiService (`src/app/services/api.service.ts`)

Defines the full data-access contract as abstract methods returning `Observable<T>`. Components inject `ApiService` and are completely decoupled from the data source (see ADR-002).

**Contract surface** (18 methods):
- **Collection queries**: `getAuthors()`, `getChats()`, `getFeeds()`, `getFolders()`, `getNodes()`, `getPeers()`
- **By-ID lookups**: `getAuthor(id)`, `getChat(id)`, `getFeed(id)`, `getFolder(id)`, `getFile(id)`, `getMessage(id)`, `getPost(id)`
- **Scoped queries**: `getMessages(chatId)`, `getPosts(feedId)`, `getFiles(folderId)`

### MockApiService (`src/app/services/mock-api.service.ts`)

Concrete implementation that fetches `public/mock-data.json` via `HttpClient`, caches with `shareReplay(1)`, and filters in memory. Provides realistic interconnected records for all 9 entity types. Includes `retry(2)` with 500ms delay and graceful fallback to empty collections on error.

### Swapping to Real Backend

Replace `useClass: MockApiService` with a new `HttpApiService extends ApiService` in `app.config.ts` — no component changes needed. The real implementation will eventually talk to Globalstorage in the Service Worker via the Command Pattern.

## Application Bootstrap

```
main.ts → bootstrapApplication(App, appConfig)
  └── app.config.ts
        ├── provideRouter(routes)
        ├── provideHttpClient()
        └── { provide: ApiService, useClass: MockApiService }
```

- **Routing**: `app.routes.ts` — currently empty (`Routes = []`), planned URL scheme: `/:type/:id` (e.g., `/chat/abc`, `/feed/xyz`, `/folder/123`)
- **Root component**: `App` — standalone component with `<router-outlet>`

## UI Architecture

### Layout: 3-Column Terminal Scaffold

```
┌──────────────────────────────────────────────────────────┐
│  $ Chat title   peers: N                    [App Header] │
├────────────┬───────────────────────┬─────────────────────┤
│ Left Nav   │  Center Content       │  Right Panel        │
│ ~260px     │  flexible             │  ~320–400px         │
│            │                       │                     │
│ CONTACTS   │  !chat | description  │  Thread / Details / │
│ FEEDS      │  [Search][Pins]...    │  Pins / Members /   │
│ CHATS      │                       │  Files / Search     │
│ FOLDERS    │  Timeline / Cards /   │                     │
│            │  File list            │                     │
│            │                       │                     │
│            │  Shortcut hint bar    │                     │
│            │  > Composer           │                     │
├────────────┴───────────────────────┴─────────────────────┤
│  Ctrl+F: search | Ctrl+P: pinned | Esc: close           │
└──────────────────────────────────────────────────────────┘
```

- **Left sidebar**: collapsible, sections (Contacts, Feeds, Chats, Folders) with uppercase labels, chevron toggles, persisted collapse state
- **Center column**: mode-dependent (Chat timeline, Feed post cards, Folder file list), fixed header + scrollable content + fixed composer
- **Right panel**: contextual (Thread, Post Details, Pins, Members, Files, Search), collapsible with `X` close
- **Column borders**: draggable with min/max constraints (left 200–360px, center ≥400px, right 280–480px)

### Responsive Breakpoints

| Breakpoint | Left Sidebar | Right Panel |
| ---------- | ------------ | ----------- |
| ≥1280px | Full sidebar (260px) | Inline column |
| 1024–1279px | Full sidebar | Slide-over overlay |
| 768–1023px | Icon-only rail (~48px) | Slide-over overlay |
| <768px | Hidden (hamburger toggle) | Full-screen overlay |

### Screens Inventory

| Screen | Center Mode | Right Panel | Trigger |
| ------ | ----------- | ----------- | ------- |
| Chat timeline | Message list + composer | (closed) | Select chat |
| Chat + Thread | Message list + composer | Thread panel | Click `↳ N replies` |
| Chat + Members | Message list + composer | Members list | Click `[Members]` |
| Chat + Pins | Message list + composer | Pinned messages | Click `[Pin list]` |
| Chat + Search | Message list + composer | Search results | Ctrl+F or `[Search]` |
| Chat + Files | Message list + composer | File list | Click `[Files]` |
| Feed timeline | Post cards + composer | (closed) | Select feed |
| Feed + Post Details | Post cards or reader | Post Details panel | Click post title |
| Folder view | File list (terminal rows) | (closed) | Select folder |
| Folder + File Details | File list | File details panel | Click file row |

### Navigation Flows

- **Sidebar → Center**: selecting a sidebar item replaces center content
- **Center → Right panel**: message actions or header buttons open right panel without losing scroll position
- **Right panel → Center**: clicking pinned message or search result scrolls and highlights in center
- **Back**: browser back returns to previous sidebar selection; right panel close is not a navigation event

## Visual Design System

### Design Philosophy

Dark-mode "Modern Terminal" aesthetic — monospace typography, high information density, keyboard-first interaction, ASCII-like separators (`|`, `↳`, `↪`, `[ ]` brackets for buttons).

### Color Palette

| Token | Hex | Usage |
| ----- | --- | ----- |
| Background | `#0d1117` | Main app background |
| Surface | `#161b22` | Sidebars, cards, panels |
| Border | `#30363d` | Dividers, separators |
| Text-Primary | `#c9d1d9` | Message body, labels |
| Text-Muted | `#8b949e` | Timestamps, metadata |
| Terminal-Green | `#4af626` | Accents, active elements, focus ring |
| User-Yellow | `#e3b341` | Secondary nicks, notifications |
| User-Red | `#f85149` | Errors, alerts, danger |
| User-Blue | `#58a6ff` | Links, attachments |

### Typography

- **Font**: JetBrains Mono → Fira Code → `monospace`
- **Header**: 14px / 1.2 / 700
- **Body**: 13px / 1.5 / 400
- **Nick**: 13px / 1.5 / 500
- **Meta**: 11px / 1.2 / 400
- **Spacing base unit**: 4px (scale: 4·8·12·16·24·32·48·64)

### Elevation

No box-shadows — depth conveyed through background color layering (Background → Surface → overlay). Focus ring: `1px` solid Terminal-Green outline.

## Component Architecture

### Planned Reusable Components

**Layout**: `SidebarSection`, `SidebarRow`, `RightPanel`, `Composer`
**Content**: `TimelineMessage`, `FeedCard`, `ReactionBadge`, `AttachmentChip`
**Generic**: `Button` (Primary/Ghost/Danger), `Input`, `Textarea`, `Select`, `Badge`, `Modal`, `Tooltip`, `Skeleton`, `ErrorBanner`

### Pipes

| Pipe | Purpose |
| ---- | ------- |
| `timeAgo` | Timestamps → "12:41", "yesterday", date |
| `fileSize` | Bytes → "2.3MB" |
| `mentionHighlight` | `@nick` → accent-colored spans |
| `markdown` | Basic markdown → HTML (bold, code, links) |

### Directives

| Directive | Purpose |
| --------- | ------- |
| `keyboardNav` | Up/Down/Enter selection on lists |
| `autoFocus` | Focus composer on context change |
| `resizable` | Draggable column borders |
| `clickOutside` | Close dropdowns/overlays |

## State Management Patterns

### Global UI States

Every data-driven component implements four states:

| State | Visual | Trigger |
| ----- | ------ | ------- |
| **Loading** | Skeleton matching target layout | Observable pending |
| **Empty** | Centered muted text | Empty array result |
| **Error** | Inline banner + `[Retry]` | Fetch failure |
| **Success** | Normal rendering | Data loaded |

### Persistence

- **Selected chat/feed/folder ID**: survives page reload
- **Sidebar section collapse state**: `localStorage`
- **Composer drafts**: saved per chat ID in `localStorage`
- **Right panel state**: open/closed + active tab persisted
- **Column widths**: persisted after resize
- **Last-used attachment folder**: `localStorage`

### Reactive Data Flow

Components inject `ApiService` → subscribe to `Observable<T>` → render via `async` pipe or signal-based subscription. Mock layer uses `shareReplay(1)` for caching. Real backend will use Globalstorage subscriptions with event-driven updates.

## Interaction Model

### Keyboard-First Navigation

- **Tab cycle**: App header → Sidebar → Center header → Timeline → Composer → Right panel → loop
- **Zone navigation**: Up/Down within lists, Enter to activate, Escape to close/cancel
- **Global hotkeys**: Ctrl+F (search), Ctrl+P (pins), Ctrl+K (command palette, future), Escape (close)
- **Composer**: Enter sends, Shift+Enter newline
- **Focus trapping**: modals trap Tab until dismissed

### Mobile & Touch

- Swipe right/left for sidebar toggle
- Long press on message for context actions
- Pull to refresh timeline
- Minimum 44px touch targets
- Pinch-to-zoom disabled (terminal consistency)

### Accessibility

- ARIA roles: `navigation` (sidebar), `log` (timeline), `complementary` (right panel), `dialog` (modals)
- `aria-live="polite"` for new messages
- Visible focus indicator on all interactive elements
- Skip link for screen readers

## Animations

Minimal, consistent with terminal aesthetic:
- Panel collapse/expand: `150ms` ease-out slide
- Modal: `100ms` opacity fade
- Hover transitions: `100ms` background-color
- New messages: instant append (no animation)
- Skeleton → content: instant swap
- No bounces, springs, or parallax

## Architecture Decisions

| ADR | Decision | Status |
| --- | -------- | ------ |
| ADR-001 | Hand-maintained TS interfaces in `src/app/models/` mirroring `xxii-schema` | Accepted |
| ADR-002 | Abstract `ApiService` with DI-swappable `MockApiService` (`shareReplay` cached) | Accepted |

## Future Architecture Evolution

The client will evolve through these stages:
1. **Current** — Mock data via `MockApiService`, no Service Worker
2. **Next** — Real `HttpApiService` talking to Metacom/Globalstorage server
3. **Target** — Globalstorage in-browser with Service Worker sync engine (Stage ④), CRDT conflict resolution, OPFS for offline storage, delta sync via WebSocket

Planned capabilities: WebRTC peer-to-peer, bot engine integration, smart contracts, full-text search, AI assistant integration.

## Related Documentation

- `./DIAGRAMS.md` — Mermaid diagrams: data flow, architectural evolution, entity relationships
- `./product_technologies_used.md` — Globalstorage, CRDT, OPFS, WebSocket, WebRTC, Metaschema
- `./future_features.md` — Full product scope, schemas, permissions, future features roadmap
- `../UI_UX_requirements.md` — Complete UI/UX specification (§1–§29)
- `../issues/` — Implementation work items (screen layout, UI logic, domain logic)
- `../../ADR.md` — Architecture Decision Records
