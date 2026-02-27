import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../services/api.service';
import { UiStateService } from '../../../services/ui-state.service';

function formatSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

@Component({
  selector: 'app-folder-view',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (vm$ | async; as vm) {
      <div class="folder-view">
        <!-- Folder header -->
        <div class="folder-view__header">
          <span class="folder-view__icon">▤</span>
          <span class="folder-view__name">{{ vm.folder?.name }}</span>
          @if (vm.folder?.description) {
            <span class="folder-view__sep">|</span>
            <span class="folder-view__desc">{{ vm.folder?.description }}</span>
          }
        </div>

        <!-- File list -->
        <div class="folder-view__list">
          <div aria-hidden="true" class="folder-view__list-header">
            <span class="folder-view__col-name">name</span>
            <span class="folder-view__col-mime">type</span>
            <span class="folder-view__col-size">size</span>
            <span class="folder-view__col-date">modified</span>
          </div>

          @if (vm.files.length === 0) {
            <p class="folder-view__empty">No files in this folder.</p>
          }
          @for (file of vm.files; track file.id) {
            <div class="folder-view__row">
              <span class="folder-view__col-name">{{ file.name }}</span>
              <span class="folder-view__col-mime">{{ file.mime }}</span>
              <span class="folder-view__col-size">{{ formatSize(file.size) }}</span>
              <span class="folder-view__col-date">{{ formatDate(file.modified) }}</span>
            </div>
          }
        </div>
      </div>
    } @else {
      <div class="folder-view__empty-state">Select a folder to browse files.</div>
    }
  `,
  styles: `
    .folder-view {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .folder-view__header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      background-color: var(--color-surface);
      overflow: hidden;
    }

    .folder-view__icon {
      color: var(--color-user-blue);
      font-weight: 700;
      flex-shrink: 0;
    }

    .folder-view__name {
      font-weight: 700;
      font-size: var(--font-size-header);
      color: var(--color-text-primary);
      flex-shrink: 0;
    }

    .folder-view__sep {
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .folder-view__desc {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .folder-view__list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-2) var(--space-3);
      font-family: var(--font-mono);
    }

    .folder-view__list-header {
      display: grid;
      grid-template-columns: 2fr 1fr 80px 100px;
      gap: var(--space-3);
      padding: var(--space-1) 0;
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border);
      margin-bottom: var(--space-1);
    }

    .folder-view__row {
      display: grid;
      grid-template-columns: 2fr 1fr 80px 100px;
      gap: var(--space-3);
      padding: var(--space-1) 0;
      font-size: var(--font-size-base);
      color: var(--color-text-primary);
      border-bottom: 1px solid transparent;
    }

    .folder-view__row:hover {
      background-color: var(--color-surface);
      border-bottom-color: var(--color-border);
    }

    .folder-view__col-name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-user-blue);
    }

    .folder-view__col-mime {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--color-text-muted);
      font-size: var(--font-size-small);
    }

    .folder-view__col-size {
      color: var(--color-text-muted);
      font-size: var(--font-size-small);
      text-align: right;
    }

    .folder-view__col-date {
      color: var(--color-text-muted);
      font-size: var(--font-size-small);
    }

    .folder-view__empty {
      color: var(--color-text-muted);
      text-align: center;
      margin-top: var(--space-8);
    }

    .folder-view__empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
    }
  `,
})
export class FolderViewComponent {
  private readonly api = inject(ApiService);
  private readonly uiState = inject(UiStateService);

  readonly formatSize = formatSize;
  readonly formatDate = formatDate;

  readonly vm$ = this.uiState.state.pipe(
    map((s) => (s.activeItemType === 'folder' ? s.activeItemId : null)),
    switchMap((folderId) => {
      if (!folderId) {
        return of(null);
      }
      return combineLatest({
        folder: this.api.getFolder(folderId),
        files: this.api.getFiles(folderId),
      });
    }),
  );
}
