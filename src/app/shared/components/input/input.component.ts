import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <input
      class="app-input"
      [attr.aria-label]="ariaLabel() || null"
      [disabled]="isDisabled"
      [ngModel]="value"
      [placeholder]="placeholder()"
      [type]="type()"
      (blur)="onTouched()"
      (ngModelChange)="onValueChange($event)" />
  `,
  styles: `
    .app-input {
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
      transition: border-color var(--transition-fast);
    }

    .app-input::placeholder {
      color: var(--color-text-muted);
    }

    .app-input:focus {
      border-color: var(--color-terminal-green);
      outline: 1px solid var(--color-terminal-green);
      outline-offset: 0;
    }

    .app-input:disabled {
      color: var(--color-text-muted);
      cursor: not-allowed;
    }
  `,
})
export class InputComponent implements ControlValueAccessor {
  readonly type = input<string>('text');
  readonly placeholder = input<string>('');
  readonly ariaLabel = input<string>('');

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
}
