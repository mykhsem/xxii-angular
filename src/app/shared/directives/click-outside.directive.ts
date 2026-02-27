import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Emits `clickOutside` when a click or touch occurs outside the host element.
 */
@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnInit {
  readonly clickOutside = output<void>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly doc = inject(DOCUMENT);

  ngOnInit(): void {
    merge(fromEvent<MouseEvent>(this.doc, 'click'), fromEvent<TouchEvent>(this.doc, 'touchstart'))
      .pipe(
        filter((event) => !this.el.nativeElement.contains(event.target as Node)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.clickOutside.emit());
  }
}
