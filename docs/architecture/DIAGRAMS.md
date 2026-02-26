# XXII Chat Diagrams

This file contains text-based representations of the project's architecture and data models, converted from image diagrams. These schemes are compatible with Mermaid-capable viewers and AI tools.

## 1. Calls and Data Flow Diagram `./calls_and_data_flow_diagram.md`

This diagram represents the interaction between the browser tab, service worker, and the server in the local-first architecture.

```mermaid
flowchart TB
    subgraph BrowserTab ["Browser Tab / Window"]
        UI["UI"]
        B_GS["API GLOBALSTORAGE"]

        UI -- "call to api" --> B_GS
        B_GS -- "subscription" --> UI
    end

    subgraph SW ["Service Worker"]
        S_GS["API GLOBALSTORAGE<br/>(CRDT, OPFS)"]
        BLR["BUSINESS LOGIC RUNNER"]
        DQ["Δ Queue"]
        MC["metacom"]

        S_GS -- "event" --> B_GS
        B_GS -- "command pattern" --> BLR

        BLR -- "call" --> S_GS
        S_GS -- "subscription" --> BLR

        S_GS -- "Δ" --> DQ
        DQ -- "Δ" --> MC
        MC -- "Δ" --> S_GS
    end

    subgraph Remote ["Server"]
        SRV["SERVER"]
        FS["FS"]

        MC <--> SRV
        SRV --> FS
    end

    style BrowserTab stroke:#f66,stroke-width:2px
    style SW stroke:#66f,stroke-width:2px
    style Remote stroke:#6f6,stroke-width:2px
```

<details><summary>Plain-text version</summary>

```
┌─── Browser Tab / Window ────────────────────────┐
│                                                  │
│   UI  ── call to api ──▶  API GLOBALSTORAGE      │
│   UI  ◀── subscription ──  API GLOBALSTORAGE     │
│                                                  │
└──────────────────────────────────────────────────┘
        ▲ subscription / event │  ▲ command pattern
        │                      ▼  │
┌─── Service Worker ──────────────────────────────┐
│                                                  │
│   API GLOBALSTORAGE  ◀── call ── B/L RUNNER      │
│     (CRDT, OPFS)     ── subscription ──▶         │
│         │                                        │
│         ▼ Δ                                      │
│      Δ Queue  ── Δ ──▶  metacom  ◀── Δ ──┘      │
│                            │                     │
└────────────────────────────│─────────────────────┘
                             │
┌─── Server ─────────────────│─────────────────────┐
│                            ▼                     │
│                         SERVER  ──▶  FS          │
│                                                  │
└──────────────────────────────────────────────────┘
```

</details>

## 2. Architectural Evolution `./chat_prototype_phases.jpg`

The evolution of the XXII Chat architecture from a simple Web API to a full local-first system with synchronization.

### Stage 1 & 2: Basic Connection & Service Worker

```mermaid
flowchart LR
    subgraph Stage1 ["Stage 1: Pure Web API"]
        UI1["UI"] --> WS1["Web Socket"] --> Node1["Node.js"] --> FS1["FS"]
    end

    subgraph Stage2 ["Stage 2: Service Worker"]
        UI2["UI"] --> MP2["Message Port"]
        subgraph SW2 ["Service Worker"]
            MP2_SW["Message Port"] --> WS2["Web Socket"]
        end
        WS2 --> Node2["Node.js"] --> FS2["FS"]
    end
```

### Stage 3 & 4: Metacom & Local-First Sync

```mermaid
flowchart LR
    subgraph Stage3 ["Stage 3: Metacom"]
        UI3["UI"] --> MET3["Metacom Event Transport"]
        subgraph SW3 ["Service Worker"]
            MP3["Metacom Proxy"] --> WST3["Websocket Transport"]
        end
        WST3 --> Node3["Node.js: Metacom + Globalstorage"] --> FS3["FS"]
    end

    subgraph Stage4 ["Stage 4: Full Local-First"]
        UI4["UI"] --> GS4["Globalstorage"] --> MET4["Metacom Event Transport"]
        subgraph SW4 ["Service Worker"]
            MP4["Metacom Proxy"]
            BLR4["B/L Runner"]
            GS4_SW["Globalstorage"]
            WST4["Websocket Transport"]

            MP4 <--> GS4_SW
            BLR4 <--> GS4_SW
            GS4_SW <--> WST4
        end
        WST4 --> Node4["Node.js: Metacom + Globalstorage"] --> FS4["FS"]
    end
```

## 3. Entity Relationshil Diagram `./entity_relationship_diagram.md`

The relationship between core domain entities in the XXII Chat system.

```mermaid
erDiagram
    Author ||--o{ Author : "contact"
    Author ||--o{ Node : "server"
    Author ||--o{ Peer : "device"
    Author ||--o{ Feed : "owner"
    Author ||--o{ Chat : "owner"
    Author ||--o{ Folder : "owner"
    Author ||--o{ File : "owner"
    Author ||--o{ Post : "author"
    Author ||--o{ Reaction : "reacts"

    Feed ||--o{ Post : "contains"
    Chat ||--o{ Message : "contains"

    Post ||--o{ Reaction : "has"
    Message ||--o{ Reaction : "has"

    Message ||--o{ File : "attach"
    Post ||--o{ File : "attach"

    Folder ||--o{ Folder : "parent"
    Folder ||--o{ File : "contains"
```

<details><summary>Plain-text version</summary>

```
                        ┌──────────┐
                ┌──────▶│  Author  │◀─── contact (self)
                │       └────┬─────┘
                │            │ owns / authors
        server  │    ┌───┬───┼───┬───────┬───────┐
                │    │   │   │   │       │       │
            ┌───┘  ┌─▼─┐ │ ┌─▼─┐ │   ┌───▼──┐ ┌──▼──┐
            │ Node │  │ │Chat│ │   │Folder│ │File │
            └─────┘  │ └───┘ │   └──┬───┘ └─────┘
                     │       │      │ parent (self)
              device │       │      │ contains ──▶ File
            ┌──────┐ │       │
            │ Peer │◀┘       │
            └──────┘     ┌───▼──┐      ┌──────────┐
                         │ Feed │──────▶│   Post   │
                         └──────┘       └────┬─────┘
                                             │ attach ──▶ File
                                             │ has
                  ┌─────────┐           ┌────▼─────┐
           Chat ──│ Message │──attach──▶│   File   │
                  └────┬────┘           └──────────┘
                       │ has
                  ┌────▼─────┐
                  │ Reaction │
                  └──────────┘
```

**Relationships:**

| From    | To       | Relation | Cardinality |
| ------- | -------- | -------- | ----------- |
| Author  | Author   | contact  | one-to-many |
| Author  | Node     | server   | one-to-many |
| Author  | Peer     | device   | one-to-many |
| Author  | Feed     | owner    | one-to-many |
| Author  | Chat     | owner    | one-to-many |
| Author  | Folder   | owner    | one-to-many |
| Author  | File     | owner    | one-to-many |
| Author  | Post     | author   | one-to-many |
| Author  | Reaction | reacts   | one-to-many |
| Feed    | Post     | contains | one-to-many |
| Chat    | Message  | contains | one-to-many |
| Post    | Reaction | has      | one-to-many |
| Message | Reaction | has      | one-to-many |
| Message | File     | attach   | one-to-many |
| Post    | File     | attach   | one-to-many |
| Folder  | Folder   | parent   | one-to-many |
| Folder  | File     | contains | one-to-many |

</details>
