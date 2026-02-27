import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeVariant = 'unread' | 'role' | 'visibility';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="badge"
      [attr.aria-label]="ariaLabel() || null"
      [class.badge--role]="variant() === 'role'"
      [class.badge--unread]="variant() === 'unread'"
      [class.badge--visibility]="variant() === 'visibility'">
      @if (variant() === 'role') {
        [<ng-content />]
      } @else if (variant() === 'visibility') {
        (<ng-content />)
      } @else {
        <ng-content />
      }
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-1) var(--space-2);
      font-family: var(--font-mono);
      font-size: var(--font-size-small);
      line-height: var(--line-height-tight);
      white-space: nowrap;
      border-radius: 2px;
    }

    .badge--unread {
      background-color: var(--color-terminal-green);
      color: var(--color-background);
      border-radius: 999px;
      min-width: 18px;
      text-align: center;
      justify-content: center;
    }

    .badge--role {
      color: var(--color-user-yellow);
      background: transparent;
      padding: 0;
    }

    .badge--visibility {
      color: var(--color-text-muted);
      background: transparent;
      padding: 0;
    }
  `,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('unread');
  readonly ariaLabel = input<string>('');
}
