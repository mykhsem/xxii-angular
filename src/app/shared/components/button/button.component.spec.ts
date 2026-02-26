import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ButtonComponent);
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders bracket-style label via content projection', () => {
    fixture.nativeElement.textContent = '[save]';
    expect(fixture.nativeElement.textContent).toContain('[');
  });

  it('applies primary class for intent=primary', () => {
    fixture.componentRef.setInput('intent', 'primary');
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('btn--primary');
  });

  it('applies danger class for intent=danger', () => {
    fixture.componentRef.setInput('intent', 'danger');
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('btn--danger');
  });

  it('applies ghost class for intent=ghost', () => {
    fixture.componentRef.setInput('intent', 'ghost');
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('btn--ghost');
  });

  it('disables the button when disabled=true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(btn.disabled).toBe(true);
    expect(btn.classList).toContain('btn--disabled');
  });

  it('emits clicked event on click when not disabled', () => {
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.clicked.subscribe(() => (emitted = true));
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(emitted).toBe(true);
  });

  it('does not emit clicked when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    let emitted = false;
    fixture.componentInstance.clicked.subscribe(() => (emitted = true));
    fixture.componentInstance.onClick(new MouseEvent('click'));
    expect(emitted).toBe(false);
  });
});
