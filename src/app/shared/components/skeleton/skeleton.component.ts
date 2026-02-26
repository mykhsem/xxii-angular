import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      aria-busy="true"
      aria-label="Loading…"
      class="skeleton"
      role="status"
      [style.height]="height()"
      [style.width]="width()"></span>
  `,
  styles: `
    .skeleton {
      display: block;
      background-color: var(--color-surface);
      border-radius: 2px;
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }

    @keyframes skeleton-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
    }
  `,
})
export class SkeletonComponent {
  readonly width = input<string>('100%');
  readonly height = input<string>('13px');
}
