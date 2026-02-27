import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { UiStateService } from '../../services/ui-state.service';

interface SidebarSection {
  label: string;
  type: 'chat' | 'feed' | 'folder';
  collapsed: boolean;
  storageKey: string;
}

function loadCollapsed(key: string): boolean {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function saveCollapsed(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <nav aria-label="Navigation" class="sidebar">
        <!-- CHATS -->
        <div aria-label="Chats" class="sidebar__section" role="group">
          <button
            class="sidebar__section-header"
            type="button"
            [attr.aria-expanded]="!sections[0].collapsed"
            (click)="toggleSection(0)">
            <span class="sidebar__section-label">CHATS</span>
            <span class="sidebar__chevron" [class.sidebar__chevron--collapsed]="sections[0].collapsed">▾</span>
          </button>
          @if (!sections[0].collapsed) {
            <ul class="sidebar__list" role="list">
              @for (chat of vm.chats; track chat.id) {
                <li
                  class="sidebar__row"
                  role="button"
                  tabindex="0"
                  [class.sidebar__row--active]="vm.activeType === 'chat' && vm.activeId === chat.id"
                  (click)="navigate('chat', chat.id)"
                  (keyup.enter)="navigate('chat', chat.id)">
                  <span class="sidebar__icon">{{ chat.icon ?? '#' }}</span>
                  <span class="sidebar__name">{{ chat.name }}</span>
                </li>
              }
            </ul>
          }
        </div>

        <!-- FEEDS -->
        <div aria-label="Feeds" class="sidebar__section" role="group">
          <button
            class="sidebar__section-header"
            type="button"
            [attr.aria-expanded]="!sections[1].collapsed"
            (click)="toggleSection(1)">
            <span class="sidebar__section-label">FEEDS</span>
            <span class="sidebar__chevron" [class.sidebar__chevron--collapsed]="sections[1].collapsed">▾</span>
          </button>
          @if (!sections[1].collapsed) {
            <ul class="sidebar__list" role="list">
              @for (feed of vm.feeds; track feed.id) {
                <li
                  class="sidebar__row"
                  role="button"
                  tabindex="0"
                  [class.sidebar__row--active]="vm.activeType === 'feed' && vm.activeId === feed.id"
                  (click)="navigate('feed', feed.id)"
                  (keyup.enter)="navigate('feed', feed.id)">
                  <span class="sidebar__icon">{{ feed.icon ?? '!' }}</span>
                  <span class="sidebar__name">{{ feed.name }}</span>
                </li>
              }
            </ul>
          }
        </div>

        <!-- FOLDERS -->
        <div aria-label="Folders" class="sidebar__section" role="group">
          <button
            class="sidebar__section-header"
            type="button"
            [attr.aria-expanded]="!sections[2].collapsed"
            (click)="toggleSection(2)">
            <span class="sidebar__section-label">FOLDERS</span>
            <span class="sidebar__chevron" [class.sidebar__chevron--collapsed]="sections[2].collapsed">▾</span>
          </button>
          @if (!sections[2].collapsed) {
            <ul class="sidebar__list" role="list">
              @for (folder of vm.folders; track folder.id) {
                <li
                  class="sidebar__row"
                  role="button"
                  tabindex="0"
                  [class.sidebar__row--active]="vm.activeType === 'folder' && vm.activeId === folder.id"
                  (click)="navigate('folder', folder.id)"
                  (keyup.enter)="navigate('folder', folder.id)">
                  <span class="sidebar__icon">▤</span>
                  <span class="sidebar__name">{{ folder.name }}</span>
                </li>
              }
            </ul>
          }
        </div>
      </nav>
    }
  `,
  styles: `
    .sidebar {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: var(--space-2) 0;
    }

    .sidebar__section {
      display: flex;
      flex-direction: column;
    }

    .sidebar__section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-1) var(--space-3);
      background: transparent;
      border: none;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: var(--font-size-small);
      font-weight: 700;
      color: var(--color-text-muted);
      letter-spacing: 0.06em;
      text-align: left;
      width: 100%;
      user-select: none;
    }

    .sidebar__section-header:hover {
      color: var(--color-text-primary);
    }

    .sidebar__section-header:focus-visible {
      outline: 1px solid var(--color-terminal-green);
      outline-offset: -1px;
    }

    .sidebar__section-label {
      font-size: var(--font-size-small);
      font-weight: 700;
      letter-spacing: 0.06em;
    }

    .sidebar__chevron {
      font-size: var(--font-size-small);
      transition: transform var(--transition-fast);
      display: inline-block;
    }

    .sidebar__chevron--collapsed {
      transform: rotate(-90deg);
    }

    .sidebar__list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .sidebar__row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-3) var(--space-1) var(--space-4);
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border-left: 2px solid transparent;
    }

    .sidebar__row:hover {
      background-color: var(--color-surface);
      color: var(--color-text-primary);
    }

    .sidebar__row--active {
      background-color: var(--color-surface);
      border-left-color: var(--color-terminal-green);
      color: var(--color-terminal-green);
    }

    .sidebar__icon {
      flex-shrink: 0;
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      width: 14px;
      text-align: center;
    }

    .sidebar__row--active .sidebar__icon {
      color: var(--color-terminal-green);
    }

    .sidebar__name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `,
})
export class SidebarComponent {
  private readonly api = inject(ApiService);
  private readonly uiState = inject(UiStateService);
  private readonly router = inject(Router);

  readonly sections: SidebarSection[] = [
    { label: 'CHATS', type: 'chat', collapsed: loadCollapsed('xxii.sidebar.chats'), storageKey: 'xxii.sidebar.chats' },
    { label: 'FEEDS', type: 'feed', collapsed: loadCollapsed('xxii.sidebar.feeds'), storageKey: 'xxii.sidebar.feeds' },
    {
      label: 'FOLDERS',
      type: 'folder',
      collapsed: loadCollapsed('xxii.sidebar.folders'),
      storageKey: 'xxii.sidebar.folders',
    },
  ];

  readonly vm$ = combineLatest({
    chats: this.api.getChats(),
    feeds: this.api.getFeeds(),
    folders: this.api.getFolders(),
    activeType: this.uiState.state.pipe(map((s) => s.activeItemType)),
    activeId: this.uiState.state.pipe(map((s) => s.activeItemId)),
  });

  toggleSection(index: number): void {
    const section = this.sections[index];
    section.collapsed = !section.collapsed;
    saveCollapsed(section.storageKey, section.collapsed);
  }

  navigate(type: 'chat' | 'feed' | 'folder', id: string): void {
    void this.router.navigate([type, id]);
  }
}
