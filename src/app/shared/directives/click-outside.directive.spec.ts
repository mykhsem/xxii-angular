import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickOutsideDirective } from './click-outside.directive';

@Component({
  standalone: true,
  imports: [ClickOutsideDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="outer">
      <div id="inner" (appClickOutside)="onOutside()">inside</div>
    </div>
  `,
})
class TestHostComponent {
  outsideCount = 0;
  onOutside(): void {
    this.outsideCount++;
  }
}

describe('ClickOutsideDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let outsideEl: HTMLElement;
  let testDocument: Document;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    testDocument = TestBed.inject(DOCUMENT);

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();

    outsideEl = testDocument.createElement('div');
    outsideEl.id = 'outside-sentinel';
    testDocument.body.appendChild(outsideEl);
  });

  afterEach(() => {
    outsideEl.remove();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('does NOT emit when clicking inside the host element', () => {
    const inner: HTMLElement = fixture.nativeElement.querySelector('#inner');
    inner.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(host.outsideCount).toBe(0);
  });

  it('emits clickOutside when clicking on an element outside the host', () => {
    const debugEl = fixture.debugElement.query(By.directive(ClickOutsideDirective));
    const directive = debugEl.injector.get(ClickOutsideDirective);
    let emitted = false;
    outputToObservable(directive.clickOutside).subscribe(() => (emitted = true));
    outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(emitted).toBe(true);
  });

  it('emits clickOutside on touch outside', () => {
    const debugEl = fixture.debugElement.query(By.directive(ClickOutsideDirective));
    const directive = debugEl.injector.get(ClickOutsideDirective);
    let emitted = false;
    outputToObservable(directive.clickOutside).subscribe(() => (emitted = true));
    outsideEl.dispatchEvent(new TouchEvent('touchstart', { bubbles: true }));
    expect(emitted).toBe(true);
  });
});
