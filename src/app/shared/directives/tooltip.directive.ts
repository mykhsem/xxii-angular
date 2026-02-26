import { Directive, ElementRef, HostListener, inject, input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  readonly appTooltip = input<string>('');

  private readonly el = inject(ElementRef<HTMLElement>);
  private tooltipEl: HTMLElement | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showTimer = setTimeout(() => this.show(), 300);
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.hide();
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.show();
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.hide();
  }

  private show(): void {
    const text = this.appTooltip();
    if (!text) {
      return;
    }

    this.hide();

    const tooltip = document.createElement('div');
    tooltip.className = 'app-tooltip';
    tooltip.textContent = text;
    tooltip.setAttribute('role', 'tooltip');

    Object.assign(tooltip.style, {
      position: 'fixed',
      zIndex: '9000',
      padding: '4px 8px',
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-border)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--font-size-small)',
      lineHeight: 'var(--line-height-tight)',
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
    });

    document.body.appendChild(tooltip);
    this.tooltipEl = tooltip;

    const rect = this.el.nativeElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = rect.bottom + 4;
    let left = rect.left;

    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 8;
    }
    if (top + tooltipRect.height > window.innerHeight) {
      top = rect.top - tooltipRect.height - 4;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  private hide(): void {
    if (this.showTimer !== null) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }

  ngOnDestroy(): void {
    this.hide();
  }
}
