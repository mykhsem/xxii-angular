import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

@Component({
  selector: 'app-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div aria-hidden="true" class="modal-backdrop" (click)="onBackdropClick($event)"></div>
    <div
      #dialog
      aria-modal="true"
      class="modal-dialog"
      role="dialog"
      [attr.aria-label]="title()"
      (keydown)="onKeydown($event)">
      <div class="modal-header">
        <span class="modal-title">{{ title() }}</span>
        <button aria-label="Close" class="modal-close" type="button" (click)="closed.emit()">✕</button>
      </div>
      <div class="modal-body">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-backdrop {
      position: absolute;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-dialog {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 560px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-3);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .modal-title {
      font-family: var(--font-mono);
      font-size: var(--font-size-header);
      font-weight: 700;
      color: var(--color-text-primary);
      line-height: var(--line-height-tight);
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-1);
      font-family: var(--font-mono);
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: color var(--transition-fast);
    }

    .modal-close:hover {
      color: var(--color-text-primary);
    }

    .modal-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-3);
    }
  `,
})
export class ModalComponent implements OnInit, OnDestroy {
  readonly title = input<string>('');
  readonly closed = output<void>();

  private readonly dialogRef = viewChild<ElementRef<HTMLElement>>('dialog');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.trapFocus();
      document.body.style.overflow = 'hidden';
    });
  }

  ngOnInit(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((e) => e.key === 'Escape'),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closed.emit());
  }

  onBackdropClick(event: MouseEvent): void {
    event.stopPropagation();
    this.closed.emit();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') {
      return;
    }
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) {
      return;
    }

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  private trapFocus(): void {
    const dialog = this.dialogRef()?.nativeElement;
    if (!dialog) {
      return;
    }
    const focusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable?.focus();
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }
}
