import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { UiStateService } from '../../services/ui-state.service';
import type { Author } from '../../models/author';
import type { Message } from '../../models/message';

const STATUS_LABEL: Record<string, string> = {
  online: '●',
  away: '○',
  dnd: '◌',
  offline: '·',
  unknown: '·',
};

interface MemberRow {
  id: string;
  nick: string;
  statusDot: string;
  status: string;
}

interface PinRow extends Message {
  authorNick: string;
  timeLabel: string;
}

interface FileRow {
  id: string;
  name: string;
  mime: string;
  size: string;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function buildMembers(memberIds: string[], authors: Author[]): MemberRow[] {
  const authorMap = new Map(authors.map((a) => [a.id, a]));
  return memberIds.map((id) => {
    const a = authorMap.get(id);
    return {
      id,
      nick: a?.nick ?? id,
      statusDot: STATUS_LABEL[a?.status ?? 'unknown'],
      status: a?.status ?? 'unknown',
    };
  });
}

function buildPins(messages: Message[], authors: Author[]): PinRow[] {
  const authorMap = new Map(authors.map((a) => [a.id, a.nick]));
  return messages
    .filter((m) => m.pinned)
    .map((m) => ({
      ...m,
      authorNick: authorMap.get(m.author) ?? m.author,
      timeLabel: formatTime(m.created),
    }));
}

@Component({
  selector: 'app-right-panel',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="panel">
        <!-- Panel header -->
        <div class="panel__header">
          <span class="panel__title">{{ vm.tabLabel }}</span>
          <button aria-label="Close panel" class="panel__close" type="button" (click)="close()">✕</button>
        </div>

        <!-- MEMBERS tab -->
        @if (vm.tab === 'members') {
          <div class="panel__content">
            @if (!vm.members || vm.members.length === 0) {
              <p class="panel__empty">No members.</p>
            }
            @for (member of vm.members; track member.id) {
              <div class="panel__member-row">
                <span
                  class="panel__status-dot"
                  [attr.aria-label]="member.status"
                  [class]="'panel__status-dot--' + member.status">
                  {{ member.statusDot }}
                </span>
                <span class="panel__nick">{{ member.nick }}</span>
              </div>
            }
          </div>
        }

        <!-- PINS tab -->
        @if (vm.tab === 'pins') {
          <div class="panel__content">
            @if (!vm.pins || vm.pins.length === 0) {
              <p class="panel__empty">No pinned messages.</p>
            }
            @for (msg of vm.pins; track msg.id) {
              <div class="panel__pin-row">
                <div class="panel__pin-meta">
                  <span class="panel__pin-time">{{ msg.timeLabel }}</span>
                  <span class="panel__pin-nick">{{ msg.authorNick }}</span>
                </div>
                <div class="panel__pin-content">{{ msg.content }}</div>
              </div>
            }
          </div>
        }

        <!-- FILES tab -->
        @if (vm.tab === 'files') {
          <div class="panel__content">
            @if (!vm.files || vm.files.length === 0) {
              <p class="panel__empty">No file attachments in this chat.</p>
            }
            @for (file of vm.files; track file.id) {
              <div class="panel__file-row">
                <span class="panel__file-name">{{ file.name }}</span>
                <span class="panel__file-meta">{{ file.mime }} · {{ file.size }}</span>
              </div>
            }
          </div>
        }

        <!-- SEARCH tab -->
        @if (vm.tab === 'search') {
          <div class="panel__content">
            <div class="panel__search-hint">&gt; search placeholder</div>
          </div>
        }
      </div>
    }
  `,
  styles: `
    .panel {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .panel__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      background-color: var(--color-surface);
    }

    .panel__title {
      font-size: var(--font-size-header);
      font-weight: 700;
      color: var(--color-text-primary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .panel__close {
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      padding: 0;
      line-height: 1;
    }

    .panel__close:hover {
      color: var(--color-user-red);
    }

    .panel__close:focus-visible {
      outline: 1px solid var(--color-terminal-green);
    }

    .panel__content {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-2) var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .panel__empty {
      color: var(--color-text-muted);
      text-align: center;
      margin-top: var(--space-6);
    }

    /* Members */
    .panel__member-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) 0;
    }

    .panel__status-dot {
      font-size: var(--font-size-small);
      width: 12px;
      text-align: center;
      flex-shrink: 0;
    }

    .panel__status-dot--online {
      color: var(--color-terminal-green);
    }

    .panel__status-dot--away {
      color: var(--color-user-yellow);
    }

    .panel__status-dot--dnd {
      color: var(--color-user-red);
    }

    .panel__status-dot--offline {
      color: var(--color-text-muted);
    }

    .panel__nick {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
    }

    /* Pins */
    .panel__pin-row {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .panel__pin-meta {
      display: flex;
      gap: var(--space-2);
      font-size: var(--font-size-small);
    }

    .panel__pin-time {
      color: var(--color-text-muted);
    }

    .panel__pin-nick {
      color: var(--color-terminal-green);
      font-weight: 500;
    }

    .panel__pin-content {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      overflow-wrap: break-word;
    }

    /* Files */
    .panel__file-row {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: var(--space-2) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .panel__file-name {
      font-size: var(--font-size-base);
      color: var(--color-user-blue);
    }

    .panel__file-meta {
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
    }

    /* Search */
    .panel__search-hint {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      padding: var(--space-3) 0;
    }
  `,
})
export class RightPanelComponent {
  private readonly api = inject(ApiService);
  private readonly uiState = inject(UiStateService);

  readonly vm$ = this.uiState.state.pipe(
    switchMap((state) => {
      const { activeItemType, activeItemId, rightPanelTab } = state;

      const tabLabels: Record<string, string> = {
        members: 'Members',
        pins: 'Pins',
        files: 'Files',
        search: 'Search',
      };

      const tabLabel = rightPanelTab ? (tabLabels[rightPanelTab] ?? rightPanelTab) : '';

      if (activeItemType === 'chat' && activeItemId) {
        return combineLatest({
          chat: this.api.getChat(activeItemId),
          messages: this.api.getMessages(activeItemId),
          authors: this.api.getAuthors(),
          allFiles: this.api
            .getFiles('fld1')
            .pipe(
              switchMap((f1) =>
                combineLatest([of(f1), this.api.getFiles('fld2'), this.api.getFiles('fld3')]).pipe(
                  map(([a, b, c]) => [...a, ...b, ...c]),
                ),
              ),
            ),
        }).pipe(
          map(({ chat, messages, authors, allFiles }) => {
            const attachmentIds = new Set(messages.flatMap((m) => m.attachments));
            const attachedFiles: FileRow[] = allFiles
              .filter((f) => attachmentIds.has(f.id))
              .map((f) => ({ id: f.id, name: f.name, mime: f.mime, size: formatSize(f.size) }));

            return {
              tab: rightPanelTab,
              tabLabel,
              members: buildMembers(chat?.members ?? [], authors),
              pins: buildPins(messages, authors),
              files: attachedFiles,
            };
          }),
        );
      }

      return of({ tab: rightPanelTab, tabLabel, members: [], pins: [], files: [] });
    }),
  );

  close(): void {
    this.uiState.closeRightPanel();
  }
}
