import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { UiStateService } from '../../../services/ui-state.service';
import type { Author } from '../../../models/author';
import type { Message } from '../../../models/message';

interface MessageRow extends Message {
  authorNick: string;
  replyToNick?: string;
  timeLabel: string;
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
}

function buildRows(messages: Message[], authors: Author[]): MessageRow[] {
  const authorMap = new Map(authors.map((a) => [a.id, a.nick]));
  const msgMap = new Map(messages.map((m) => [m.id, m]));
  return messages.map((m) => {
    const replyTo = m.replyTo ? msgMap.get(m.replyTo) : undefined;
    return {
      ...m,
      authorNick: authorMap.get(m.author) ?? m.author,
      replyToNick: replyTo ? (authorMap.get(replyTo.author) ?? replyTo.author) : undefined,
      timeLabel: formatTime(m.created),
    };
  });
}

@Component({
  selector: 'app-chat-view',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="chat-view">
        <!-- Chat header -->
        <div class="chat-view__header">
          <div class="chat-view__title">
            <span class="chat-view__icon">{{ vm.chat?.icon ?? '#' }}</span>
            <span class="chat-view__name">{{ vm.chat?.name }}</span>
            @if (vm.chat?.description) {
              <span class="chat-view__sep">|</span>
              <span class="chat-view__desc">{{ vm.chat?.description }}</span>
            }
          </div>
          <div class="chat-view__actions">
            <button class="chat-view__action-btn" type="button" (click)="openPanel('search')">[Search]</button>
            <button class="chat-view__action-btn" type="button" (click)="openPanel('pins')">[Pins]</button>
            <button class="chat-view__action-btn" type="button" (click)="openPanel('members')">[Members]</button>
            <button class="chat-view__action-btn" type="button" (click)="openPanel('files')">[Files]</button>
          </div>
        </div>

        <!-- Shortcut hint bar -->
        <div aria-hidden="true" class="chat-view__hints">
          Ctrl+F: search &nbsp;|&nbsp; Ctrl+P: pinned &nbsp;|&nbsp; Esc: close
        </div>

        <!-- Message timeline -->
        <div aria-live="polite" class="chat-view__timeline" role="log">
          @if (vm.messages.length === 0) {
            <p class="chat-view__empty">No messages yet.</p>
          }
          @for (msg of vm.messages; track msg.id) {
            <div class="chat-view__message" [class.chat-view__message--pinned]="msg.pinned">
              @if (msg.replyToNick) {
                <div class="chat-view__reply-indicator">↳ {{ msg.replyToNick }}</div>
              }
              <div class="chat-view__message-body">
                <span class="chat-view__time">{{ msg.timeLabel }}</span>
                <span class="chat-view__nick">{{ msg.authorNick }}:</span>
                <span class="chat-view__content">{{ msg.content }}</span>
                @if (msg.pinned) {
                  <span class="chat-view__pinned-badge">[pinned]</span>
                }
              </div>
              @if (msg.reactions && objectKeys(msg.reactions).length > 0) {
                <div class="chat-view__reactions">
                  @for (emoji of objectKeys(msg.reactions); track emoji) {
                    <span class="chat-view__reaction">{{ emoji }} {{ msg.reactions[emoji].length }}</span>
                  }
                </div>
              }
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="chat-view__empty-state">Select a chat to start reading.</div>
    }
  `,
  styles: `
    .chat-view {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .chat-view__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      background-color: var(--color-surface);
      gap: var(--space-3);
    }

    .chat-view__title {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      overflow: hidden;
      min-width: 0;
    }

    .chat-view__icon {
      color: var(--color-terminal-green);
      font-weight: 700;
      flex-shrink: 0;
    }

    .chat-view__name {
      font-weight: 700;
      font-size: var(--font-size-header);
      color: var(--color-text-primary);
      flex-shrink: 0;
    }

    .chat-view__sep {
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .chat-view__desc {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .chat-view__actions {
      display: flex;
      gap: var(--space-2);
      flex-shrink: 0;
    }

    .chat-view__action-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      padding: 0;
      white-space: nowrap;
    }

    .chat-view__action-btn:hover {
      color: var(--color-terminal-green);
    }

    .chat-view__action-btn:focus-visible {
      outline: 1px solid var(--color-terminal-green);
    }

    .chat-view__hints {
      padding: var(--space-1) var(--space-3);
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .chat-view__timeline {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3);
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .chat-view__empty {
      color: var(--color-text-muted);
      text-align: center;
      margin-top: var(--space-8);
    }

    .chat-view__empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
    }

    .chat-view__message {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 2px 0;
    }

    .chat-view__message--pinned {
      border-left: 2px solid var(--color-user-yellow);
      padding-left: var(--space-2);
    }

    .chat-view__reply-indicator {
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
      padding-left: calc(var(--font-size-small) * 4);
    }

    .chat-view__message-body {
      display: flex;
      align-items: baseline;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .chat-view__time {
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .chat-view__nick {
      font-size: var(--font-size-base);
      font-weight: 500;
      color: var(--color-terminal-green);
      flex-shrink: 0;
    }

    .chat-view__content {
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      overflow-wrap: break-word;
      word-break: break-word;
    }

    .chat-view__pinned-badge {
      font-size: var(--font-size-small);
      color: var(--color-user-yellow);
      flex-shrink: 0;
    }

    .chat-view__reactions {
      display: flex;
      gap: var(--space-2);
      padding-left: calc(var(--font-size-small) * 4 + var(--space-2));
    }

    .chat-view__reaction {
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
      background-color: var(--color-surface);
      padding: 0 var(--space-1);
      border: 1px solid var(--color-border);
    }
  `,
})
export class ChatViewComponent {
  private readonly api = inject(ApiService);
  private readonly uiState = inject(UiStateService);

  readonly objectKeys = Object.keys;

  readonly vm$ = this.uiState.state.pipe(
    map((s) => (s.activeItemType === 'chat' ? s.activeItemId : null)),
    switchMap((chatId) => {
      if (!chatId) {
        return of(null);
      }
      return combineLatest({
        chat: this.api.getChat(chatId),
        messages: this.api.getMessages(chatId),
        authors: this.api.getAuthors(),
      }).pipe(
        map(({ chat, messages, authors }) => ({
          chat,
          messages: buildRows(messages, authors),
        })),
      );
    }),
  );

  openPanel(tab: 'search' | 'pins' | 'members' | 'files'): void {
    this.uiState.openRightPanel(tab);
  }
}
