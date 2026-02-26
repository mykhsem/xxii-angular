import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonIntent = 'primary' | 'ghost' | 'danger';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"inline-block"',
  },
  template: `
    <button
      class="btn"
      [attr.aria-disabled]="disabled() || null"
      [attr.type]="type()"
      [class.btn--danger]="intent() === 'danger'"
      [class.btn--disabled]="disabled()"
      [class.btn--ghost]="intent() === 'ghost'"
      [class.btn--primary]="intent() === 'primary'"
      [disabled]="disabled()"
      (click)="onClick($event)">
      [<ng-content />]
    </button>
  `,
  styles: `
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-3);
      font-family: var(--font-mono);
      font-size: var(--font-size-base);
      line-height: var(--line-height-tight);
      background: transparent;
      border: none;
      cursor: pointer;
      transition:
        color var(--transition-fast),
        background-color var(--transition-fast);
      white-space: nowrap;
      user-select: none;
    }

    .btn--primary {
      color: var(--color-terminal-green);
    }

    .btn--ghost {
      color: var(--color-text-primary);
    }

    .btn--danger {
      color: var(--color-user-red);
    }

    .btn:hover:not(.btn--disabled) {
      border-color: var(--color-border-hover);
    }

    .btn--primary:hover:not(.btn--disabled) {
      color: var(--color-terminal-green);
      opacity: 0.85;
    }

    .btn--ghost:hover:not(.btn--disabled) {
      color: var(--color-text-primary);
      background-color: var(--color-surface);
    }

    .btn--danger:hover:not(.btn--disabled) {
      color: var(--color-user-red);
      opacity: 0.85;
    }

    .btn--disabled {
      color: var(--color-text-muted);
      background: var(--color-background);
      cursor: not-allowed;
      pointer-events: none;
    }
  `,
})
export class ButtonComponent {
  readonly intent = input<ButtonIntent>('ghost');
  readonly disabled = input<boolean>(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  readonly clicked = output<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled()) {
      this.clicked.emit(event);
    }
  }
}
