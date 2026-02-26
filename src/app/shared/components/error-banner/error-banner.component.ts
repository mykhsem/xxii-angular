import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="error-banner" role="alert">
      <span class="error-banner__message">{{ message() }}</span>
      <app-button intent="danger" (clicked)="retry.emit()">Retry</app-button>
    </div>
  `,
  styles: `
    .error-banner {
      display: flex;
      align-items: center;
      gap: var(--space-4);
      padding: var(--space-2) var(--space-3);
      background-color: var(--color-surface);
      border: 1px solid var(--color-border);
    }

    .error-banner__message {
      flex: 1;
      font-family: var(--font-mono);
      font-size: var(--font-size-base);
      color: var(--color-user-red);
    }
  `,
})
export class ErrorBannerComponent {
  readonly message = input<string>('An error occurred.');
  readonly retry = output<void>();
}
