import { DestroyRef, Directive, ElementRef, inject, input, NgZone, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

/**
 * Appends a drag handle to the host element's right edge.
 * Resizes the host element's width within [min, max] constraints
 * and persists the value to localStorage under `storageKey`.
 */
@Directive({
  selector: '[appResizable]',
  standalone: true,
})
export class ResizableDirective implements OnInit {
  readonly minWidth = input<number>(200);
  readonly maxWidth = input<number>(480);
  readonly storageKey = input<string>('');
  readonly defaultWidth = input<number>(260);

  readonly widthChanged = output<number>();

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const el = this.el.nativeElement;

    const saved = this.loadWidth();
    const initial = saved ?? this.defaultWidth();
    el.style.width = `${initial}px`;
    el.style.flexShrink = '0';

    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    Object.assign(handle.style, {
      position: 'absolute',
      top: '0',
      right: '0',
      width: '4px',
      height: '100%',
      cursor: 'col-resize',
      zIndex: '10',
      userSelect: 'none',
    });

    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
    el.appendChild(handle);

    this.zone.runOutsideAngular(() => {
      const mousedown$ = fromEvent<MouseEvent>(handle, 'mousedown');
      const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');
      const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup');

      mousedown$
        .pipe(
          tap((e) => e.preventDefault()),
          switchMap((startEvent) => {
            const startX = startEvent.clientX;
            const startWidth = el.offsetWidth;
            return mousemove$.pipe(
              tap((moveEvent) => {
                const delta = moveEvent.clientX - startX;
                const newWidth = Math.min(this.maxWidth(), Math.max(this.minWidth(), startWidth + delta));
                el.style.width = `${newWidth}px`;
                this.zone.run(() => {
                  this.widthChanged.emit(newWidth);
                  this.saveWidth(newWidth);
                });
              }),
              takeUntil(mouseup$),
            );
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }

  private loadWidth(): number | null {
    const key = this.storageKey();
    if (!key) {
      return null;
    }
    try {
      const stored = localStorage.getItem(key);
      return stored ? Number(stored) : null;
    } catch {
      return null;
    }
  }

  private saveWidth(width: number): void {
    const key = this.storageKey();
    if (!key) {
      return;
    }
    try {
      localStorage.setItem(key, String(width));
    } catch {
      // ignore
    }
  }
}
