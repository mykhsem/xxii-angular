import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableDirective } from './resizable.directive';

@Component({
  standalone: true,
  imports: [ResizableDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      appResizable
      id="resizable"
      storageKey="test.resize"
      [defaultWidth]="260"
      [maxWidth]="400"
      [minWidth]="200"></div>
  `,
  styles: `
    #resizable {
      height: 100px;
    }
  `,
})
class TestHostComponent {}

describe('ResizableDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    el = fixture.nativeElement.querySelector('#resizable');
  });

  it('should create host with directive applied', () => {
    expect(el).toBeTruthy();
  });

  it('sets initial width to defaultWidth when no localStorage value', () => {
    expect(el.style.width).toBe('260px');
  });

  it('restores width from localStorage', async () => {
    localStorage.setItem('test.resize', '300');
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const newEl: HTMLElement = fixture.nativeElement.querySelector('#resizable');
    expect(newEl.style.width).toBe('300px');
  });

  it('appends a resize handle child', () => {
    const handle = el.querySelector('.resize-handle');
    expect(handle).toBeTruthy();
  });

  it('handle has col-resize cursor', () => {
    const handle = el.querySelector<HTMLElement>('.resize-handle');
    expect(handle?.style.cursor).toBe('col-resize');
  });
});
