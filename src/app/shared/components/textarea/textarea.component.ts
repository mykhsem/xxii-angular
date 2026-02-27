import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, input, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true,
    },
  ],
  template: `
    <textarea
      #textarea
      class="app-textarea"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="isDisabled"
      [ngModel]="value"
      [placeholder]="placeholder()"
      [rows]="rows()"
      (blur)="onTouched()"
      (input)="autoGrow()"
      (ngModelChange)="onValueChange($event)"></textarea>
  `,
  styles: `
    .app-textarea {
      display: block;
      width: 100%;
      padding: var(--space-2);
      font-family: var(--font-mono);
      font-size: var(--font-size-base);
      line-height: var(--line-height-base);
      color: var(--color-text-primary);
      background-color: var(--color-background);
      border: 1px solid var(--color-border);
      outline: none;
      resize: none;
      overflow: hidden;
      transition: border-color var(--transition-fast);
    }

    .app-textarea::placeholder {
      color: var(--color-text-muted);
    }

    .app-textarea:focus {
      border-color: var(--color-terminal-green);
      outline: 1px solid var(--color-terminal-green);
      outline-offset: 0;
    }

    .app-textarea:disabled {
      color: var(--color-text-muted);
      cursor: not-allowed;
    }
  `,
})
export class TextareaComponent implements ControlValueAccessor {
  readonly placeholder = input<string>('');
  readonly rows = input<number>(3);
  readonly ariaLabel = input<string>('');

  private readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  value = '';
  isDisabled = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onChange: (value: string) => void = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  autoGrow(): void {
    const el = this.textareaRef()?.nativeElement;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }
}
