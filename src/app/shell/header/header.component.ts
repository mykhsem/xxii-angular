import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="app-header" role="banner">
      <span aria-hidden="true" class="app-header__prefix">$</span>
      <span class="app-header__title">XXII</span>
      <span aria-label="Connected peers: 0" class="app-header__peers">peers: 0</span>
    </header>
  `,
  styles: `
    .app-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      height: var(--header-height);
      padding: 0 var(--space-3);
      background-color: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
      user-select: none;
    }

    .app-header__prefix {
      color: var(--color-terminal-green);
      font-size: var(--font-size-header);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }

    .app-header__title {
      font-size: var(--font-size-header);
      font-weight: 700;
      line-height: var(--line-height-tight);
      color: var(--color-text-primary);
    }

    .app-header__peers {
      margin-left: auto;
      font-size: var(--font-size-small);
      color: var(--color-text-muted);
      line-height: var(--line-height-tight);
    }
  `,
})
export class HeaderComponent {}
