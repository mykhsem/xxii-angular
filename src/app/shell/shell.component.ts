import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { HotkeyService } from '../services/hotkey.service';
import { ActiveItemType, UiStateService } from '../services/ui-state.service';
import { ResizableDirective } from '../shared/directives/resizable.directive';
import { HeaderComponent } from './header/header.component';

const VALID_TYPES: ActiveItemType[] = ['chat', 'feed', 'folder'];

function isActiveItemType(value: string | null): value is ActiveItemType {
  return VALID_TYPES.includes(value as ActiveItemType);
}

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [AsyncPipe, RouterOutlet, ResizableDirective, HeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="shell">
      <app-header />

      <div class="shell__columns">
        <!-- Left Sidebar -->
        @if (leftSidebarOpen$ | async) {
          <aside
            appResizable
            aria-label="Navigation"
            class="shell__sidebar-left"
            role="navigation"
            storageKey="xxii.layout.leftSidebar"
            [defaultWidth]="260"
            [maxWidth]="360"
            [minWidth]="200">
            <!-- Content provided by Priority 3 (#22 chat_ui_logic) -->
          </aside>
        }

        <!-- Center Column -->
        <main class="shell__center" id="main-content" role="main">
          <router-outlet />
        </main>

        <!-- Right Panel -->
        @if (rightPanelOpen$ | async) {
          <aside
            appResizable
            aria-label="Context panel"
            class="shell__panel-right"
            role="complementary"
            storageKey="xxii.layout.rightPanel"
            [defaultWidth]="320"
            [maxWidth]="480"
            [minWidth]="280">
            <!-- Content provided by Priority 3 (#22 chat_ui_logic) -->
          </aside>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }

    .shell {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .shell__columns {
      display: flex;
      flex: 1;
      min-height: 0;
      overflow: hidden;
    }

    /* Left sidebar */
    .shell__sidebar-left {
      flex-shrink: 0;
      height: 100%;
      overflow-y: auto;
      background-color: var(--color-surface);
      border-right: 1px solid var(--color-border);
    }

    /* Center column */
    .shell__center {
      flex: 1;
      min-width: 400px;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    /* Right panel */
    .shell__panel-right {
      flex-shrink: 0;
      height: 100%;
      overflow-y: auto;
      background-color: var(--color-surface);
      border-left: 1px solid var(--color-border);
    }

    /* === Breakpoints === */

    /* 1024–1279px: right panel overlays center */
    @media (max-width: 1279px) {
      .shell__panel-right {
        position: absolute;
        top: var(--header-height);
        right: 0;
        bottom: 0;
        z-index: 100;
      }
    }

    /* 768–1023px: left sidebar collapses to icon rail */
    @media (max-width: 1023px) {
      .shell__sidebar-left {
        width: 48px !important;
        min-width: 48px;
        overflow: hidden;
      }

      .shell__center {
        min-width: 0;
      }
    }

    /* <768px: left sidebar hidden, right panel fullscreen */
    @media (max-width: 767px) {
      .shell__sidebar-left {
        display: none;
      }

      .shell__panel-right {
        top: var(--header-height);
        left: 0;
        right: 0;
        bottom: 0;
        width: 100% !important;
      }

      .shell__center {
        min-width: 0;
      }
    }
  `,
})
export class ShellComponent implements OnInit {
  private readonly uiState = inject(UiStateService);
  private readonly hotkeys = inject(HotkeyService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly leftSidebarOpen$ = this.uiState.state.pipe(map((s) => s.leftSidebarOpen));
  readonly rightPanelOpen$ = this.uiState.state.pipe(map((s) => s.rightPanelOpen));

  ngOnInit(): void {
    this.hotkeys.init();

    this.route.paramMap
      .pipe(
        map((params) => ({
          type: params.get('type'),
          id: params.get('id'),
        })),
        filter(({ type }) => isActiveItemType(type)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ type, id }) => {
        if (id) {
          this.uiState.selectItem(type as ActiveItemType, id);
        }
      });
  }
}
