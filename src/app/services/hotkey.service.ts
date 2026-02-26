import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UiStateService } from './ui-state.service';

@Injectable({ providedIn: 'root' })
export class HotkeyService {
  private readonly uiState = inject(UiStateService);
  private readonly destroyRef = inject(DestroyRef);

  private initialized = false;

  init(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;

    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((e) => {
          const tag = (e.target as HTMLElement).tagName;
          const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
          return !isEditable || e.key === 'Escape';
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.handleKey(e));
  }

  private handleKey(e: KeyboardEvent): void {
    const ctrl = e.ctrlKey || e.metaKey;

    if (e.key === 'Escape') {
      e.preventDefault();
      this.uiState.closeRightPanel();
      return;
    }

    if (ctrl && e.key === 'f') {
      e.preventDefault();
      this.uiState.openRightPanel('search');
      return;
    }

    if (ctrl && e.key === 'p') {
      e.preventDefault();
      this.uiState.openRightPanel('pins');
      return;
    }
  }
}
