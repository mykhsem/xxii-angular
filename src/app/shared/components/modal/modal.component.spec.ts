import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ModalComponent);
    fixture.componentRef.setInput('title', 'Test Modal');
    fixture.detectChanges();
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog).toBeTruthy();
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  it('sets aria-label to the title input', () => {
    const dialog: HTMLElement = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(dialog.getAttribute('aria-label')).toBe('Test Modal');
  });

  it('emits closed when backdrop is clicked', () => {
    let wasClosed = false;
    fixture.componentInstance.closed.subscribe(() => (wasClosed = true));
    const backdrop: HTMLElement = fixture.nativeElement.querySelector('.modal-backdrop');
    backdrop.click();
    expect(wasClosed).toBe(true);
  });

  it('emits closed when close button is clicked', () => {
    let wasClosed = false;
    fixture.componentInstance.closed.subscribe(() => (wasClosed = true));
    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.modal-close');
    closeBtn.click();
    expect(wasClosed).toBe(true);
  });

  it('emits closed when Escape is pressed', () => {
    let wasClosed = false;
    fixture.componentInstance.closed.subscribe(() => (wasClosed = true));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(wasClosed).toBe(true);
  });

  it('renders title text in header', () => {
    const title: HTMLElement = fixture.nativeElement.querySelector('.modal-title');
    expect(title.textContent?.trim()).toBe('Test Modal');
  });
});
